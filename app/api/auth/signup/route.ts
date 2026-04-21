import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, getClientIP } from '@/lib/security'
import { emailSchema, usernameSchema, passwordSchema, nameSchema, detectSQLInjection, detectXSS } from '@/lib/validation'
import { z } from 'zod'

const schema = z.object({
  username: usernameSchema,
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
})

type SignupData = z.infer<typeof schema>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    let validatedData: SignupData
    try {
      validatedData = schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: error.errors[0].message },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { message: 'بيانات غير صحيحة' },
        { status: 400 }
      )
    }

    // Additional security checks
    if (detectSQLInjection(validatedData.username) || detectXSS(validatedData.username)) {
      return NextResponse.json(
        { message: 'اسم المستخدم يحتوي على أحرف غير مسموحة' },
        { status: 400 }
      )
    }

    if (detectSQLInjection(validatedData.name) || detectXSS(validatedData.name)) {
      return NextResponse.json(
        { message: 'الاسم يحتوي على أحرف غير مسموحة' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        return NextResponse.json(
          { message: 'هذا البريد الإلكتروني مستخدم بالفعل' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { message: 'اسم المستخدم مستخدم بالفعل' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        hashedPassword,
        name: validatedData.name,
        role: 'USER',
        phoneVerified: false,
        image: null,
        bio: null,
      },
    })

    // Log signup event (for security monitoring)
    const clientIP = getClientIP(Object.fromEntries(request.headers))
    console.log(`[SIGNUP] User: ${user.id}, Email: ${user.email}, IP: ${clientIP}`)

    return NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[SIGNUP_ERROR]', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
