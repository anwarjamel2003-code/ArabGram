'use client'

import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface PostCardProps {
  id: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  username: string
  userImage: string
  userHasLiked: boolean
}

export default function PostCard({ 
  id, 
  imageUrl, 
  caption, 
  likes, 
  comments, 
  username, 
  userImage, 
  userHasLiked 
}: PostCardProps) {
  const { data: session } = useSession()

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <img src={userImage} alt={username} className="w-8 h-8 rounded-full" />
          <span className="font-semibold">@{username}</span>
        </div>
      </div>
      <img src={imageUrl} alt="Post" className="w-full h-64 object-cover" />
      <div className="p-4">
        <p className="text-sm mb-2">{caption}</p>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Heart className={`h-4 w-4 ${userHasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <span>💬</span>
            <span>{comments}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
