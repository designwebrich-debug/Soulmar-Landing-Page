'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X, Send, Smile, Palette, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  getConversation,
  sendMessage,
  markMessagesAsRead,
  reactToMessage,
  editMessage,
  deleteMessage,
  togglePinMessage,
  updateChatColorPreference,
  type Message
} from '@/lib/actions/messages'
import { CHAT_CACHE, setCachedMessages, initCache } from '@/lib/chat-cache'
import { ALL_THERAPIST_IDS } from '@/lib/constants'
import MessageBubble from './chat/MessageBubble'
import ReplyPreview from './chat/ReplyPreview'
import PinnedMessageBanner from './chat/PinnedMessageBanner'
import { useAuth } from '@/context/AuthContext'

const QUICK_EMOJIS = ['😊', '👍', '❤️', '🙏', '😄', '💪', '🌟', '✨', '🤗', '😌', '🎉', '💚', '☀️', '🧘', '💭', '🫶']

const CHAT_COLORS = [
  { name: 'Azul Soulmar', color: '#8da9c4' },
  { name: 'Verde Soulmar', color: '#c9cba3' },
  { name: 'Amarillo Soulmar', color: '#ffc971' },
  { name: 'Brisa Soulmar', color: 'linear-gradient(135deg, #8da9c4 0%, #ffc971 100%)' },
  { name: 'Ocaso Soulmar', color: 'linear-gradient(135deg, #ffc971 0%, #c9cba3 100%)' },
  { name: 'Selva Soulmar', color: 'linear-gradient(135deg, #c9cba3 0%, #8da9c4 100%)' },
  { name: 'Gris Oscuro', color: '#334155' },
  { name: 'Gris Claro', color: '#94a3b8' },
  { name: 'Soulmar Night', color: '#000000' },
]

interface Therapist {
  name: string
  role: string
  img: string
  id: string
}

interface ChatSlideOverProps {
  isOpen: boolean
  onClose: () => void
  therapist: Therapist | null
  userId: string
  t: (key: string, options?: Record<string, unknown>) => string
}


