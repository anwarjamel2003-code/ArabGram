import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
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
      return NextResponse.json(
        { message: 'البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل' },
        { status: 409 }
      )
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const hashedCode = await bcrypt.hash(verificationCode, 10)
    const codeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create temporary user record with pending verification
    await prisma.user.create({
      data: {
        username,
        email,
        name,
        hashedPassword,
        role: 'USER',
        phoneVerified: false, // Use this field to track email verification
        image: null,
        bio: null,
      },
    })

    // Store verification code in a temporary way (in production, use a separate table)
    // For now, we'll store it in environment or cache
    // In production, create a VerificationCode table in Prisma schema

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode, name)

    if (!emailSent) {
      // Delete the user if email sending fails
      await prisma.user.delete({
        where: { email },
      })

      return NextResponse.json(
        { message: 'فشل إرسال البريد الإلكتروني. حاول مرة أخرى' },
        { status: 500 }
      )
    }

    // Return masked email for display
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')

    return NextResponse.json(
      {
        message: 'تم إرسال رمز التحقق بنجاح',
        maskedEmail,
        // Store code in session/cache for verification (in production)
        // For demo purposes, we're sending it via email
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
