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
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-2xl" dir="rtl">
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] arabgram-gradient rounded-full blur-[150px] opacity-15 animate-pulse" />
      </div>

      <div className="relative glass-panel rounded-[3rem] p-10 max-w-sm w-full text-center border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

        {/* Ringing Rings */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full arabgram-gradient opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full arabgram-gradient opacity-15 animate-ping" style={{ animationDelay: '0.3s' }} />
          
          {/* Avatar */}
          <div className="absolute inset-4 rounded-full arabgram-gradient p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden">
              {callerImage ? (
                <Image src={callerImage} alt={callerName} width={120} height={120} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center arabgram-gradient">
                  <span className="text-4xl font-black text-white">{callerName[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">{callerName}</h2>
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mb-10">
          {type === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          مكالمة {type === 'video' ? 'مرئية' : 'صوتية'} واردة
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onReject}
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all hover:scale-110"
            >
              <PhoneOff className="h-8 w-8" />
            </button>
            <span className="text-zinc-600 text-xs font-black uppercase tracking-widest">رفض</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onAccept}
              className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all hover:scale-110 animate-bounce"
            >
              <Phone className="h-8 w-8" />
            </button>
            <span className="text-zinc-400 text-xs font-black uppercase tracking-widest arabgram-text-gradient">قبول</span>
          </div>
        </div>
      </div>
    </div>
  )
}
