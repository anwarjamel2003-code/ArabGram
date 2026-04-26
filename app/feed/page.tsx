'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Loader2, Smile } from 'lucide-react'
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
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin mb-4" />
        <span className="text-zinc-500 font-medium animate-pulse">جاري التحميل...</span>
      </div>
    )
  }

  return (
    <div className="max-w-[550px] w-full mx-auto pb-24 pt-8 px-4" dir="rtl">
      
      {/* Stories Section Floating Bar */}
      <div className="glass-card rounded-[2rem] p-4 mb-8 flex gap-4 overflow-x-auto no-scrollbar shadow-pink-500/5 border border-white/5 relative z-10">
        <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
          <div className="w-[68px] h-[68px] rounded-full p-[2px] bg-zinc-800 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
              <span className="text-2xl text-white">+</span>
            </div>
          </div>
          <span className="text-xs text-zinc-400 font-medium">إضافة</span>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="w-[68px] h-[68px] story-ring-active group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(220,20,90,0.3)]">
              <div className="w-full h-full rounded-full border-2 border-zinc-950 bg-zinc-800" />
            </div>
            <span className="text-xs text-zinc-300 font-medium w-16 truncate text-center">User {i}</span>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[3rem] p-10 animate-float">
          <div className="w-24 h-24 rounded-full arabgram-gradient p-[1px] mx-auto mb-6">
            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white opacity-50">+</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">عالمك فارغ حالياً</h2>
          <p className="text-zinc-500 text-sm mb-8 font-medium">استكشف وتفاعل مع الآخرين لملء التغذية الخاصة بك.</p>
          <Link href="/search" className="btn-primary inline-block">اكتشف الآن</Link>
        </div>
      ) : (
        <div className="space-y-10">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-colors">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 px-5 bg-zinc-900/50 backdrop-blur-md">
                <Link href={`/profile/${post.user.username}`} className="flex items-center gap-3 group/user">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 shadow-sm group-hover/user:shadow-pink-500/20 transition-all">
                    {post.user.image ? (
                      <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold arabgram-text-gradient bg-zinc-900">
                        {post.user.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-white group-hover/user:arabgram-text-gradient transition-all">{post.user.username}</p>
                  </div>
                </Link>
                <button className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
              </div>

              {/* Post Image Container */}
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.caption} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Modern subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Post Actions & Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/5">
                    <button className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all group/btn relative">
                      <Heart className="h-6 w-6 group-hover/btn:fill-pink-500 group-hover/btn:text-pink-500 transition-colors" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all">
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <button className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all">
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                  <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 text-white transition-all">
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>

                {/* Likes count */}
                <p className="font-bold text-[15px] text-white mb-2 flex items-center gap-2">
                  <span className="arabgram-gradient w-2 h-2 rounded-full animate-pulse" />
                  {post.likes.length} تسجيل إعجاب
                </p>

                {/* Caption */}
                <div className="text-[15px] text-zinc-300 leading-relaxed mb-3">
                  <span className="font-bold text-white ml-2">{post.user.username}</span>
                  {post.caption}
                </div>

                {/* Comments preview */}
                {post._count.comments > 0 && (
                  <button className="text-zinc-500 hover:text-zinc-400 font-medium text-[14px] transition-colors">
                    عرض جميع التعليقات ({post._count.comments})
                  </button>
                )}
                
                {/* Date */}
                <p className="text-[11px] text-zinc-600 font-bold uppercase mt-2 tracking-wider">
                  {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>

              {/* Add Comment Input */}
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-pink-500/50 focus-within:ring-1 focus-within:ring-pink-500/50 transition-all">
                  <Smile className="h-5 w-5 text-zinc-500 shrink-0 cursor-pointer hover:text-white transition-colors" />
                  <input 
                    type="text" 
                    placeholder="أضف تعليقاً..." 
                    className="flex-1 text-[14px] bg-transparent outline-none text-white placeholder-zinc-500"
                  />
                  <button className="arabgram-text-gradient text-[14px] font-bold opacity-50 hover:opacity-100 transition-opacity">نشر</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
