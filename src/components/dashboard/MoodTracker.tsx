"use client"

// Deployment trigger for restoration
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { saveWellbeingEntry } from "@/lib/actions/wellbeing"
import { Smile, Frown, Meh, SmileIcon, Laugh, Check, Zap, Brain, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const MOODS = (t: any) => [
  { score: 1, icon: Frown, label: t('dashboard.user.mood_low', { defaultValue: "Mal" }), color: "bg-red-500", shadow: "shadow-red-500/20" },
  { score: 2, icon: Meh, label: t('dashboard.user.mood_mid', { defaultValue: "Regular" }), color: "bg-orange-500", shadow: "shadow-orange-500/20" },
  { score: 3, icon: Smile, label: t('dashboard.user.mood_ok', { defaultValue: "Bien" }), color: "bg-[#8da9c4]", shadow: "shadow-[#8da9c4]/20" },
  { score: 5, icon: Laugh, label: t('dashboard.user.mood_great', { defaultValue: "Excelente" }), color: "bg-[#1D9E75]", shadow: "shadow-[#1D9E75]/20" },
]

export function MoodTracker({ onLogged, t }: { onLogged?: () => void, t: any }) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSave = async (score: number) => {
    setSelectedMood(score)
    setIsSaving(true)
    try {
      await saveWellbeingEntry({
        mood_score: score,
        energy_level: 3, // Default for now
        stress_level: 3  // Default for now
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        if (onLogged) onLogged()
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h3 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">{t('dashboard.user.mood_title', { defaultValue: "¿Cómo te sientes hoy?" })}</h3>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{t('dashboard.user.mood_subtitle', { defaultValue: "Registra tu bienestar diario" })}</p>
      </div>

      <div className="flex justify-between items-center gap-2 max-w-sm mx-auto">
        {MOODS(t).map((mood) => {
          const Icon = mood.icon
          const isActive = selectedMood === mood.score

          return (
            <button
              key={mood.score}
              disabled={isSaving || isSuccess}
              onClick={() => handleSave(mood.score)}
              className="flex flex-col items-center gap-3 group outline-none"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                  isActive ? mood.color : "bg-slate-50 dark:bg-[#0A0A0A] group-hover:bg-slate-100 dark:group-hover:bg-[#151515]",
                  isActive ? mood.shadow : "shadow-sm",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                )}
              >
                {isActive && isSuccess ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </motion.div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter transition-colors",
                isActive ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-700"
              )}>
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
