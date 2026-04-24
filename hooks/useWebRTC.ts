'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import SimplePeer from 'simple-peer'
import { useWebRTCSignaling } from './useWebRTCSignaling'

/**
 * WebRTC Hook for ArabGram
 * Handles peer-to-peer audio/video calls with Supabase Realtime Signaling
 */

interface WebRTCConfig {
  callId: string
  userId: string
  otherUserId: string
  initiator: boolean
  stream?: MediaStream
  onConnect?: () => void
  onError?: (error: Error) => void
  onStream?: (stream: MediaStream) => void
}

export function useWebRTC(config: WebRTCConfig) {
  const peerRef = useRef<SimplePeer.Instance | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { signals, isConnected: signalingConnected, sendSignal } = useWebRTCSignaling(config.callId, config.userId)

  // Create peer connection
  const createPeer = useCallback(() => {
    try {
      const peer = new SimplePeer({
        initiator: config.initiator,
        trickle: true,
        stream: config.stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
          ],
        },
      })

      peer.on('signal', (data) => {
        console.log('[WebRTC] Sending signal:', data.type)
        sendSignal({
          type: data.type === 'offer' ? 'offer' : data.type === 'answer' ? 'answer' : 'ice-candidate',
          data,
          to: config.otherUserId,
        })
      })

      peer.on('connect', () => {
        console.log('[WebRTC] Connected')
        setConnected(true)
        config.onConnect?.()
      })

      peer.on('stream', (stream) => {
        console.log('[WebRTC] Received stream')
        config.onStream?.(stream)
      })

      peer.on('error', (err) => {
        console.error('[WebRTC] Error:', err)
        setError(err)
        config.onError?.(err)
      })

      peer.on('close', () => {
        console.log('[WebRTC] Connection closed')
        setConnected(false)
      })

      peerRef.current = peer
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      config.onError?.(error)
    }
  }, [config, sendSignal])

  // Initialize peer
  useEffect(() => {
    if (signalingConnected) {
      createPeer()
    }

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy()
      }
    }
  }, [createPeer, signalingConnected])

  // Handle incoming signals
  useEffect(() => {
    signals.forEach((signal) => {
      if (signal.from === config.otherUserId && peerRef.current) {
        try {
          peerRef.current.signal(signal.data)
        } catch (err) {
          console.error('[WebRTC] Signal error:', err)
        }
      }
    })
  }, [signals, config.otherUserId])

  const close = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
      setConnected(false)
    }
  }, [])

  return {
    peer: peerRef.current,
    connected,
    error,
    signalingConnected,
    close,
  }
}

/**
 * Get user media stream (audio/video)
 */
export async function getUserMedia(constraints: MediaStreamConstraints = { audio: true, video: true }) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  } catch (error) {
    console.error('[Media] Error:', error)
    throw error
  }
}

/**
 * Stop all tracks in a stream
 */
export function stopStream(stream: MediaStream) {
  stream.getTracks().forEach((track) => {
    track.stop()
  })
}
