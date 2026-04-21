'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'

/**
 * Hook for Real-time events in ArabGram
 * Using SSE for instant updates to messages, calls, and notifications
 */

type EventType = 'message' | 'call' | 'notification' | 'connected'

interface RealtimeEvent {
  type: EventType
  data: any
}

export function useRealtime(onEvent: (event: RealtimeEvent) => void) {
  const { data: session } = useSession()
  const eventSourceRef = useRef<EventSource | null>(null)
  const onEventRef = useRef(onEvent)

  // Keep callback ref fresh to avoid re-subscribing every time
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  const connect = useCallback(() => {
    if (!session?.user?.id || eventSourceRef.current) return

    // Using EventSource for SSE (Server-Sent Events)
    const eventSource = new EventSource('/api/realtime')
    eventSourceRef.current = eventSource

    eventSource.onmessage = (e) => {
      try {
        const event: RealtimeEvent = JSON.parse(e.data)
        onEventRef.current(event)
      } catch (err) {
        console.error('[REALTIME] Failed to parse event:', err)
      }
    }

    eventSource.onerror = (e) => {
      console.error('[REALTIME] SSE Error:', e)
      eventSource.close()
      eventSourceRef.current = null
      
      // Attempt reconnect after delay (Exponential backoff)
      setTimeout(connect, 3000)
    }

    return () => {
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [session?.user?.id])

  useEffect(() => {
    const cleanup = connect()
    return () => {
      if (cleanup) cleanup()
    }
  }, [connect])

  return {
    isConnected: !!eventSourceRef.current,
  }
}
