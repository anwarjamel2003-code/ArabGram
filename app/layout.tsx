import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import Navigation from '@/components/Navigation'


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
          <main className="min-h-screen bg-slate-50 text-slate-900">
            <Navigation />
            <div className="md:pr-72 pb-24 md:pb-0 pt-16 md:pt-0">
              <div className="w-full">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
