import crypto from 'crypto'
import bcrypt from 'bcryptjs'

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Encrypt data using AES-256
 */
export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.scryptSync(key, 'salt', 32),
    iv
  )

  let encrypted = cipher.update(data, 'utf-8', 'hex')
  encrypted += cipher.final('hex')

  return iv.toString('hex') + ':' + encrypted
}

/**
 * Decrypt data using AES-256
 */
export function decryptData(encryptedData: string, key: string): string {
  const parts = encryptedData.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    crypto.scryptSync(key, 'salt', 32),
    iv
  )

  let decrypted = decipher.update(parts[1], 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}

/**
 * Generate a hash for verification
 */
export function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Verify a hash
 */
export function verifyHash(data: string, hash: string): boolean {
  return generateHash(data) === hash
}

/**
 * Generate HMAC signature
 */
export function generateHMAC(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

/**
 * Verify HMAC signature
 */
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHMAC(data, secret)
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

/**
 * Generate a one-time password (OTP)
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)]
  }
  return otp
}

/**
 * Hash OTP for storage
 */
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10)
}

/**
 * Verify OTP
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash)
}

/**
 * Generate JWT-like token (for demo, use jsonwebtoken in production)
 */
export function generateToken(payload: Record<string, any>, expiresIn: number = 3600): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    })
  ).toString('base64')

  const signature = generateHMAC(`${header}.${body}`, process.env.JWT_SECRET || 'secret')

  return `${header}.${body}.${signature}`
}

/**
 * Verify JWT-like token
 */
export function verifyToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const signature = generateHMAC(`${parts[0]}.${parts[1]}`, process.env.JWT_SECRET || 'secret')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(parts[2]))) {
      return null
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Mask sensitive data
 */
export function maskSensitiveData(data: string, visibleChars: number = 2): string {
  if (data.length <= visibleChars) return data
  return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars)
}

/**
 * Mask email
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  return maskSensitiveData(localPart, 2) + '@' + domain
}

/**
 * Mask phone number
 */
export function maskPhone(phone: string): string {
  return phone.slice(0, 3) + '*'.repeat(phone.length - 6) + phone.slice(-3)
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string): {
  score: number
  label: string
  suggestions: string[]
} {
  let score = 0
  const suggestions: string[] = []

  if (password.length >= 8) score++
  else suggestions.push('استخدم 8 أحرف على الأقل')

  if (password.length >= 12) score++
  else suggestions.push('استخدم 12 حرف أو أكثر للأمان الأفضل')

  if (/[a-z]/.test(password)) score++
  else suggestions.push('أضف أحرف صغيرة')

  if (/[A-Z]/.test(password)) score++
  else suggestions.push('أضف أحرف كبيرة')

  if (/[0-9]/.test(password)) score++
  else suggestions.push('أضف أرقام')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else suggestions.push('أضف رموز خاصة')

  let label = 'ضعيفة'
  if (score >= 4) label = 'قوية'
  else if (score >= 3) label = 'متوسطة'

  return { score, label, suggestions }
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate IP address
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/

  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.')
    return parts.every(part => parseInt(part) <= 255)
  }

  return ipv6Regex.test(ip)
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }

  return headers['x-real-ip'] as string || 'unknown'
}
