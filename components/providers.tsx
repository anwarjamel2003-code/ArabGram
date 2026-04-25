'use client'

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import Navbar from "./Navbar"
import CallProvider from "./CallProvider"
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
              background: '#fff',
              color: '#1e293b',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            },
          }}
        />
        <Navbar />
        <CallProvider>
          {children}
        </CallProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
