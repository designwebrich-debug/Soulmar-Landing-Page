"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Send, User, Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  is_read: boolean
}

interface TherapistChatProps {
  currentUserId: string
  receiverId: string
  receiverName: string
}

export default function TherapistChat({ currentUserId, receiverId, receiverName }: TherapistChatProps) {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [receiverProfile, setReceiverProfile] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch initial messages and profile
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_status, status_color')
        .eq('id', receiverId)
        .single()
      if (!error && data) {
        setReceiverProfile(data)
      }
    }

    fetchMessages()
    fetchProfile()

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${receiverId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}` 
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, receiverId, supabase])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const tempMsg: Partial<Message> = {
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: newMessage,
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([tempMsg])
      .select()
      .single()

    if (!error && data) {
      setMessages(prev => [...prev, data as Message])
      setNewMessage("")
    }
    setIsSending(false)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] border border-slate-100 dark:border-[#1A1A1A] overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 dark:border-[#1A1A1A] flex items-center justify-between bg-slate-50/50 dark:bg-[#111111]/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#8da9c4] flex items-center justify-center text-white font-bold" style={{ backgroundColor: receiverProfile?.status_color || '#8da9c4' }}>
            {receiverName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{receiverName}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: receiverProfile?.status_color || '#10b981' }} />
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: receiverProfile?.status_color || '#10b981' }}>
                {receiverProfile?.profile_status || t('dashboard.chat.online')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('/grid-light.svg')] dark:bg-[url('/grid-dark.svg')] bg-repeat"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm shadow-sm",
                  isMe 
                    ? "bg-[#8da9c4] text-white rounded-tr-none" 
                    : "bg-white dark:bg-[#151515] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-[#222222] rounded-tl-none"
                )}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={cn(
                    "flex items-center gap-1 mt-2 text-[10px]",
                    isMe ? "text-white/60 justify-end" : "text-slate-400 justify-start"
                  )}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && (msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-6 bg-slate-50/50 dark:bg-[#111111]/50 border-t border-slate-50 dark:border-[#1A1A1A]">
        <div className="relative flex items-center gap-4">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('dashboard.chat.placeholder')}
            className="flex-1 h-14 bg-white dark:bg-[#050505] rounded-2xl px-6 text-sm font-medium outline-none border border-slate-200 dark:border-[#222222] focus:border-[#8da9c4] transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="w-14 h-14 rounded-2xl bg-[#8da9c4] text-white flex items-center justify-center hover:bg-[#7392ad] transition-all shadow-lg shadow-[#8da9c4]/20 disabled:opacity-50 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
