'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, MessageCircle, Heart, User, Search, Grid, LogOut, Hexagon } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [unreadNotifs, setUnreadNotifs] = useState(0)

  const currentUserId = (session?.user as any)?.id
  const profileUsername = (session?.user as any)?.username || ''

  // Do not show navigation on auth pages or landing page
  if (pathname.startsWith('/auth') || pathname === '/') {
    return null
  }

  useEffect(() => {
    if (!currentUserId || !supabase) return

    const channel = supabase.channel(CHANNELS.NOTIFICATIONS(currentUserId))
    channel
      .on('broadcast', { event: 'new_notification' }, () => {
        setUnreadNotifs((prev) => prev + 1)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId])

  useEffect(() => {
    if (pathname === '/notifications') {
      setUnreadNotifs(0)
    }
  }, [pathname])

  const navItems = [
    { href: '/feed', icon: Hexagon, label: 'اللوحة' },
    { href: '/search', icon: Search, label: 'استكشف' },
    { href: '/stories/new', icon: PlusSquare, label: 'شارك', isPrimary: true },
    { href: '/messages', icon: MessageCircle, label: 'رسائل' },
    { href: '/notifications', icon: Heart, label: 'تنبيهات', badge: unreadNotifs },
    { href: profileUsername ? `/profile/${profileUsername}` : '/feed', icon: User, label: 'الهوية' },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center justify-center">
      {/* Floating Command Pill */}
      <nav className="glass-panel rounded-full p-2 flex items-center gap-2 md:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-pink-500/20">
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group mx-2"
                title={item.label}
              >
                <div className="w-12 h-12 rounded-full arabgram-gradient flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 hover:shadow-pink-500/50">
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative group p-3 rounded-full transition-all duration-300 ${
                isActive ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              title={item.label}
            >
              <item.icon className={`h-6 w-6 transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />
              
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse border border-zinc-900" />
              ) : null}

              {/* Minimal active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse-glow" />
              )}
            </Link>
          )
        })}

        {/* Small separator */}
        <div className="w-[1px] h-8 bg-white/10 mx-1 md:mx-2" />

        {/* Log Out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="p-3 rounded-full text-zinc-600 hover:text-red-500 hover:bg-white/5 transition-all duration-300 group"
          title="تسجيل الخروج"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </nav>
    </div>
  )
}
