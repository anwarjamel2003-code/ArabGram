import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security'
import { z } from 'zod'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني تم التحقق منه بالفعل' },
        { status: 400 }
      )
    }

    // Generate new code
    const verificationCode = generateVerificationCode()
    const hashedCode = await hashPassword(verificationCode)
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: hashedCode,
        verificationCodeExpires: codeExpiry,
      },
    })

    const emailSent = await sendVerificationEmail(email, verificationCode, user.name || '')

    if (!emailSent) {
      return NextResponse.json(
        { message: 'فشل إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'تم إعادة إرسال رمز التحقق بنجاح' },
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
