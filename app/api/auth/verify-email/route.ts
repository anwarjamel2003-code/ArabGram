import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'الرمز يجب أن يكون 6 أرقام'),
})

// In production, store verification codes in a database table
// For now, we'll use a simple in-memory store (not suitable for production)
const verificationStore: Record<string, { code: string; expiry: number; attempts: number }> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = schema.parse(body)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Check if user is already verified
    if (user.phoneVerified) {
      return NextResponse.json(
        { message: 'الحساب مفعل بالفعل' },
        { status: 400 }
      )
    }

    // In production, verify against database
    // For demo, we'll accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { message: 'الرمز غير صحيح' },
        { status: 400 }
      )
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: {
        phoneVerified: true, // Using this field to track email verification
      },
    })

    return NextResponse.json(
      { message: 'تم التحقق بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
