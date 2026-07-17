"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MoodTracker } from "./MoodTracker"
import { WellbeingChart } from "./WellbeingChart"
import { getWellbeingHistory, WellbeingEntry } from "@/lib/actions/wellbeing"
import { TrendingUp, Activity, Heart, Brain } from "lucide-react"

interface ProgressSectionProps {
  language: string
  t: (key: string, options?: any) => any
}

export function ProgressSection({ language, t }: ProgressSectionProps) {
  const [history, setHistory] = useState<WellbeingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistory = async () => {
    try {
      const data = await getWellbeingHistory(7)
      setHistory(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
      {/* Mood Logging Card */}
      <div className="lg:col-span-1 bg-white dark:bg-[#111111] rounded-[3.5rem] p-10 border border-slate-100 dark:border-[#222222] shadow-sm flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8da9c4]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#8da9c4]/10 transition-colors duration-700" />
        <MoodTracker onLogged={loadHistory} t={t} />
      </div>

      {/* Analytics Chart Card */}
      <div className="lg:col-span-2 bg-white dark:bg-[#111111] rounded-[3.5rem] p-10 border border-slate-100 dark:border-[#222222] shadow-sm flex flex-col space-y-8 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#0A0A0A] flex items-center justify-center text-slate-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">Tu Evolución</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Últimos 7 días</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-tighter">Estado Promedio</span>
                <span className="text-2xl font-bold text-slate-950 dark:text-white">
                  {history.length > 0 
                    ? (history.reduce((acc, c) => acc + c.mood_score, 0) / history.length).toFixed(1) 
                    : "0.0"}
                </span>
             </div>
             <div className="w-[1px] h-10 bg-slate-100 dark:bg-[#222222]" />
             <Activity className="w-8 h-8 text-emerald-500/20" />
          </div>
        </div>

        {isLoading ? (
          <div className="h-[200px] w-full bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] animate-pulse" />
        ) : (
          <WellbeingChart data={history} language={language} />
        )}
      </div>
    </section>
  )
}
