'use client'

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import Navbar from "./Navbar"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        <Navbar />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}

