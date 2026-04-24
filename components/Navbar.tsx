'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, MessageCircle, Bell, LogOut, Home, Compass, PlusSquare, User, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [notifCount] = useState(3)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'py-2 bg-black/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link
            href={session ? '/feed' : '/'}
            className="flex items-center gap-4 group relative z-10"
          >
            <div className="relative overflow-hidden rounded-2xl p-[2px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <div className="absolute inset-0 arabgram-gradient animate-spin-slow opacity-80" />
              <div className="relative bg-black rounded-[14px] p-1.5">
                <Image
                  src="/arabgram-logo.png"
                  alt="ArabGram"
                  width={48}
                  height={48}
                  className="rounded-xl object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter arabgram-text-gradient leading-none">
                ArabGram
              </span>
              <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase leading-none mt-1">
                Premium Social
              </span>
            </div>
          </Link>

          {/* Center Navigation (Desktop) */}
          {session && (
            <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
              <NavItem href="/feed" icon={Home} label="الرئيسية" />
              <NavItem href="/search" icon={Compass} label="استكشاف" />
              <NavItem href="/stories" icon={PlusSquare} label="القصص" />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3 relative z-10">
            {session ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <IconButton href="/messages" icon={MessageCircle} title="الرسائل" />
                  <IconButton href="/notifications" icon={Bell} title="الإشعارات" badge={notifCount} />
                </div>
                
                <div className="h-8 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                {/* Profile Dropdown Trigger */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 story-ring-active">
                    <div className="w-full h-full bg-gray-900 rounded-full overflow-hidden border-2 border-black">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                          <User className="h-4 w-4 text-white/70" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white hidden lg:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  title="خروج"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/signin"
                  className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  تسجيل دخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 text-sm font-bold text-white btn-arabgram rounded-xl shadow-brand-primary/20"
                >
                  ابدأ الآن
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-white/10 p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {session ? (
              <>
                <MobileLink href="/feed" icon={Home} label="الرئيسية" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/search" icon={Compass} label="استكشاف" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/stories" icon={PlusSquare} label="القصص" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/messages" icon={MessageCircle} label="الرسائل" onClick={() => setMobileMenuOpen(false)} />
                <MobileLink href="/notifications" icon={Bell} label="الإشعارات" onClick={() => setMobileMenuOpen(false)} />
              </>
            ) : (
              <Link href="/auth/signup" className="btn-arabgram text-center">انضم إلينا</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-bold group"
    >
      <Icon className="h-4 w-4 transition-transform group-hover:scale-120 group-hover:-rotate-6" />
      <span>{label}</span>
    </Link>
  )
}

function IconButton({ href, icon: Icon, title, badge }: { href: string; icon: any; title: string; badge?: number }) {
  return (
    <Link
      href={href}
      className="relative p-2.5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
      title={title}
    >
      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
      {badge && badge > 0 && (
        <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  )
}

function MobileLink({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-white"
    >
      <Icon className="h-6 w-6" />
      <span className="font-bold">{label}</span>
    </Link>
  )
}
