import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token

    // Admin protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token || (token as any).role !== 'ADMIN') {
        const url = new URL('/auth/signin', req.url)
        url.searchParams.set('callbackUrl', req.url)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to feed and search
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/feed' || req.nextUrl.pathname === '/search') {
          return true
        }
        // Require authentication for other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}