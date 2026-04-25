import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client for broadcasting realtime events
 * (Notifications, incoming calls, etc.)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let serverSupabase: any = null

if (supabaseUrl && supabaseServiceKey) {
  serverSupabase = createClient(supabaseUrl, supabaseServiceKey)
}

/**
 * Broadcast a realtime notification to a user
 */
export async function broadcastNotification(userId: string, notification: {
  id: string
  type: string
  actorImage: string
  actorInitials: string
  message: string
  time: string
}) {
  if (!serverSupabase) return

  try {
    const channel = serverSupabase.channel(`notifications:${userId}`)
    await channel.subscribe()
    await channel.send({
      type: 'broadcast',
      event: 'new_notification',
      payload: notification,
    })
    // Clean up after sending
    setTimeout(() => serverSupabase.removeChannel(channel), 1000)
  } catch (error) {
    console.error('[BROADCAST_ERROR]', error)
  }
}
