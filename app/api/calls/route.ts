import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiverId, type } = await request.json()

  if (!receiverId || !['voice', 'video'].includes(type)) {
    return NextResponse.json({ error: 'receiverId and valid type (voice/video) required' }, { status: 400 })
  }

  const call = await prisma.call.create({
    data: {
      type,
      status: 'ringing',
      callerId: session.user.id,
      receiverId
    },
    include: {
      caller: { select: { name: true } },
      receiver: { select: { name: true } }
    }
  })

  // TODO: Emit WebSocket/Pusher for real-time ringing notification

  return NextResponse.json(call)
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { callId, status, startedAt, endedAt } = await request.json()

  const call = await prisma.call.update({
    where: { id: callId },
    data: { status, startedAt, endedAt },
    include: {
      caller: { select: { name: true } },
      receiver: { select: { name: true } }
    }
  })

  return NextResponse.json(call)
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const otherUserId = searchParams.get('otherUserId')
  const limit = parseInt(searchParams.get('limit') || '20')

  const calls = await prisma.call.findMany({
    where: {
      OR: [
        { callerId: session.user.id, receiverId: otherUserId },
        { callerId: otherUserId, receiverId: session.user.id }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  return NextResponse.json(calls)
}
