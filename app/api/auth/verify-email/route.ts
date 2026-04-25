import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/security'
import { z } from 'zod'
import { sendWelcomeEmail } from '@/lib/email'

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = schema.parse(body)

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

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json(
        { message: 'لم يتم طلب رمز تحقق لهذا الحساب' },
        { status: 400 }
      )
    }

    // Check expiration
    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { message: 'انتهت صلاحية الرمز. يرجى طلب رمز جديد' },
        { status: 400 }
      )
    }

    // Verify code
    const isValid = await comparePassword(code, user.verificationCode)

    if (!isValid) {
      return NextResponse.json(
        { message: 'رمز التحقق غير صحيح' },
        { status: 400 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpires: null,
      },
    })

    // Send welcome email
    try {
        await sendWelcomeEmail(user.email, user.name || '', user.username)
    } catch (emailError) {
        console.error('Welcome email failed:', emailError)
        // Don't fail the verification if only welcome email fails
    }

    return NextResponse.json(
      { message: 'تم التحقق من البريد الإلكتروني بنجاح' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify email error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'الرمز يجب أن يتكون من 6 أرقام' }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
