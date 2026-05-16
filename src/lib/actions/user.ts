'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user orders:', error)
    return []
  }

  return data
}

export async function updateProfileStatus(userId: string, status: string, color: string) {
  const supabase = await createAdminClient()
  
  // 1. Update Profiles Table (Primary)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      profile_status: status,
      status_color: color 
    })
    .eq('id', userId)

  // 2. Update Auth Metadata (Secondary Fallback)
  // This is helpful if the profiles table schema is not yet updated
  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { profile_status: status, status_color: color }
  })

  if (profileError && authError) {
    console.error('Error updating status in both places:', { profileError, authError })
    return { success: false, error: profileError }
  }

  return { success: true }
}

export async function checkProfileColumns() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('profile_status, status_color')
    .limit(1)
  
  if (error) {
    return { exists: false, error: error.message }
  }
  return { exists: true }
}
