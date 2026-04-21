import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  const otherUserId = request.nextUrl.searchParams.get('otherUserId')

  if (!userId || !otherUserId) {
    return NextResponse.json({ error: 'Missing userId or otherUserId' }, { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: { select: { name: true, image: true } }
    }
  })

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const { text, receiverId } = await request.json()
  const senderId = request.nextUrl.searchParams.get('userId')

  if (!senderId || !receiverId) {
    return NextResponse.json({ error: 'Missing senderId or receiverId' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      text,
      senderId,
      receiverId
    },
    include: {
      sender: { select: { name: true } }
    }
  })

  return NextResponse.json(message)
}

