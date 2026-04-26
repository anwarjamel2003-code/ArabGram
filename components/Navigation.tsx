'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, MessageCircle, Bell, User, LogOut, Search, Heart, Video } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
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
    { href: '/search', icon: Search, label: 'بحث', badge: 0 },
    { href: '/explore', icon: Compass, label: 'استكشاف', badge: 0 },
    { href: '/reels', icon: Video, label: 'Reels', badge: 0 },
    { href: '/messages', icon: MessageCircle, label: 'الرسائل', badge: 0 },
    { href: '/notifications', icon: Heart, label: 'الإشعارات', badge: unreadNotifs },
    { href: '/stories/new', icon: PlusSquare, label: 'إنشاء', badge: 0 },
    { href: profileUsername ? `/profile/${profileUsername}` : '/feed', icon: User, label: 'الملف الشخصي', badge: 0 },
  ]

  const mobileNavItems = [
    { href: '/feed', icon: Home },
    { href: '/search', icon: Search },
    { href: '/stories/new', icon: PlusSquare },
    { href: '/reels', icon: Video },
    { href: profileUsername ? `/profile/${profileUsername}` : '/feed', icon: User },
  ]

  return (
    <>
      {/* Desktop Sidebar (RTL means it's on the right) */}
      <aside className="hidden md:flex flex-col fixed right-0 top-0 bottom-0 w-64 border-l border-slate-200 bg-white z-50 py-8 px-4">
        <Link href="/feed" className="flex items-center gap-4 mb-10 px-2">
          <Image src="/arabgram-logo.png" alt="ArabGram" width={32} height={32} className="object-contain" />
          <span className="text-xl font-bold font-serif italic tracking-wide">ArabGram</span>
        </Link>

        <div className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors group relative ${
                  isActive ? 'font-bold' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <item.icon className={`h-6 w-6 transition-transform group-hover:scale-105 ${isActive ? 'stroke-[2.5px]' : 'stroke-2 text-slate-900'}`} />
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[15px]">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-4 p-3 rounded-lg text-slate-900 hover:bg-slate-50 transition-colors mt-auto group"
        >
          <LogOut className="h-6 w-6 stroke-2 group-hover:scale-105 transition-transform" />
          <span className="text-[15px]">تسجيل الخروج</span>
        </button>
      </aside>

      {/* Mobile Top Navbar (Logo & Actions) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="font-bold font-serif italic text-xl">ArabGram</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/notifications" className="relative text-slate-900">
            <Heart className="h-6 w-6 stroke-2" />
            {unreadNotifs > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
            )}
          </Link>
          <Link href="/messages" className="relative text-slate-900">
            <MessageCircle className="h-6 w-6 stroke-2" />
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-12 bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-2 transition-transform active:scale-95"
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5px] text-slate-900' : 'stroke-2 text-slate-900'}`} />
            </Link>
          )
        })}
      </div>
    </>
  )
}
