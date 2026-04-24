import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, Smartphone, Heart, MessageCircle, Camera, Globe, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative" dir="rtl">
      {/* Dynamic Background Elements */}
      <div className="bg-blob w-[600px] h-[600px] bg-brand-primary top-[-10%] left-[-10%] opacity-20" />
      <div className="bg-blob w-[500px] h-[500px] bg-brand-secondary bottom-[-10%] right-[-10%] opacity-20 delay-700" />
      <div className="bg-blob w-[400px] h-[400px] bg-brand-accent top-[30%] right-[5%] opacity-10 delay-1000" />

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            {/* Main Logo Display */}
            <div className="flex justify-center mb-12">
              <div className="relative group">
                <div className="absolute inset-0 arabgram-gradient blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse-soft" />
                <div className="relative overflow-hidden rounded-[3.5rem] p-[5px] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                  <div className="absolute inset-0 arabgram-gradient animate-spin-slow" />
                  <div className="relative bg-black rounded-[3.3rem] p-8">
                    <Image
                      src="/arabgram-logo.png"
                      alt="ArabGram Logo"
                      width={200}
                      height={200}
                      className="rounded-3xl object-contain animate-float"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
              مستقبل التواصل <br />
              <span className="arabgram-text-gradient">الاجتماعي العربي</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
              انضم إلى أول منصة تواصل اجتماعي عربية متكاملة. شارك لحظاتك، تواصل مع أصدقائك، واكتشف عالماً جديداً من الإبداع والتميز.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
              <Link
                href="/auth/signup"
                className="btn-arabgram text-xl px-14 py-6 group flex items-center gap-3"
              >
                <span className="font-black">ابدأ رحلتك الآن</span>
                <ArrowRight className="h-6 w-6 transition-transform group-hover:-translate-x-2" />
              </Link>
              <Link
                href="/auth/signin"
                className="px-14 py-6 rounded-2xl bg-white/5 border border-white/10 text-xl font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto py-16 border-y border-white/5 backdrop-blur-sm animate-fade-in delay-500">
            <StatItem number="+1M" label="مستخدم نشط" />
            <StatItem number="+50M" label="منشور شهري" />
            <StatItem number="+200" label="دولة عربية" />
            <StatItem number="100%" label="خصوصية وأمان" />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-32 bg-black/50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">لماذا ArabGram؟</h2>
            <div className="w-32 h-2 arabgram-gradient mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={Shield} 
              title="خصوصية مطلقة" 
              desc="بياناتك مشفرة بالكامل ومحمية بأعلى معايير الأمان العالمية لضمان راحتك." 
            />
            <FeatureCard 
              icon={Zap} 
              title="سرعة فائقة" 
              desc="تجربة تصفح وتواصل فورية بدون أي تأخير بفضل أحدث تقنيات الويب العالمية." 
            />
            <FeatureCard 
              icon={Smartphone} 
              title="تجربة متكاملة" 
              desc="تطبيق ذكي يعمل بسلاسة تامة على كافة أجهزتك المحمولة والمكتبية في أي وقت." 
            />
            <FeatureCard 
              icon={Camera} 
              title="مشاركة إبداعية" 
              desc="أدوات متطورة لتحرير الصور والفيديوهات ومشاركتها مع العالم العربي بلمسة واحدة." 
            />
            <FeatureCard 
              icon={MessageCircle} 
              title="تواصل فوري" 
              desc="دردشة ومكالمات صوتية وفيديو بجودة عالية جداً وتشفير تام من الطرفين." 
            />
            <FeatureCard 
              icon={Heart} 
              title="مجتمع متفاعل" 
              desc="انضم لمجتمعات تشبهك تماماً وشارك اهتماماتك وهواياتك مع الملايين." 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-white/5 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-right">
          <div className="flex items-center gap-4">
            <Image src="/arabgram-logo.png" alt="ArabGram" width={50} height={50} className="rounded-xl" />
            <span className="text-3xl font-black arabgram-text-gradient">ArabGram</span>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            © 2026 ArabGram — Engineered with Passion by Eng. Anwar
          </p>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">الشروط</Link>
            <Link href="#" className="hover:text-white transition-colors">الخصوصية</Link>
            <Link href="#" className="hover:text-white transition-colors">الدعم</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-black arabgram-text-gradient mb-2">{number}</span>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</span>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-card p-12 rounded-[3rem] group hover:scale-105 transition-all duration-500">
      <div className="w-20 h-20 rounded-[1.5rem] arabgram-gradient flex items-center justify-center mb-10 shadow-2xl shadow-brand-primary/20 group-hover:rotate-12 transition-transform">
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-5">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium text-lg">{desc}</p>
    </div>
  )
}
