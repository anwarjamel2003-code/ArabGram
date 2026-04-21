import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

/**
 * Push Notification Utility for ArabGram
 * Using Web Push API for real-time device notifications
 */

// Configure VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@arabgram.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

interface PushPayload {
  title: string
  body: string
  url?: string
  tag?: string
}

/**
 * Send a push notification to a specific user
 */
export async function sendPushNotification(userId: string, payload: PushPayload) {
  try {
    // Get all subscriptions for the user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) {
      console.log(`[PUSH] No subscriptions found for user ${userId}`)
      return
    }

    const notificationPayload = JSON.stringify(payload)

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload
        )
      } catch (error: any) {
        // If subscription is expired or invalid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`[PUSH] Removing invalid subscription for user ${userId}`)
          await prisma.pushSubscription.delete({
            where: { endpoint: sub.endpoint },
          })
        } else {
          console.error(`[PUSH] Error sending to subscription:`, error)
        }
      }
    })

    await Promise.all(sendPromises)
  } catch (error) {
    console.error(`[PUSH] Failed to send notifications to user ${userId}:`, error)
  }
}
