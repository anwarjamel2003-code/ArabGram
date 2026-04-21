import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: ({ session, token }: any) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        username: token.username,
        role: token.role,
      },
    }),
    jwt: ({ token, user }: any) => {
      if (user) {
        return {
          ...token,
          username: user.username,
          role: user.role,
        }
      }
      return token
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.hashedPassword) {
            return null
          }

          const valid = await bcrypt.compare(password, user.hashedPassword!)
          if (!valid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            role: user.role,
            image: user.image
          }
        } catch {
          return null
        }
      }
    })
  ]
}

export default NextAuth(authOptions)
export { authOptions }

export const handlers = {
  GET: (req: any, res: any) => NextAuth(req, res, authOptions),
  POST: (req: any, res: any) => NextAuth(req, res, authOptions),
}
