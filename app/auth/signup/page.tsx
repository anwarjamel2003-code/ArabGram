'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, AtSign, Shield, Check, Loader2 } from 'lucide-react'
import { z } from 'zod'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  name: z.string().min(2, 'الاسم قصير جداً').max(50, 'الاسم طويل جداً'),
  username: z
    .string()
    .min(3, 'اسم المستخدم قصير جداً')
    .max(20, 'اسم المستخدم طويل جداً')
    .regex(/^[a-zA-Z0-9_]+$/, 'يُسمح فقط بالأحرف والأرقام والشرطة السفلية'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم'),
})

type FormData = z.infer<typeof schema>

const steps = [
  { id: 1, title: 'بريدك', subtitle: 'كيف نصل إليك؟', icon: Mail, field: 'email' as keyof FormData },
  { id: 2, title: 'اسمك', subtitle: 'ما الذي تريد أن يعرفك به الناس؟', icon: User, field: 'name' as keyof FormData },
  { id: 3, title: 'هويتك', subtitle: 'ما الذي يميزك عن الآخرين؟', icon: AtSign, field: 'username' as keyof FormData },
  { id: 4, title: 'سرّك', subtitle: 'كلمة مرور قوية لا يخترقها أحد', icon: Lock, field: 'password' as keyof FormData },
  { id: 5, title: 'التحقق', subtitle: 'تأكيد هويتك الرقمية', icon: Shield, field: 'verification' as any },
]

export default function Signup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    username: '',
    password: '',
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStep = steps[step - 1]

  const validateStep = () => {
    const field = currentStep.field as any
    if (field === 'verification') return true

    const partial = { [field]: (formData as any)[field] }
    const partialSchema = schema.pick({ [field]: true } as any)
    const result = partialSchema.safeParse(partial)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const nextStep = async () => {
    if (step === 4) {
      if (!validateStep()) return
      setLoading(true)
      try {
        const res = await fetch('/api/auth/send-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.toLowerCase().trim(),
            name: formData.name.trim(),
            username: formData.username.toLowerCase(),
            password: formData.password,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          setSentCode(data.maskedEmail || formData.email)
          toast.success('تم إرسال رمز التحقق لبريدك')
          setStep(5)
        } else {
          const err = await res.json()
          toast.error(err.message || 'حدث خطأ في إرسال الرمز')
        }
      } catch {
        toast.error('حدث خطأ في الاتصال')
      } finally {
        setLoading(false)
      }
    } else if (validateStep()) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
    }
  }

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setErrors({ verification: 'الرمز يجب أن يكون 6 أرقام' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          code: verificationCode,
        }),
      })

      if (res.ok) {
        toast.success('تم تفعيل الحساب بنجاح')
        router.push('/auth/signin?verified=true')
      } else {
        const err = await res.json()
        toast.error(err.message || 'الرمز غير صحيح')
      }
    } catch {
      toast.error('حدث خطأ في التحقق')
    } finally {
      setLoading(false)
    }
  }

  const progressPct = ((step - 1) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">

      {/* Liquid Background Blobs */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#fa9628] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-blob1 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#2850e6] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob2 pointer-events-none" />
      <div className="absolute top-[50%] right-[30%] w-[25vw] h-[25vw] bg-[#dc145a] rounded-full mix-blend-screen filter blur-[130px] opacity-10 pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 arabgram-gradient blur-3xl opacity-40 rounded-full animate-blob1" />
              <div className="relative w-20 h-20 rounded-3xl arabgram-gradient p-[2px]">
                <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center overflow-hidden">
                  <Image src="/arabgram-logo.png" alt="ArabGram" width={64} height={64} className="object-contain" priority />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black arabgram-text-gradient tracking-tighter mb-2">ArabGram</h1>
          <p className="text-zinc-600 font-bold text-xs uppercase tracking-[0.4em]">ابنِ هويتك الرقمية</p>
        </div>

        {/* Progress Bar (not dots, a real bar) */}
        <div className="mb-10 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">الخطوة {step} من {steps.length}</span>
            <span className="text-xs font-black arabgram-text-gradient">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full arabgram-gradient rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(220,20,90,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-[2.5rem] p-10 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

          {step !== 5 && (
            <div className="mb-10">
              <h2 className="text-5xl font-black text-white tracking-tight mb-2">{currentStep.title}.</h2>
              <p className="text-zinc-500 font-bold text-lg">{currentStep.subtitle}</p>
            </div>
          )}

          <div className="space-y-8">
            {step === 1 && (
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white text-2xl font-bold py-4 placeholder:text-zinc-700 outline-none focus:border-white transition-colors"
                  placeholder="example@email.com"
                  onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  autoFocus
                />
                {errors.email && <p className="text-red-400 text-sm font-bold mt-2">{errors.email}</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white text-2xl font-bold py-4 placeholder:text-zinc-700 outline-none focus:border-white transition-colors"
                  placeholder="اسمك الكامل"
                  onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  autoFocus
                />
                {errors.name && <p className="text-red-400 text-sm font-bold mt-2">{errors.name}</p>}
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="flex items-center border-b-2 border-white/10 focus-within:border-white transition-colors py-4">
                  <span className="text-zinc-600 text-2xl font-black ml-2">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="flex-1 bg-transparent text-white text-2xl font-bold placeholder:text-zinc-700 outline-none"
                    placeholder="username"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                    autoFocus
                  />
                </div>
                {errors.username && <p className="text-red-400 text-sm font-bold mt-2">{errors.username}</p>}
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-white/10 text-white text-2xl font-bold py-4 placeholder:text-zinc-700 outline-none focus:border-white transition-colors pl-10"
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm font-bold mt-2">{errors.password}</p>}
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-8">
                <div>
                  <div className="w-20 h-20 arabgram-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,20,90,0.4)]">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3">تحقق من هويتك.</h2>
                  <p className="text-zinc-500 font-bold">أرسلنا الرمز إلى <span className="arabgram-text-gradient font-black">{sentCode}</span></p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-transparent border-b-2 border-white/10 text-white text-4xl font-black tracking-[0.5em] text-center py-6 placeholder:text-zinc-700 outline-none focus:border-white transition-colors"
                  placeholder="000000"
                />
                {errors.verification && <p className="text-red-400 text-sm font-bold">{errors.verification}</p>}
                <button
                  onClick={handleVerify}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full h-16 rounded-full arabgram-gradient text-white font-black text-xl shadow-[0_0_30px_rgba(220,20,90,0.3)] hover:shadow-[0_0_50px_rgba(220,20,90,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'تأكيد الهوية ✓'}
                </button>
                <button onClick={() => setStep(1)} className="text-zinc-600 hover:text-white font-bold text-sm transition-colors">
                  تغيير البريد الإلكتروني
                </button>
              </div>
            )}

            {step < 5 && (
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-8 h-16 rounded-full glass-panel border border-white/10 text-white font-black hover:bg-white/10 transition-all"
                  >
                    →
                  </button>
                )}
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-1 h-16 rounded-full arabgram-gradient text-white font-black text-xl shadow-[0_0_30px_rgba(220,20,90,0.3)] hover:shadow-[0_0_50px_rgba(220,20,90,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <span>{step === 4 ? 'إنشاء الهوية ✦' : 'التالي ←'}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <p className="text-zinc-600 font-bold">
              لديك هوية بالفعل؟{' '}
              <Link href="/auth/signin" className="arabgram-text-gradient font-black hover:opacity-80 transition-opacity">
                ادخل عالمك
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