export default function ChatSlideOver({ isOpen, onClose, therapist, userId, t }: ChatSlideOverProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(therapist?.id ? (CHAT_CACHE[therapist.id] || []) : [])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojis, setShowEmojis] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)
  const isSendingRef = useRef(false)
  
  // Cache local para carga instantánea
  useEffect(() => {
    if (typeof window !== 'undefined' && therapist?.id) {
      const saved = localStorage.getItem('soulmar_chat_cache')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          Object.assign(CHAT_CACHE, parsed)
          if (CHAT_CACHE[therapist.id] && messages.length === 0) {
            setMessages(CHAT_CACHE[therapist.id])
          }
        } catch (e) {
          console.error("Error loading chat cache", e)
        }
      }
    }
  }, [therapist?.id])
  
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [chatColor, setChatColor] = useState<string>(user?.chat_color_preference || '')
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([])
  const [isDeletingSelected, setIsDeletingSelected] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cache local para carga instantánea
  const [cacheLoaded, setCacheLoaded] = useState(false)

  // Sincronizar con Cache
  useEffect(() => {
    if (therapist?.id && messages.length > 0) {
      setCachedMessages(therapist.id, messages)
    }
  }, [messages, therapist?.id])

  // Load conversation
  useEffect(() => {
    if (isOpen && therapist?.id && userId) {
      // Si ya hay mensajes en cache, no mostramos el loader principal
      const hasCache = (CHAT_CACHE[therapist.id]?.length || 0) > 0
      if (!hasCache) setIsLoading(true)
      
      const safetyTimer = setTimeout(() => setIsLoading(false), 5000)
      
      getConversation(userId, therapist.id)
        .then(msgs => {
          if (JSON.stringify(msgs) !== JSON.stringify(messages)) {
            setMessages(msgs)
            setCachedMessages(therapist.id!, msgs)
          }
        })
        .catch(err => {
          console.error("[CHAT] Critical fetch error:", err)
          if (therapist?.id) delete CHAT_CACHE[therapist.id]
        })
        .finally(() => {
          clearTimeout(safetyTimer)
          setIsLoading(false)
          markMessagesAsRead(userId, therapist.id!).catch(() => {})
        })
      
      return () => clearTimeout(safetyTimer)
    } else {
      setIsLoading(false)
    }
  }, [isOpen, therapist?.id, userId])

  const handleRefresh = async () => {
    if (!therapist?.id || !userId) return
    const safetyTimer = setTimeout(() => setIsLoading(false), 5000)
    
    try {
      setIsLoading(true)
      const msgs = await getConversation(userId, therapist.id)
      setMessages(msgs)
      setCachedMessages(therapist.id, msgs)
    } catch (err) {
      console.error("[CHAT] Refresh error:", err)
    } finally {
      clearTimeout(safetyTimer)
      setIsLoading(false)
      markMessagesAsRead(userId, therapist.id).catch(() => {})
    }
  }

  useEffect(() => {
    if (user?.chat_color_preference) {
      setChatColor(user.chat_color_preference)
    }
  }, [user?.chat_color_preference])

  // Real-time subscription
  useEffect(() => {
    if (!isOpen || !therapist?.id || !userId) return

    const supabase = createClient()
    const channel = supabase
      .channel(`chat-${userId}-${therapist.id}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId === therapist.id) {
          setOtherUserTyping(payload.isTyping)
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          const oldMsg = payload.old as Message;
          
          const isRelevant = 
            (newMsg && ((newMsg.sender_id === userId && newMsg.receiver_id === therapist.id) || (newMsg.sender_id === therapist.id && newMsg.receiver_id === userId))) ||
            (oldMsg && ((oldMsg.sender_id === userId && oldMsg.receiver_id === therapist.id) || (oldMsg.sender_id === therapist.id && oldMsg.receiver_id === userId)));

          if (!isRelevant) return;

          if (payload.eventType === 'INSERT') {
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            if (newMsg.sender_id === therapist.id) {
              markMessagesAsRead(userId, therapist.id)
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Message
            if (updatedMsg.is_deleted) {
              setMessages(prev => prev.filter(m => m.id !== updatedMsg.id))
            } else {
              setMessages(prev => prev.map(m => 
                m.id === updatedMsg.id ? { ...updatedMsg, read: !!(updatedMsg as any).read } : m
              ))
            }
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(m => m.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, therapist?.id, userId])

  const handleTyping = () => {
    if (!channelRef.current) return
    if (!isTyping) {
      setIsTyping(true)
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, isTyping: true }
      })
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      channelRef.current?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, isTyping: false }
      })
    }, 3000)
  }

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // --- FIX 03: ROBUT HANDLE SEND (NO BOUNCE/DUPLICATION) ---
  const handleSend = useCallback(async () => {
    const content = newMessage.trim()
    if (!content || !therapist?.id || isSendingRef.current) return

    isSendingRef.current = true
    setIsSending(true)

    const currentReplyTo = replyingTo?.id
    const currentEditingId = editingMessage?.id

    // LIMPIAR INMEDIATAMENTE EL ESTADO (Orden crítico)
    setNewMessage('')
    setReplyingTo(null)
    setEditingMessage(null)
    setShowEmojis(false)

    if (currentEditingId) {
      // Optimistic Update for Edit
      setMessages(prev => prev.map(m => 
        m.id === currentEditingId ? { ...m, content, is_edited: true } : m
      ))

      const result = await editMessage(currentEditingId, content)
      if (!result.success) {
        // Revert on failure
        setMessages(prev => prev.map(m => 
          m.id === currentEditingId ? editingMessage! : m
        ))
        setNewMessage(content)
        setEditingMessage(editingMessage)
      }
    } else {
      // Optimistic Update
      const optimisticId = `temp-${Date.now()}`
      const optimisticMsg: Message = {
        id: optimisticId,
        sender_id: userId,
        receiver_id: therapist.id,
        content: content,
        read: false,
        created_at: new Date().toISOString(),
        reply_to: currentReplyTo
      }
      setMessages(prev => [...prev, optimisticMsg])

      try {
        const result = await sendMessage(userId, therapist.id, content, currentReplyTo)
        if (result.success && result.data) {
          setMessages(prev => prev.map(m => m.id === optimisticId ? result.data : m))
        } else {
          // Si falla, revertimos con precaución
          setMessages(prev => prev.filter(m => m.id !== optimisticId))
          setNewMessage(content)
          if (currentReplyTo) {
             const originalReply = messages.find(m => m.id === currentReplyTo)
             if (originalReply) setReplyingTo(originalReply)
          }
        }
      } catch (error) {
        setMessages(prev => prev.filter(m => m.id !== optimisticId))
        setNewMessage(content)
      }
    }

    setIsSending(false)
    isSendingRef.current = false
    inputRef.current?.focus()
  }, [newMessage, therapist?.id, userId, replyingTo, editingMessage, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Escape') {
      setReplyingTo(null)
      setEditingMessage(null)
      setNewMessage('')
    }
  }

  const handleEdit = (msg: Message) => {
    setEditingMessage(msg)
    setNewMessage(msg.content)
    setReplyingTo(null)
    inputRef.current?.focus()
  }

  const handleReact = async (msg: Message, emoji: string) => {
    // Optimistic Update
    setMessages(prev => prev.map(m => {
      if (m.id === msg.id) {
        let reactions = [...(m.reactions || [])]
        const existingIdx = reactions.findIndex(r => r.user_id === userId)
        
        if (existingIdx > -1) {
          if (reactions[existingIdx].emoji === emoji) {
            reactions.splice(existingIdx, 1)
          } else {
            reactions[existingIdx] = { ...reactions[existingIdx], emoji }
          }
        } else {
          reactions.push({ user_id: userId, emoji })
        }
        return { ...m, reactions }
      }
      return m
    }))

    const result = await reactToMessage(msg.id, userId, emoji)
    if (!result.success) {
      // Revert if failed (though in real-time it might be overwritten soon)
      // For simplicity, we just log here or we could fetch again
      console.error("Failed to react:", result.error)
    }
  }

  const handleDelete = async (msg: Message, forAll: boolean) => {
    // Optimistic remove
    setMessages(prev => prev.filter(m => m.id !== msg.id))
    await deleteMessage(msg.id, userId, forAll)
  }

  const handlePin = async (msg: Message) => {
    const newStatus = !msg.is_pinned
    
    // Optimistic Update
    setMessages(prev => prev.map(m => ({
      ...m,
      is_pinned: m.id === msg.id ? newStatus : false
    })))

    const result = await togglePinMessage(msg.id, newStatus)
    if (!result.success) {
      // Revert on failure
      setMessages(prev => prev.map(m => ({
        ...m,
        is_pinned: m.id === msg.id ? !newStatus : m.is_pinned // This is a bit simplified
      })))
    }
  }

  const handleColorChange = async (color: string) => {
    setChatColor(color)
    await updateChatColorPreference(userId, color)
    setShowColors(false)
  }

  const toggleMessageSelection = (id: string) => {
    setSelectedMessageIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    )
  }

  const enterSelectionMode = (initialId: string) => {
    setIsSelectionMode(true)
    setSelectedMessageIds([initialId])
  }

  const handleDeleteSelected = async (forAll: boolean) => {
    if (selectedMessageIds.length === 0) return
    setIsDeletingSelected(true)
    
    // Optimistic Update
    const idsToRemove = [...selectedMessageIds]
    setMessages(prev => prev.filter(m => !idsToRemove.includes(m.id)))
    setIsSelectionMode(false)
    setSelectedMessageIds([])

    const result = await deleteMessages(idsToRemove, userId, forAll)
    if (!result.success) {
      // En una app real aquí recargaríamos o mostraríamos error
      console.error("Error deleting selected:", result.error)
      handleRefresh()
    }
    setIsDeletingSelected(false)
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateSeparator = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Hoy'
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
  }

  const groupedMessages: { date: string; messages: Message[] }[] = []
  messages.forEach(msg => {
    const date = new Date(msg.created_at).toDateString()
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date, messages: [msg] })
    }
  })

  const pinnedMessage = messages.find(m => m.is_pinned) || null

  if (!therapist) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#0A0A0A] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-slate-100 dark:border-[#222222] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md z-10">
              <div className="w-12 h-12 rounded-2xl overflow-hidden relative flex-shrink-0 shadow-sm">
                <Image src={therapist.img} alt={therapist.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{therapist.name}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {t('dashboard.chat.online', { defaultValue: 'EN LÍNEA' })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowColors(!showColors)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    showColors ? "bg-slate-100 dark:bg-[#222222] text-[#8da9c4]" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <Palette className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111111] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showColors && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-20 right-5 z-50 w-48 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#222222] p-4"
                >
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Color del Chat</p>
                  <div className="grid grid-cols-3 gap-2">
                    {CHAT_COLORS.map(c => (
                      <button
                        key={c.color}
                        onClick={() => handleColorChange(c.color)}
                        className={cn(
                          "w-full aspect-square rounded-xl transition-all hover:scale-110",
                          chatColor === c.color ? "ring-2 ring-slate-400 ring-offset-2 dark:ring-offset-[#1A1A1A]" : ""
                        )}
                        style={{ background: c.color }}
                        title={c.name}
                      />
                    ))}
                    <button
                      onClick={() => handleColorChange('')}
                      className="w-full aspect-square rounded-xl bg-slate-100 dark:bg-[#222222] flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      title="Default"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <PinnedMessageBanner 
              pinnedMessage={pinnedMessage} 
              onUnpin={handlePin}
              onJumpTo={(msg) => document.getElementById(`msg-${msg.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            />

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar relative">
              {isLoading ? (
                <div className="space-y-4 py-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "h-12 rounded-2xl animate-pulse shadow-sm",
                        i % 2 === 0 ? "w-48 bg-slate-200 dark:bg-[#222222]" : "w-56 bg-slate-100 dark:bg-[#111111]"
                      )} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#8da9c4]/20 to-[#c9cba3]/20 flex items-center justify-center mb-6">
                    <Send className="w-8 h-8 text-[#8da9c4]" />
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {t('dashboard.chat.empty_title', { defaultValue: '¡Inicia la conversación!' })}
                  </p>
                  <p className="text-sm text-slate-400 max-w-[200px]">
                    {t('dashboard.chat.empty_subtitle', { defaultValue: `Envía un mensaje a ${therapist.name}`, therapistName: therapist.name })}
                  </p>
                </div>
              ) : (
                groupedMessages.map((group, gi) => (
                  <div key={gi} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-100 dark:bg-[#222222]" />
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                        {formatDateSeparator(group.messages[0].created_at)}
                      </span>
                      <div className="flex-1 h-px bg-slate-100 dark:bg-[#222222]" />
                    </div>

                    {group.messages.map((msg) => (
                      <div id={`msg-${msg.id}`} key={msg.id}>
                        <MessageBubble
                          message={msg}
                          isMine={msg.sender_id === userId}
                          userId={userId}
                          onReply={setReplyingTo}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onPin={handlePin}
                          onReact={handleReact}
                          formatTime={formatTime}
                          customColor={chatColor}
                          repliedMessage={messages.find(m => m.id === msg.reply_to)}
                          isSelectionMode={isSelectionMode}
                          isSelected={selectedMessageIds.includes(msg.id)}
                          onToggleSelection={toggleMessageSelection}
                          onEnterSelectionMode={enterSelectionMode}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
              {otherUserTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#8da9c4] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#8da9c4] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#8da9c4] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{therapist.name.split(' ')[0]} escribiendo...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-col border-t border-slate-100 dark:border-[#222222] bg-white dark:bg-[#0A0A0A]">
              <AnimatePresence>
                {isSelectionMode ? (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="p-4 bg-slate-50 dark:bg-[#111111] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => { setIsSelectionMode(false); setSelectedMessageIds([]); }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedMessageIds.length} seleccionados
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteSelected(false)}
                        disabled={selectedMessageIds.length === 0 || isDeletingSelected}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-[#222222] text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        Eliminar para mí
                      </button>
                      <button
                        onClick={() => handleDeleteSelected(true)}
                        disabled={selectedMessageIds.length === 0 || isDeletingSelected}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                      >
                        Eliminar para todos
                      </button>
                    </div>
                  </motion.div>
                ) : replyingTo ? (
                  <ReplyPreview message={replyingTo} onCancel={() => setReplyingTo(null)} />
                ) : editingMessage ? (
                  <div className="bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/20 px-4 py-2 flex items-center justify-between">
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Palette className="w-3 h-3" /> Editando mensaje...
                    </p>
                    <button onClick={() => { setEditingMessage(null); setNewMessage(''); }} className="text-xs font-bold text-amber-600 uppercase tracking-widest">Cancelar</button>
                  </div>
                ) : null}
              </AnimatePresence>

              <div className="p-4 flex items-center gap-3">
                <div className="flex-1 relative flex items-center bg-slate-50 dark:bg-[#111111] rounded-[1.5rem] px-4 py-1.5 border border-slate-100 dark:border-[#222222] focus-within:border-[#8da9c4] focus-within:ring-4 focus-within:ring-[#8da9c4]/10 transition-all">
                  <button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className={cn(
                      "p-2 rounded-xl transition-colors flex-shrink-0",
                      showEmojis ? "text-[#8da9c4] bg-[#8da9c4]/10" : "text-slate-300 hover:text-slate-500"
                    )}
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                      handleTyping()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={editingMessage ? 'Editar mensaje...' : t('dashboard.chat.placeholder', { defaultValue: 'Escribe un mensaje...' })}
                    className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 outline-none py-2.5 px-2"
                    disabled={isSending}
                  />
                  <AnimatePresence>
                    {showEmojis && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full mb-4 left-0 z-50 p-2 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#222222] flex flex-wrap gap-1 max-w-[240px]"
                      >
                        {QUICK_EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => { setNewMessage(prev => prev + emoji); setShowEmojis(false); inputRef.current?.focus(); }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-slate-50 dark:hover:bg-[#222222] transition-transform active:scale-90"
                          >
                            {emoji}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || isSending}
                  className={cn(
                    "w-12 h-12 rounded-2xl transition-all flex items-center justify-center flex-shrink-0",
                    newMessage.trim()
                      ? "bg-[#8da9c4] text-white shadow-lg shadow-[#8da9c4]/30 hover:scale-105 active:scale-95"
                      : "bg-slate-100 dark:bg-[#111111] text-slate-300 dark:text-slate-600"
                  )}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
