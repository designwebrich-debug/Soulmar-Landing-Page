"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type WellbeingEntry = {
  id: string
  user_id: string
  mood_score: number
  energy_level: number
  stress_level: number
  note?: string
  created_at: string
}

export async function saveWellbeingEntry(data: {
  mood_score: number
  energy_level: number
  stress_level: number
  note?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: entry, error } = await supabase
    .from('wellbeing_entries')
    .insert([{
      user_id: user.id,
      ...data
    }])
    .select()
    .single()

  if (error) {
    console.error('Error saving wellbeing entry:', error)
    throw new Error('Failed to save wellbeing entry')
  }

  revalidatePath('/panel-usuario')
  return entry
}

export async function getWellbeingHistory(days: number = 7) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('wellbeing_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching wellbeing history:', error)
    return []
  }

  return data as WellbeingEntry[]
}

export async function getWellbeingStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get last 30 days of data to calculate trends
  const history = await getWellbeingHistory(30)
  
  if (history.length === 0) return null

  const latest = history[history.length - 1]
  const avgMood = history.reduce((acc, curr) => acc + curr.mood_score, 0) / history.length
  
  return {
    latest,
    avgMood: parseFloat(avgMood.toFixed(1)),
    totalEntries: history.length
  }
}
