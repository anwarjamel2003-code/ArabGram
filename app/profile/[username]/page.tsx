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
        // If API returns whether current user follows this profile
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
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-xl font-semibold mb-2">عذراً، هذه الصفحة غير متوفرة.</h2>
        <p className="text-sm text-slate-500 mb-6">قد يكون الرابط الذي اتبعته معطلاً، أو ربما تمت إزالة الصفحة.</p>
        <Link href="/feed" className="text-brand-primary font-semibold text-sm">العودة إلى ArabGram.</Link>
      </div>
    )
  }

  return (
    <div className="max-w-[935px] mx-auto pt-8 pb-20 px-4 md:px-5" dir="rtl">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row mb-11">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start md:mr-10 md:w-1/3 mb-6 md:mb-0">
          <div className="w-[150px] h-[150px] md:w-[150px] md:h-[150px] story-ring-seen">
            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-slate-100 flex items-center justify-center">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-light text-slate-400">{profile.name?.[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="md:w-2/3 flex flex-col items-center md:items-start text-center md:text-right">
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-5">
            <h1 className="text-xl leading-5">{profile.username}</h1>
            <div className="flex gap-2 items-center">
              {isOwnProfile ? (
                <>
                  <EditProfileModal user={profile} onUpdate={fetchProfile} />
                  <button className="text-slate-900 px-2 py-1 hover:bg-slate-50 rounded-md transition-colors">
                    <Settings className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleFollow}
                    className={`font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors ${
                      following 
                        ? 'bg-[#efefef] hover:bg-[#dbdbdb] text-black' 
                        : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                    }`}
                  >
                    {following ? 'متابَع' : 'متابعة'}
                  </button>
                  <button 
                    onClick={handleMessage}
                    className="font-semibold px-4 py-1.5 rounded-lg text-sm bg-[#efefef] hover:bg-[#dbdbdb] text-black transition-colors"
                  >
                    مراسلة
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-10 mb-5 text-base">
            <div><span className="font-semibold">{profile._count.posts}</span> منشورات</div>
            <div className="cursor-pointer"><span className="font-semibold">{followersCount}</span> متابع</div>
            <div className="cursor-pointer"><span className="font-semibold">{profile._count.following}</span> يتابع</div>
          </div>

          <div className="text-sm">
            <span className="font-semibold block">{profile.name}</span>
            {profile.bio && <p className="whitespace-pre-wrap mt-1">{profile.bio}</p>}
          </div>

        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden flex justify-around border-t border-slate-200 py-3 text-sm text-center">
        <div className="flex flex-col"><span className="font-semibold">{profile._count.posts}</span><span className="text-slate-500">منشورات</span></div>
        <div className="flex flex-col"><span className="font-semibold">{followersCount}</span><span className="text-slate-500">متابع</span></div>
        <div className="flex flex-col"><span className="font-semibold">{profile._count.following}</span><span className="text-slate-500">يتابع</span></div>
      </div>

      {/* Tabs */}
      <div className="border-t border-slate-200 flex justify-center gap-12">
        <div className="flex items-center gap-2 py-4 border-t border-black -mt-[1px] text-xs font-semibold tracking-widest text-black">
          <Grid className="w-3 h-3" /> منشورات
        </div>
        {isOwnProfile && (
          <div className="flex items-center gap-2 py-4 text-xs font-semibold tracking-widest text-slate-500 cursor-pointer">
            <Bookmark className="w-3 h-3" /> محفوظات
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-7">
        {posts.map((post: any) => (
          <div 
            key={post.id} 
            className="aspect-square relative group cursor-pointer bg-slate-100"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white font-bold">
                <Heart className="w-6 h-6 fill-white stroke-transparent" /> {post._count?.likes || 0}
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <MessageCircle className="w-6 h-6 fill-white stroke-transparent" /> {post._count?.comments || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-900" />
          </div>
          <h2 className="text-2xl font-bold mb-2">لا توجد منشورات بعد</h2>
        </div>
      )}

    </div>
  )
}
