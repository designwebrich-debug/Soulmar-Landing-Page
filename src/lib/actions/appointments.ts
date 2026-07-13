"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Appointment = {
  id: string
  patient_id: string
  therapist_id: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  meeting_link?: string
  reason?: string
  created_at: string
}

export async function bookAppointment(data: {
  therapist_id: string
  appointment_date: string
  appointment_time: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([{
      patient_id: user.id,
      ...data,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('This slot is already booked. Please choose another time.')
    }
    console.error('Error booking appointment:', error)
    throw new Error('Failed to book appointment')
  }

  revalidatePath('/panel-usuario')
  return appointment
}

export async function getPatientAppointments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', user.id)
    .order('appointment_date', { ascending: true })

  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }

  return data as Appointment[]
}

export async function getBusySlots(therapistId: string, date: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('therapist_id', therapistId)
    .eq('appointment_date', date)
    .neq('status', 'cancelled')

  if (error) {
    console.error('Error fetching busy slots:', error)
    return []
  }

  return data.map(a => a.appointment_time)
}
