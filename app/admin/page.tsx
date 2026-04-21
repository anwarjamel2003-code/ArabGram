'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Users, FileText, BarChart3, Shield, Trash2, Eye, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

interface User {
  id: string
  username: string
  email: string
  name?: string
  role: string
  createdAt: string
  image?: string
}

interface Post {
  id: string
  caption?: string
  imageUrl: string
  user: {
    username: string
    name?: string
  }
  createdAt: string
  likes?: number
}

export default function AdminPanel() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'security'>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    setTimeout(() => {
      setUsers([
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          name: 'أحمد محمد',
          role: 'USER',
          createdAt: '2024-01-15',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          name: 'سارة علي',
          role: 'USER',
          createdAt: '2024-02-20',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        },
      ])

      setPosts([
        {
          id: '1',
          caption: 'صورة جميلة من الطبيعة',
          imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
          user: { username: 'user1', name: 'أحمد محمد' },
          createdAt: '2024-04-10',
          likes: 234,
        },
      ])

      setLoading(false)
    }, 500)
  }, [status, session, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 arabgram-gradient rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'المستخدمين', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'المنشورات', value: posts.length, icon: FileText, color: 'from-purple-500 to-pink-500' },
    { label: 'الإحصائيات', value: '99.9%', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
    { label: 'الأمان', value: 'آمن', icon: Shield, color: 'from-orange-500 to-red-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 arabgram-gradient rounded-2xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black arabgram-text-gradient">لوحة الإدارة</h1>
              <p className="text-gray-500 text-sm mt-1">إدارة المنصة والمستخدمين</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>مسؤول النظام</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="arabgram-card p-6 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview' as const, label: 'نظرة عامة', icon: BarChart3 },
            { id: 'users' as const, label: 'المستخدمين', icon: Users },
            { id: 'posts' as const, label: 'المنشورات', icon: FileText },
            { id: 'security' as const, label: 'الأمان', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'arabgram-gradient text-white shadow-lg'
                  : 'border border-white/20 text-gray-400 hover:text-white hover:border-white/40'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="arabgram-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">آخر المستخدمين</h2>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                        alt={user.name || user.username}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        <p className="text-gray-500 text-xs">@{user.username}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="arabgram-card p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">آخر المنشورات</h2>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <Image
                        src={post.imageUrl}
                        alt="Post"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{post.user.name}</p>
                        <p className="text-gray-500 text-xs truncate">{post.caption}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all duration-200">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="arabgram-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">إدارة المستخدمين</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">المستخدم</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">الدور</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">تاريخ الإنشاء</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                            alt={user.name || user.username}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-white font-semibold text-sm">{user.name}</p>
                            <p className="text-gray-500 text-xs">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN' ? 'bg-red-500/20 text-red-300' :
                          user.role === 'MODERATOR' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{user.createdAt}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button className="p-1 hover:bg-blue-500/20 rounded text-blue-400 transition-all duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-all duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="arabgram-card p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">إدارة المنشورات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                  <Image
                    src={post.imageUrl}
                    alt="Post"
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-white/5">
                    <p className="text-white font-semibold text-sm mb-2">{post.user.name}</p>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{post.caption}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{post.likes} إعجاب</span>
                      <button className="p-2 hover:bg-red-500/20 rounded text-red-400 transition-all duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="arabgram-card p-6 rounded-2xl border border-green-500/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">حالة الأمان</h2>
                  <p className="text-gray-400">جميع أنظمة الأمان تعمل بشكل صحيح</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { name: 'تشفير SSL', status: 'مفعّل' },
                  { name: 'المصادقة الثنائية', status: 'مفعّلة' },
                  { name: 'حماية CSRF', status: 'مفعّلة' },
                  { name: 'Rate Limiting', status: 'مفعّل' },
                  { name: 'التحقق برموز البريد', status: 'مفعّل' },
                  { name: 'تشفير كلمات المرور', status: 'مفعّل' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white font-semibold">{item.name}</span>
                    <span className="text-green-400 text-sm font-semibold">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
