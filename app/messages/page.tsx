'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Search, Phone, Video, Send, Loader2, Info, Smile } from 'lucide-react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
  const [searchQuery, setSearchQuery] = useState('')
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
          if (existingUser) {
            setActiveChat(existingUser)
          } else {
            setActiveChat({
              id: initialUserId,
              name: "مستخدم",
              username: "مستخدم",
              image: "",
              lastMessage: "",
              updatedAt: ""
            })
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

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)]" dir="rtl">
        <div className="text-center glass-card p-12 rounded-[3rem] animate-float">
          <div className="w-20 h-20 arabgram-gradient rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">الرسائل الخاصة</h2>
          <p className="text-zinc-400 font-medium text-sm">سجّل دخولك للبدء بالمراسلة مع أصدقائك.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex max-w-6xl mx-auto w-full p-4 md:p-6 gap-6" dir="rtl">
      
      {/* Left (RTL) - Chat List */}
      <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col glass-card rounded-[2.5rem] overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <span className="font-black text-xl text-white">الرسائل</span>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatUsers.length === 0 && !activeChat ? (
            <div className="text-center py-10 text-zinc-500 font-medium text-sm">لا توجد محادثات سابقة</div>
          ) : (
            chatUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${
                  activeChat?.id === user.id 
                    ? 'bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-white/10' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/10 relative">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center arabgram-gradient font-bold text-white text-lg">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-bold text-[15px] text-white truncate mb-0.5">{user.name}</p>
                  <p className="text-[13px] text-zinc-400 truncate">{user.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right (RTL) - Chat Window */}
      <div className={`flex-1 flex flex-col glass-card rounded-[2.5rem] overflow-hidden relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
              <div className="w-24 h-24 arabgram-gradient rounded-full flex items-center justify-center mx-auto mb-6 p-[2px]">
                <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">ابدأ المراسلة</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">اختر محادثة من القائمة أو ابدأ محادثة جديدة مع أحد المتابعين.</p>
              <button className="btn-primary">إرسال رسالة</button>
            </div>
          </div>
        ) : (
          <>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] arabgram-gradient opacity-5 blur-[100px] pointer-events-none" />

            {/* Chat Header */}
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-white p-2 bg-white/5 rounded-xl">
                  &rarr;
                </button>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border border-white/10 relative">
                  {activeChat.image ? (
                    <img src={activeChat.image} alt={activeChat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white font-bold">
                      {activeChat.name[0]}
                    </div>
                  )}
                  {isConnected && (
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-900" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-white block">{activeChat.name}</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {isConnected ? 'متصل الآن' : 'غير متصل'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white transition-all">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white transition-all">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white transition-all">
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-[2rem] shadow-lg ${
                      isMe 
                        ? 'arabgram-gradient text-white rounded-br-md shadow-pink-500/20' 
                        : 'bg-zinc-800 text-white rounded-bl-md border border-white/5'
                    }`}>
                      <p className="text-[15px] leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 pt-2 relative z-10">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-zinc-800/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.3)] focus-within:border-pink-500/50 focus-within:ring-1 focus-within:ring-pink-500/50 transition-all">
                <Smile className="h-6 w-6 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
                <input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="اكتب رسالة..."
                  className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 rounded-full arabgram-gradient flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-5 h-5 text-white -ml-1" />
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-pink-500 animate-spin" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}
