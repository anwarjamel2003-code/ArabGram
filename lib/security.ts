import crypto from 'crypto'
import argon2 from 'argon2'

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Hash a password using Argon2id (Most secure)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 1,
    })
  } catch (error) {
    console.error('Argon2 hashing error:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare password with Argon2 hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password)
  } catch (error) {
    console.error('Argon2 verification error:', error)
    return false
  }
}

/**
 * Encrypt data using AES-256-GCM (More secure than CBC)
 */
export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(12)
  const salt = crypto.randomBytes(16)
  const derivedKey = crypto.scryptSync(key, salt, 32)
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv)

  let encrypted = cipher.update(data, 'utf-8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag().toString('hex')

  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decryptData(encryptedData: string, key: string): string {
  const [saltHex, ivHex, authTagHex, encrypted] = encryptedData.split(':')
  const salt = Buffer.from(saltHex, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const derivedKey = crypto.scryptSync(key, salt, 32)
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  return decrypted
}

/**
 * Generate a hash for verification (SHA-512 for better security)
 */
export function generateHash(data: string): string {
  return crypto.createHash('sha512').update(data).digest('hex')
}

/**
 * Verify a hash
 */
export function verifyHash(data: string, hash: string): boolean {
  return generateHash(data) === hash
}

/**
 * Generate HMAC signature (SHA-512)
 */
export function generateHMAC(data: string, secret: string): string {
  return crypto.createHmac('sha512', secret).update(data).digest('hex')
}

/**
 * Verify HMAC signature
 */
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
  const expectedSignature = generateHMAC(data, secret)
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

/**
 * Generate a secure one-time password (OTP)
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  // Use crypto.getRandomValues for better randomness if needed, 
  // but Math.random is okay for simple OTPs. For high security:
  const randomBytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10]
  }
  return otp
}

/**
 * Hash OTP for storage using Argon2
 */
export async function hashOTP(otp: string): Promise<string> {
  return await hashPassword(otp)
}

/**
 * Verify OTP using Argon2
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return await comparePassword(otp, hash)
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return (headers['x-real-ip'] as string) || 'unknown'
}
