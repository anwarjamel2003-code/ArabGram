'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">

      {/* Liquid Background Blobs */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#fa9628] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-blob1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#2850e6] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob2 pointer-events-none" />
      <div className="absolute top-[50%] right-[30%] w-[25vw] h-[25vw] bg-[#dc145a] rounded-full mix-blend-screen filter blur-[130px] opacity-10 animate-blob1 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">

        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 arabgram-gradient blur-3xl opacity-40 rounded-full animate-blob1" />
              <div className="relative w-24 h-24 rounded-3xl arabgram-gradient p-[2px]">
                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                  <Image src="/arabgram-logo.png" alt="ArabGram" width={80} height={80} className="object-contain" priority />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-6xl font-black arabgram-text-gradient tracking-tighter mb-3">ArabGram</h1>
          <p className="text-zinc-600 font-bold text-xs uppercase tracking-[0.4em]">الكون الرقمي العربي</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-[2.5rem] p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">ادخل عالمك.</h2>
          <p className="text-zinc-500 font-bold mb-10 tracking-wide">لديك أثر هنا. سجّل دخولك.</p>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Email */}
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-white/10 text-white text-xl font-bold py-4 placeholder:text-zinc-700 outline-none focus:border-white transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">كلمة المرور</label>
                <Link href="#" className="text-xs font-bold arabgram-text-gradient">نسيت؟</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white text-xl font-bold py-4 placeholder:text-zinc-700 outline-none focus:border-white transition-colors pr-0 pl-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-full arabgram-gradient text-white font-black text-xl tracking-wide shadow-[0_0_30px_rgba(220,20,90,0.3)] hover:shadow-[0_0_50px_rgba(220,20,90,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span>دخول ←</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-zinc-600 font-bold">
              ليس لديك هوية رقمية بعد؟{' '}
              <Link href="/auth/signup" className="arabgram-text-gradient font-black hover:opacity-80 transition-opacity">
                أنشئها الآن
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-zinc-700 text-[10px] mt-8 font-bold uppercase tracking-[0.4em]">
          © 2026 ArabGram — Engineered by Eng. Anwar
        </p>
      </div>
    </div>
  )
}
