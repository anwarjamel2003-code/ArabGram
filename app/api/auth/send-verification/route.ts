import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security'
import { z } from 'zod'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, name, password } = schema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      // If user exists but is not verified, we can allow resending or update the record
      // But for signup flow, usually we just say it exists
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { message: 'البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل' },
          { status: 409 }
        )
      }
      // If not verified, we'll update the existing record with new code
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const hashedCode = await hashPassword(verificationCode)
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Hash password
    const hashedPassword = await hashPassword(password)

    if (existingUser && !existingUser.emailVerified) {
      // Update existing unverified user
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          username,
          name,
          hashedPassword,
          verificationCode: hashedCode,
          verificationCodeExpires: codeExpiry,
        },
      })
    } else {
      // Create new user record
      await prisma.user.create({
        data: {
          username,
          email,
          name,
          hashedPassword,
          role: 'USER',
          emailVerified: null,
          verificationCode: hashedCode,
          verificationCodeExpires: codeExpiry,
        },
      })
    }

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, name)

    if (!emailSent) {
      // We don't necessarily delete the user here, just return error
      return NextResponse.json(
        { message: 'فشل إرسال البريد الإلكتروني. يرجى التأكد من إعدادات SMTP' },
        { status: 500 }
      )
    }

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')

    return NextResponse.json(
      {
        message: 'تم إرسال رمز التحقق بنجاح',
        maskedEmail,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send verification error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم. تأكد من اتصال قاعدة البيانات' },
      { status: 500 }
    )
  }
}
