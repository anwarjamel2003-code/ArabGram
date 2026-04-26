'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Search, Phone, Video, Send, Loader2, Info } from 'lucide-react'
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

        // Handle initial user ID from URL
        if (initialUserId) {
          const existingUser = usersArray.find(u => u.id === initialUserId)
          if (existingUser) {
            setActiveChat(existingUser)
          } else {
            // Need to fetch user details to add them to the list
            try {
              // Since we don't have a direct /api/users/[id] endpoint we might just need to pass username in URL instead,
              // but we will create a temporary user object that gets updated.
              setActiveChat({
                id: initialUserId,
                name: "مستخدم",
                username: "مستخدم",
                image: "",
                lastMessage: "",
                updatedAt: ""
              })
            } catch (err) {}
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
      <div className="flex-1 flex items-center justify-center bg-white" dir="rtl">
        <div className="text-center">
          <MessageCircle className="h-24 w-24 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">سجّل دخولك</h2>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-56px)] md:h-screen flex bg-white" dir="rtl">
      
      {/* Left (RTL) - Chat List */}
      <div className={`w-full md:w-[350px] border-l border-slate-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-center px-4 font-bold text-lg">
          {(session?.user as any)?.username || 'الرسائل'}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.length === 0 && !activeChat ? (
            <div className="text-center py-10 text-slate-500">لا توجد رسائل</div>
          ) : (
            chatUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors ${
                  activeChat?.id === user.id ? 'bg-slate-50' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-lg">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-semibold text-sm text-slate-900 truncate">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right (RTL) - Chat Window */}
      <div className={`flex-1 flex flex-col bg-white ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">رسائلك</h3>
              <p className="text-slate-500 text-sm mb-6">أرسل صوراً ورسائل خاصة لصديق.</p>
              <button className="btn-primary">إرسال رسالة</button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-900 p-2">
                  &rarr;
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  {activeChat.image ? (
                    <img src={activeChat.image} alt={activeChat.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                      {activeChat.name[0]}
                    </div>
                  )}
                </div>
                <span className="font-semibold">{activeChat.name}</span>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 stroke-[1.5px] cursor-pointer hover:opacity-50" />
                <Video className="h-6 w-6 stroke-[1.5px] cursor-pointer hover:opacity-50" />
                <Info className="h-6 w-6 stroke-[1.5px] cursor-pointer hover:opacity-50" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-3xl ${
                      isMe 
                        ? 'bg-slate-200 text-slate-900' 
                        : 'bg-white border border-slate-200 text-slate-900'
                    }`}>
                      <p className="text-[15px]">{msg.text}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 bg-white">
                <Smile className="h-6 w-6 text-slate-900 shrink-0 cursor-pointer" />
                <input
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="مراسلة..."
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="font-semibold text-brand-primary disabled:opacity-50 disabled:cursor-default"
                >
                  إرسال
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
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}
