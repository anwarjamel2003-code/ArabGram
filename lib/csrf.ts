import crypto from 'crypto'

// CSRF token store (in production, use session storage or Redis)
const csrfTokens = new Map<string, { token: string; createdAt: number }>()

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Store CSRF token
 */
export function storeCSRFToken(sessionId: string, token: string): void {
  csrfTokens.set(sessionId, {
    token,
    createdAt: Date.now(),
  })
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)

  if (!stored) {
    return false
  }

  // Check if token has expired
  if (Date.now() - stored.createdAt > TOKEN_EXPIRY) {
    csrfTokens.delete(sessionId)
    return false
  }

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(stored.token), Buffer.from(token))
}

/**
 * Clean up expired tokens
 */
export function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY) {
      csrfTokens.delete(sessionId)
    }
  }
}

// Run cleanup every hour
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000)
}
