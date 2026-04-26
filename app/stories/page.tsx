'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Clock, Plus, Eye, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Story {
  id: string
  user: {
    name: string
    username: string
    image?: string
  }
  expiresAt: string
  views: number
  imageUrl: string
}

export default function Stories() {
  const { data: session } = useSession()
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories')
      if (res.ok) {
        const data = await res.json()
        setStories(data.map((s: any) => ({
          ...s,
          views: Math.floor(Math.random() * 500) + 10,
        })))
      }
    } catch (err) {
      console.error('Failed to fetch stories', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full px-6 py-12 md:py-20 relative z-10 pb-32" dir="rtl">
      <div className="max-w-[1400px] mx-auto">

        {/* Avant-Garde Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <h1 className="text-7xl md:text-9xl font-black text-white/5 tracking-tighter select-none uppercase">اللحظات.</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm -mt-4 md:-mt-8">تختفي بعد 24 ساعة · {stories.length} قصة نشطة</p>
          </div>
          {session && (
            <button className="flex items-center gap-3 px-8 py-4 rounded-full arabgram-gradient text-white font-black text-lg shadow-[0_0_30px_rgba(220,20,90,0.3)] hover:shadow-[0_0_50px_rgba(220,20,90,0.5)] transition-all hover:scale-105 shrink-0">
              <Plus className="h-6 w-6" />
              <span>أضف لحظة</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-12 w-12 text-white animate-spin opacity-20" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="text-5xl font-black text-zinc-700">لا لحظات هنا بعد.</h2>
            <p className="text-zinc-600 mt-4 font-bold">كن أول من يترك أثراً.</p>
          </div>
        ) : (
          /* Cinematic Stories Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {stories.map((story, i) => (
              <div
                key={story.id}
                className="group cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <div
                  className="relative overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  style={{ aspectRatio: '9/16' }}
                >
                  <Image
                    src={story.imageUrl}
                    alt={story.user.name || 'Story'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/10 to-transparent" />

                  {/* Top: Views */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-white text-xs font-black">
                    <Eye className="h-3 w-3" />
                    <span>{story.views}</span>
                  </div>

                  {/* Bottom: User Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                        {story.user.image ? (
                          <img src={story.user.image} alt={story.user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full arabgram-gradient flex items-center justify-center">
                            <span className="text-white text-xs font-black">{story.user.name?.[0]}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-white font-black text-sm line-clamp-1">{story.user.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold">
                      <Clock className="h-3 w-3" />
                      <span>{story.expiresAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Story Card */}
            {session && (
              <div className="group cursor-pointer">
                <div
                  className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 flex items-center justify-center"
                  style={{ aspectRatio: '9/16' }}
                >
                  <div className="text-center">
                    <div className="w-14 h-14 arabgram-gradient rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(220,20,90,0.3)]">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <p className="arabgram-text-gradient font-black text-sm">لحظة جديدة</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cinematic Story Viewer Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]"
            style={{ aspectRatio: '9/16', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Story Image */}
            <Image
              src={selectedStory.imageUrl}
              alt={selectedStory.user.name || 'Story'}
              fill
              className="object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/50" />

            {/* Close */}
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-6 left-6 z-10 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white border border-white/20 text-2xl hover:scale-110 transition-transform"
            >
              ✕
            </button>

            {/* Story User Info */}
            <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                {selectedStory.user.image ? (
                  <img src={selectedStory.user.image} alt={selectedStory.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full arabgram-gradient flex items-center justify-center">
                    <span className="text-white font-black">{selectedStory.user.name?.[0]}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-black">{selectedStory.user.name}</p>
                <p className="text-zinc-400 text-sm">@{selectedStory.user.username}</p>
              </div>
            </div>

            {/* Bottom stats */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-white z-10">
              <Eye className="h-5 w-5 opacity-60" />
              <span className="font-black text-xl">{selectedStory.views}</span>
              <span className="text-zinc-400 text-sm font-bold">مشاهدة</span>
            </div>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-10">
              <button className="pointer-events-auto w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white text-xl border border-white/10 hover:scale-110 transition-transform">←</button>
              <button className="pointer-events-auto w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white text-xl border border-white/10 hover:scale-110 transition-transform">→</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
