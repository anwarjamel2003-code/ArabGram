'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Loader2 } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('يرجى ملء جميع الحقول')
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
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        window.location.href = '/feed'
      }
    } catch {
      setError('حدث خطأ. يرجى المحاولة مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="story-ring p-1 animate-pulse-ring">
              <div className="bg-gray-900 rounded-full p-1">
                <Image
                  src="/arabgram-logo.png"
                  alt="ArabGram"
                  width={80}
                  height={80}
                  className="rounded-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black arabgram-text-gradient mb-2">ArabGram</h1>
          <p className="text-gray-400 text-sm">منصتك الاجتماعية العربية الأولى</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">مرحباً بعودتك!</h2>
            <p className="text-gray-400 text-sm">سجّل دخولك للمتابعة</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
              <Shield className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="arabgram-input pr-10 text-right"
                  placeholder="example@email.com"
                  required
                  autoComplete="email"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="arabgram-input pr-10 pl-10 text-right"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-arabgram flex items-center justify-center gap-2 mt-6 h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 text-gray-500">أو</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{' '}
              <Link
                href="/auth/signup"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <div className="security-badge">
            <Shield className="h-3 w-3" />
            <span>محمي بتشفير SSL 256-bit</span>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          © 2026 ArabGram — Developed by Eng. Anwar
        </p>
      </div>
    </div>
  )
}
