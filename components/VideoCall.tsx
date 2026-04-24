'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWebRTC, getUserMedia, stopStream } from '@/hooks/useWebRTC'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface VideoCallProps {
  callId: string
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  onEnd?: () => void
}

export default function VideoCall({
  callId,
  otherUserId,
  otherUserName,
  otherUserImage,
  onEnd,
}: VideoCallProps) {
  const { data: session } = useSession()
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout>()

  const { connected, error, close } = useWebRTC({
    callId,
    userId: (session?.user as any)?.id || '',
    otherUserId,
    initiator: false,
    stream: localStream || undefined,
    onStream: setRemoteStream,
    onConnect: () => {
      console.log('[CALL] Connected')
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    },
    onError: (err) => {
      console.error('[CALL_ERROR]', err)
    },
  })

  // Get local media
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await getUserMedia({
          audio: true,
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        })
        setLocalStream(stream)

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[MEDIA_ERROR]', err)
      }
    }

    getMedia()

    return () => {
      if (localStream) {
        stopStream(localStream)
      }
    }
  }, [])

  // Set remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleEndCall = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }
    close()
    if (localStream) {
      stopStream(localStream)
    }
    onEnd?.()
  }

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">خطأ في الاتصال</p>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <Button onClick={handleEndCall} variant="destructive">
            إغلاق
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
      {/* Remote Video */}
      <div className="flex-1 relative bg-black">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={otherUserImage} />
                <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                  {otherUserName[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-white text-lg font-semibold">{otherUserName}</p>
              <p className="text-gray-400 text-sm">
                {connected ? 'جاري الاتصال...' : 'في انتظار الاتصال...'}
              </p>
            </div>
          </div>
        )}

        {/* Call Duration */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold">
          {formatDuration(callDuration)}
        </div>

        {/* Local Video (Picture in Picture) */}
        {localStream && (
          <div className="absolute bottom-4 right-4 w-32 h-40 bg-black rounded-lg overflow-hidden border-2 border-indigo-500 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800/90 backdrop-blur border-t border-slate-700 p-6 flex items-center justify-center gap-4">
        <Button
          size="icon"
          className={`h-12 w-12 rounded-full transition-all ${
            isMuted
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={toggleMute}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        <Button
          size="icon"
          className={`h-12 w-12 rounded-full transition-all ${
            !isVideoOn
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={toggleVideo}
        >
          {isVideoOn ? (
            <Video className="h-6 w-6" />
          ) : (
            <VideoOff className="h-6 w-6" />
          )}
        </Button>

        <Button
          size="icon"
          className={`h-12 w-12 rounded-full transition-all ${
            isSpeakerOn
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
        >
          {isSpeakerOn ? (
            <Volume2 className="h-6 w-6" />
          ) : (
            <VolumeX className="h-6 w-6" />
          )}
        </Button>

        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
