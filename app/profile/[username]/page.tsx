'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Settings, Loader2, Bookmark, Heart, MessageCircle } from 'lucide-react'
import EditProfileModal from "@/components/EditProfileModal"

interface UserProfile {
  id: string
  name: string
  username: string
  image?: string
  bio?: string
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

  const currentUserId = (session?.user as any)?.id
  const isOwnProfile = profile?.id === currentUserId
  const displayUsername = typeof username === 'string' ? username.replace('%40', '') : ''

  useEffect(() => {
    if (!username) return
    fetchProfile()
  }, [username])

  useEffect(() => {
    if (profile?.id) {
      fetchPosts()
      checkFollowing()
    }
  }, [profile])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?username=${displayUsername}`)
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    const res = await fetch(`/api/posts?userId=${profile?.id}`)
    if (res.ok) setPosts(await res.json())
  }

  const checkFollowing = async () => {
    if (!isOwnProfile && currentUserId && profile?.id) {
      const res = await fetch(`/api/follows?userId=${profile.id}&type=followers`)
      if (res.ok) {
        const { count, isFollowing } = await res.json()
        setFollowersCount(count)
        if (isFollowing !== undefined) setFollowing(isFollowing)
      }
    } else if (profile) {
      setFollowersCount(profile._count.followers)
    }
  }

  const handleFollow = async () => {
    if (!currentUserId) {
      router.push('/auth/signin')
      return
    }
    const method = following ? 'DELETE' : 'POST'
    await fetch('/api/follows', { 
      method, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: profile!.id }) 
    })
    setFollowing(!following)
    setFollowersCount(prev => following ? prev - 1 : prev + 1)
  }

  const handleMessage = () => {
    if (!currentUserId) {
      router.push('/auth/signin')
      return
    }
    router.push(`/messages?userId=${profile!.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 text-white animate-spin drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h2 className="text-6xl font-black text-white/20 mb-4 tracking-widest">404</h2>
        <p className="text-xl text-zinc-500 font-medium">الهوية مفقودة في هذا الكون.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 relative" dir="rtl">
      
      {/* Background large text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none z-0">
        {profile.username.toUpperCase()}
      </div>

      {/* Digital Passport Card */}
      <div className="glass-panel w-full max-w-[1000px] rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10 animate-float shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/10">
        
        {/* Holographic effect */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />

        {/* Profile Image (Orb) */}
        <div className="relative group flex-shrink-0">
          <div className="absolute -inset-4 arabgram-gradient rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-white/20 bg-zinc-900 z-10 shadow-2xl">
            {profile.image ? (
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center arabgram-gradient">
                <span className="text-6xl font-black text-white">{profile.name?.[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
            {profile.name}
          </h1>
          <p className="text-2xl text-zinc-400 font-bold mb-8">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-xl text-white/80 leading-relaxed font-medium mb-10 max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Minimalist Stats */}
          <div className="flex items-center justify-center md:justify-start gap-12 mb-10">
            <div className="text-center">
              <span className="block text-4xl font-black text-white mb-1">{profile._count.posts}</span>
              <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">إبداع</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black text-white mb-1">{followersCount}</span>
              <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">متابع</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black text-white mb-1">{profile._count.following}</span>
              <span className="text-sm font-bold tracking-widest text-zinc-500 uppercase">يتابع</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {isOwnProfile ? (
              <>
                <EditProfileModal user={profile} onUpdate={fetchProfile} />
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold transition-all text-lg">
                  <Settings className="w-6 h-6 inline-block" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleFollow}
                  className={`px-10 py-4 rounded-full font-black text-lg transition-all duration-300 ${
                    following 
                      ? 'bg-transparent border border-white/20 text-white hover:bg-white/5' 
                      : 'arabgram-gradient text-white shadow-[0_0_30px_rgba(250,150,40,0.3)] hover:shadow-[0_0_40px_rgba(250,150,40,0.5)] transform hover:scale-105'
                  }`}
                >
                  {following ? 'متصل' : 'تواصل'}
                </button>
                <button 
                  onClick={handleMessage}
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold transition-all text-lg"
                >
                  أرسل إشارة
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Gallery (The Artworks) */}
      <div className="w-full mt-24 pb-32 relative z-10">
        <h3 className="text-3xl font-black text-white/50 mb-8 px-8 max-w-[1600px] mx-auto uppercase tracking-widest">المعرض</h3>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <span className="text-6xl">✦</span>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-8 px-8 pb-12 snap-x snap-mandatory no-scrollbar max-w-[1600px] mx-auto">
            {posts.map((post: any) => (
              <div 
                key={post.id} 
                className="snap-center shrink-0 w-[80vw] max-w-[500px] aspect-[4/5] relative group cursor-pointer rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl"
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="hover-reveal">
                    <p className="text-white font-medium text-lg line-clamp-2 mb-4">{post.caption}</p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/80">
                        <Heart className="w-6 h-6" /> <span className="font-bold">{post._count?.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MessageCircle className="w-6 h-6" /> <span className="font-bold">{post._count?.comments || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
