'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, MessageCircle, Heart, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <>
      <nav className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 lg:px-6">
          <Link href="/" className="flex items-center space-x-2 font-black text-3xl hover:scale-105 transition-all duration-300 mr-8">
            <Image 
              src="/arabgram-logo.png" 
              alt="ArabGram Logo" 
              width={50} 
              height={50}
              className="h-12 w-12 object-contain"
              priority
            />
            <span className="arabgram-text-gradient">Arabgram</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-1 lg:space-x-3">
            <Button variant="ghost" size="icon" asChild className="hover:bg-indigo-500/10 hover:scale-110 transition-all duration-300 group">
              <Link href="/search">
                <Search className="h-6 w-6 group-hover:text-indigo-600 transition-colors duration-300" />
              </Link>
            </Button>
            {session && (
              <>
                <Button variant="ghost" size="icon" asChild className="hover:bg-pink-500/10 hover:scale-110 transition-all duration-300 group">
                  <Link href="/messages">
                    <MessageCircle className="h-6 w-6 group-hover:text-pink-600 transition-colors duration-300" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="hover:bg-rose-500/10 hover:scale-110 transition-all duration-300 group relative">
                  <Link href="/notifications">
                    <Heart className="h-6 w-6 group-hover:text-rose-600 transition-colors duration-300" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="w-12 h-12 hover:scale-110 transition-all duration-300 hover:shadow-lg">
                  <Link href="/profile">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">AG</AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => signOut()} 
                  className="hover:bg-red-500/10 hover:scale-110 transition-all duration-300 group"
                  title="Sign Out"
                >
                  <LogOut className="h-6 w-6 group-hover:text-red-600 transition-colors duration-300" />
                </Button>
              </>
            )}
            {!session && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  asChild
                  className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <Link href="/auth/signin">
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
                >
                  <Link href="/auth/signup">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
