import Link from 'next/link'
import Image from 'next/image'
import {
  Camera, MessageCircle, Zap, Globe, Heart, Users, Star,
  Shield, ArrowRight, Play, Sparkles, TrendingUp
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen animated-bg relative overflow-hidden" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/arabgram-logo.png"
                alt="ArabGram"
                width={44}
                height={44}
                className="rounded-xl object-contain"
                priority
              />
              <span className="text-2xl font-black arabgram-text-gradient">ArabGram</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-semibold text-white btn-arabgram rounded-xl"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>منصة التواصل الاجتماعي العربية #1</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-white">شارك لحظاتك</span>
                <br />
                <span className="arabgram-text-gradient">مع العالم العربي</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                انضم إلى ملايين المستخدمين العرب. شارك صورك، تواصل مع أصدقائك، واستكشف محتوى لا نهاية له.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 px-8 py-4 btn-arabgram text-lg font-bold rounded-2xl"
              >
                <span>ابدأ مجاناً</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/feed"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg"
              >
                <Play className="h-5 w-5" />
                <span>استكشف المنصة</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: '2M+', label: 'مستخدم نشط' },
                { value: '50M+', label: 'منشور يومياً' },
                { value: '99.9%', label: 'وقت التشغيل' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black arabgram-text-gradient">{stat.value}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Logo Display */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in delay-200">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 arabgram-gradient rounded-full blur-3xl opacity-30 scale-110 animate-pulse-ring" />
              {/* Logo container */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="story-ring p-2 animate-float">
                  <div className="bg-gray-900/80 backdrop-blur-xl rounded-full p-4">
                    <Image
                      src="/arabgram-logo.png"
                      alt="ArabGram Logo"
                      width={280}
                      height={280}
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-8 glass-card px-4 py-3 rounded-2xl animate-float delay-100">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                  <span className="text-white text-sm font-semibold">+1,234 إعجاب</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 glass-card px-4 py-3 rounded-2xl animate-float delay-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm font-semibold">+567 متابع</span>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 glass-card px-3 py-2 rounded-xl animate-float delay-300">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs font-semibold">مميز</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">
            كل ما تحتاجه في <span className="arabgram-text-gradient">مكان واحد</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            منصة متكاملة تجمع بين التواصل الاجتماعي والترفيه والتواصل الفوري
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Camera,
              title: 'شارك لحظاتك',
              desc: 'انشر صورك وفيديوهاتك مع قصص تختفي بعد 24 ساعة',
              color: 'from-purple-500 to-pink-500',
              glow: 'glow-purple',
            },
            {
              icon: MessageCircle,
              title: 'تواصل مباشر',
              desc: 'أرسل رسائل خاصة وتحدث مع أصدقائك في الوقت الفعلي',
              color: 'from-blue-500 to-cyan-500',
              glow: 'glow-purple',
            },
            {
              icon: Zap,
              title: 'اتصالات فورية',
              desc: 'استمتع باتصالات صوتية وفيديو عالية الجودة',
              color: 'from-yellow-500 to-orange-500',
              glow: 'glow-orange',
            },
            {
              icon: Globe,
              title: 'عالمي وعربي',
              desc: 'انضم لملايين المستخدمين العرب حول العالم',
              color: 'from-green-500 to-teal-500',
              glow: 'glow-purple',
            },
            {
              icon: TrendingUp,
              title: 'اكتشف المحتوى',
              desc: 'استكشف محتوى مخصص لاهتماماتك وتابع الترندات',
              color: 'from-pink-500 to-rose-500',
              glow: 'glow-pink',
            },
            {
              icon: Shield,
              title: 'أمان متقدم',
              desc: 'بياناتك محمية بأحدث تقنيات التشفير والأمان',
              color: 'from-indigo-500 to-purple-500',
              glow: 'glow-purple',
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`arabgram-card p-6 animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-12 rounded-3xl text-center border border-purple-500/20">
          <div className="flex justify-center mb-6">
            <Image
              src="/arabgram-logo.png"
              alt="ArabGram"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            جاهز للانضمام؟
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            سجّل الآن مجاناً وابدأ رحلتك مع ArabGram
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 btn-arabgram text-lg font-bold rounded-2xl"
            >
              <span>إنشاء حساب مجاني</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg"
            >
              <span>تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/arabgram-logo.png"
                alt="ArabGram"
                width={32}
                height={32}
                className="rounded-lg object-contain"
              />
              <span className="text-white font-bold">ArabGram</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>محمي ومشفر بالكامل</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2026 ArabGram — Developed by Eng. Anwar. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
