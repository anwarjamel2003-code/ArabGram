'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { User, Users, Image as ImageIcon, ShieldCheck, Grid, Heart, MessageCircle, Settings, Loader2 } from 'lucide-react'
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
        const { count } = await res.json()
        setFollowersCount(count)
      }
    } else if (profile) {
      setFollowersCount(profile._count.followers)
    }
  }

  const handleFollow = async () => {
    const method = following ? 'DELETE' : 'POST'
    await fetch('/api/follows', { 
      method, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetId: profile!.id }) 
    })
    setFollowing(!following)
    setFollowersCount(prev => following ? prev - 1 : prev + 1)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#050505]">
        <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-center">
        <div className="glass-card p-12 rounded-[3rem] max-w-md">
          <User className="h-16 w-16 text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white mb-2">المستخدم غير موجود</h2>
          <p className="text-gray-500 mb-8">عذراً، لم نتمكن من العثور على الحساب الذي تبحث عنه.</p>
          <Link href="/feed" className="btn-arabgram px-8 py-3 rounded-xl font-bold inline-block">العودة للرئيسية</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20" dir="rtl">
      {/* Background Blobs */}
      <div className="bg-blob w-[400px] h-[400px] bg-brand-primary top-[-5%] right-[-5%] opacity-10" />
      <div className="bg-blob w-[300px] h-[300px] bg-brand-secondary bottom-[10%] left-[-5%] opacity-10" />

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header Card */}
        <div className="glass-card rounded-[3rem] p-8 md:p-12 mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 arabgram-gradient opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 story-ring-active p-1 animate-pulse-soft">
                <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden border-4 border-black shadow-2xl">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-gradient">
                      <span className="text-4xl font-black text-white">{profile.name?.[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{profile.name}</h1>
                <span className="text-brand-primary font-bold text-lg">@{profile.username}</span>
              </div>
              
              {profile.bio && (
                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mb-8">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {!isOwnProfile ? (
                  <>
                    <button 
                      onClick={handleFollow}
                      className={`px-10 py-3.5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl ${
                        following 
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                        : 'btn-arabgram hover:scale-105'
                      }`}
                    >
                      {following ? 'إلغاء المتابعة' : 'متابعة'}
                    </button>
                    <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <MessageCircle className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <EditProfileModal user={profile} onUpdate={fetchProfile} />
                    <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                      <Settings className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-white/5">
            <StatBox count={profile._count.posts} label="منشور" icon={ImageIcon} />
            <StatBox count={followersCount} label="متابع" icon={Users} />
            <StatBox count={profile._count.following} label="يتابع" icon={User} />
          </div>
        </div>

        {/* Content Tabs / Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl arabgram-gradient flex items-center justify-center">
              <Grid className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-black">المنشورات <span className="text-gray-600 text-sm mr-2 font-bold">{posts.length}</span></h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {posts.map((post: any, idx) => (
              <div 
                key={post.id} 
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => router.push(`/post/${post.id}`)}
              >
                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-white fill-white" />
                    <span className="text-white font-black text-lg">{post._count?.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-white fill-white" />
                    <span className="text-white font-black text-lg">{post._count?.comments || 0}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="col-span-full py-32 text-center glass-card rounded-[3rem]">
                <ImageIcon className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">لا توجد منشورات حتى الآن</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ count, label, icon: Icon }: { count: number, label: string, icon: any }) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="flex items-center gap-2 mb-1 transition-transform group-hover:scale-110 duration-300">
        <Icon className="h-4 w-4 text-brand-primary" />
        <span className="text-2xl md:text-3xl font-black text-white">{count}</span>
      </div>
      <span className="text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  )
}
