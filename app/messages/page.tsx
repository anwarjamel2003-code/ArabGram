'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Search, Phone, Video, Send, Loader2, ArrowRight, Plus, PhoneCall } from 'lucide-react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import Image from 'next/image'

interface ChatUser {
  id: string
  name: string
  username: string
  image: string
  lastMessage: string
  updatedAt: string
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCallUI, setShowCallUI] = useState<'voice' | 'video' | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const currentUserId = (session?.user as any)?.id

  const { messages, isConnected, typingUsers, sendMessage, setTyping } = useRealtimeChat(
    currentUserId || '',
    activeChat?.id || ''
  )

  // Fetch real chat users from API
  const fetchChatUsers = useCallback(async () => {
    if (!currentUserId) return
    try {
      const res = await fetch('/api/messages')
      if (res.ok) {
        const data = await res.json()
        // Group messages by conversation partner
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
        setChatUsers(Array.from(usersMap.values()))
      }
    } catch (error) {
      console.error('Failed to fetch chats', error)
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    if (currentUserId) fetchChatUsers()
  }, [currentUserId, fetchChatUsers])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load conversation history when switching chats
  useEffect(() => {
    if (activeChat?.id && currentUserId) {
      loadConversation(activeChat.id)
    }
  }, [activeChat?.id])

  const loadConversation = async (otherUserId: string) => {
    try {
      const res = await fetch(`/api/messages?otherUserId=${otherUserId}`)
      if (res.ok) {
        // Messages will come from the realtime hook + API
      }
    } catch (err) {
      console.error('Failed to load conversation')
    }
  }

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

  const handleStartCall = (type: 'voice' | 'video') => {
    if (!activeChat) return
    setShowCallUI(type)
    // Create call via API
    fetch('/api/calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: activeChat.id, type })
    }).then(res => {
      if (res.ok) return res.json()
    }).then(call => {
      if (call) {
        console.log('[CALL] Started:', call.id)
        // The VideoCall component will handle the rest via WebRTC
      }
    }).catch(err => {
      console.error('Call failed', err)
      setShowCallUI(null)
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
        <div className="text-center glass-card p-12 rounded-[2.5rem]">
          <MessageCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">سجّل دخولك</h2>
          <p className="text-slate-500">لعرض رسائلك</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl arabgram-gradient flex items-center justify-center shadow-lg">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="arabgram-text-gradient">الرسائل</span>
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-80 border-l border-slate-100 bg-white/70 backdrop-blur flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="بحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pr-10 pl-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          {/* Chat Users List */}
          <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
            {chatUsers.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium text-sm">لا توجد محادثات بعد</p>
                <p className="text-slate-400 text-xs mt-1">ابدأ محادثة من الملف الشخصي لأي مستخدم</p>
              </div>
            ) : (
              chatUsers
                .filter(u => u.name.includes(searchQuery) || u.username.includes(searchQuery))
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setActiveChat(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                      activeChat?.id === user.id
                        ? 'bg-brand-primary/10 border border-brand-primary/20 shadow-sm'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white font-bold">
                          {user.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="font-bold text-sm text-slate-900 leading-tight">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.lastMessage}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium min-w-[50px] text-left">
                      {user.updatedAt}
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">اختر محادثة</h3>
                <p className="text-slate-500 text-sm">اختر من محادثاتك أو ابدأ محادثة جديدة</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b border-slate-100 bg-white/80 backdrop-blur-xl p-4 flex items-center gap-3 sticky top-0 z-10">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 shadow-sm">
                  {activeChat.image ? (
                    <img src={activeChat.image} alt={activeChat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center arabgram-gradient text-white font-bold">
                      {activeChat.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{activeChat.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {isConnected ? '🟢 متصل الآن' : '@' + activeChat.username}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleStartCall('voice')}
                    className="p-2.5 rounded-xl hover:bg-green-50 text-green-600 transition-all"
                    title="مكالمة صوتية"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleStartCall('video')}
                    className="p-2.5 rounded-xl hover:bg-purple-50 text-purple-600 transition-all"
                    title="مكالمة فيديو"
                  >
                    <Video className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-16">
                    <MessageCircle className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">لا توجد رسائل بعد</p>
                    <p className="text-sm mt-1">ابدأ المحادثة الآن!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        msg.senderId === currentUserId
                          ? 'arabgram-gradient text-white rounded-br-md'
                          : 'bg-white border border-slate-100 text-slate-900 rounded-bl-md'
                      }`}>
                        <p className="text-sm break-words leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-1.5 font-medium ${
                          msg.senderId === currentUserId ? 'text-white/70' : 'text-slate-400'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-end">
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="border-t border-slate-100 bg-white/80 backdrop-blur-xl p-4 sticky bottom-0">
                <div className="flex items-end gap-2">
                  <input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="h-12 w-12 shrink-0 arabgram-gradient rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
