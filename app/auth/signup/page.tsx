'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, User, Mail, Lock, AtSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { z } from 'zod'
import { toast } from 'sonner' // Assume or use alert

const steps = [
  { id: 1, title: 'Email', icon: Mail },
  { id: 2, title: 'Name', icon: User },
  { id: 3, title: 'Username', icon: AtSign },
  { id: 4, title: 'Password', icon: Lock }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
  username: z.string().min(3, 'Username too short').max(20).regex(/^[a-zA-Z0-9_]+$/, 'Invalid characters'),
  password: z.string().min(8, 'Password min 8 chars')
})

type FormData = z.infer<typeof schema>

export default function Signup() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const nextStep = () => {
    const stepData = { [`step${step}`]: formData }
    const stepSchema = schema.pick(Object.keys(stepData)[0] as any)
    const result = stepSchema.safeParse(stepData)
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    if (step < 4) {
      setStep(step + 1)
      setErrors({})
    }
  }

  const prevStep = () => step > 1 && setStep(step - 1)

  const submitSignup = async () => {
    const result = schema.safeParse(formData)
    if (!result.success) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('Account created! Welcome to ArabGram.')
        router.push('/auth/signin')
      } else {
        const err = await res.json()
        toast.error(err.message || 'Signup failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={errors.email ? 'border-destructive focus:ring-destructive' : ''}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </>
        )
      case 2:
        return (
          <>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={errors.name ? 'border-destructive focus:ring-destructive' : ''}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </>
        )
      case 3:
        return (
          <>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Unique username"
              value={formData.username}
              onChange={(e) => updateField('username', e.target.value)}
              className={errors.username ? 'border-destructive focus:ring-destructive' : ''}
            />
            {errors.username && <p className="text-destructive text-sm mt-1">{errors.username}</p>}
          </>
        )
      case 4:
        return (
          <>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min 8 chars)"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              className={errors.password ? 'border-destructive focus:ring-destructive' : ''}
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 instagram-gradient bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Check className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black instagram-gradient bg-gradient-to-r from-gray-900 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Step {step} of 4
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="flex bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center mb-8">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center space-y-1 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s.id <= step 
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground border'
                }`}>
                  {s.id}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                className="flex-1 border-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button 
              type="button" 
              onClick={step < 4 ? nextStep : submitSignup}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg font-semibold"
            >
              {loading ? 'Creating...' : step < 4 ? 'Next' : 'Finish'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary font-semibold hover:underline transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
