'use client'

import { Pin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Message } from '@/lib/actions/messages'

interface PinnedMessageBannerProps {
  pinnedMessage: Message | null
  onUnpin: (msg: Message) => void
  onJumpTo: (msg: Message) => void
}

export default function PinnedMessageBanner({ pinnedMessage, onUnpin, onJumpTo }: PinnedMessageBannerProps) {
  return (
    <AnimatePresence>
      {pinnedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative z-40 bg-white dark:bg-[#0A0A0A] border-b border-slate-100 dark:border-[#222222] px-5 py-2 flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
          onClick={() => onJumpTo(pinnedMessage)}
        >
          <div className="w-8 h-8 rounded-xl bg-[#8da9c4]/10 flex items-center justify-center text-[#8da9c4]">
            <Pin className="w-4 h-4 fill-[#8da9c4]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-[#8da9c4] uppercase tracking-widest leading-none mb-1">Mensaje Anclado</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{pinnedMessage.content}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onUnpin(pinnedMessage); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
