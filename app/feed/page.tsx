'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Loader2, Sparkles, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  id: string
  caption: string
  imageUrl: string
  createdAt: string
  user: {
    id: string
    name: string
    username: string
    image?: string
  }
  likes: any[]
  _count: {
    comments: number
  }
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl arabgram-gradient animate-spin-slow opacity-20 blur-xl absolute inset-0" />
          <Loader2 className="h-16 w-16 text-brand-primary animate-spin relative z-10" />
        </div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">جاري تحميل عالمك...</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-10 pb-20 pt-24 px-4" dir="rtl">
      {/* Stories Placeholder / Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">آخر <span className="arabgram-text-gradient">التحديثات</span></h1>
        <div className="flex -space-x-3 space-x-reverse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
              <Sparkles className="h-4 w-4 text-brand-primary" />
            </div>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="glass-card p-16 rounded-[3rem] text-center animate-fade-in-up">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Camera className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">لا توجد منشورات بعد</h2>
          <p className="text-slate-500 font-medium mb-8">ابدأ بمتابعة الأشخاص لتشاهد منشوراتهم هنا في تغذيتك.</p>
          <Link href="/search" className="btn-arabgram px-8 py-3 rounded-xl font-bold">استكشف الآن</Link>
        </div>
      ) : (
        posts.map((post, idx) => (
          <div 
            key={post.id} 
            className="post-card glass-card rounded-[2.5rem] overflow-hidden animate-fade-in-up shadow-2xl"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Post Header */}
            <div className="p-5 flex items-center justify-between">
              <Link href={`/profile/${post.user.username}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 story-ring-active group-hover:scale-110 transition-transform shadow-md">
                  <div className="w-full h-full bg-white rounded-full overflow-hidden border-2 border-white">
                    {post.user.image ? (
                      <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-gradient">
                        <span className="text-white font-bold">{post.user.name?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-black text-slate-900 group-hover:text-brand-primary transition-colors">{post.user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">@{post.user.username}</p>
                </div>
              </Link>
              <button className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </div>

            {/* Post Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-900 group">
              <img 
                src={post.imageUrl} 
                alt={post.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white font-medium text-lg leading-relaxed line-clamp-2">{post.caption}</p>
              </div>
            </div>

            {/* Post Actions & Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-secondary transition-all group">
                    <Heart className="h-6 w-6 group-hover:fill-current transition-all" />
                    <span className="font-black text-sm">{post.likes.length}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-primary transition-all">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-black text-sm">{post._count.comments}</span>
                  </button>
                  <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-accent transition-all">
                    <Send className="h-6 w-6" />
                  </button>
                </div>
                <button className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-brand-accent transition-all">
                  <Bookmark className="h-6 w-6" />
                </button>
              </div>

              {/* Caption & Date */}
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <span className="font-black text-brand-primary text-sm">@{post.user.username}</span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{post.caption}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    {new Date(post.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-brand-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
