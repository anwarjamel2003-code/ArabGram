'use client'

import { Search as SearchIcon, Loader2 } from "lucide-react"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    fetchResults()
  }, [debouncedQuery])

  const fetchResults = async () => {
    if (!debouncedQuery) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${debouncedQuery}&tab=users`)
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
    <div className="min-h-screen w-full flex flex-col px-6 py-20 relative z-10" dir="rtl">

      <div className="max-w-[1000px] w-full mx-auto">
        <h1 className="text-7xl md:text-9xl font-black text-white/5 tracking-tighter mb-12 select-none uppercase">الاستكشاف.</h1>

        {/* Cinematic Search Bar */}
        <div className="relative mb-24 group">
          <input
            placeholder="ابحث عن هويات..."
            className="w-full bg-transparent border-b-4 border-white/10 text-white text-3xl md:text-5xl font-black py-6 placeholder:text-white/10 outline-none focus:border-white transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute left-0 bottom-6">
            {loading ? (
              <Loader2 className="h-10 w-10 text-white animate-spin opacity-50" />
            ) : (
              <SearchIcon className="h-10 w-10 text-white/20 group-focus-within:text-white transition-colors" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-6">
          {results.length === 0 && query && !loading ? (
            <div className="text-right">
              <h2 className="text-4xl font-black text-zinc-600">لا يوجد أثر.</h2>
            </div>
          ) : (
            results.map((user) => (
              <Link key={user.id} href={`/profile/${user.username}`}>
                <div className="group flex items-center justify-between p-8 rounded-full hover:bg-white text-white hover:text-zinc-950 transition-all duration-500">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-900 border border-white/20 group-hover:border-zinc-950">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white font-black text-2xl">
                          {user.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-2">{user.name}</h3>
                      <p className="text-xl font-bold opacity-50">@{user.username}</p>
                    </div>
                  </div>
                  <span className="text-5xl opacity-0 group-hover:opacity-100 transform -translate-x-10 group-hover:translate-x-0 transition-all duration-500">&larr;</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
