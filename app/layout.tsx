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
          <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
            <Navigation />
            <div className="pt-20 flex-1">
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
