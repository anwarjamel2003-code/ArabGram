'use client'

import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Posts Yet</h2>
          <p className="text-gray-600 dark:text-gray-400">Start following people to see their posts here</p>
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.image} alt={post.user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {post.user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{post.user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{post.user.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">⋮</Button>
            </div>

            {/* Post Image */}
            <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
            </div>

            {/* Post Actions */}
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="hover:text-red-500">
                    <Heart className="h-6 w-6" fill="currentColor" />
                    <span className="ml-2 text-sm">{post.likes.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-blue-500">
                    <MessageCircle className="h-6 w-6" />
                    <span className="ml-2 text-sm">{post._count.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:text-purple-500">
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="hover:text-yellow-500">
                  <Bookmark className="h-6 w-6" />
                </Button>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">@{post.user.username}</span> {post.caption}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

