'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, UserPlus, Share2, Bell, Trash2, Loader2, CheckCheck } from 'lucide-react'
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
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const currentUserId = (session?.user as any)?.id

  // Fetch notifications from API
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

  // Subscribe to real-time notifications via Supabase
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">يجب تسجيل الدخول</h1>
          <p className="text-slate-500">سجّل دخولك لعرض الإشعارات</p>
        </div>
      </div>
    )
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case 'share':
        return <Share2 className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32" dir="rtl">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black arabgram-text-gradient">الإشعارات</h1>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <>
                  <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-bold rounded-full">
                    {unreadCount} جديد
                  </span>
                  <button
                    onClick={markAllAsRead}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-brand-primary transition-all"
                    title="تعليم الكل كمقروء"
                  >
                    <CheckCheck className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-white/60 shadow-sm">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  filter === f
                    ? 'arabgram-gradient text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {f === 'all' ? 'الكل' : 'غير المقروءة'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
          </div>
        )}

        {/* Notifications List */}
        {!loading && filteredNotifications.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-[2.5rem] p-12">
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-500 mb-2">
              {filter === 'unread' ? 'لا توجد إشعارات جديدة' : 'لا توجد إشعارات'}
            </h2>
            <p className="text-slate-400">
              {filter === 'unread' ? 'أنت محدّث مع كل شيء!' : 'ستظهر الإشعارات هنا عندما يتفاعل أحد مع حسابك'}
            </p>
          </div>
        ) : (
          !loading && (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`glass-card p-4 rounded-2xl flex items-start gap-4 group cursor-pointer transition-all duration-300 ${
                    !notification.read ? 'border-brand-primary/30 bg-brand-primary/5 shadow-md' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) router.push(notification.actionUrl)
                  }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shadow-sm">
                        <Image
                          src={notification.actorImage || '/arabgram-logo.png'}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        {getIcon(notification.type)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-slate-900 font-medium text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-slate-400 text-xs mt-1.5 font-medium">{notification.time}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="flex-shrink-0 p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {!notification.read && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                        <span className="text-xs text-brand-primary font-bold">جديد</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
