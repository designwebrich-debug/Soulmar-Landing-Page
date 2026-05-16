"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop
} from "recharts"
import { WellbeingEntry } from "@/lib/actions/wellbeing"

interface WellbeingChartProps {
  data: WellbeingEntry[]
  language: string
}

export function WellbeingChart({ data, language }: WellbeingChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-[200px] w-full bg-slate-50 dark:bg-[#0A0A0A] rounded-[2.5rem] animate-pulse" />

  const chartData = data.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString(language, { day: 'numeric', month: 'short' }),
    score: entry.mood_score
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#151515] p-3 rounded-2xl shadow-2xl border border-slate-100 dark:border-[#222222] outline-none">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Estado: {payload[0].value}/5</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8da9c4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8da9c4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-[#222222]" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8da9c4', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#8da9c4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
