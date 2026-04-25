'use client'

import { Phone, PhoneOff, Video } from 'lucide-react'
import Image from 'next/image'

interface IncomingCallModalProps {
  callerName: string
  callerImage?: string
  type: 'voice' | 'video'
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCallModal({
  callerName,
  callerImage,
  type,
  onAccept,
  onReject,
}: IncomingCallModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full mx-4 text-center shadow-2xl animate-fade-in-up">
        {/* Caller Avatar */}
        <div className="relative mx-auto mb-6">
          <div className="w-28 h-28 rounded-full mx-auto overflow-hidden border-4 border-white shadow-xl">
            {callerImage ? (
              <Image src={callerImage} alt={callerName} width={112} height={112} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white text-3xl font-black">
                {callerName[0]}
              </div>
            )}
          </div>
          {/* Ringing animation */}
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 animate-pulse" />
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-black text-slate-900 mb-1">{callerName}</h2>
        <p className="text-slate-500 font-medium mb-8 flex items-center justify-center gap-2">
          {type === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          <span>مكالمة {type === 'video' ? 'فيديو' : 'صوتية'} واردة...</span>
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-6">
          {/* Reject */}
          <button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          >
            <PhoneOff className="h-7 w-7" />
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all animate-bounce"
          >
            <Phone className="h-7 w-7" />
          </button>
        </div>
      </div>
    </div>
  )
}
