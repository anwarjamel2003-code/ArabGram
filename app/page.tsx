'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Zap, Globe } from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/feed')
    }
  }, [session, router])

  if (session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 lg:px-6 mx-auto max-w-6xl">
          <Link href="/" className="flex items-center space-x-2 font-black text-3xl hover:scale-105 transition-all duration-300">
            <Image 
              src="/arabgram-logo.png" 
              alt="ArabGram Logo" 
              width={50} 
              height={50}
              className="h-12 w-12 object-contain"
              priority
            />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">ArabGram</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-3">
            <Link href="/auth/signin">
              <Button 
                variant="outline" 
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                تسجيل دخول
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
              >
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  ArabGram
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-2">شبكة اجتماعية عربية حديثة</p>
              <p className="text-lg text-gray-400">تواصل مع أصدقائك ومتابعيك بطريقة جديدة</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Heart className="h-6 w-6 text-pink-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">شارك لحظاتك</h3>
                  <p className="text-gray-400">شارك صورك ولحظاتك مع أصدقائك</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-blue-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">تواصل مباشر</h3>
                  <p className="text-gray-400">أرسل رسائل خاصة وتحدث مع أصدقائك</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-yellow-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">اتصالات فورية</h3>
                  <p className="text-gray-400">استمتع باتصالات صوتية وفيديو فورية</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Globe className="h-6 w-6 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">عالمي وعربي</h3>
                  <p className="text-gray-400">انضم لملايين المستخدمين حول العالم</p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex">
              <Link href="/auth/signup" className="block">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-6"
                >
                  ابدأ الآن
                </Button>
              </Link>
              <Link href="/auth/signin" className="block">
                <Button 
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 font-semibold text-lg py-6"
                >
                  هل لديك حساب؟
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <Image 
                src="/arabgram-logo.png" 
                alt="ArabGram Logo" 
                width={400}
                height={400}
                className="relative w-full max-w-sm h-auto drop-shadow-2xl"
                priority
                className="relative w-full max-w-sm h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/40 py-6 text-center text-gray-400">
        <p>&copy;  developed by : Eng Anwar 2026 ArabGram. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}
