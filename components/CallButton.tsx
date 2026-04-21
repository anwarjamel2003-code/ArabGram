'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Phone, Video } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface CallButtonProps {
  otherUserId: string
  type: 'voice' | 'video'
  className?: string
}

export default function CallButton({ otherUserId, type, className = '' }: CallButtonProps) {
  const [calling, setCalling] = useState(false)
  const { data: session } = useSession()

  const handleCall = async () => {
    setCalling(true)
    try {
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: otherUserId, type })
      })

      if (res.ok) {
        const call = await res.json()
        // TODO: Open WebRTC modal/peer connection
        console.log('Call started:', call)
        // peer = new Peer(call.id) etc.
      }
    } catch (error) {
      console.error('Call failed', error)
    } finally {
      setCalling(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleCall}
      disabled={calling || !session}
      className={className}
      title={`Start ${type} call`}
    >
      {calling ? (
        'Ringing...'
      ) : type === 'voice' ? (
        <Phone className="h-5 w-5" />
      ) : (
        <Video className="h-5 w-5" />
      )}
    </Button>
  )
}
