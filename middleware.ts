import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting middleware
 */
function rateLimit(req: NextRequest, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const key = `${ip}:${req.nextUrl.pathname}`
  const now = Date.now()

  let record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs }
    rateLimitStore.set(key, record)
  }

  record.count++

  if (record.count > limit) {
    return NextResponse.json(
      { error: 'عدد الطلبات كثير جداً. حاول لاحقاً' },
      { status: 429 }
    )
  }

  return null
}

/**
 * Security headers middleware
 */
function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  )

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  )

  // HSTS (HTTP Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // Disable caching for sensitive pages
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
}

/**
 * Main middleware
 */
export function middleware(req: NextRequest) {
  // Skip middleware for static files and public assets
  if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/public')) {
    return NextResponse.next()
  }

  // Apply rate limiting to API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    const rateLimitResponse = rateLimit(req, 100, 15 * 60 * 1000)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
  }

  // Apply stricter rate limiting to auth routes
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    const authRateLimitResponse = rateLimit(req, 30, 15 * 60 * 1000)
    if (authRateLimitResponse) {
      return authRateLimitResponse
    }
  }

  // Create response
  const response = NextResponse.next()

  // Add security headers
  addSecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
