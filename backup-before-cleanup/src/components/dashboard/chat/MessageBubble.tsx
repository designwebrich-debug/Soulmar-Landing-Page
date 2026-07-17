'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CheckCheck, Reply, Pencil, Trash2, Pin, Copy, Flag, CheckSquare } from 'lucide-react'
import { type Message } from '@/lib/actions/messages'

interface MessageBubbleProps {
  message: Message
  isMine: boolean
  userId: string
  onReply: (msg: Message) => void
  onEdit: (msg: Message) => void
  onDelete: (msg: Message, forAll: boolean) => void
  onPin: (msg: Message) => void
  onReact: (msg: Message, emoji: string) => void
  formatTime: (date: string) => string
  customColor?: string
  repliedMessage?: Message
  isSelectionMode?: boolean
  isSelected?: boolean
  onToggleSelection?: (id: string) => void
  onEnterSelectionMode?: (id: string) => void
}

export default function MessageBubble({
  message,
  isMine,
  userId,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onReact,
  formatTime,
  customColor,
  repliedMessage,
  isSelectionMode,
  isSelected,
  onToggleSelection,
  onEnterSelectionMode
}: MessageBubbleProps) {
  const [showCtxMenu, setShowCtxMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    cerrarTodos()
    
    const MENU_HEIGHT = 300 
    const MENU_WIDTH = 220
    const PADDING = 12
    
    let x = e.clientX
    let y = e.clientY

    if (x + MENU_WIDTH > window.innerWidth - PADDING) x = x - MENU_WIDTH
    if (y + MENU_HEIGHT > window.innerHeight - PADDING) y = y - MENU_HEIGHT

    setMenuPos({ x, y })
    setShowCtxMenu(true)
  }

  const cerrarTodos = useCallback(() => {
    setShowCtxMenu(false)
    setShowEmojiPicker(false)
    setShowDeleteConfirm(false)
  }, [])

  useEffect(() => {
    const handleClose = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) cerrarTodos()
    }
    if (showCtxMenu || showEmojiPicker || showDeleteConfirm) {
      document.addEventListener('mousedown', handleClose)
      window.addEventListener('scroll', cerrarTodos, true)
      return () => {
        document.removeEventListener('mousedown', handleClose)
        window.removeEventListener('scroll', cerrarTodos, true)
      }
    }
  }, [showCtxMenu, showEmojiPicker, showDeleteConfirm, cerrarTodos])

  const confirmarEliminacion = async (forAll: boolean) => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(message, forAll)
      cerrarTodos()
    }, 300)
  }

  if (message.is_deleted && !isDeleting) {
    return (
      <div className={cn("flex mb-4", isMine ? "justify-end" : "justify-start")}>
        <div className="px-4 py-2 rounded-2xl border border-slate-100 dark:border-[#222222] bg-slate-50/50 dark:bg-[#0A0A0A]/50 italic text-slate-400 text-xs">
          {isMine ? 'Eliminaste este mensaje' : 'Este mensaje fue eliminado'}
        </div>
      </div>
    )
  }

  const reactions = message.reactions || []
  const groupedReactions = reactions.reduce((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const hasReactions = Object.keys(groupedReactions).length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDeleting ? 0 : 1, scale: isDeleting ? 0.95 : 1, maxHeight: isDeleting ? 0 : 1000 }}
      className={cn(
        "flex flex-col mb-4 group relative transition-all duration-300", 
        isMine ? "items-end" : "items-start",
        isSelectionMode && "px-4"
      )}
    >
      <div className={cn("flex items-center gap-4 w-full", isMine ? "flex-row-reverse" : "flex-row")}>
        {/* Checkbox de selección */}
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onToggleSelection?.(message.id)}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all",
              isSelected ? "bg-[#8da9c4] border-[#8da9c4] text-white" : "border-slate-200 dark:border-[#333333] bg-transparent"
            )}
          >
            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
          </motion.div>
        )}

      <div 
        className={cn("flex items-end gap-2 max-w-[85%] relative", isMine ? "flex-row-reverse" : "flex-row")}
        onClick={() => isSelectionMode && onToggleSelection?.(message.id)}
      >
        
        {/* --- FIX 01: REACTION TRIGGER (SVG IN CIRCLE) --- */}
        <button
          onClick={() => { cerrarTodos(); setShowEmojiPicker(true); }}
          className={cn(
            "reaction-trigger absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all z-10",
            isMine ? "left-[-40px]" : "right-[-40px]"
          )}
        >
          <div className="reaction-trigger-circle w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500/60 hover:bg-blue-500/20 hover:text-blue-500 hover:scale-110 active:scale-95 transition-all">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
            </svg>
          </div>
        </button>

        {/* --- PICKER TIPO PÍLDORA --- */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className={cn(
                "absolute bottom-[calc(100%+8px)] bg-white dark:bg-[#1A1A1A] rounded-full px-3 py-2 flex gap-1 shadow-2xl border border-slate-100 dark:border-[#222222] z-[100]",
                isMine ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left"
              )}
            >
              {['😀', '👍', '❤️', '🙏', '🔥', '😢'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { onReact(message, emoji); cerrarTodos(); }}
                  className="w-9 h-9 flex items-center justify-center text-xl hover:scale-135 hover:-translate-y-1 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- BURBUJA DE MENSAJE --- */}
        <div
          ref={bubbleRef}
          onContextMenu={handleContextMenu}
          className={cn(
            "relative px-4 py-3 shadow-sm transition-all duration-200 cursor-default",
            isMine ? "rounded-[22px] rounded-br-[4px]" : "rounded-[22px] rounded-bl-[4px]",
            isMine ? (customColor ? "" : "bg-[#c9cba3] text-slate-900") : "bg-white dark:bg-[#1A1A1A] text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-[#222222]",
            hasReactions && "mb-4"
          )}
          style={isMine && customColor ? { background: customColor, color: '#fff' } : {}}
        >
          {repliedMessage && (
            <div className={cn("mb-2 p-2 rounded-lg border-l-4 text-xs bg-black/5 dark:bg-white/5", isMine ? "border-slate-700/30" : "border-[#8da9c4]")}>
              <p className="font-bold opacity-70 truncate">{repliedMessage.sender_id === userId ? 'Tú' : 'Terapeuta'}</p>
              <p className="opacity-50 truncate">{repliedMessage.content}</p>
            </div>
          )}

          <p className="text-[14.5px] leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
          
          <div className="flex items-center gap-1 mt-1 justify-end opacity-60">
            {message.is_edited && <span className="text-[9px] font-medium">(editado)</span>}
            <span className="text-[10px] font-medium">{formatTime(message.created_at)}</span>
            {isMine && (message.read ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Check className="w-3 h-3 text-slate-400" />)}
          </div>

          {/* --- WHATSAPP-STYLE REACTION PILLS --- */}
          {hasReactions && (
            <div className={cn(
              "absolute -bottom-3 flex items-center gap-1 z-10 select-none",
              isMine ? "right-4" : "left-4"
            )}>
              <div className={cn(
                "flex items-center gap-1.5 px-1.5 py-1 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] border transition-all duration-200",
                "bg-white dark:bg-[#202020] border-slate-100 dark:border-white/10"
              )}>
                <div className="flex -space-x-1">
                  {Object.keys(groupedReactions).map((emoji, idx) => (
                    <span 
                      key={emoji} 
                      className="text-[14px] leading-none drop-shadow-sm"
                      style={{ zIndex: 10 - idx }}
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                {reactions.length > 1 && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pr-0.5">
                    {reactions.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* --- FIX 04: CLEANED CONTEXT MENU --- */}
      <AnimatePresence>
        {showCtxMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            style={{ top: menuPos.y, left: menuPos.x }}
            className="fixed z-[9999] bg-white dark:bg-[#1F1F1F] rounded-[10px] shadow-2xl border border-black/5 dark:border-white/5 py-1 min-w-[210px] overflow-hidden"
          >
            <CtxItem icon={<Reply className="w-4 h-4"/>} label="Responder" onClick={() => { onReply(message); cerrarTodos(); }} />
            {isMine && <CtxItem icon={<Pencil className="w-4 h-4"/>} label="Editar" onClick={() => { onEdit(message); cerrarTodos(); }} />}
            <CtxItem icon={<span className="text-sm">😊</span>} label="Reaccionar" onClick={() => { setShowEmojiPicker(true); setShowCtxMenu(false); }} />
            <CtxItem icon={<Pin className="w-4 h-4"/>} label="Fijar" onClick={() => { onPin(message); cerrarTodos(); }} />
            <CtxItem icon={<Copy className="w-4 h-4"/>} label="Copiar" onClick={() => { navigator.clipboard.writeText(message.content); cerrarTodos(); }} />
            <CtxItem icon={<Flag className="w-4 h-4"/>} label="Reportar" onClick={() => cerrarTodos()} />
            <div className="h-[0.5px] bg-slate-100 dark:bg-white/10 my-1 mx-1" />
            <CtxItem icon={<Trash2 className="w-4 h-4 text-red-500"/>} label="Eliminar" danger onClick={() => setShowDeleteConfirm(true)} />
            <CtxItem icon={<CheckSquare className="w-4 h-4"/>} label="Seleccionar mensajes" onClick={() => { onEnterSelectionMode?.(message.id); cerrarTodos(); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUBMENÚ ELIMINACIÓN */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] min-w-[240px] overflow-hidden border border-black/5 dark:border-white/10"
          >
            <div className="p-4 border-b border-slate-50 dark:border-white/5"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">¿Eliminar mensaje?</p></div>
            <button onClick={() => confirmarEliminacion(false)} className="w-full p-4 text-sm text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Eliminar para mí</button>
            {isMine && <button onClick={() => confirmarEliminacion(true)} className="w-full p-4 text-sm text-left text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-slate-50 dark:border-white/5">Eliminar para todos</button>}
            <button onClick={cerrarTodos} className="w-full p-4 text-sm text-center text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-t border-slate-50 dark:border-white/5">Cancelar</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CtxItem({ icon, label, onClick, danger }: { icon: any, label: string, onClick: () => void, danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-white/5", danger ? "text-red-500 font-medium" : "text-slate-700 dark:text-slate-200")}>
      <span className="flex-shrink-0 opacity-70">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  )
}
