'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { User, Users, Image as ImageIcon, Grid, MessageCircle, Settings, Loader2, Bookmark, Heart, Plus } from 'lucide-react'
import Link from 'next/link'
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="glass-card p-12 rounded-[3rem] animate-float">
          <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">عذراً، هذه الصفحة غير متوفرة.</h2>
          <p className="text-sm text-zinc-400 mb-6 font-medium">قد يكون الرابط الذي اتبعته معطلاً، أو ربما تمت إزالة الصفحة.</p>
          <Link href="/feed" className="btn-primary inline-block">العودة إلى الرئيسية</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[900px] mx-auto pt-8 pb-24 px-4 md:px-8" dir="rtl">
      
      {/* Profile Header (Modern Glass Bento Style) */}
      <div className="glass-card rounded-[3rem] p-6 md:p-10 mb-10 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Subtle background glow based on brand gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] arabgram-gradient opacity-10 blur-[100px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
          
          {/* Avatar with glowing ring */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 arabgram-gradient rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full p-1 arabgram-gradient">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden border-4 border-zinc-950">
                {profile.image ? (
                  <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold arabgram-text-gradient">{profile.name?.[0]}</span>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right w-full">
            
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{profile.name}</h1>
                <span className="text-pink-500 font-bold text-lg">@{profile.username}</span>
              </div>
              
              <div className="flex items-center gap-3">
                {isOwnProfile ? (
                  <>
                    <EditProfileModal user={profile} onUpdate={fetchProfile} />
                    <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all shadow-lg hover:shadow-white/5">
                      <Settings className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`btn-primary shadow-[0_10px_20px_rgba(220,20,90,0.2)] hover:shadow-[0_10px_25px_rgba(220,20,90,0.4)] ${
                        following ? '!bg-white/10 !text-white !shadow-none border border-white/20' : ''
                      }`}
                    >
                      {following ? 'متابَع' : 'متابعة'}
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-white transition-all shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {profile.bio && (
              <p className="text-zinc-300 font-medium text-[15px] leading-relaxed max-w-xl mb-8">
                {profile.bio}
              </p>
            )}

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-2xl font-black text-white mb-1">{profile._count.posts}</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">منشور</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-2xl font-black text-white mb-1">{followersCount}</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">متابع</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-2xl font-black text-white mb-1">{profile._count.following}</span>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">يتابع</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button className="px-6 py-3 rounded-2xl font-bold text-sm arabgram-gradient text-white shadow-lg shadow-pink-500/25 flex items-center gap-2">
          <Grid className="w-4 h-4" /> المنشورات
        </button>
        {isOwnProfile && (
          <button className="px-6 py-3 rounded-2xl font-bold text-sm bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
            <Bookmark className="w-4 h-4" /> المحفوظات
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post: any) => (
          <div 
            key={post.id} 
            className="aspect-square relative group cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-zinc-900"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            
            {/* Modern Hover Overlay */}
            <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white font-black text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Heart className="w-7 h-7 fill-pink-500 text-pink-500" /> {post._count?.likes || 0}
              </div>
              <div className="flex items-center gap-2 text-white font-black text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <MessageCircle className="w-7 h-7 fill-blue-500 text-blue-500" /> {post._count?.comments || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-[3rem]">
          <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6">
            <ImageIcon className="w-10 h-10 text-zinc-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">لا توجد منشورات بعد</h2>
          <p className="text-zinc-500 font-medium text-sm">شارك أجمل لحظاتك مع أصدقائك</p>
        </div>
      )}

    </div>
  )
}
