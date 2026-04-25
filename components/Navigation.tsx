'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, MessageCircle, Bell, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [unreadNotifs, setUnreadNotifs] = useState(0)

  const currentUserId = (session?.user as any)?.id

  // Do not show navigation on auth pages or landing page
  if (pathname.startsWith('/auth') || pathname === '/') {
    return null
  }

  const profileUsername = (session?.user as any)?.username || ''

  // Listen for real-time notification count
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

  // Reset badge when visiting notifications
  useEffect(() => {
    if (pathname === '/notifications') {
      setUnreadNotifs(0)
    }
  }, [pathname])

  const navItems = [
    { href: '/feed', icon: Home, label: 'الرئيسية', badge: 0 },
    { href: '/search', icon: Compass, label: 'استكشاف', badge: 0 },
    { href: '/stories', icon: PlusSquare, label: 'قصة جديدة', badge: 0 },
    { href: '/messages', icon: MessageCircle, label: 'الرسائل', badge: 0 },
    { href: '/notifications', icon: Bell, label: 'الإشعارات', badge: unreadNotifs },
    { href: profileUsername ? `/profile/${profileUsername}` : '/feed', icon: User, label: 'الملف الشخصي', badge: 0 },
  ]

  return (
    <>
      {/* Top Glass Navbar for Desktop & Mobile */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-2xl border-b border-white/5 z-50 flex items-center justify-between px-6 transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link href="/feed" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1px] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-500">
               <div className="w-full h-full bg-black/90 rounded-[15px] flex items-center justify-center backdrop-blur-xl">
                 <Image src="/arabgram-logo.png" alt="ArabGram" width={32} height={32} className="object-contain" />
               </div>
            </div>
            <span className="font-black text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300 hidden sm:block">
              ArabGram
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 relative group ${
                    isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 text-cyan-400' : 'group-hover:scale-110'}`} />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-sm animate-bounce">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile specific quick actions */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/notifications" className="relative p-2 text-zinc-400 hover:text-white">
              <Bell className="h-6 w-6" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </Link>
            <Link href="/messages" className="relative p-2 text-zinc-400 hover:text-white">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
          >
            <span className="text-sm font-semibold">خروج</span>
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 pointer-events-auto rounded-[2rem] p-2 flex items-center justify-between shadow-2xl">
          {navItems.filter(i => !['/messages', '/notifications'].includes(i.href)).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center relative ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isActive && <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-100" />}
                <item.icon className={`h-6 w-6 relative z-10 ${isActive ? 'text-cyan-400' : ''}`} />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
