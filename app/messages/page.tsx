'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, Search, Phone, Video, Send, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const currentUserId = session?.user?.id

  const { messages, isConnected, typingUsers, sendMessage, setTyping } = useRealtimeChat(
    currentUserId || '',
    activeChat?.id || ''
  )

  if (!session) return <div className="flex items-center justify-center min-h-screen text-muted-foreground">Sign in to view messages</div>

  useEffect(() => {
    fetchChatUsers()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatUsers = async () => {
    // TODO: Fetch real chat users from API
    setChatUsers([
      {
        id: 'user1',
        name: 'Sarah Ahmed',
        username: 'sarah_ahmed',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        lastMessage: 'Hey! Saw your story 🔥',
        updatedAt: '2m ago'
      },
      {
        id: 'user2',
        name: 'Mohammed Ali',
        username: 'moh_ali92',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        lastMessage: 'Thanks for the follow!',
        updatedAt: '1h ago'
      }
    ])
    setLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChat || !currentUserId) return

    await sendMessage(newMessage, session.user?.name, session.user?.image)
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return <div className="container mx-auto p-8 text-center">Loading messages...</div>

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="border-b bg-white/80 backdrop-blur p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-7 w-7" />
          Messages
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-80 border-r bg-white/70 backdrop-blur flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages" className="pl-10" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-1">
            {chatUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer border-l-4 border-transparent hover:border-indigo-500 ${
                  activeChat?.id === user.id ? 'bg-indigo-100 border-indigo-500 font-medium' : ''
                }`}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="bg-indigo-500 text-white font-semibold">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-tight">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right min-w-[60px]">
                  {user.updatedAt}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p>Choose from your recent messages</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="border-b bg-white/80 backdrop-blur p-4 flex items-center gap-3 sticky top-0 z-10">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={activeChat.image} />
                  <AvatarFallback className="bg-indigo-500 text-white font-semibold">{activeChat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{activeChat.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {isConnected ? '🟢 متصل' : '⚪ غير متصل'}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="hover:bg-green-500/10">
                    <Phone className="h-5 w-5 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="hover:bg-purple-500/10">
                    <Video className="h-5 w-5 text-purple-600" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl shadow-sm ${
                        msg.senderId === currentUserId 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                          : 'bg-white border'
                      }`}>
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className={`text-xs mt-1 opacity-75 ${
                          msg.senderId === currentUserId ? 'text-indigo-100' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {typingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-2xl p-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="border-t bg-white/80 backdrop-blur p-4 sticky bottom-0">
                <div className="flex items-end gap-2">
                  <Input
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 min-h-[44px] resize-none"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!isConnected}
                    className="h-12 w-12 shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg disabled:opacity-50"
                  >
                    {isConnected ? (
                      <Send className="h-5 w-5" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
