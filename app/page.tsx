import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Zap, Smartphone, Heart, MessageCircle, Camera, Sparkles, UserPlus } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative" dir="rtl">
      {/* Exclusive Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none delay-1000" />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-emerald-400/15 rounded-full blur-[100px] mix-blend-multiply pointer-events-none delay-700" />

      {/* Navigation */}
      <nav className="relative z-20 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[2px]">
               <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                 <Image src="/arabgram-logo.png" alt="ArabGram" width={28} height={28} className="object-contain drop-shadow-sm" />
               </div>
            </div>
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">ArabGram</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">المميزات</Link>
            <Link href="#community" className="hover:text-indigo-600 transition-colors">المجتمع</Link>
            <Link href="#security" className="hover:text-indigo-600 transition-colors">الأمان</Link>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="hidden sm:flex px-6 py-2.5 rounded-full font-bold text-slate-700 hover:bg-slate-100 transition-colors items-center justify-center">
              دخول
            </Link>
            <Link href="/auth/signup" className="px-6 py-2.5 rounded-full font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:scale-105 transition-all duration-300">
              حساب جديد
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-right animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm mb-8 border border-indigo-100 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>الجيل الجديد من التواصل الاجتماعي</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900">
              تواصل بأسلوب <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500">استثنائي</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              منصة حصرية مصممة بأرقى معايير التصميم العالمي لتلبي تطلعاتك. تجربة نقية، سريعة، وخالية من الفوضى لمشاركة أفضل لحظاتك.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-white shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group text-lg"
              >
                <span>ابدأ تجربتك الحصرية</span>
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-2" />
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> +1M مستخدم</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> خصوصية 100%</div>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full aspect-square max-w-lg mx-auto">
             {/* Floating UI Elements Mockup */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-cyan-50 rounded-[3rem] rotate-3 scale-105 opacity-50 blur-xl"></div>
             <div className="relative w-full h-full bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-6 flex flex-col gap-6 overflow-hidden animate-float">
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-300 p-[2px]">
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100">
                           <Image src="/arabgram-logo.png" alt="Avatar" width={48} height={48} className="object-cover" />
                        </div>
                     </div>
                     <div>
                       <div className="w-24 h-4 bg-slate-200 rounded-full mb-2"></div>
                       <div className="w-16 h-3 bg-slate-100 rounded-full"></div>
                     </div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-50"></div>
                </div>
                {/* Image Mockup */}
                <div className="w-full flex-1 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay"></div>
                  {/* Decorative Elements inside Mockup */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-white/50 border-t-indigo-400 animate-spin-slow"></div>
                </div>
                {/* Action Mockup */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Heart className="w-5 h-5 fill-current" /></div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><MessageCircle className="w-5 h-5" /></div>
                  <div className="flex-1"></div>
                  <div className="w-10 h-10 rounded-full bg-slate-50"></div>
                </div>
             </div>
             
             {/* Small Floating Card */}
             <div className="absolute -left-12 top-1/4 glass-card p-4 rounded-2xl flex items-center gap-4 animate-bounce-slow shadow-xl">
               <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                 <UserPlus className="w-6 h-6" />
               </div>
               <div>
                 <p className="font-bold text-slate-800 text-sm">متابع جديد</p>
                 <p className="text-xs text-slate-500">منذ دقيقتين</p>
               </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">صُمم ليكون الأفضل</h2>
            <p className="text-xl text-slate-500 font-medium">كل تفصيلة في المنصة تم ابتكارها لتمنحك تجربة تواصل فريدة لا تشبه غيرها.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} 
              title="خصوصية استثنائية" 
              desc="بياناتك في خزنة آمنة. نستخدم أحدث بروتوكولات التشفير لضمان أن تبقى حياتك الشخصية شخصية." 
              color="indigo"
            />
            <FeatureCard 
              icon={Zap} 
              title="أداء خارق" 
              desc="استمتع بتصفح سلس كالماء. تقنياتنا المبنية على Real-time تجعل كل نقرة تستجيب في جزء من الثانية." 
              color="cyan"
            />
            <FeatureCard 
              icon={Camera} 
              title="جودة لا تضاهى" 
              desc="شارك صورك وفيديوهاتك بأعلى جودة ممكنة دون ضغط يقلل من جمال لحظاتك." 
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[2px]">
               <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                 <Image src="/arabgram-logo.png" alt="ArabGram" width={20} height={20} className="object-contain" />
               </div>
            </div>
            <span className="text-xl font-black text-slate-800">ArabGram</span>
          </div>
          <p className="text-slate-400 font-bold text-sm">
            © 2026 ArabGram — Engineered by Eng. Anwar
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: 'indigo' | 'cyan' | 'emerald' }) {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-200',
    cyan: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white group-hover:shadow-cyan-200',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-200'
  }
  
  return (
    <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 shadow-lg ${colorStyles[color]}`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  )
}
