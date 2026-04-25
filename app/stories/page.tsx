'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Plus, Eye, Trash2, Share2 } from 'lucide-react'
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
          views: Math.floor(Math.random() * 500) + 10, // Mock views as they are not in DB
        })))
      }
    } catch (err) {
      console.error('Failed to fetch stories', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = (id: string) => {
    setStories(stories.filter(s => s.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 arabgram-gradient rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black arabgram-text-gradient">القصص</h1>
              <p className="text-gray-500 text-sm mt-1">تختفي بعد 24 ساعة</p>
            </div>
          </div>

          {session && (
            <button className="flex items-center gap-2 px-6 py-3 btn-arabgram rounded-2xl font-semibold">
              <Plus className="h-5 w-5" />
              <span>إضافة قصة</span>
            </button>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative overflow-hidden rounded-3xl aspect-[9/16] bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Background Image */}
                <Image
                  src={story.imageUrl}
                  alt={story.user.name || 'Story'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />

                {/* Story Ring */}
                <div className="absolute top-3 right-3 story-ring p-0.5">
                  <Image
                    src={story.user.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                    alt={story.user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                  <p className="text-white font-bold text-sm line-clamp-1">{story.user.name}</p>
                  <div className="flex items-center gap-1 text-gray-300 text-xs mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{story.expiresAt}</span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                  <div className="flex gap-3">
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Views Badge */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-semibold flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{story.views}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add Story Card */}
          {session && (
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-[9/16] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-dashed border-purple-500/50 hover:border-purple-500 transition-all duration-300 flex items-center justify-center hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-12 h-12 arabgram-gradient rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-purple-400 font-semibold text-sm">إضافة قصة</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Story Viewer Modal */}
        {selectedStory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStory(null)}
          >
            <div
              className="relative w-full max-w-sm h-screen max-h-[90vh] rounded-3xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                ✕
              </button>

              {/* Story Image */}
              <Image
                src={selectedStory.imageUrl}
                alt={selectedStory.user.name || 'Story'}
                fill
                className="object-cover"
              />

              {/* Story Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-10">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedStory.user.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                    alt={selectedStory.user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-bold">{selectedStory.user.name}</p>
                    <p className="text-gray-400 text-sm">@{selectedStory.user.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{selectedStory.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute top-1/2 left-4 right-4 flex justify-between pointer-events-none z-10">
                <button className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200">
                  ←
                </button>
                <button className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200">
                  →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">لا توجد قصص حالياً</h2>
            <p className="text-gray-600">ابدأ بإضافة قصة جديدة لمشاركة لحظاتك</p>
          </div>
        )}
      </div>
    </div>
  )
}
