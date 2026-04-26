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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">يجب تسجيل الدخول</h1>
        </div>
      </div>
    )
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="max-w-[600px] mx-auto pt-16 md:pt-10 pb-20 px-4" dir="rtl">
      
      <h1 className="text-xl font-bold mb-6 px-2">الإشعارات</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 stroke-[1.5px] text-slate-900 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">النشاط على منشوراتك</h2>
          <p className="text-slate-500 text-sm">عندما يعجب شخص ما أو يعلق على أحد منشوراتك، سيظهر ذلك هنا.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
              onClick={() => {
                markAsRead(notification.id)
                if (notification.actionUrl) router.push(notification.actionUrl)
              }}
            >
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                {notification.actorImage ? (
                  <Image
                    src={notification.actorImage}
                    alt=""
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 font-bold">
                    {notification.actorInitials || '?'}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-[14px]">
                <span className="font-semibold">{notification.actorUsername || notification.actorInitials}</span>
                <span className="text-slate-900 ml-1"> {notification.message}</span>
                <span className="text-slate-500 text-[12px] mr-2 block sm:inline">{notification.time}</span>
              </div>

              {notification.type === 'follow' && (
                <button className="bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold text-sm px-4 py-1.5 rounded-lg ml-2 flex-shrink-0">
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
