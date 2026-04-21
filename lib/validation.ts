import { z } from 'zod'

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate email
 */
export const emailSchema = z
  .string()
  .email('بريد إلكتروني غير صالح')
  .max(255, 'البريد الإلكتروني طويل جداً')
  .transform(email => email.toLowerCase().trim())

/**
 * Validate username
 */
export const usernameSchema = z
  .string()
  .min(3, 'اسم المستخدم قصير جداً')
  .max(20, 'اسم المستخدم طويل جداً')
  .regex(/^[a-zA-Z0-9_]+$/, 'يُسمح فقط بالأحرف الإنجليزية والأرقام والشرطة السفلية')
  .transform(username => username.toLowerCase())

/**
 * Validate password
 */
export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(128, 'كلمة المرور طويلة جداً')
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
  .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')

/**
 * Validate name
 */
export const nameSchema = z
  .string()
  .min(2, 'الاسم قصير جداً')
  .max(100, 'الاسم طويل جداً')
  .transform(name => sanitizeInput(name.trim()))

/**
 * Validate post caption
 */
export const captionSchema = z
  .string()
  .max(2200, 'النص طويل جداً')
  .optional()
  .transform(caption => (caption ? sanitizeInput(caption.trim()) : undefined))

/**
 * Validate URL
 */
export const urlSchema = z
  .string()
  .url('رابط غير صالح')
  .max(2048, 'الرابط طويل جداً')

/**
 * Validate image URL
 */
export const imageUrlSchema = z
  .string()
  .url('رابط الصورة غير صالح')
  .max(2048, 'الرابط طويل جداً')
  .refine(
    url => {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      return imageExtensions.some(ext => url.toLowerCase().includes(ext))
    },
    'صيغة الصورة غير مدعومة'
  )

/**
 * Validate verification code
 */
export const verificationCodeSchema = z
  .string()
  .length(6, 'الرمز يجب أن يكون 6 أرقام')
  .regex(/^\d+$/, 'الرمز يجب أن يحتوي على أرقام فقط')

/**
 * Validate phone number
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'رقم الهاتف غير صالح')
  .optional()

/**
 * Validate bio
 */
export const bioSchema = z
  .string()
  .max(500, 'السيرة الذاتية طويلة جداً')
  .optional()
  .transform(bio => (bio ? sanitizeInput(bio.trim()) : undefined))

/**
 * Validate comment text
 */
export const commentSchema = z
  .string()
  .min(1, 'التعليق لا يمكن أن يكون فارغاً')
  .max(500, 'التعليق طويل جداً')
  .transform(comment => sanitizeInput(comment.trim()))

/**
 * Validate message text
 */
export const messageSchema = z
  .string()
  .min(1, 'الرسالة لا يمكن أن تكون فارغة')
  .max(4000, 'الرسالة طويلة جداً')
  .transform(message => sanitizeInput(message.trim()))

/**
 * Validate search query
 */
export const searchSchema = z
  .string()
  .min(1, 'البحث لا يمكن أن يكون فارغاً')
  .max(100, 'البحث طويل جداً')
  .transform(search => sanitizeInput(search.trim()))

/**
 * Validate ID (CUID format)
 */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+$/, 'معرف غير صالح')
  .min(1)
  .max(50)

/**
 * Validate pagination
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

/**
 * Validate sort order
 */
export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc')

/**
 * Validate date range
 */
export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

/**
 * Check for SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlInjectionPatterns = [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT)\b)/gi,
    /(-{2}|\/\*|\*\/|;)/g,
    /(--|#|\/\/)/g,
  ]

  return sqlInjectionPatterns.some(pattern => pattern.test(input))
}

/**
 * Check for XSS patterns
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate and sanitize user input
 */
export function validateAndSanitize(input: string, maxLength: number = 1000): string | null {
  if (!input || typeof input !== 'string') {
    return null
  }

  if (input.length > maxLength) {
    return null
  }

  if (detectSQLInjection(input) || detectXSS(input)) {
    return null
  }

  return sanitizeInput(input.trim())
}
