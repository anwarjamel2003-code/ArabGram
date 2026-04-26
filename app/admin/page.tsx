'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Users, FileText, BarChart3, Shield, Trash2, Eye, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface AdminUser {
  id: string
  username: string
  email: string
  name?: string
  role: string
  createdAt: string
  image?: string
}

interface AdminPost {
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
  const [users, setUsers] = useState<AdminUser[]>([])
  const [posts, setPosts] = useState<AdminPost[]>([])
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
        { id: '1', username: 'user1', email: 'user1@example.com', name: 'أحمد محمد', role: 'USER', createdAt: '2024-01-15', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
        { id: '2', username: 'user2', email: 'user2@example.com', name: 'سارة علي', role: 'USER', createdAt: '2024-02-20', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' },
      ])
      setPosts([
        { id: '1', caption: 'صورة جميلة من الطبيعة', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300', user: { username: 'user1', name: 'أحمد محمد' }, createdAt: '2024-04-10', likes: 234 },
      ])
      setLoading(false)
    }, 500)
  }, [status, session, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin opacity-20" />
      </div>
    )
  }

  const stats = [
    { label: 'المستخدمين', value: users.length, icon: Users },
    { label: 'المنشورات', value: posts.length, icon: FileText },
    { label: 'جاهزية النظام', value: '99.9%', icon: BarChart3 },
    { label: 'حالة الأمان', value: '✓ آمن', icon: Shield },
  ]

  const tabs = [
    { id: 'overview' as const, label: 'نظرة عامة', icon: BarChart3 },
    { id: 'users' as const, label: 'المستخدمون', icon: Users },
    { id: 'posts' as const, label: 'المنشورات', icon: FileText },
    { id: 'security' as const, label: 'الأمان', icon: Shield },
  ]

  const securityItems = [
    { name: 'تشفير SSL', ok: true },
    { name: 'المصادقة الثنائية', ok: true },
    { name: 'حماية CSRF', ok: true },
    { name: 'Rate Limiting', ok: true },
    { name: 'التحقق برموز البريد', ok: true },
    { name: 'تشفير كلمات المرور', ok: true },
  ]

  return (
    <div className="min-h-screen w-full px-6 py-12 md:py-20 relative z-10 pb-32" dir="rtl">
      <div className="max-w-[1400px] mx-auto">

        {/* Avant-Garde Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="px-4 py-2 rounded-full glass-panel border border-white/10 text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 arabgram-text-gradient" />
              مسؤول النظام
            </div>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white/5 tracking-tighter select-none uppercase">الإدارة.</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm -mt-4 md:-mt-8">لوحة التحكم الكاملة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-panel rounded-[2rem] p-8 border border-white/10 group hover:border-white/20 transition-colors">
              <stat.icon className="h-8 w-8 text-zinc-600 mb-6 group-hover:text-white transition-colors" />
              <p className="text-5xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'arabgram-gradient text-white shadow-[0_0_20px_rgba(220,20,90,0.3)]'
                  : 'glass-panel border border-white/10 text-zinc-500 hover:text-white hover:border-white/20'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-8">آخر المستخدمين</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                      {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full arabgram-gradient flex items-center justify-center text-white font-black">{user.name?.[0]}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black truncate">{user.name}</p>
                      <p className="text-zinc-500 text-sm font-bold">@{user.username}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-black ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-8">آخر المنشورات</h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                      <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black">{post.user.name}</p>
                      <p className="text-zinc-500 text-sm truncate">{post.caption}</p>
                    </div>
                    <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10 overflow-x-auto">
            <h2 className="text-3xl font-black text-white mb-10">إدارة المستخدمين</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['المستخدم', 'البريد الإلكتروني', 'الدور', 'تاريخ الإنشاء', 'إجراءات'].map(h => (
                    <th key={h} className="text-right py-4 px-6 text-xs font-black text-zinc-600 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {user.image ? <img src={user.image} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full arabgram-gradient flex items-center justify-center text-white font-black text-sm">{user.name?.[0]}</div>}
                        </div>
                        <div>
                          <p className="text-white font-black">{user.name}</p>
                          <p className="text-zinc-600 text-xs">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-zinc-400 text-sm">{user.email}</td>
                    <td className="py-5 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>{user.role}</span>
                    </td>
                    <td className="py-5 px-6 text-zinc-500 text-sm font-bold">{user.createdAt}</td>
                    <td className="py-5 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><Eye className="h-4 w-4" /></button>
                        <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10">
            <h2 className="text-3xl font-black text-white mb-10">إدارة المنشورات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors group">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-5 bg-zinc-900/50">
                    <p className="text-white font-black mb-1">{post.user.name}</p>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{post.caption}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-xs font-bold">{post.likes} إعجاب</span>
                      <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 border border-white/10">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Shield className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white mb-2">جميع الأنظمة تعمل.</h2>
                <p className="text-zinc-500 font-bold">آخر فحص: منذ لحظات</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-white font-black text-lg">{item.name}</span>
                  <span className="text-emerald-400 font-black text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    مفعّل
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
