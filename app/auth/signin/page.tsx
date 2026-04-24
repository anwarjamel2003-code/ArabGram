'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول')
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
        window.location.href = '/feed'
      }
    } catch {
      toast.error('حدث خطأ. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="bg-blob w-[500px] h-[500px] bg-brand-primary top-[-10%] left-[-10%]" />
      <div className="bg-blob w-[400px] h-[400px] bg-brand-secondary bottom-[-10%] right-[-10%] delay-700" />
      <div className="bg-blob w-[300px] h-[300px] bg-brand-accent top-[40%] right-[10%] delay-1000" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 arabgram-gradient blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-soft" />
              <div className="relative overflow-hidden rounded-[2.5rem] p-[3px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div className="absolute inset-0 arabgram-gradient animate-spin-slow" />
                <div className="relative bg-black rounded-[2.3rem] p-3">
                  <Image
                    src="/arabgram-logo.png"
                    alt="ArabGram"
                    width={120}
                    height={120}
                    className="rounded-3xl object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black arabgram-text-gradient mb-3 tracking-tighter">ArabGram</h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">Premium Social Experience</p>
        </div>

        {/* Card */}
        <div className="glass-card p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">مرحباً بعودتك!</h2>
            <p className="text-gray-400 text-sm">سجّل دخولك للبدء في استكشاف عالمك</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 mr-1">البريد الإلكتروني</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="arabgram-input pr-12 text-right placeholder:text-gray-600"
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-300">كلمة المرور</label>
                <Link href="#" className="text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors">نسيت كلمة المرور؟</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="arabgram-input pr-12 pl-12 text-right placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-arabgram flex items-center justify-center gap-3 mt-8 h-14 text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span className="font-black">دخول سريع</span>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-4 bg-[#0a0a0a] text-gray-500 font-bold">أو المتابعة عبر</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 font-medium">
              ليس لديك حساب حتى الآن؟{' '}
              <Link
                href="/auth/signup"
                className="text-brand-primary hover:text-brand-secondary font-black transition-all hover:underline underline-offset-4"
              >
                انضم إلينا الآن
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="security-badge px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Secure Enterprise Encryption</span>
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 font-bold uppercase tracking-[0.3em]">
          © 2026 ArabGram — Engineered by Eng. Anwar
        </p>
      </div>
    </div>
  )
}
