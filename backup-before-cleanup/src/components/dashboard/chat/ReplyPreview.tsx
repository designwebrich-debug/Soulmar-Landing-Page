'use client'

import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { type Message } from '@/lib/actions/messages'

interface ReplyPreviewProps {
  message: Message | null
  onCancel: () => void
}

export default function ReplyPreview({ message, onCancel }: ReplyPreviewProps) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-50 dark:bg-[#0F0F0F] border-t border-slate-100 dark:border-[#222222] px-4 py-2 flex items-center gap-3 overflow-hidden"
    >
      <div className="flex-1 min-w-0 border-l-4 border-[#8da9c4] pl-3 py-1">
        <p className="text-[10px] font-black text-[#8da9c4] uppercase tracking-widest">
          Respondiendo a
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {message.content}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="w-7 h-7 rounded-full bg-slate-200 dark:bg-[#222222] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}
