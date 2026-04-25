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
<<<<<<< Updated upstream
          <main className="min-h-screen">
            <Navigation />
            <div className="md:pr-72 pb-24 md:pb-0 pt-16 md:pt-0">
              <div className="container mx-auto p-4 max-w-6xl">
                {children}
              </div>
            </div>
=======
          <main className="w-full flex-1 flex flex-col">
            {children}
>>>>>>> Stashed changes
          </main>
        </Providers>
      </body>

    </html>
  )
}

