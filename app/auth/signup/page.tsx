'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight, ArrowLeft, Shield, Check, Loader2, AlertCircle } from 'lucide-react'
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
  { id: 1, title: 'البريد الإلكتروني', icon: Mail, field: 'email' as keyof FormData },
  { id: 2, title: 'الاسم الكامل', icon: User, field: 'name' as keyof FormData },
  { id: 3, title: 'اسم المستخدم', icon: AtSign, field: 'username' as keyof FormData },
  { id: 4, title: 'كلمة المرور', icon: Lock, field: 'password' as keyof FormData },
  { id: 5, title: 'التحقق', icon: Shield, field: 'verification' as any },
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
  const [resendCountdown, setResendCountdown] = useState(0)

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
      setServerError('')

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
          setResendCountdown(60)
          const interval = setInterval(() => {
            setResendCountdown(prev => {
              if (prev <= 1) {
                clearInterval(interval)
                return 0
              }
              return prev - 1
            })
          }, 1000)
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
      setServerError('')
    }
  }

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setErrors({ verification: 'الرمز يجب أن يكون 6 أرقام' })
      return
    }

    setLoading(true)
    setServerError('')

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

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Dynamic Background Elements */}
      <div className="bg-blob w-[500px] h-[500px] bg-brand-primary top-[-10%] left-[-10%]" />
      <div className="bg-blob w-[400px] h-[400px] bg-brand-secondary bottom-[-10%] right-[-10%] delay-700" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute inset-0 arabgram-gradient blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-soft" />
              <div className="relative overflow-hidden rounded-[3.5rem] p-[4px] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div className="absolute inset-0 arabgram-gradient animate-spin-slow" />
                <div className="relative bg-black rounded-[3.3rem] p-4">
                  <Image
                    src="/arabgram-logo.png"
                    alt="ArabGram"
                    width={180}
                    height={180}
                    className="rounded-3xl object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black arabgram-text-gradient mb-2 tracking-tighter">انضم إلى ArabGram</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">ابدأ رحلتك الاجتماعية اليوم</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                  s.id < step
                    ? 'arabgram-gradient text-white shadow-lg'
                    : s.id === step
                    ? 'bg-white/10 border-2 border-brand-primary text-brand-primary shadow-brand-primary/20'
                    : 'bg-white/5 border border-white/10 text-gray-600'
                }`}
              >
                {s.id < step ? <Check className="h-5 w-5" /> : s.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-[2px] mx-1 rounded-full ${s.id < step ? 'arabgram-gradient' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {step !== 5 && (
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl arabgram-gradient flex items-center justify-center shadow-xl">
                  <currentStep.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">الخطوة {step} من {steps.length}</p>
                  <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
                </div>
              </div>
            </div>
          )}



          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 mr-1">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="arabgram-input pr-12 text-right"
                    placeholder="example@email.com"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1 font-bold">{errors.email}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 mr-1">الاسم الكامل</label>
                <div className="relative group">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="arabgram-input pr-12 text-right"
                    placeholder="أدخل اسمك الحقيقي"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1 font-bold">{errors.name}</p>}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 mr-1">اسم المستخدم</label>
                <div className="relative group">
                  <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="arabgram-input pr-12 text-right"
                    placeholder="username"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs mt-1 font-bold">{errors.username}</p>}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 mr-1">كلمة المرور</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="arabgram-input pr-12 pl-12 text-right"
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1 font-bold">{errors.password}</p>}
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl arabgram-gradient flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">تحقق من بريدك</h2>
                  <p className="text-gray-400 text-sm">أرسلنا رمز التحقق إلى <span className="text-brand-primary font-bold">{sentCode}</span></p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[0.5em] text-brand-primary focus:border-brand-primary outline-none transition-all"
                  placeholder="000000"
                />
                {errors.verification && <p className="text-red-400 text-sm font-bold">{errors.verification}</p>}
                
                <div className="flex flex-col gap-4 pt-4">
                  <button
                    onClick={handleVerify}
                    disabled={loading || verificationCode.length !== 6}
                    className="btn-arabgram h-14 text-lg font-black disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'تأكيد الرمز'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-500 hover:text-white font-bold text-sm transition-colors"
                  >
                    تغيير البريد الإلكتروني
                  </button>
                </div>
              </div>
            )}

            {step < 5 && (
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>السابق</span>
                  </button>
                )}
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-[2] btn-arabgram h-14 text-lg font-black flex items-center justify-center gap-2 group"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <span>{step === 4 ? 'إنشاء الحساب' : 'المتابعة'}</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-400 font-medium">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/auth/signin"
                className="text-brand-primary hover:text-brand-secondary font-black transition-all hover:underline underline-offset-4"
              >
                سجل دخولك الآن
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 font-bold uppercase tracking-[0.3em]">
          © 2026 ArabGram — Engineered by Eng. Anwar
        </p>
      </div>
    </div>
  )
}
