import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 })
  }

  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } }
    }
  })

  return NextResponse.json(likes)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as any) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json()

  if (!postId) {
    return NextResponse.json({ error: 'postId required' }, { status: 400 })
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: (session.user as any).id
        }
      }
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: (session.user as any).id
          }
        }
      })
      return NextResponse.json({ liked: false })
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId: (session.user as any).id
      }
    })

    return NextResponse.json({ liked: true, like }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
