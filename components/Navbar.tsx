'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, MessageCircle, Bell, LogOut, Home, Compass, PlusSquare, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [notifCount] = useState(3)

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-2xl shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={session ? '/feed' : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 arabgram-gradient rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              <Image
                src="/arabgram-logo.png"
                alt="ArabGram"
                width={40}
                height={40}
                className="relative rounded-xl object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="text-xl font-black arabgram-text-gradient hidden sm:block">
              ArabGram
            </span>
          </Link>

          {/* Center Nav (Desktop) */}
          {session && (
            <div className="hidden md:flex items-center gap-1">
              <NavItem href="/feed" icon={Home} label="الرئيسية" />
              <NavItem href="/search" icon={Compass} label="استكشاف" />
              <NavItem href="/stories" icon={PlusSquare} label="القصص" />
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {session ? (
              <>
                {/* Search */}
                <Link
                  href="/search"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  title="البحث"
                >
                  <Search className="h-5 w-5" />
                </Link>

                {/* Messages */}
                <Link
                  href="/messages"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  title="الرسائل"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>

                {/* Notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                  title="الإشعارات"
                >
                  <Bell className="h-5 w-5" />
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link
                  href="/profile"
                  className="p-1 rounded-xl hover:bg-white/10 transition-all duration-200"
                  title="الملف الشخصي"
                >
                  <div className="w-8 h-8 arabgram-gradient rounded-xl flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                </Link>

                {/* Sign Out */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="تسجيل الخروج"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm font-semibold text-white btn-arabgram rounded-xl"
                >
                  تسجيل
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      {session && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-2xl">
          <div className="flex items-center justify-around py-2 px-4">
            <MobileNavItem href="/feed" icon={Home} label="الرئيسية" />
            <MobileNavItem href="/search" icon={Search} label="بحث" />
            <MobileNavItem href="/stories" icon={PlusSquare} label="قصص" />
            <MobileNavItem href="/messages" icon={MessageCircle} label="رسائل" />
            <MobileNavItem href="/profile" icon={User} label="حسابي" />
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
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )
}

function MobileNavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}
