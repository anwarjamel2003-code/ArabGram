'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Radio, Globe, SendHorizontal, Phone, Video, X } from 'lucide-react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ChatUser {
  id: string
  name: string
  username: string
  image: string
  lastMessage: string
  updatedAt: string
}

interface ActiveCall {
  callId: string
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  type: 'voice' | 'video'
  initiator: boolean
}

function MessagesContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const initialUserId = searchParams?.get('userId')

  const [activeChat, setActiveChat] = useState<ChatUser | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const currentUserId = (session?.user as any)?.id
  const currentUserName = (session?.user as any)?.name || ''
  const currentUserImage = (session?.user as any)?.image || ''

  const { messages, isConnected, sendMessage, setTyping } = useRealtimeChat(
    currentUserId || '',
    activeChat?.id || ''
  )

  // Fetch existing messages from DB when chat opens
  const fetchHistoryForUser = useCallback(async (userId: string) => {
    if (!currentUserId) return
    try {
      const res = await fetch(`/api/messages?withUserId=${userId}`)
      if (res.ok) {
        // The hook will handle state, but we trigger a fetch to pre-load history
        // by re-mounting with the right userId
      }
    } catch (e) {}
  }, [currentUserId])

  const fetchChatUsers = useCallback(async () => {
    if (!currentUserId) return
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        const usersMap = new Map<string, ChatUser>()
        data.forEach((msg: any) => {
          const otherUser = msg.senderId === currentUserId ? msg.receiver : msg.sender
          if (!usersMap.has(otherUser.id)) {
            usersMap.set(otherUser.id, {
              id: otherUser.id,
              name: otherUser.name || otherUser.username,
              username: otherUser.username,
              image: otherUser.image || '',
              lastMessage: msg.text,
              updatedAt: new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            })
          }
        })

        const usersArray = Array.from(usersMap.values())
        setChatUsers(usersArray)

        if (initialUserId) {
          const existingUser = usersArray.find(u => u.id === initialUserId)
          if (existingUser) {
            setActiveChat(existingUser)
          } else {
            // Open fresh chat with this user
            try {
              const profileRes = await fetch(`/api/profile?userId=${initialUserId}`)
              if (profileRes.ok) {
                const profileData = await profileRes.json()
                const newChatUser: ChatUser = {
                  id: initialUserId,
                  name: profileData.name || profileData.username,
                  username: profileData.username,
                  image: profileData.image || '',
                  lastMessage: '',
                  updatedAt: '',
                }
                setActiveChat(newChatUser)
                setChatUsers(prev => [newChatUser, ...prev.filter(u => u.id !== initialUserId)])
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch chats', error)
    } finally {
      setLoading(false)
    }
  }, [currentUserId, initialUserId])

  useEffect(() => {
    if (currentUserId) fetchChatUsers()
  }, [currentUserId, fetchChatUsers])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle starting a call
  const startCall = async (type: 'voice' | 'video') => {
    if (!activeChat || !currentUserId || !supabase) return

    const callId = `${[currentUserId, activeChat.id].sort().join('_')}_${Date.now()}`

    try {
      // ✅ FIX: Must SUBSCRIBE to a channel before you can send broadcasts on it
      const channel = supabase.channel(`incoming_calls:${activeChat.id}`)

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Subscribe timeout')), 5000)
        channel.subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            clearTimeout(timeout)
            resolve()
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            clearTimeout(timeout)
            reject(new Error(`Channel error: ${status}`))
          }
        })
      })

      await channel.send({
        type: 'broadcast',
        event: 'ringing',
        payload: {
          callId,
          callerId: currentUserId,
          callerName: currentUserName,
          callerImage: currentUserImage,
          type,
        },
      })

      // Clean up the channel after sending
      setTimeout(() => supabase.removeChannel(channel), 3000)

      setActiveCall({
        callId,
        otherUserId: activeChat.id,
        otherUserName: activeChat.name,
        otherUserImage: activeChat.image,
        type,
        initiator: true,
      })
    } catch (error) {
      console.error('Failed to start call', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat || !currentUserId) return
    await sendMessage(newMessage, currentUserName, currentUserImage)
    setNewMessage('')
    setIsTyping(false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    // Update last message in sidebar
    setChatUsers(prev => prev.map(u =>
      u.id === activeChat.id ? { ...u, lastMessage: newMessage, updatedAt: 'الآن' } : u
    ))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!isTyping) { setIsTyping(true); setTyping(true) }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => { setIsTyping(false); setTyping(false) }, 3000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-white animate-spin opacity-20" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex overflow-hidden relative z-10" dir="rtl">

      {/* Sidebar — Conversations List */}
      <div className={`w-full md:w-[380px] h-full flex flex-col border-l border-white/5 bg-zinc-950/60 backdrop-blur-3xl ${activeChat ? 'hidden md:flex' : 'flex'}`}>

        <div className="p-8 border-b border-white/5">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-1">الترددات</h2>
          <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">محادثاتك الخاصة</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-2 no-scrollbar">
          {chatUsers.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-700 font-bold">لا توجد محادثات حتى الآن</p>
            </div>
          )}
          {chatUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveChat(user)}
              className={`w-full text-right p-5 rounded-3xl transition-all duration-500 group flex items-center gap-4 ${
                activeChat?.id === user.id
                  ? 'bg-white text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.1)]'
                  : 'hover:bg-white/5 text-white'
              }`}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full arabgram-gradient flex items-center justify-center text-white font-black text-xl">
                    {user.name?.[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-lg truncate ${activeChat?.id === user.id ? 'text-zinc-900' : 'text-white'}`}>{user.name}</p>
                <p className={`text-sm truncate ${activeChat?.id === user.id ? 'text-zinc-600' : 'text-zinc-500'}`}>{user.lastMessage || 'ابدأ المحادثة...'}</p>
              </div>
              {user.updatedAt && (
                <span className={`text-xs font-bold flex-shrink-0 ${activeChat?.id === user.id ? 'text-zinc-500' : 'text-zinc-700'}`}>{user.updatedAt}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Globe className="w-24 h-24 text-white/5 mb-8 animate-pulse" />
            <h3 className="text-3xl font-black text-white/30 tracking-widest uppercase">في انتظار الإشارة</h3>
            <p className="text-zinc-700 mt-3 font-bold">اختر محادثة من القائمة</p>
          </div>
        ) : (
          <>
            {/* Cinematic Header */}
            <div className="h-28 flex items-end justify-between px-8 pb-5 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent z-20 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-white/30 hover:text-white mr-2 text-2xl font-black">→</button>
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                  {activeChat.image ? (
                    <img src={activeChat.image} alt={activeChat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full arabgram-gradient flex items-center justify-center text-white font-black text-xl">{activeChat.name[0]}</div>
                  )}
                  {isConnected && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-[0_0_8px_#10B981]" />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">{activeChat.name}</h2>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-600">
                    {isConnected ? '● متصل' : '○ غير متصل'}
                  </span>
                </div>
              </div>

              {/* Call Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => startCall('voice')}
                  className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                  title="مكالمة صوتية"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button
                  onClick={() => startCall('video')}
                  className="w-12 h-12 glass-panel rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                  title="مكالمة مرئية"
                >
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto px-8 md:px-16 py-8 space-y-10 z-10 no-scrollbar pb-36">
              {messages.length === 0 && (
                <div className="text-center py-16 opacity-30">
                  <p className="text-white font-black text-2xl">قل مرحبا 👋</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">
                      {isMe ? 'أنت' : activeChat.name} — {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className={`text-xl md:text-3xl font-black leading-tight max-w-[85%] ${
                      isMe
                        ? 'arabgram-text-gradient drop-shadow-[0_0_15px_rgba(250,150,40,0.3)] text-right'
                        : 'text-white/90 text-left'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Cinematic Input */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-20">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-4">
                <div className="flex-1">
                  <input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك..."
                    className="w-full bg-transparent border-b-2 border-white/10 text-white text-xl md:text-2xl font-black py-4 placeholder:text-white/10 outline-none focus:border-white/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center disabled:opacity-20 hover:scale-110 transition-transform shrink-0"
                >
                  <SendHorizontal className="w-7 h-7 -ml-0.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Active Call Overlay */}
      {activeCall && (
        <div className="fixed inset-0 z-[200]">
          <VideoCallOverlay
            call={activeCall}
            currentUserId={currentUserId}
            onEnd={() => setActiveCall(null)}
          />
        </div>
      )}
    </div>
  )
}

const VideoCall = dynamic(() => import('@/components/VideoCall'), { ssr: false })

// ─── Inline Video Call Overlay (Avant-Garde Style) ───────────────────────────
function VideoCallOverlay({ call, currentUserId, onEnd }: {
  call: ActiveCall
  currentUserId: string
  onEnd: () => void
}) {
  return (
    <div className="w-full h-full bg-zinc-950/95 backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] bg-[#fa9628] rounded-full mix-blend-screen blur-[150px] opacity-10 animate-blob1" />
        <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-[#2850e6] rounded-full mix-blend-screen blur-[130px] opacity-10 animate-blob2" />
      </div>

      {/* Close / End Call top button */}
      <button
        onClick={onEnd}
        className="absolute top-8 left-8 z-10 w-12 h-12 glass-panel border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="w-full h-full relative z-10">
        <VideoCall
          callId={call.callId}
          otherUserId={call.otherUserId}
          otherUserName={call.otherUserName}
          otherUserImage={call.otherUserImage}
          initiator={call.initiator}
          type={call.type}
          onEnd={onEnd}
        />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-white animate-spin opacity-20" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}
