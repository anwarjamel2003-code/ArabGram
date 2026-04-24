import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * Push Subscription Route for ArabGram
 * Save user device subscription for real-time notifications
 */

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subscription } = await request.json()

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  try {
    // Save or update subscription
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: (session!.user as any).id,
      },
      create: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: (session!.user as any).id,
      },
    })

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 })
  } catch (error) {
    console.error('[PUSH_SUBSCRIBE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
