import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Realtime Client for ArabGram
 * Used strictly for WebRTC Signaling and Real-time Chat/Notifications
 * (Data persistence is still handled by Prisma + PostgreSQL)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Channel Names
export const CHANNELS = {
  SIGNALING: (callId: string) => `call_signaling:${callId}`,
  CHAT: (userId: string) => `chat_updates:${userId}`,
  NOTIFICATIONS: (userId: string) => `notifications:${userId}`,
}
