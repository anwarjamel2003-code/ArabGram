import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Zap, Heart, MessageCircle, Camera, Sparkles, UserPlus, Video, Globe, ChevronLeft } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-indigo-500/30 overflow-x-hidden" dir="rtl">
      {/* Ultra-Modern Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/30 blur-[150px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[30%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-600/20 blur-[150px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-[2px]">
               <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                 <Image src="/arabgram-logo.png" alt="ArabGram" width={38} height={38} className="object-contain drop-shadow-sm" />
               </div>
            </div>
            <span className="text-3xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
              ArabGram
            </span>
          </div>
          
          <div className="flex gap-12 items-center">
            <Link href="/auth/signin" className="text-base font-semibold text-zinc-400 hover:text-white transition-colors hidden sm:block">
              تسجيل الدخول
            </Link>
            <Link href="/auth/signup" className="group relative px-8 py-3 rounded-full text-base font-semibold overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
              <span className="relative text-white flex items-center gap-2">
                ابدأ الآن
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-zinc-300 tracking-wide">الإصدار 2.0 من الجيل القادم للتواصل</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            تواصل بشغف.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400">
              بدون حدود.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-400 mb-12 font-medium max-w-3xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            أعدنا ابتكار التجربة الاجتماعية بالكامل لنمنحك منصة عصرية، أسرع، وأكثر أماناً. مصممة بعناية فائقة لتليق بصناع المحتوى والمبدعين العرب.
          </p>

          {/* Hero Image / Dashboard Mockup */}
          <div className="w-full max-w-5xl mx-auto relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
            <div className="relative rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden aspect-video flex flex-col">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-2 px-4 pb-4 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              
              <div className="flex-1 flex mt-4 gap-4">
                {/* Sidebar Mockup */}
                <div className="hidden md:flex flex-col gap-4 w-64 border-l border-white/5 pl-4">
                  <div className="h-10 rounded-xl bg-white/5 w-full"></div>
                  <div className="h-10 rounded-xl bg-white/5 w-3/4"></div>
                  <div className="h-10 rounded-xl bg-white/5 w-4/5"></div>
                  <div className="h-10 rounded-xl bg-white/5 w-full mt-auto"></div>
                </div>
                {/* Main Feed Mockup */}
                <div className="flex-1 flex flex-col gap-6 p-2">
                  <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-20 h-20 shrink-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border-2 border-white/10 p-1">
                        <div className="w-full h-full rounded-full bg-white/5"></div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full h-64 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                     <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between">
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md"></div>
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bento Grid Features */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight">
              صُمم ليكون <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">استثنائياً.</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl">تم بناء كل مكون بشغف لتقديم أداء لا مثيل له وتجربة بصرية تحبس الأنفاس.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[300px]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 p-10 flex flex-col justify-end hover:border-indigo-500/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Shield className="absolute top-10 right-10 w-12 h-12 text-indigo-400" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold mb-4">أمان لا يُخترق</h3>
                <p className="text-lg text-zinc-400 max-w-md">نظام تشفير شامل (End-to-End) يضمن بقاء محادثاتك وصورك وبياناتك الخاصة بعيدة عن أي تطفل. أنت تملك بياناتك بالكامل.</p>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between hover:border-cyan-500/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="relative z-10 mt-8">
                <h3 className="text-2xl font-bold mb-2">أداء خارق</h3>
                <p className="text-zinc-400">تحديثات لحظية وتمرير سلس يعتمد على أحدث معمارية برمجية.</p>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between hover:border-fuchsia-500/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center">
                <Video className="w-7 h-7 text-fuchsia-400" />
              </div>
              <div className="relative z-10 mt-8">
                <h3 className="text-2xl font-bold mb-2">مكالمات WebRTC</h3>
                <p className="text-zinc-400">تواصل بالصوت والصورة بجودة 4K وبدون أي تأخير زمني.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 mt-20 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
            <Image src="/arabgram-logo.png" alt="ArabGram" width={24} height={24} className="object-contain" />
            <span className="text-xl font-bold tracking-tight">ArabGram</span>
          </div>
          <p className="text-zinc-600 font-medium text-sm">
            © 2026 ArabGram — مبتكر، عصري، استثنائي.
          </p>
        </div>
      </footer>

    </div>
  )
}
