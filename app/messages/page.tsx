'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { Loader2, Zap, Radio, Globe, SendHorizontal } from 'lucide-react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useSearchParams } from 'next/navigation'

interface ChatUser {
  id: string
  name: string
  username: string
  image: string
  lastMessage: string
  updatedAt: string
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const currentUserId = (session?.user as any)?.id

  const { messages, isConnected, typingUsers, sendMessage, setTyping } = useRealtimeChat(
    currentUserId || '',
    activeChat?.id || ''
  )

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
          if (existingUser) setActiveChat(existingUser)
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat || !currentUserId) return

    await sendMessage(newMessage, (session?.user as any)?.name, (session?.user as any)?.image)
    setNewMessage('')
    setIsTyping(false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (!isTyping) {
      setIsTyping(true)
      setTyping(true)
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      setTyping(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 text-white animate-spin opacity-50" />
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex overflow-hidden relative z-10" dir="rtl">
      
      {/* Left Sidebar (Frequencies) */}
      <div className={`w-full md:w-[400px] h-full flex flex-col border-l border-white/5 bg-zinc-950/50 backdrop-blur-3xl ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        <div className="p-8">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">الترددات</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">اتصالات مشفرة</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-2 no-scrollbar">
          {chatUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveChat(user)}
              className={`w-full text-right p-6 rounded-3xl transition-all duration-500 group ${
                activeChat?.id === user.id 
                  ? 'bg-white text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                  : 'hover:bg-white/5 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`font-black text-xl tracking-wide ${activeChat?.id === user.id ? 'text-zinc-900' : 'text-white'}`}>
                  {user.name}
                </span>
                {activeChat?.id !== user.id && (
                  <Radio className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <p className={`text-sm line-clamp-1 font-medium ${activeChat?.id === user.id ? 'text-zinc-600' : 'text-zinc-500'}`}>
                {user.lastMessage}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Interface (The Terminal) */}
      <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Globe className="w-24 h-24 text-white/5 mb-8 animate-pulse" />
            <h3 className="text-3xl font-black text-white/50 tracking-widest uppercase">في انتظار الإشارة</h3>
          </div>
        ) : (
          <>
            {/* Cinematic Header */}
            <div className="h-32 flex items-end justify-between px-8 pb-6 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent z-20">
              <div className="flex items-center gap-6">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-white/50 hover:text-white transition-colors">
                  &rarr; عودة
                </button>
                <div>
                  <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg mb-2">{activeChat.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#10B981] animate-pulse shadow-[0_0_10px_#10B981]' : 'bg-zinc-600'}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      {isConnected ? 'متصل بالشبكة' : 'غير متصل'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic Messages Stream */}
            <div className="flex-1 overflow-y-auto px-8 md:px-20 py-10 space-y-12 z-10 no-scrollbar pb-40">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
                      {isMe ? 'أنت' : activeChat.name} // {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className={`text-2xl md:text-4xl font-black leading-tight max-w-[85%] ${
                      isMe ? 'arabgram-text-gradient drop-shadow-[0_0_15px_rgba(250,150,40,0.3)] text-right' : 'text-white/90 text-left'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Cinematic Input Box */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-20">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-4 relative">
                <div className="flex-1">
                  <input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك..."
                    className="w-full bg-transparent border-b-2 border-white/10 text-white text-2xl md:text-3xl font-black py-4 placeholder:text-white/10 outline-none focus:border-white/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 transition-transform duration-300 shrink-0"
                >
                  <SendHorizontal className="w-8 h-8 -ml-1" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-white animate-spin opacity-50" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}
