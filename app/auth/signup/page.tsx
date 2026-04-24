'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight, ArrowLeft, Shield, Check, Loader2, AlertCircle } from 'lucide-react'
import { z } from 'zod'

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
  const [serverError, setServerError] = useState('')
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
      // Before moving to verification, create account and send code
      if (!validateStep()) return
      
      setLoading(true)
      setServerError('')

      try {
        const result = schema.safeParse(formData)
        if (!result.success) {
          setServerError('بيانات غير صحيحة')
          setLoading(false)
          return
        }

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
          setStep(5)
          setResendCountdown(60)
          
          // Start countdown
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
          setServerError(err.message || 'حدث خطأ في إرسال الرمز')
        }
      } catch {
        setServerError('حدث خطأ في الاتصال')
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (step < 5) nextStep()
      else handleVerify()
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
        router.push('/auth/signin?verified=true')
      } else {
        const err = await res.json()
        setErrors({ verification: err.message || 'الرمز غير صحيح' })
      }
    } catch {
      setServerError('حدث خطأ في التحقق')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.toLowerCase().trim() }),
      })

      if (res.ok) {
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
        setServerError('فشل إعادة إرسال الرمز')
      }
    } catch {
      setServerError('حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const p = formData.password
    if (!p) return { strength: 0, label: '', color: '' }
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (p.length >= 12) score++

    if (score <= 2) return { strength: score, label: 'ضعيفة', color: 'bg-red-500' }
    if (score <= 3) return { strength: score, label: 'متوسطة', color: 'bg-yellow-500' }
    return { strength: score, label: 'قوية', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float delay-300" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="story-ring p-1">
              <div className="bg-gray-900 rounded-full p-1">
                <Image
                  src="/arabgram-logo.png"
                  alt="ArabGram"
                  width={70}
                  height={70}
                  className="rounded-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-black arabgram-text-gradient">ArabGram</h1>
          <p className="text-gray-400 text-sm mt-1">إنشاء حساب جديد</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  s.id < step
                    ? 'arabgram-gradient text-white'
                    : s.id === step
                    ? 'border-2 border-purple-500 text-purple-400'
                    : 'border border-white/20 text-gray-600'
                }`}
              >
                {s.id < step ? <Check className="h-4 w-4" /> : s.id}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-0.5 transition-all duration-300 flex-shrink-0 ${
                    s.id < step ? 'arabgram-gradient' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
          {step !== 5 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 arabgram-gradient rounded-xl flex items-center justify-center">
                  <currentStep.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">الخطوة {step} من {steps.length}</p>
                  <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                </div>
              </div>
            </div>
          )}

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="arabgram-input pr-10 text-right"
                    placeholder="example@email.com"
                    autoFocus
                    maxLength={100}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="arabgram-input pr-10 text-right"
                    placeholder="أدخل اسمك الكامل"
                    autoFocus
                    maxLength={50}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">اسم المستخدم</label>
                <div className="relative">
                  <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    onKeyDown={handleKeyDown}
                    className="arabgram-input pr-10"
                    placeholder="username"
                    autoFocus
                    maxLength={20}
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                <p className="text-gray-500 text-xs">يُسمح فقط بالأحرف الإنجليزية والأرقام و _</p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="arabgram-input pr-10 pl-10"
                      placeholder="••••••••"
                      autoFocus
                      maxLength={128}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">قوة كلمة المرور</span>
                      <span className={passwordStrength.color.replace('bg-', 'text-')}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength.strength ? passwordStrength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-xs text-gray-500">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-400' : ''}`}>
                    <Check className="h-3 w-3" />
                    <span>8 أحرف على الأقل</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <Check className="h-3 w-3" />
                    <span>حرف كبير واحد على الأقل</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-400' : ''}`}>
                    <Check className="h-3 w-3" />
                    <span>رقم واحد على الأقل</span>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 arabgram-gradient rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">تحقق من بريدك الإلكتروني</h3>
                  <p className="text-gray-400 text-sm">أرسلنا رمز تحقق 6 أرقام إلى:</p>
                  <p className="text-purple-400 font-semibold mt-1">{sentCode}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">رمز التحقق</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setVerificationCode(val)
                      if (errors.verification) setErrors({})
                    }}
                    onKeyDown={handleKeyDown}
                    className="arabgram-input text-center text-2xl letter-spacing tracking-widest"
                    placeholder="000000"
                    autoFocus
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {errors.verification && <p className="text-red-400 text-xs mt-1">{errors.verification}</p>}
                </div>

                <p className="text-gray-500 text-xs text-center">
                  الرمز صالح لمدة 10 دقائق
                </p>

                {resendCountdown > 0 ? (
                  <p className="text-center text-gray-500 text-sm">
                    إعادة الإرسال متاحة خلال {resendCountdown} ثانية
                  </p>
                ) : (
                  <button
                    onClick={handleResendCode}
                    disabled={loading}
                    className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    لم تستقبل الرمز؟ أعد الإرسال
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                السابق
              </button>
            )}

            {step < 5 ? (
              <button
                onClick={nextStep}
                disabled={loading}
                className="flex-1 btn-arabgram flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>التالي</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="flex-1 btn-arabgram flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>تحقق وأنشئ الحساب</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {step !== 5 && (
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                لديك حساب بالفعل؟{' '}
                <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <div className="security-badge">
            <Shield className="h-3 w-3" />
            <span>بياناتك محمية ومشفرة بالكامل</span>
          </div>
        </div>
      </div>
    </div>
  )
}
