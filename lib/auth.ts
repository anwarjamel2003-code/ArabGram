import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/security'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
        })

        if (!user || !user.hashedPassword) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('يرجى التحقق من بريدك الإلكتروني أولاً')
        }

        const isValid = await comparePassword(credentials.password, user.hashedPassword)

        if (!isValid) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, 'user' is available from authorize()
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      // Pass token data into session so client can read it
      if (session.user && token) {
        ;(session.user as any).id = token.id
        ;(session.user as any).username = token.username
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',       // JWT works with CredentialsProvider (database doesn't!)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
