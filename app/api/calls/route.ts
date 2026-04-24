import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sendPushNotification } from '@/lib/push'

/**
 * Call API Route for ArabGram
 * Handles call management and real-time push notifications
 */

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiverId, type } = await request.json()

  if (!receiverId || !['voice', 'video'].includes(type)) {
    return NextResponse.json({ error: 'receiverId and valid type (voice/video) required' }, { status: 400 })
  }

  try {
    const call = await prisma.call.create({
      data: {
        type,
        status: 'ringing',
        callerId: (session!.user as any).id,
        receiverId,
      },
      include: {
        caller: { select: { name: true, username: true, image: true } },
      },
    })

    // Send real-time push notification for incoming call
    await sendPushNotification(receiverId, {
      title: `مكالمة ${type === 'video' ? 'فيديو' : 'صوتية'} واردة`,
      body: `مكالمة من ${call.caller.name || call.caller.username}`,
      url: `/calls?callId=${call.id}`,
      tag: `call-${(session!.user as any).id}`,
    })

    return NextResponse.json(call)
  } catch (error) {
    console.error('[CALL_POST_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { callId, status, startedAt, endedAt } = await request.json()

  try {
    const call = await prisma.call.update({
      where: { id: callId },
      data: { status, startedAt, endedAt },
      include: {
        caller: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    })

    return NextResponse.json(call)
  } catch (error) {
    console.error('[CALL_PUT_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!(session?.user as any)?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get('otherUserId')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const calls = await prisma.call.findMany({
      where: {
        OR: [
          { callerId: (session!.user as any).id, receiverId: otherUserId },
          { callerId: otherUserId, receiverId: (session!.user as any).id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(calls)
  } catch (error) {
    console.error('[CALL_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
