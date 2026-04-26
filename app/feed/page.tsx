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
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[470px] w-full mx-auto pb-20 pt-16 md:pt-10 px-0 sm:px-4" dir="rtl">
      {/* Stories Section Placeholder */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 mb-6 border-b border-slate-200">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
          <div className="w-[66px] h-[66px] rounded-full border border-slate-200 p-[2px] relative">
            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">+</span>
            </div>
          </div>
          <span className="text-xs text-slate-500">قصتك</span>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
            <div className="w-[66px] h-[66px] story-ring-active">
              <div className="w-full h-full rounded-full border-2 border-white bg-slate-200" />
            </div>
            <span className="text-xs text-slate-900 w-16 truncate text-center">user_{i}</span>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 border-2 border-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">+</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">لا توجد منشورات</h2>
          <p className="text-slate-500 text-sm mb-6">ابدأ بمتابعة الأشخاص لتشاهد صورهم.</p>
          <Link href="/search" className="btn-primary">استكشف</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white sm:border border-slate-200 sm:rounded-md pb-4">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <Link href={`/profile/${post.user.username}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    {post.user.image ? (
                      <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                        {post.user.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{post.user.username}</p>
                  </div>
                </Link>
                <button className="text-slate-900">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Post Image Container */}
              <div className="relative aspect-square w-full bg-slate-100 border-y border-slate-100">
                <img 
                  src={post.imageUrl} 
                  alt={post.caption} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Post Actions & Content */}
              <div className="px-3 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <button className="hover:opacity-50 transition-opacity">
                      <Heart className="h-6 w-6 stroke-[1.5px]" />
                    </button>
                    <button className="hover:opacity-50 transition-opacity">
                      <MessageCircle className="h-6 w-6 stroke-[1.5px]" />
                    </button>
                    <button className="hover:opacity-50 transition-opacity">
                      <Send className="h-6 w-6 stroke-[1.5px]" />
                    </button>
                  </div>
                  <button className="hover:opacity-50 transition-opacity">
                    <Bookmark className="h-6 w-6 stroke-[1.5px]" />
                  </button>
                </div>

                {/* Likes count */}
                <p className="font-semibold text-sm text-slate-900 mb-1">
                  {post.likes.length} تسجيلات إعجاب
                </p>

                {/* Caption */}
                <div className="text-sm">
                  <span className="font-semibold ml-2">{post.user.username}</span>
                  <span>{post.caption}</span>
                </div>

                {/* Comments preview */}
                {post._count.comments > 0 && (
                  <button className="text-slate-500 text-sm mt-1 mb-1">
                    عرض جميع التعليقات ({post._count.comments})
                  </button>
                )}
                
                {/* Date */}
                <p className="text-[10px] text-slate-400 uppercase mt-1">
                  {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>

              {/* Add Comment Input (fake) */}
              <div className="px-3 pt-3 mt-3 border-t border-slate-100 flex items-center gap-3">
                <Smile className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="أضف تعليقاً..." 
                  className="flex-1 text-sm bg-transparent outline-none"
                />
                <button className="text-brand-primary text-sm font-semibold opacity-50 cursor-default">نشر</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
