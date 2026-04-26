'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, MessageCircle, Bell, User, LogOut, Search, Heart, Video, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { supabase, CHANNELS } from '@/lib/supabase'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentUserId = (session?.user as any)?.id

  // Do not show navigation on auth pages or landing page
  if (pathname.startsWith('/auth') || pathname === '/') {
    return null
  }

  const profileUsername = (session?.user as any)?.username || ''

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
    // Close mobile menu on route change
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: '/feed', icon: Home, label: 'الرئيسية', badge: 0 },
    { href: '/search', icon: Search, label: 'بحث', badge: 0 },
    { href: '/explore', icon: Compass, label: 'استكشاف', badge: 0 },
    { href: '/messages', icon: MessageCircle, label: 'الرسائل', badge: 0 },
    { href: '/notifications', icon: Heart, label: 'الإشعارات', badge: unreadNotifs },
    { href: '/stories/new', icon: PlusSquare, label: 'إنشاء', badge: 0 },
    { href: profileUsername ? `/profile/${profileUsername}` : '/feed', icon: User, label: 'الملف الشخصي', badge: 0 },
  ]

  return (
    <>
      {/* Top Navbar (Desktop & Mobile Header) */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass-navbar z-50 flex items-center justify-between px-6 lg:px-10">
        
        {/* Right side (RTL) - Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-white hover:text-pink-500 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
          
          <Link href="/feed" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 arabgram-gradient opacity-80" />
              <Image src="/arabgram-logo.png" alt="ArabGram" fill className="object-contain p-1 relative z-10" />
            </div>
            <span className="text-2xl font-black tracking-widest hidden sm:block arabgram-text-gradient">ArabGram</span>
          </Link>
        </div>

        {/* Center - Desktop Links */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative group px-4 py-2"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <item.icon className={`h-6 w-6 transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                    } ${isActive ? 'fill-white/20' : ''}`} />
                    
                    {item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] arabgram-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg border border-zinc-900 animate-pulse-glow">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Active Indicator Line */}
                  <div className={`absolute -bottom-4 w-full h-1 rounded-t-full transition-all duration-300 ${
                    isActive ? 'arabgram-gradient opacity-100 shadow-[0_-2px_10px_rgba(236,72,153,0.5)]' : 'bg-transparent opacity-0'
                  }`} />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Left side (RTL) - User Actions / Profile Snippet */}
        <div className="flex items-center gap-4">
          <Link href="/stories/new" className="hidden sm:flex items-center gap-2 btn-primary !py-2 !px-4 text-sm">
            <PlusSquare className="h-4 w-4" />
            <span>نشر</span>
          </Link>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white transition-all hidden md:block"
            title="تسجيل الخروج"
          >
            <LogOut className="h-5 w-5" />
          </button>

          {/* Mobile direct icons (optional, since menu exists, but good for quick access) */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/stories/new" className="text-zinc-400 hover:text-white transition-colors">
              <PlusSquare className="h-6 w-6" />
            </Link>
            <Link href="/messages" className="text-zinc-400 hover:text-white transition-colors">
              <MessageCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar Menu */}
          <div className="absolute top-0 bottom-0 right-0 w-72 glass-navbar border-l border-white/10 shadow-2xl flex flex-col p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-10">
              <span className="text-2xl font-black arabgram-text-gradient tracking-widest">ArabGram</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive ? 'bg-zinc-800/80 border border-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="relative">
                      <item.icon className={`h-6 w-6 ${isActive ? 'arabgram-text-gradient' : ''}`} />
                      {item.badge > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] arabgram-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border border-zinc-900">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-lg">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-auto"
            >
              <LogOut className="h-6 w-6" />
              <span className="font-bold text-lg">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
