'use client'

import { useState } from 'react'
import { Phone, Video, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'

interface CallButtonProps {
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  type: 'voice' | 'video'
  className?: string
  onCallStart?: (callId: string) => void
}

export default function CallButton({ otherUserId, otherUserName, otherUserImage, type, className = '', onCallStart }: CallButtonProps) {
  const [calling, setCalling] = useState(false)
  const { data: session } = useSession()

  const handleCall = async () => {
    if (!session || calling) return
    setCalling(true)

    try {
      // 1. Create call record via API
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: otherUserId, type })
      })

      if (res.ok) {
        const call = await res.json()

        // 2. Send "ringing" broadcast to the receiver via Supabase
        if (supabase) {
          const channel = supabase.channel(`incoming_calls:${otherUserId}`)
          await channel.subscribe()
          await channel.send({
            type: 'broadcast',
            event: 'ringing',
            payload: {
              callId: call.id,
              callerId: (session.user as any).id,
              callerName: (session.user as any).name || (session.user as any).username,
              callerImage: (session.user as any).image,
              type,
            },
          })
        }

        // 3. Notify parent to open VideoCall UI
        onCallStart?.(call.id)
      }
    } catch (error) {
      console.error('Call failed', error)
    } finally {
      setCalling(false)
    }
  }

  return (
    <button
      onClick={handleCall}
      disabled={calling || !session}
      className={`p-2.5 rounded-xl transition-all disabled:opacity-50 ${className}`}
      title={`مكالمة ${type === 'voice' ? 'صوتية' : 'فيديو'}`}
    >
      {calling ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : type === 'voice' ? (
        <Phone className="h-5 w-5" />
      ) : (
        <Video className="h-5 w-5" />
      )}
    </button>
  )
}
