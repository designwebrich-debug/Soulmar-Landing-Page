'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getUserSessions(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: true })

  if (error) {
    console.error('Error fetching user sessions:', error)
    return []
  }
  return data
}

export async function getUpcomingSessions(userId: string) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', now)
    .eq('status', 'scheduled')
    .neq('platform', 'personal')
    .order('session_date', { ascending: true })
    .limit(5)

  if (error) {
    console.error('Error fetching upcoming sessions:', error)
    return []
  }
  return data
}

export async function getNextSession(userId: string) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('session_date', now)
    .eq('status', 'scheduled')
    .order('session_date', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    return null
  }
  return data
}

export async function getTherapistNotes(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('therapist_notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }
  return data
}

export async function getSessionDatesForMonth(userId: string, year: number, month: number) {
  const supabase = await createClient()
  const startDate = new Date(year, month, 1).toISOString()
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('sessions')
    .select('session_date')
    .eq('user_id', userId)
    .gte('session_date', startDate)
    .lte('session_date', endDate)

  if (error) {
    console.error('Error fetching session dates:', error)
    return []
  }
  return data.map(s => new Date(s.session_date).getDate())
}

export async function getUserStats(userId: string) {
  const supabase = await createAdminClient()

  const { count: sessionsCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: completedCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed')

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: coursesCount } = await supabase
    .from('course_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    totalSessions: sessionsCount || 0,
    completedSessions: completedCount || 0,
    totalOrders: ordersCount || 0,
    activeCourses: coursesCount || 0,
  }
}

export async function addCustomEvent(event: any) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[EXEC][${requestId}] starting custom event insert...`, { userId: event.user_id });

  try {
    const supabase = await createAdminClient();
    
    if (!event.user_id || !event.session_date) {
      return { success: false, error: "Datos de usuario o fecha incompletos." };
    }

    // 1. Payload Ultra-Compatible (Solo usa campos que sabemos que existen)
    const finalPayload = {
      user_id: event.user_id,
      therapist_name: event.therapist_name || 'Evento Personal',
      therapist_specialty: 'DASHBOARD.USER.PERSONAL_EVENT',
      therapist_image: '/images/default-avatar.png',
      session_date: event.session_date,
      status: 'scheduled',
      platform: 'personal',
      duration_minutes: 60,
      meeting_url: 'N/A',
      // Guardamos el color de forma segura en las notas con un prefijo especial
      notes: `COLOR_META:${event.color || '#8da9c4'}`
    };

    // 2. Ejecución directa
    const { data, error } = await supabase
      .from('sessions')
      .insert([finalPayload])
      .select()
      .single();

    if (error) {
      console.error(`[EXEC][${requestId}] Database error:`, error);
      return { success: false, error: `Error de base de datos: ${error.message}` };
    }

    console.log(`[EXEC][${requestId}] Successfully saved.`);
    return { success: true, data: { ...data, color: event.color } };
  } catch (err: any) {
    console.error(`[EXEC][${requestId}] Critical exception:`, err);
    return { success: false, error: "Error crítico de conexión con el servidor." };
  }
}

export async function deleteCustomEvent(eventId: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', eventId)

  if (error) {
    console.error('Error deleting custom event (Admin):', error)
    return false
  }
  return true
}

export async function getCustomEvents(userId: string) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', 'personal')
    .order('session_date', { ascending: true })

  if (error) {
    console.error('Error fetching custom events (Admin):', error)
    return []
  }

  // Recuperamos el color desde el prefijo en las notas para ambos formatos (antiguo y nuevo)
  return data.map(event => {
    if (event.notes?.startsWith('COLOR_META:')) {
      const color = event.notes.split(':')[1];
      return { ...event, color };
    } else if (event.notes?.startsWith('Color:')) {
      const color = event.notes.split(':')[1];
      return { ...event, color };
    }
    return event;
  });
}

// --- THERAPIST SPECIFIC ACTIONS ---

/**
 * Fetches upcoming sessions for a specific therapist
 */
export async function getTherapistUpcomingSessions(therapistId: string) {
  const supabase = await createClient()
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      profiles:user_id (
        name,
        email,
        profile_status,
        status_color
      )
    `)
    .eq('therapist_id', therapistId)
    .gte('session_date', now)
    .eq('status', 'scheduled')
    .order('session_date', { ascending: true })

  if (error) {
    console.error('Error fetching therapist sessions:', error)
    return []
  }
  return data
}

/**
 * Fetches unique patients associated with a therapist
 */
export async function getTherapistPatients(therapistId: string) {
  const supabase = await createClient()
  
  // We get unique user_ids from sessions where therapist_id matches
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      user_id,
      profiles:user_id (
        id,
        name,
        email,
        phone,
        interests,
        profile_status,
        status_color
      )
    `)
    .eq('therapist_id', therapistId)

  if (error) {
    console.error('Error fetching therapist patients:', error)
    return []
  }

  // Filter unique profiles
  const uniqueProfiles = Array.from(new Set(data.map(item => JSON.stringify(item.profiles))))
    .map(str => JSON.parse(str))
    .filter(Boolean)

  return uniqueProfiles
}

/**
 * Fetches stats for the therapist dashboard
 */
export async function getTherapistStats(therapistId: string) {
  const supabase = await createAdminClient()
  const now = new Date().toISOString()
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  // 1. Total unique patients
  const { data: patientsData } = await supabase
    .from('sessions')
    .select('user_id')
    .eq('therapist_id', therapistId)
  
  const uniquePatientsCount = new Set(patientsData?.map(p => p.user_id)).size

  // 2. Sessions today
  const { count: todayCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('therapist_id', therapistId)
    .gte('session_date', startOfDay.toISOString())
    .lte('session_date', endOfDay.toISOString())

  // 3. Pending messages (mock logic or from messages table)
  const { count: pendingMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', therapistId)
    .eq('is_read', false)

  // 4. Monthly hours (approx)
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0,0,0,0);

  const { data: monthlySessions } = await supabase
    .from('sessions')
    .select('duration_minutes')
    .eq('therapist_id', therapistId)
    .eq('status', 'completed')
    .gte('session_date', firstOfMonth.toISOString())

  const totalMinutes = monthlySessions?.reduce((acc, s) => acc + (s.duration_minutes || 60), 0) || 0
  const totalHours = Math.round(totalMinutes / 60)

  return {
    activePatients: uniquePatientsCount,
    sessionsToday: todayCount || 0,
    pendingMessages: pendingMessages || 0,
    totalHours: totalHours
  }
}
