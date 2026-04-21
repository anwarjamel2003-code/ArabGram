'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import EditProfileModal from "@/components/EditProfileModal"
import PostCard from "@/components/PostCard"
import { User, Users, Image } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
  phoneVerified: boolean
  createdAt: string
  _count: {
    posts: number
    followers: number
    following: number
  }
}

export default function ProfilePage() {
  const { username } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)

  const currentUserId = session?.user?.id
  const isOwnProfile = profile?.id === currentUserId
  const fullUsername = `@{username}`

  useEffect(() => {
    if (!username) return

    fetchProfile()
    fetchPosts()
    checkFollowing()
  }, [username])

  const fetchProfile = async () => {
    const res = await fetch(`/api/profile?username=${username}`)
    if (res.ok) {
      const data = await res.json()
      setProfile(data)
    }
    setLoading(false)
  }

  const fetchPosts = async () => {
    // Fetch user's posts
    const res = await fetch(`/api/posts?userId=${profile?.id}`)
    if (res.ok) setPosts(await res.json())
  }

  const checkFollowing = async () => {
    if (!isOwnProfile && currentUserId && profile?.id) {
      const res = await fetch(`/api/follows?userId=${profile.id}&type=followers`)
      const { count } = await res.json()
      setFollowersCount(count)
      // Check if current user follows
      // TODO: Add isFollowing check via API
    }
  }

  const handleFollow = async () => {
    const method = following ? 'DELETE' : 'POST'
    await fetch('/api/follows', { method, body: JSON.stringify({ targetId: profile!.id }) })
    setFollowing(!following)
    setFollowersCount(prev => following ? prev - 1 : prev + 1)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  if (!profile) return <div>User not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border border-white/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 ring-4 ring-white shadow-lg">
              <AvatarImage src={profile.image} />
              <AvatarFallback className="w-28 h-28 md:w-32 md:h-32 text-4xl bg-gradient-to-br from-purple-500 to-pink-500">
                {profile.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {fullUsername}
                </h1>
                {profile.phoneVerified && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Verified
                  </div>
                )}
              </div>
              <p className="text-2xl text-gray-600 mt-1">{profile.name}</p>
              {profile.bio && (
                <p className="text-xl text-gray-700 mt-4 leading-relaxed">{profile.bio}</p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {!isOwnProfile ? (
                <Button 
                  size="lg" 
                  className="font-semibold px-8 py-6 text-lg h-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl"
                  onClick={handleFollow}
                >
                  {following ? 'Unfollow' : 'Follow'}
                </Button>
              ) : (
                <EditProfileModal user={profile} onUpdate={fetchProfile} />
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="text-3xl md:text-4xl font-black mb-1">{profile._count.posts}</div>
            <div className="text-muted-foreground font-medium flex items-center justify-center gap-1">
              <Image className="h-4 w-4" />
              Posts
            </div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="text-3xl md:text-4xl font-black mb-1">{followersCount}</div>
            <div className="text-muted-foreground font-medium flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              Followers
            </div>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="text-3xl md:text-4xl font-black mb-1">{profile._count.following}</div>
            <div className="text-muted-foreground font-medium flex items-center justify-center gap-1">
              <User className="h-4 w-4" />
              Following
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Image className="h-8 w-8" />
            Posts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {posts.map((post: any) => (
              <div key={post.id} className="group relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer hover:scale-105" onClick={() => router.push(`/post/${post.id}`)}>
                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 w-full">
                    <div className="flex items-center justify-between text-sm font-semibold text-black">
                      <span>{post._count.likes} likes</span>
                      <span>{post._count.comments} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full text-center py-24 text-muted-foreground">
                No posts yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
