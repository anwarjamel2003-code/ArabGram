import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden" dir="rtl">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] arabgram-gradient rounded-full blur-[120px] opacity-20 animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-[1400px] mx-auto w-full px-6 py-12 lg:py-0 gap-12 lg:gap-24 relative z-10">
        
        {/* Right Side (RTL) - Hero Text & Auth */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-right pt-20 lg:pt-0">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 w-fit mx-auto lg:mx-0 mb-8">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-sm font-bold text-white tracking-widest uppercase">الجيل الجديد من التواصل</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-tight mb-6 tracking-tight">
            عالمك <br />
            <span className="arabgram-text-gradient">أكثر إشراقاً</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
            اكتشف طريقة جديدة للتواصل ومشاركة لحظاتك مع أصدقائك. انضم إلى المجتمع الأسرع نمواً في العالم العربي الآن.
          </p>

          {/* Auth Card */}
          <div className="glass-card rounded-[2.5rem] p-8 max-w-md mx-auto lg:mx-0 w-full relative group">
            <div className="absolute inset-0 arabgram-gradient opacity-0 group-hover:opacity-10 rounded-[2.5rem] transition-opacity duration-500" />
            
            <div className="flex flex-col gap-4 relative z-10">
              <Link href="/auth/signup" className="btn-primary w-full text-center text-lg py-4">
                ابدأ رحلتك مجاناً
              </Link>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-zinc-500 font-medium text-sm">أو</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>
              <Link href="/auth/signin" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl py-4 text-center transition-all text-lg">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>

        {/* Left Side (RTL) - Floating App Mockup */}
        <div className="hidden lg:flex w-1/2 relative h-[800px] items-center justify-center perspective-[2000px]">
          {/* Main Floating Card */}
          <div className="relative w-[380px] h-[750px] bg-zinc-950 rounded-[3rem] border-8 border-zinc-900 shadow-[0_0_50px_rgba(220,20,90,0.3)] overflow-hidden transform rotate-y-[-15deg] rotate-x-[5deg] animate-float z-20">
            {/* Mockup Header */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-zinc-900 to-transparent z-10 flex items-start justify-between p-6">
              <span className="text-2xl font-black arabgram-text-gradient italic">ArabGram</span>
            </div>
            
            {/* Mockup Content (Fake Feed) */}
            <div className="pt-24 px-4 space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-zinc-900/80 rounded-3xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full arabgram-gradient" />
                    <div className="h-4 w-24 bg-zinc-800 rounded-full" />
                  </div>
                  <div className="w-full aspect-square bg-zinc-800 rounded-2xl mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 arabgram-gradient opacity-20" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Element 1 */}
          <div className="absolute top-1/4 -right-12 w-48 h-48 glass-card rounded-3xl border border-white/10 p-4 transform rotate-12 animate-float shadow-2xl z-30 flex flex-col justify-between" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full arabgram-gradient flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="space-y-1">
                <div className="h-2 w-16 bg-zinc-700 rounded-full" />
                <div className="h-2 w-10 bg-zinc-800 rounded-full" />
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-white">+12k</span>
              <p className="text-xs text-zinc-500 font-bold">تسجيل إعجاب جديد</p>
            </div>
          </div>

          {/* Floating Element 2 */}
          <div className="absolute bottom-1/4 -left-12 w-56 h-32 glass-card rounded-3xl border border-white/10 p-4 transform -rotate-6 animate-float shadow-2xl z-30 flex items-center gap-4" style={{ animationDelay: '2s' }}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-zinc-900 bg-pink-500 z-20 relative" />
              <div className="w-12 h-12 rounded-full border-2 border-zinc-900 bg-blue-500 absolute top-0 -right-6 z-10" />
              <div className="w-12 h-12 rounded-full border-2 border-zinc-900 bg-orange-500 absolute top-0 -right-12 z-0" />
            </div>
            <div>
              <span className="text-xl font-black text-white block">مجتمع نابض</span>
              <span className="text-xs text-zinc-400">شارك أفكارك</span>
            </div>
          </div>
        </div>

      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-white/5 bg-zinc-950/50 backdrop-blur-md relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">حول</Link>
            <Link href="#" className="hover:text-white transition-colors">الخصوصية</Link>
            <Link href="#" className="hover:text-white transition-colors">الشروط</Link>
          </div>
          <span className="text-sm font-bold text-zinc-600">© 2026 ArabGram. جميع الحقوق محفوظة.</span>
        </div>
      </footer>
    </div>
  )
}
