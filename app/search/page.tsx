'use client'

import { Input } from "@/components/ui/input"
import { Search, User, Hash, ImageIcon as ImageIconComponent, Loader2, Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [tab, setTab] = useState('users')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'users', icon: User, label: 'المستخدمين' },
    { id: 'posts', icon: Hash, label: 'المنشورات' },
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
    <div className="max-w-3xl mx-auto pb-24 pt-24 px-4" dir="rtl">
      {/* Search Header */}
      <div className="mb-10 text-center animate-fade-in">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">
          ابحث في <span className="arabgram-text-gradient">ArabGram</span>
        </h1>
        <p className="text-gray-400 font-medium">اكتشف أصدقاء جدد، ومنشورات مميزة</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 group animate-fade-in-up">
        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-2xl group-hover:bg-brand-primary/30 transition-colors duration-500" />
        <div className="relative flex items-center glass-card rounded-2xl overflow-hidden p-2">
          <div className="pl-4 pr-3">
            <Search className="h-6 w-6 text-brand-primary" />
          </div>
          <input
            placeholder="ابحث هنا..."
            className="w-full bg-transparent border-none focus:ring-0 text-white text-lg font-medium placeholder:text-gray-500 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="h-6 w-6 text-brand-primary animate-spin mr-3" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 bg-white/5 p-2 rounded-2xl border border-white/10 animate-fade-in-up delay-100">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
              tab === id 
                ? 'arabgram-gradient text-white shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            onClick={() => setTab(id)}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4 min-h-[40vh] animate-fade-in-up delay-200">
        {results.length === 0 && !loading ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">لا توجد نتائج</h2>
            <p className="text-gray-600">حاول البحث بكلمات مختلفة</p>
          </div>
        ) : (
          tab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((user, i) => (
                <Link key={user.id} href={`/profile/${user.username}`}>
                  <div className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 story-ring-active p-[2px] group-hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-2 border-black">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brand-gradient">
                            <span className="text-white font-bold">{user.name?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-brand-primary transition-colors text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">@{user.username}</p>
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
              <div key={post.id} className="group relative aspect-square glass-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all">
                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="w-full">
                    <p className="text-white font-bold text-sm line-clamp-1 mb-2">{post.caption}</p>
                    <div className="flex gap-4 text-sm font-black text-brand-primary">
                      <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {post._count.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {post._count.comments}</span>
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
