'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, UserPlus, Share2, Repeat2, Bell, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention'
  user: {
    id: string
    name: string
    username: string
    image?: string
  }
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: { id: '1', name: 'سارة أحمد', username: 'sarah_ahmed', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
    message: 'أعجبت بمنشورك',
    timestamp: 'منذ 5 دقائق',
    read: false,
    actionUrl: '/post/1',
  },
  {
    id: '2',
    type: 'follow',
    user: { id: '2', name: 'محمد علي', username: 'moh_ali92', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    message: 'بدأ متابعتك',
    timestamp: 'منذ 15 دقيقة',
    read: false,
  },
  {
    id: '3',
    type: 'comment',
    user: { id: '3', name: 'فاطمة خالد', username: 'fatima_k', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    message: 'علّقت على منشورك: "رائع جداً! 🔥"',
    timestamp: 'منذ 30 دقيقة',
    read: true,
    actionUrl: '/post/2',
  },
  {
    id: '4',
    type: 'share',
    user: { id: '4', name: 'عمر حسن', username: 'omar_hassan', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    message: 'شارك منشورك مع متابعيه',
    timestamp: 'منذ 1 ساعة',
    read: true,
  },
  {
    id: '5',
    type: 'mention',
    user: { id: '5', name: 'ليلى إبراهيم', username: 'leila_ibrahim', image: 'https://images.unsplash.com/photo-1517841905240-1c28a93fe869?w=150' },
    message: 'ذكرتك في قصة',
    timestamp: 'منذ 2 ساعة',
    read: true,
  },
  {
    id: '6',
    type: 'like',
    user: { id: '6', name: 'أحمد محمود', username: 'ahmad_m', image: 'https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=150' },
    message: 'أعجب بقصتك',
    timestamp: 'منذ 3 ساعات',
    read: true,
  },
]

export default function Notifications() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">يجب تسجيل الدخول</h1>
          <p className="text-gray-400">سجّل دخولك لعرض الإشعارات</p>
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-5 w-5 text-purple-500" />
      case 'share':
        return <Share2 className="h-5 w-5 text-green-500" />
      case 'mention':
        return <Repeat2 className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-32">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-black arabgram-text-gradient">الإشعارات</h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-full">
                {unreadCount} جديد
              </span>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {['all', 'unread'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  filter === f
                    ? 'arabgram-gradient text-white shadow-lg'
                    : 'border border-white/20 text-gray-400 hover:text-white hover:border-white/40'
                }`}
              >
                {f === 'all' ? 'الكل' : 'غير المقروءة'}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">
              {filter === 'unread' ? 'لا توجد إشعارات جديدة' : 'لا توجد إشعارات'}
            </h2>
            <p className="text-gray-600">
              {filter === 'unread' ? 'أنت محدّث مع كل شيء!' : 'ستظهر الإشعارات هنا'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`arabgram-card p-4 rounded-2xl flex items-start gap-4 group cursor-pointer transition-all duration-300 ${
                  !notification.read ? 'border-purple-500/50 bg-purple-500/5' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id)
                  if (notification.actionUrl) router.push(notification.actionUrl)
                }}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={notification.user.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                      alt={notification.user.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-12 h-12"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-semibold">
                        {notification.user.name}
                        <span className="text-gray-500 font-normal"> @{notification.user.username}</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-600 text-xs mt-2">{notification.timestamp}</p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="flex-shrink-0 p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-xs text-purple-400">جديد</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
