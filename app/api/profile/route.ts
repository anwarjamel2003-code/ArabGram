import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || searchParams.get('username')

  if (!userId) return NextResponse.json({ error: 'userId or username required' }, { status: 400 })

  const user = await prisma.user.findFirst({
    where: userId.startsWith('@') ? { username: userId.slice(1) } : { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      phoneVerified: true,
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
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, image, bio, phoneVerified } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      image,
      bio,
      phoneVerified
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      phoneVerified: true
    }
  })

  return NextResponse.json(updatedUser)
}
