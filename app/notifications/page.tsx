'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

interface Notification {
  id: string
  type: string
  actorImage: string
  actorInitials: string
  actorUsername?: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

export default function Notifications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const currentUserId = (session?.user as any)?.id

  const fetchNotifications = useCallback(async () => {
    if (!currentUserId) return
    try {
      const res = await fetch(`/api/notifications?userId=${currentUserId}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.map((n: any) => ({ ...n, read: false })))
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!currentUserId || !supabase) return

    const channel = supabase.channel(CHANNELS.NOTIFICATIONS(currentUserId))

    channel
      .on('broadcast', { event: 'new_notification' }, (payload: any) => {
        const newNotif: Notification = {
          ...payload.payload,
          read: false,
        }
        setNotifications((prev) => [newNotif, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  if (status === 'unauthenticated') {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black text-zinc-600 tracking-widest uppercase">الوصول مقيد</h1>
      </div>
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="min-h-screen w-full max-w-[1200px] mx-auto px-6 py-20 relative z-10" dir="rtl">
      
      <h1 className="text-7xl md:text-9xl font-black text-white/5 tracking-tighter mb-20 select-none uppercase">التنبيهات.</h1>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-12 w-12 text-white animate-spin opacity-50" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-right py-20">
          <h2 className="text-5xl font-black text-zinc-600">لا يوجد ترددات جديدة.</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-8 p-8 rounded-[2rem] cursor-pointer transition-all duration-500 ${
                !notification.read ? 'bg-white text-zinc-950 scale-[1.02] shadow-[0_20px_50px_rgba(255,255,255,0.1)]' : 'hover:bg-white/5 text-white'
              }`}
              onClick={() => {
                markAsRead(notification.id)
                if (notification.actionUrl) router.push(notification.actionUrl)
              }}
            >
              <span className={`text-6xl font-black opacity-20 hidden md:block ${!notification.read ? 'text-pink-500' : 'text-white'}`}>
                {notification.type === 'like' ? '♡' : notification.type === 'comment' ? '💬' : '⚑'}
              </span>

              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-2xl md:text-3xl font-black tracking-wide leading-tight">
                  <span className={!notification.read ? 'arabgram-text-gradient' : 'text-zinc-400'}>
                    {notification.actorUsername || notification.actorInitials}
                  </span>
                  {' '}{notification.message}
                </p>
                <span className={`text-sm font-bold uppercase tracking-widest ${!notification.read ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  {notification.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
