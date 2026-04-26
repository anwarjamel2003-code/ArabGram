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
    <div className="max-w-[470px] md:max-w-[600px] mx-auto pb-24 pt-16 md:pt-10 px-4" dir="rtl">

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative flex items-center bg-[#efefef] rounded-lg overflow-hidden p-1">
          <div className="pl-3 pr-2">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            placeholder="بحث"
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-[15px] font-medium placeholder:text-slate-500 h-10 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="h-5 w-5 text-slate-400 animate-spin mr-3" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-semibold transition-all duration-200 ${
              tab === id 
                ? 'text-slate-900 border-b-2 border-slate-900' 
                : 'text-slate-400 hover:text-slate-900'
            }`}
            onClick={() => setTab(id)}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="min-h-[40vh]">
        {results.length === 0 && !loading ? (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">لا توجد نتائج للبحث.</p>
          </div>
        ) : (
          tab === 'users' && (
            <div className="flex flex-col gap-1">
              {results.map((user, i) => (
                <Link key={user.id} href={`/profile/${user.username}`}>
                  <div className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                          <span className="text-slate-500 font-bold">{user.name?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{user.username}</h3>
                      <p className="text-[13px] text-slate-500">{user.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === 'posts' && results.length > 0 && (
          <div className="grid grid-cols-3 gap-1">
            {results.map((post, i) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="group relative aspect-square bg-slate-100 overflow-hidden cursor-pointer">
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-white font-bold text-sm">
                      <Heart className="h-5 w-5 fill-white stroke-transparent" /> {post._count.likes}
                    </div>
                    <div className="flex items-center gap-1 text-white font-bold text-sm">
                      <MessageCircle className="h-5 w-5 fill-white stroke-transparent" /> {post._count.comments}
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
