'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

/**
 * WebRTC Signaling Hook using Supabase Realtime
 * Handles SDP and ICE candidate exchange
 */

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate'
  data: any
  from: string
  to: string
}

export function useWebRTCSignaling(callId: string, userId: string) {
  const [signals, setSignals] = useState<SignalingMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<any>(null)

  // Subscribe to signaling channel
  useEffect(() => {
    if (!callId || !userId) return

    const channel = supabase.channel(CHANNELS.SIGNALING(callId), {
      config: {
        broadcast: { self: false },
      },
    })

    channel
      .on('broadcast', { event: 'signal' }, (payload) => {
        console.log('[SIGNALING] Received:', payload.payload)
        setSignals((prev) => [...prev, payload.payload])
      })
      .subscribe((status) => {
        console.log('[SIGNALING] Status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [callId, userId])

  const sendSignal = useCallback(
    async (message: Omit<SignalingMessage, 'from'>) => {
      if (!channelRef.current) return

      try {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'signal',
          payload: {
            ...message,
            from: userId,
          },
        })
      } catch (error) {
        console.error('[SIGNALING_ERROR]', error)
      }
    },
    [userId]
  )

  return {
    signals,
    isConnected,
    sendSignal,
  }
}
