import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendPushNotification } from '@/lib/push'

/**
 * Message API Route for ArabGram
 * Handles message sending and real-time push notifications
 */

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get('otherUserId')

  if (!otherUserId) {
    // Return chat list for the current user
    const chats = await prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, username: true, image: true } },
        receiver: { select: { id: true, name: true, username: true, image: true } },
      },
    })
    return NextResponse.json(chats)
  }

  // Return conversation between current user and otherUserId
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: { select: { name: true, image: true } },
    },
  })

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, receiverId } = await request.json()

  if (!text || !receiverId) {
    return NextResponse.json({ error: 'Missing text or receiverId' }, { status: 400 })
  }

  try {
    const message = await prisma.message.create({
      data: {
        text,
        senderId: session.user.id,
        receiverId,
      },
      include: {
        sender: { select: { name: true, username: true, image: true } },
      },
    })

    // Send real-time push notification
    await sendPushNotification(receiverId, {
      title: `رسالة جديدة من ${message.sender.name || message.sender.username}`,
      body: text.length > 100 ? `${text.substring(0, 97)}...` : text,
      url: `/messages?userId=${session.user.id}`,
      tag: `msg-${session.user.id}`,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('[MESSAGE_POST_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
