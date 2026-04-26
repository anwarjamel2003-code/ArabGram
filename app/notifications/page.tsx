'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, UserPlus, Share2, Bell, Loader2 } from 'lucide-react'
import Image from 'next/image'
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
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center glass-card p-12 rounded-[3rem] animate-float">
          <Bell className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">يجب تسجيل الدخول</h1>
          <p className="text-zinc-400 font-medium text-sm">قم بتسجيل الدخول لمعرفة من تفاعل معك.</p>
        </div>
      </div>
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="max-w-[700px] mx-auto pt-8 pb-20 px-4" dir="rtl">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white mb-2 tracking-wide">الإشعارات</h1>
        <p className="text-zinc-500 font-medium">تابع تفاعلات المتابعين معك أولاً بأول</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[3rem]">
          <div className="w-20 h-20 arabgram-gradient rounded-full flex items-center justify-center mx-auto mb-6 p-[2px]">
            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">لا توجد إشعارات حالياً</h2>
          <p className="text-zinc-500 font-medium text-sm">عندما يعجب شخص ما أو يعلق على أحد منشوراتك، سيظهر ذلك هنا.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`glass-card p-5 rounded-[2rem] flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all ${
                !notification.read ? 'border-pink-500/50 shadow-[0_5px_20px_rgba(220,20,90,0.15)]' : 'border-white/5'
              }`}
              onClick={() => {
                markAsRead(notification.id)
                if (notification.actionUrl) router.push(notification.actionUrl)
              }}
            >
              {/* Avatar Indicator */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border border-white/10 relative z-10">
                  {notification.actorImage ? (
                    <Image
                      src={notification.actorImage}
                      alt=""
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white font-bold text-lg">
                      {notification.actorInitials || '?'}
                    </div>
                  )}
                </div>
                {/* Notification Type Icon */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-900 border-2 border-zinc-900 flex items-center justify-center z-20">
                  {notification.type === 'like' && <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />}
                  {notification.type === 'comment' && <MessageCircle className="h-3 w-3 fill-blue-500 text-blue-500" />}
                  {notification.type === 'follow' && <UserPlus className="h-3 w-3 text-emerald-500" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[15px] leading-relaxed">
                  <span className="font-bold text-white">{notification.actorUsername || notification.actorInitials}</span>
                  <span className="text-zinc-300 ml-1"> {notification.message}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-zinc-500 text-[13px] font-bold">{notification.time}</span>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </div>
              </div>

              {notification.type === 'follow' && (
                <button className="btn-primary !px-5 !py-2 !text-sm flex-shrink-0">
                  متابعة
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
