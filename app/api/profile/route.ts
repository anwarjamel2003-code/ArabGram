import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const param = searchParams.get('username') || searchParams.get('userId')

  if (!param) return NextResponse.json({ error: 'userId or username required' }, { status: 400 })

  // Try to find by username first (most common), then by id
  const cleanParam = param.startsWith('@') ? param.slice(1) : param
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: cleanParam },
        { id: param },
      ]
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      }
    }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json(user)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, image, bio } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: (session!.user as any).id },
    data: {
      name,
      image,
      bio
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true
    }
  })

  return NextResponse.json(updatedUser)
}
