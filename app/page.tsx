import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, Smartphone, Heart, MessageCircle, Camera, Globe, Users, Video, Bell, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative" dir="rtl">
      {/* Dynamic Background Blobs */}
      <div className="bg-blob w-[600px] h-[600px] bg-purple-400 top-[-10%] left-[-10%]" />
      <div className="bg-blob w-[500px] h-[500px] bg-pink-400 bottom-[-10%] right-[-10%] delay-700" />
      <div className="bg-blob w-[400px] h-[400px] bg-amber-300 top-[30%] right-[5%] delay-1000" />

      {/* Hero Section */}
      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 arabgram-gradient blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse-soft" />
                <div className="relative overflow-hidden rounded-[4rem] p-[6px] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  <div className="absolute inset-0 arabgram-gradient animate-spin-slow" />
                  <div className="relative bg-white rounded-[3.8rem] p-6 shadow-2xl">
                    <Image
                      src="/arabgram-logo.png"
                      alt="ArabGram Logo"
                      width={220}
                      height={220}
                      className="rounded-3xl object-contain animate-float"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              مستقبل التواصل <br />
              <span className="arabgram-text-gradient">الاجتماعي العربي</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
              انضم إلى أول منصة تواصل اجتماعي عربية متكاملة. شارك لحظاتك، تواصل مع أصدقائك، واكتشف عالماً جديداً من الإبداع والتميز.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
              <Link
                href="/auth/signup"
                className="btn-arabgram text-xl px-14 py-6 group flex items-center gap-3"
              >
                <span className="font-black">ابدأ رحلتك الآن</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:-translate-x-2" />
              </Link>
              <Link
                href="/auth/signin"
                className="px-14 py-6 rounded-2xl bg-white border-2 border-slate-200 text-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm text-slate-700"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto py-12 animate-fade-in delay-500">
            <HighlightBadge icon={MessageCircle} label="رسائل فورية" />
            <HighlightBadge icon={Video} label="مكالمات فيديو" />
            <HighlightBadge icon={Bell} label="إشعارات لحظية" />
            <HighlightBadge icon={Shield} label="خصوصية تامة" />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-28 bg-white/60 backdrop-blur-3xl border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">لماذا <span className="arabgram-text-gradient">ArabGram</span>؟</h2>
            <div className="w-32 h-1.5 arabgram-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} 
              title="خصوصية مطلقة" 
              desc="بياناتك مشفرة بالكامل ومحمية بأعلى معايير الأمان العالمية لضمان راحتك." 
              color="from-violet-500 to-purple-600"
            />
            <FeatureCard 
              icon={Zap} 
              title="سرعة فائقة" 
              desc="تجربة تصفح وتواصل فورية بدون أي تأخير بفضل أحدث تقنيات الويب العالمية." 
              color="from-amber-500 to-orange-600"
            />
            <FeatureCard 
              icon={Video} 
              title="مكالمات حية" 
              desc="مكالمات صوتية وفيديو بجودة عالية وتشفير تام من الطرفين باستخدام WebRTC." 
              color="from-pink-500 to-rose-600"
            />
            <FeatureCard 
              icon={Camera} 
              title="مشاركة إبداعية" 
              desc="شارك صورك وقصصك اليومية مع العالم العربي بأسلوب عصري وبلمسة واحدة فقط." 
              color="from-cyan-500 to-blue-600"
            />
            <FeatureCard 
              icon={MessageCircle} 
              title="تواصل فوري" 
              desc="دردشة لحظية مع مؤشر الكتابة والقراءة لتجربة تواصل سلسة مع أصدقائك." 
              color="from-emerald-500 to-green-600"
            />
            <FeatureCard 
              icon={Heart} 
              title="مجتمع متفاعل" 
              desc="انضم لمجتمعات تشبهك وشارك اهتماماتك وهواياتك مع ملايين المستخدمين العرب." 
              color="from-fuchsia-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-14 border-t border-slate-100 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right">
          <div className="flex items-center gap-4">
            <Image src="/arabgram-logo.png" alt="ArabGram" width={44} height={44} className="rounded-xl shadow-sm" />
            <span className="text-2xl font-black arabgram-text-gradient">ArabGram</span>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            © 2026 ArabGram — Engineered with Passion by Eng. Anwar
          </p>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link href="#" className="hover:text-brand-primary transition-colors">الشروط</Link>
            <Link href="#" className="hover:text-brand-primary transition-colors">الخصوصية</Link>
            <Link href="#" className="hover:text-brand-primary transition-colors">الدعم</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HighlightBadge({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
        <Icon className="h-7 w-7 text-brand-primary" />
      </div>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] group hover:scale-[1.03] transition-all duration-500">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-8 shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}
