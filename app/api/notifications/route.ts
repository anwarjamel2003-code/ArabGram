import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Real data - query likes, follows, comments for user
    const likes = await prisma.like.findMany({
      where: { post: { userId } },
      include: {
        user: { select: { id: true, name: true, image: true } },
        post: { select: { id: true } }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    })

    const follows = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: { select: { id: true, name: true, image: true } }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    // Transform to notifications
    const notifications = [
      ...likes.map(like => ({
        id: `like-${like.id}`,
        actorImage: like.user.image || '/arabgram-logo.png',
        actorInitials: like.user.name?.[0] || 'U',
        message: `${like.user.name} liked your post`,
        time: like.createdAt.toLocaleString(),
        type: 'like'
      })),
      ...follows.map(follow => ({
        id: `follow-${follow.id}`,
        actorImage: follow.follower.image || '/arabgram-logo.png',
        actorInitials: follow.follower.name?.[0] || 'U',
        message: `${follow.follower.name} followed you`,
        time: follow.createdAt.toLocaleString(),
        type: 'follow'
      }))
    ].slice(0, 20)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

