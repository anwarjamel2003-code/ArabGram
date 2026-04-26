'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

interface ChatMessage {
  id: string
  text: string
  senderId: string
  receiverId: string
  createdAt: string
  senderName?: string
  senderImage?: string
}

export function useRealtimeChat(userId: string, otherUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  // ✅ FIX 1: Store the subscribed channel in a ref so we reuse it for sending
  const channelRef = useRef<any>(null)
  const chatChannelId = [userId, otherUserId].sort().join('_')

  // Load message history from DB when chat partner changes
  useEffect(() => {
    if (!userId || !otherUserId) return

    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/messages?withUserId=${otherUserId}`)
        if (res.ok) {
          const data = await res.json()
          // Map DB messages to ChatMessage format
          const history: ChatMessage[] = data.map((m: any) => ({
            id: m.id,
            text: m.text,
            senderId: m.senderId,
            receiverId: m.receiverId,
            createdAt: m.createdAt,
            senderName: m.sender?.name,
            senderImage: m.sender?.image,
          }))
          setMessages(history)
        }
      } catch (e) {
        console.error('[CHAT_HISTORY_ERROR]', e)
      }
    }

    loadHistory()
  }, [userId, otherUserId])

  // Subscribe to realtime channel
  useEffect(() => {
    if (!userId || !otherUserId || !supabase) return

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    const channel = supabase.channel(CHANNELS.CHAT(chatChannelId), {
      config: {
        // ✅ FIX 2: self: true so sender sees their own broadcast (needed when other tab)
        broadcast: { self: true },
      },
    })

    channel
      .on('broadcast', { event: 'message' }, (payload: any) => {
        const incoming: ChatMessage = payload.payload
        // ✅ FIX 3: Deduplicate by id so sender doesn't see message twice
        setMessages((prev) => {
          if (prev.find((m) => m.id === incoming.id)) return prev
          return [...prev, incoming]
        })
      })
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        const { userId: typingUserId, isTyping } = payload.payload
        setTypingUsers((prev) => {
          const newSet = new Set(prev)
          if (isTyping) newSet.add(typingUserId)
          else newSet.delete(typingUserId)
          return newSet
        })
      })
      .subscribe((status: any) => {
        console.log('[CHAT] Status:', status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    // ✅ FIX 4: Save the subscribed channel in ref
    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [userId, otherUserId, chatChannelId])

  const sendMessage = useCallback(
    async (text: string, senderName?: string, senderImage?: string) => {
      if (!text.trim() || !channelRef.current) return

      const message: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        text,
        senderId: userId,
        receiverId: otherUserId,
        createdAt: new Date().toISOString(),
        senderName,
        senderImage,
      }

      // ✅ FIX 5: Add message optimistically to sender's state immediately
      setMessages((prev) => [...prev, message])

      try {
        // ✅ FIX 6: Use the already-subscribed channel ref to broadcast
        await channelRef.current.send({
          type: 'broadcast',
          event: 'message',
          payload: message,
        })

        // Save to DB (fire and forget)
        fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, receiverId: otherUserId }),
        })

        // ✅ FIX 7: Send notification to receiver via their personal channel
        if (supabase) {
          const notifChannel = supabase.channel(`incoming_messages:${otherUserId}`)
          await notifChannel.subscribe()
          await notifChannel.send({
            type: 'broadcast',
            event: 'new_message',
            payload: { senderId: userId, senderName, text },
          })
          supabase.removeChannel(notifChannel)
        }
      } catch (error) {
        console.error('[CHAT_SEND_ERROR]', error)
        // Revert optimistic update on failure
        setMessages((prev) => prev.filter((m) => m.id !== message.id))
      }
    },
    [userId, otherUserId]
  )

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!channelRef.current) return
      try {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId, isTyping },
        })
      } catch (error) {
        console.error('[TYPING_ERROR]', error)
      }
    },
    [userId]
  )

  return { messages, isConnected, typingUsers, sendMessage, setTyping }
}
