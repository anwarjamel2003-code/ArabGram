'use client'

import { useState } from 'react'
import { useIncomingCalls } from '@/hooks/useIncomingCalls'
import IncomingCallModal from '@/components/IncomingCallModal'
import VideoCall from '@/components/VideoCall'

/**
 * Global wrapper that listens for incoming calls and shows the modal/video UI
 */
export default function CallProvider({ children }: { children: React.ReactNode }) {
  const { incomingCall, acceptCall, rejectCall } = useIncomingCalls()
  const [activeCall, setActiveCall] = useState<{
    callId: string
    otherUserId: string
    otherUserName: string
    otherUserImage?: string
  } | null>(null)

  const handleAcceptCall = () => {
    const call = acceptCall()
    if (call) {
      setActiveCall({
        callId: call.callId,
        otherUserId: call.callerId,
        otherUserName: call.callerName,
        otherUserImage: call.callerImage,
      })
    }
  }

  return (
    <>
      {children}

      {/* Incoming Call Modal */}
      {incomingCall && !activeCall && (
        <IncomingCallModal
          callerName={incomingCall.callerName}
          callerImage={incomingCall.callerImage}
          type={incomingCall.type}
          onAccept={handleAcceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Active Call UI (fullscreen) */}
      {activeCall && (
        <div className="fixed inset-0 z-[200]">
          <VideoCall
            callId={activeCall.callId}
            otherUserId={activeCall.otherUserId}
            otherUserName={activeCall.otherUserName}
            otherUserImage={activeCall.otherUserImage}
            onEnd={() => setActiveCall(null)}
          />
        </div>
      )}
    </>
  )
}
