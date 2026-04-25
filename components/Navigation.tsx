'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusSquare, MessageCircle, Bell, User, LogOut, Search } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Do not show navigation on auth pages or landing page if not logged in
  if (pathname.startsWith('/auth') || (pathname === '/' && !session)) {
    return null
  }

  const navItems = [
    { href: '/feed', icon: Home, label: 'الرئيسية' },
    { href: '/search', icon: Compass, label: 'استكشاف' },
    { href: '/stories', icon: PlusSquare, label: 'قصة جديدة' },
    { href: '/messages', icon: MessageCircle, label: 'الرسائل' },
    { href: '/notifications', icon: Bell, label: 'الإشعارات' },
    { href: '/profile', icon: User, label: 'الملف الشخصي' },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed right-0 top-0 bottom-0 w-72 glass-effect border-l border-white/10 z-50 p-6 animate-fade-in">
        <Link href="/feed" className="flex items-center gap-4 mb-12 group">
          <div className="relative overflow-hidden rounded-2xl p-[2px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <div className="absolute inset-0 arabgram-gradient animate-spin-slow opacity-80" />
            <div className="relative bg-white rounded-[16px] p-2">
              <Image src="/arabgram-logo.png" alt="ArabGram" width={60} height={60} className="rounded-xl object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black tracking-tighter arabgram-text-gradient leading-none">ArabGram</span>
          </div>
        </Link>

        <div className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-brand-primary/10 text-brand-primary font-black shadow-sm border border-brand-primary/20' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-bold'
                }`}
              >
                <item.icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-primary' : 'group-hover:scale-110 group-hover:-rotate-6'}`} />
                <span className="text-lg">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 mt-auto group"
        >
          <LogOut className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          <span className="text-lg">تسجيل الخروج</span>
        </button>
      </aside>

      {/* Mobile Top Navbar (Logo only) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-20 glass-effect border-b border-slate-200/50 z-50 flex items-center justify-between px-4">
        <Link href="/feed" className="flex items-center gap-3">
          <Image src="/arabgram-logo.png" alt="ArabGram" width={48} height={48} className="rounded-xl" />
          <span className="font-black text-2xl arabgram-text-gradient">ArabGram</span>
        </Link>
        <Link href="/messages" className="relative p-2 text-slate-500 hover:text-brand-primary">
          <MessageCircle className="h-6 w-6" />
        </Link>
      </nav>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="glass-card pointer-events-auto rounded-[2rem] p-2 flex items-center justify-between shadow-2xl">
          {navItems.filter(i => !['/messages', '/notifications'].includes(i.href)).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center relative ${
                  isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {isActive && <div className="absolute inset-0 arabgram-gradient rounded-2xl opacity-10 animate-pulse-soft" />}
                <item.icon className={`h-6 w-6 relative z-10 ${isActive ? 'text-brand-primary' : ''}`} />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
