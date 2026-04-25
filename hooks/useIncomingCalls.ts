'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { supabase, CHANNELS } from '@/lib/supabase'

/**
 * Hook to listen for incoming WebRTC calls via Supabase Realtime
 */

interface IncomingCall {
  callId: string
  callerId: string
  callerName: string
  callerImage?: string
  type: 'voice' | 'video'
}

export function useIncomingCalls() {
  const { data: session } = useSession()
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const currentUserId = (session?.user as any)?.id

  useEffect(() => {
    if (!currentUserId || !supabase) return

    // Listen on a personal channel for incoming calls
    const channel = supabase.channel(`incoming_calls:${currentUserId}`)

    channel
      .on('broadcast', { event: 'ringing' }, (payload: any) => {
        console.log('[INCOMING_CALL]', payload.payload)
        setIncomingCall(payload.payload)
      })
      .on('broadcast', { event: 'call_ended' }, () => {
        setIncomingCall(null)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const acceptCall = useCallback(() => {
    const call = incomingCall
    setIncomingCall(null)
    return call
  }, [incomingCall])

  const rejectCall = useCallback(() => {
    if (incomingCall && supabase) {
      // Notify the caller that the call was rejected
      const channel = supabase.channel(`incoming_calls:${incomingCall.callerId}`)
      channel.send({
        type: 'broadcast',
        event: 'call_ended',
        payload: { callId: incomingCall.callId },
      })
    }
    setIncomingCall(null)
  }, [incomingCall])

  return {
    incomingCall,
    acceptCall,
    rejectCall,
  }
}
