'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import SimplePeer from 'simple-peer'
import { useWebRTCSignaling } from './useWebRTCSignaling'

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

// ✅ FIX: Add free TURN servers (Open Relay) so calls work across networks
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  // Free TURN servers from Open Relay Project (works across different networks/NATs)
  {
    urls: 'turn:openrelay.metered.ca:80',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
  {
    urls: 'turn:openrelay.metered.ca:443?transport=tcp',
    username: 'openrelayproject',
    credential: 'openrelayproject',
  },
]

export function useWebRTC(config: WebRTCConfig) {
  const peerRef = useRef<SimplePeer.Instance | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { signals, isConnected: signalingConnected, sendSignal } = useWebRTCSignaling(config.callId, config.userId)

  const createPeer = useCallback(() => {
    try {
      // Destroy any existing peer first
      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }

      const peer = new SimplePeer({
        initiator: config.initiator,
        trickle: true,
        stream: config.stream,
        config: {
          iceServers: ICE_SERVERS,
          iceTransportPolicy: 'all',
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
        console.log('[WebRTC] Peer connected!')
        setConnected(true)
        config.onConnect?.()
      })

      peer.on('stream', (stream) => {
        console.log('[WebRTC] Got remote stream')
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
  }, [config.initiator, config.stream, config.otherUserId, sendSignal])

  useEffect(() => {
    if (signalingConnected) {
      createPeer()
    }
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy()
        peerRef.current = null
      }
    }
  }, [signalingConnected])

  // Handle incoming signals
  useEffect(() => {
    signals.forEach((signal) => {
      if (signal.from === config.otherUserId && peerRef.current) {
        try {
          peerRef.current.signal(signal.data)
        } catch (err) {
          console.error('[WebRTC] Signal processing error:', err)
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

  return { peer: peerRef.current, connected, error, signalingConnected, close }
}

export async function getUserMedia(constraints: MediaStreamConstraints = { audio: true, video: true }) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints)
  } catch (error) {
    console.error('[Media] Error:', error)
    throw error
  }
}

export function stopStream(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop())
}
