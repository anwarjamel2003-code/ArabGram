import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const tab = searchParams.get('tab') || 'users'

    if (!query) {
      if (tab === 'users') {
        const users = await prisma.user.findMany({
          take: 10,
          select: { id: true, username: true, name: true, image: true, bio: true }
        })
        return NextResponse.json(users)
      } else if (tab === 'posts') {
        const posts = await prisma.post.findMany({
          take: 12,
          include: { user: true, _count: { select: { likes: true, comments: true } } },
          orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(posts)
      }
      return NextResponse.json([])
    }

    if (tab === 'users') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 20,
        select: { id: true, username: true, name: true, image: true, bio: true }
      })
      return NextResponse.json(users)
    } else if (tab === 'posts') {
      const posts = await prisma.post.findMany({
        where: {
          caption: { contains: query, mode: 'insensitive' }
        },
        take: 20,
        include: { user: true, _count: { select: { likes: true, comments: true } } },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(posts)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 })
  }
}
