import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: { id: true, name: true, username: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      },
      likes: true
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as any) as any
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { caption, imageUrl } = await request.json()

  const post = await prisma.post.create({
    data: {
      caption,
      imageUrl,
      userId: session.user.id
    },
    include: {
      user: {
        select: { username: true }
      }
    }
  })

  return NextResponse.json(post, { status: 201 })
}

