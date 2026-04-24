'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

/**
 * Real-time Chat Hook using Supabase
 * Handles instant message delivery and typing indicators
 */

interface ChatMessage {
  id: string
  text: string
  senderId: string
  receiverId: string
  createdAt: string
  senderName?: string
  senderImage?: string
}

interface TypingIndicator {
  userId: string
  isTyping: boolean
}

export function useRealtimeChat(userId: string, otherUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  const chatChannelId = [userId, otherUserId].sort().join('_')

  // Subscribe to chat channel
  useEffect(() => {
    if (!userId || !otherUserId) return

    const channel = supabase.channel(CHANNELS.CHAT(chatChannelId), {
      config: {
        broadcast: { self: false },
      },
    })

    channel
      .on('broadcast', { event: 'message' }, (payload: any) => {
        console.log('[CHAT] Received message:', payload.payload)
        setMessages((prev) => [...prev, payload.payload])
      })
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        const { userId: typingUserId, isTyping } = payload.payload
        setTypingUsers((prev) => {
          const newSet = new Set(prev)
          if (isTyping) {
            newSet.add(typingUserId)
          } else {
            newSet.delete(typingUserId)
          }
          return newSet
        })
      })
      .subscribe((status: any) => {
        console.log('[CHAT] Status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, otherUserId, chatChannelId])

  const sendMessage = useCallback(
    async (text: string, senderName?: string, senderImage?: string) => {
      if (!text.trim()) return

      const message: ChatMessage = {
        id: `${Date.now()}`,
        text,
        senderId: userId,
        receiverId: otherUserId,
        createdAt: new Date().toISOString(),
        senderName,
        senderImage,
      }

      try {
        const channel = supabase.channel(CHANNELS.CHAT(chatChannelId))
        await channel.send({
          type: 'broadcast',
          event: 'message',
          payload: message,
        })

        // Also save to database via API
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            receiverId: otherUserId,
          }),
        })
      } catch (error) {
        console.error('[CHAT_SEND_ERROR]', error)
      }
    },
    [userId, otherUserId, chatChannelId]
  )

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      try {
        const channel = supabase.channel(CHANNELS.CHAT(chatChannelId))
        await channel.send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            userId,
            isTyping,
          },
        })
      } catch (error) {
        console.error('[TYPING_ERROR]', error)
      }
    },
    [userId, chatChannelId]
  )

  return {
    messages,
    isConnected,
    typingUsers,
    sendMessage,
    setTyping,
  }
}
