'use client'

import { Search, User, Hash, Loader2, Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [tab, setTab] = useState('users')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'users', icon: User, label: 'مستخدمون' },
    { id: 'posts', icon: Hash, label: 'منشورات' },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    fetchResults()
  }, [debouncedQuery, tab])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${debouncedQuery}&tab=${tab}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[700px] mx-auto pb-24 pt-8 px-4" dir="rtl">

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-2 tracking-wide">الاستكشاف</h1>
        <p className="text-zinc-500 font-medium">ابحث عن مستخدمين، ومنشورات، ووسوم في ArabGram</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 relative group">
        <div className="absolute inset-0 arabgram-gradient opacity-20 blur-2xl group-focus-within:opacity-40 transition-opacity duration-500 rounded-full" />
        <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl focus-within:border-pink-500/50 transition-all">
          <div className="pl-4 pr-3">
            <Search className="h-6 w-6 text-zinc-400 group-focus-within:text-pink-500 transition-colors" />
          </div>
          <input
            placeholder="ابحث هنا..."
            className="w-full bg-transparent border-none focus:ring-0 text-white text-[16px] font-medium placeholder:text-zinc-600 h-12 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="h-6 w-6 text-pink-500 animate-spin mr-3" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-3xl text-[15px] font-bold transition-all duration-300 ${
              tab === id 
                ? 'arabgram-gradient text-white shadow-lg shadow-pink-500/20' 
                : 'glass-card text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setTab(id)}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="min-h-[40vh]">
        {results.length === 0 && !loading ? (
          <div className="text-center py-20 glass-card rounded-[3rem]">
            <Search className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h2>
            <p className="text-zinc-500 font-medium">حاول استخدام كلمات مفتاحية مختلفة للبحث.</p>
          </div>
        ) : (
          tab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((user, i) => (
                <Link key={user.id} href={`/profile/${user.username}`}>
                  <div className="glass-card p-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/10 transition-colors group">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0 group-hover:border-pink-500/50 transition-colors relative">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center arabgram-gradient">
                          <span className="text-white font-bold text-xl">{user.name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[17px] leading-tight mb-1 group-hover:arabgram-text-gradient transition-all">{user.username}</h3>
                      <p className="text-[14px] text-zinc-500 font-medium">{user.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === 'posts' && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.map((post, i) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="group relative aspect-square glass-card rounded-[2rem] overflow-hidden cursor-pointer">
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-white font-black text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Heart className="h-6 w-6 fill-pink-500 text-pink-500" /> {post._count.likes}
                    </div>
                    <div className="flex items-center gap-2 text-white font-black text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      <MessageCircle className="h-6 w-6 fill-blue-500 text-blue-500" /> {post._count.comments}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
