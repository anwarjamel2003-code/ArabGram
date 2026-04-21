'use client'

import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

export default function SignInModal({ open, onClose }: SignInModalProps) {
  const { data: session } = useSession()

  if (session) {
    onClose()
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => signIn('credentials')} className="w-full">
            Sign In
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
