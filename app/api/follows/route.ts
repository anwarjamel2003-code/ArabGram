import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type') // 'followers' | 'following'
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  let users: any[] = []
  if (type === 'followers') {
    const result = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followers: {
          take: limit,
          include: { follower: { select: { id: true, name: true, username: true, image: true } } }
        }
      }
    })
    users = (result?.followers || []).map((f: any) => f.follower)
  } else if (type === 'following') {
    const result = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          take: limit,
          include: { following: { select: { id: true, name: true, username: true, image: true } } }
        }
      }
    })
    users = (result?.following || []).map((f: any) => f.following)
  } else {
    return NextResponse.json({ error: 'type must be followers or following' }, { status: 400 })
  }

  const count = await prisma.follow.count({
    where: type === 'followers' ? { followingId: userId } : { followerId: userId }
  })

  return NextResponse.json({ users, count })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetId } = await request.json()

  if (!targetId) return NextResponse.json({ error: 'targetId required' }, { status: 400 })
  if (targetId === (session!.user as any).id) return NextResponse.json({ error: 'Cannot follow self' }, { status: 400 })

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId: (session!.user as any).id,
        followingId: targetId
      },
      include: {
        following: { select: { id: true, name: true, username: true } }
      }
    })
    return NextResponse.json(follow)
  } catch (e) {
    return NextResponse.json({ error: 'Already following' }, { status: 409 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetId } = await request.json()

  if (!targetId) return NextResponse.json({ error: 'targetId required' }, { status: 400 })

  await prisma.follow.deleteMany({
    where: {
      followerId: (session!.user as any).id,
      followingId: targetId
    }
  })

  return NextResponse.json({ success: true })
}
