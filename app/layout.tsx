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
          <main className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
            {/* Global Liquid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#fa9628] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-blob1" />
              <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#2850e6] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob2" />
              <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] bg-[#dc145a] rounded-full mix-blend-screen filter blur-[140px] opacity-10 animate-blob1" style={{ animationDelay: '2s' }} />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col h-full w-full overflow-y-auto no-scrollbar">
              {children}
            </div>
            
            <div className="relative z-50 pointer-events-none">
              {/* Navigation will be floating command pill, its internal links will have pointer-events-auto */}
              <Navigation />
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
}
