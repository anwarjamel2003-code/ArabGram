import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const stories = await prisma.story.findMany({
    where: {
      expiresAt: { gt: new Date() }
    },
    include: {
      user: { select: { name: true, image: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json(stories)
}

