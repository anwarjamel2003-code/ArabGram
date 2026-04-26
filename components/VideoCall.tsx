'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react'
import { useWebRTC, getUserMedia, stopStream } from '@/hooks/useWebRTC'

interface VideoCallProps {
  callId: string
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  initiator?: boolean
  type?: 'voice' | 'video'
  onEnd?: () => void
}

export default function VideoCall({
  callId,
  otherUserId,
  otherUserName,
  otherUserImage,
  initiator = false,
  type = 'video',
  onEnd,
}: VideoCallProps) {
  const { data: session } = useSession()
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(type === 'video')
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout>()

  const { connected, error, close } = useWebRTC({
    callId,
    userId: (session?.user as any)?.id || '',
    otherUserId,
    initiator,
    stream: localStream || undefined,
    onStream: (stream) => {
      setRemoteStream(stream)
      setStatus('connected')
    },
    onConnect: () => {
      setStatus('connected')
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    },
    onError: (err) => {
      console.error('[CALL_ERROR]', err)
      setStatus('error')
    },
  })

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await getUserMedia({
          audio: true,
          video: type === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[MEDIA_ERROR]', err)
        setStatus('error')
      }
    }
    getMedia()
    return () => {
      if (localStream) stopStream(localStream)
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleEndCall = () => {
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
    close()
    if (localStream) stopStream(localStream)
    onEnd?.()
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => { track.enabled = isMuted })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => { track.enabled = !isVideoOn })
      setIsVideoOn(!isVideoOn)
    }
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 relative overflow-hidden" dir="rtl">
      
      {/* Remote Video / Audio-only Placeholder */}
      <div className="flex-1 relative bg-zinc-950">
        {type === 'video' && remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Caller Avatar with glowing ring */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 arabgram-gradient rounded-full blur-3xl opacity-30 ${status === 'connected' ? 'animate-pulse' : ''}`} />
              <div className="relative w-40 h-40 rounded-full arabgram-gradient p-1">
                <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden border-4 border-zinc-950">
                  {otherUserImage ? (
                    <img src={otherUserImage} alt={otherUserName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center arabgram-gradient">
                      <span className="text-5xl font-black text-white">{otherUserName[0]}</span>
                    </div>
                  )}
                </div>
              </div>
              {status === 'connected' && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-zinc-950 shadow-[0_0_12px_#10B981]" />
              )}
            </div>

            <h2 className="text-5xl font-black text-white tracking-tight mb-4">{otherUserName}</h2>

            <div className="flex items-center gap-3">
              {status === 'connecting' && (
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full arabgram-gradient animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
              <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">
                {status === 'connecting' ? 'جاري الاتصال...' : status === 'connected' ? formatDuration(callDuration) : 'خطأ في الاتصال'}
              </p>
            </div>
          </div>
        )}

        {/* Duration badge (video mode) */}
        {type === 'video' && status === 'connected' && (
          <div className="absolute top-6 right-6 glass-panel border border-white/10 px-4 py-2 rounded-full text-white text-sm font-black">
            {formatDuration(callDuration)}
          </div>
        )}

        {/* Local Video PiP */}
        {type === 'video' && localStream && (
          <div className="absolute bottom-6 left-6 w-32 h-44 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="glass-panel border-t border-white/5 px-8 py-8 flex items-center justify-center gap-6">
        {/* Mute */}
        <button
          onClick={toggleMute}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isMuted ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
        </button>

        {/* Video toggle (only for video calls) */}
        {type === 'video' && (
          <button
            onClick={toggleVideo}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              !isVideoOn ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isVideoOn ? <Video className="h-7 w-7" /> : <VideoOff className="h-7 w-7" />}
          </button>
        )}

        {/* Speaker */}
        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            !isSpeakerOn ? 'bg-zinc-800 border border-zinc-700 text-zinc-500' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
        >
          {isSpeakerOn ? <Volume2 className="h-7 w-7" /> : <VolumeX className="h-7 w-7" />}
        </button>

        {/* End Call */}
        <button
          onClick={handleEndCall}
          className="w-20 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] transition-all hover:scale-105 ml-4"
        >
          <PhoneOff className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
}
