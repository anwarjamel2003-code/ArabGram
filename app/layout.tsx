import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Arabgram',
  description: 'Modern Instagram-like social network with Arabic touch',
} as Metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="container mx-auto p-4 max-w-6xl">
            {children}
          </main>
        </Providers>
      </body>

    </html>
  )
}

