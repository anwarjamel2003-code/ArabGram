'use client'

import { Input } from "@/components/ui/input"
import { Search, User, Hash, ImageIcon as ImageIconComponent, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('users')

  const tabs = [
    { id: 'users', icon: User, label: 'Users' },
    { id: 'posts', icon: Hash, label: 'Posts' },
    { id: 'stories', icon: ImageIconComponent, label: 'Stories' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search Arabgram..."
            className="pl-12 pr-4 py-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border-0 focus:ring-4 focus:ring-purple-500/20 h-14 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-1 shadow-xl mb-8">
          <div className="flex gap-1">
            {tabs.map(({ id, icon: Icon, label }: any) => (
              <Button
                key={id}
                variant={tab === id ? 'default' : 'ghost'}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  tab === id ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' : 'hover:bg-purple-50'
                }`}
                onClick={() => setTab(id)}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {tab === 'users' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-transparent hover:border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">U{i+1}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">@user{i+1}</h3>
                      <p className="text-gray-600">Lorem ipsum dolor amet...</p>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          )}

          {tab === 'posts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="group relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 w-full">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 truncate">Post title</div>
                        <div className="flex gap-1 text-sm text-gray-600">
                          <span>❤️ 124</span>
                          <span>💬 23</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'stories' && (
            <div className="flex gap-4 overflow-x-auto pb-4 -mb-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center group cursor-pointer flex-shrink-0 w-20">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-2xl shadow-lg ring-4 ring-white/50 group-hover:scale-110 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse border-4 border-white" />
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center leading-tight truncate w-20">user{i+1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

