import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

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

    // Check if already verified
    if (user.phoneVerified) {
      return NextResponse.json(
        { message: 'الحساب مفعل بالفعل' },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, user.name || user.username)

    if (!emailSent) {
      return NextResponse.json(
        { message: 'فشل إرسال البريد الإلكتروني' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'تم إعادة إرسال الرمز بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
