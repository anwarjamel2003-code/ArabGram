'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, MoreHorizontal, Loader2 } from 'lucide-react'
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 arabgram-gradient rounded-full blur-xl opacity-50 animate-pulse" />
          <Loader2 className="relative z-10 h-24 w-24 text-white animate-spin drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 py-12 md:py-24" dir="rtl">
      
      {/* Avant-Garde Header */}
      <div className="mb-20 text-center md:text-right">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 opacity-90">اللوحة.</h1>
        <p className="text-xl md:text-2xl text-zinc-500 font-medium tracking-wide">فن. لحظات. إلهام.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-32 glass-panel rounded-[3rem] animate-float max-w-2xl mx-auto">
          <div className="text-8xl mb-8 opacity-20">✧</div>
          <h2 className="text-4xl font-black text-white mb-4">اللوحة عذراء</h2>
          <p className="text-zinc-500 text-lg mb-10 font-medium">كن أول من يضع بصمته هنا.</p>
        </div>
      ) : (
        <div className="masonry-grid pb-32">
          {posts.map((post, i) => {
            // Randomly assign heights to make it a true irregular masonry
            const heightClasses = ['h-[300px]', 'h-[400px]', 'h-[500px]', 'h-[600px]']
            const randomHeight = heightClasses[i % heightClasses.length]

            return (
              <div key={post.id} className={`masonry-item relative group rounded-[2rem] overflow-hidden ${randomHeight} bg-zinc-900 border border-white/5 cursor-pointer transform hover:scale-[1.02] transition-all duration-500`}>
                
                {/* The Image */}
                <img 
                  src={post.imageUrl} 
                  alt={post.caption} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* Immersive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  
                  <div className="hover-reveal flex flex-col gap-4">
                    {/* User Info */}
                    <div className="flex items-center justify-between">
                      <Link href={`/profile/${post.user.username}`} className="flex items-center gap-3 group/user" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover/user:border-white transition-colors">
                          {post.user.image ? (
                            <img src={post.user.image} alt={post.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-black text-zinc-900 bg-white">
                              {post.user.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="font-black text-xl text-white drop-shadow-md tracking-wide">{post.user.username}</span>
                      </Link>
                      
                      <button className="text-white/50 hover:text-white transition-colors p-2">
                        <MoreHorizontal className="h-8 w-8" />
                      </button>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                      <p className="text-white/90 text-lg leading-relaxed font-medium line-clamp-3">
                        {post.caption}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/20">
                      <div className="flex items-center gap-2 text-white group/btn">
                        <Heart className="h-7 w-7 transition-colors group-hover/btn:fill-white" />
                        <span className="font-bold text-lg">{post.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white group/btn">
                        <MessageCircle className="h-7 w-7 transition-colors group-hover/btn:fill-white" />
                        <span className="font-bold text-lg">{post._count.comments}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
