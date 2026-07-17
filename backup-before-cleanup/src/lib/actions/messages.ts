'use server'

import { createAdminClient } from '@/lib/supabase/server'

export interface Reaction {
  user_id: string
  emoji: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
  reactions?: Reaction[]
  reply_to?: string
  is_pinned?: boolean
  is_edited?: boolean
  is_deleted?: boolean
  deleted_for?: string[]
}

// Get conversation between two users
export async function getConversation(userId: string, therapistId: string): Promise<Message[]> {
  if (!userId || !therapistId) return []
  
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq."${userId}",receiver_id.eq."${therapistId}"),and(sender_id.eq."${therapistId}",receiver_id.eq."${userId}")`
    )
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[MESSAGES] Error fetching conversation:', error)
    return []
  }

  return (data || [])
    .map(msg => ({
      ...msg,
      read: !!msg.read
    }))
    .reverse()
}

// Send a message
export async function sendMessage(senderId: string, receiverId: string, content: string, replyTo?: string) {
  try {
    const supabase = await createAdminClient()

    if (!content.trim()) {
      return { success: false, error: 'El mensaje no puede estar vacío.' }
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
        reply_to: replyTo
      }])
      .select()
      .single()

    if (error) {
      console.error('[MESSAGES] Send error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: { ...data, read: !!data.read } }
  } catch (err: any) {
    console.error('[MESSAGES] Critical error:', err)
    return { success: false, error: 'Error de conexión.' }
  }
}

// React to a message
export async function reactToMessage(messageId: string, userId: string, emoji: string) {
  try {
    const supabase = await createAdminClient()

    // Get current reactions
    const { data: msg, error: fetchError } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single()

    if (fetchError) throw fetchError

    let reactions: Reaction[] = msg.reactions || []
    
    // Check if user already has ANY reaction
    const existingIndex = reactions.findIndex(r => r.user_id === userId)
    
    if (existingIndex > -1) {
      if (reactions[existingIndex].emoji === emoji) {
        // Si es el mismo emoji, se quita (toggle off)
        reactions.splice(existingIndex, 1)
      } else {
        // Si es un emoji diferente, se reemplaza el anterior
        reactions[existingIndex].emoji = emoji
      }
    } else {
      // Si no tiene reacción, se añade la nueva
      reactions.push({ user_id: userId, emoji })
    }

    const { error: updateError } = await supabase
      .from('messages')
      .update({ reactions })
      .eq('id', messageId)

    if (updateError) throw updateError
    return { success: true }
  } catch (err: any) {
    console.error('[MESSAGES] Reaction error:', err)
    return { success: false, error: err.message }
  }
}

// Edit a message
export async function editMessage(messageId: string, newContent: string) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('messages')
      .update({ 
        content: newContent,
        is_edited: true
      })
      .eq('id', messageId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('[MESSAGES] Edit error:', err)
    return { success: false, error: err.message }
  }
}

// Delete a message
export async function deleteMessage(messageId: string, userId: string, forAll: boolean = false) {
  return deleteMessages([messageId], userId, forAll)
}

// Bulk delete messages
export async function deleteMessages(messageIds: string[], userId: string, forAll: boolean = false) {
  try {
    const supabase = await createAdminClient()
    
    if (forAll) {
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true })
        .in('id', messageIds)
      if (error) throw error
    } else {
      // Para cada mensaje, añadir el userId a deleted_for
      // Nota: Esto es un poco ineficiente en bulk con el array actual, pero mantiene la lógica
      for (const id of messageIds) {
        const { data: msg } = await supabase.from('messages').select('deleted_for').eq('id', id).single()
        const deletedFor = Array.from(new Set([...(msg?.deleted_for || []), userId]))
        await supabase.from('messages').update({ deleted_for: deletedFor }).eq('id', id)
      }
    }
    
    return { success: true }
  } catch (err: any) {
    console.error('[MESSAGES] Bulk delete error:', err)
    return { success: false, error: err.message }
  }
}

// Pin/Unpin a message
export async function togglePinMessage(messageId: string, status: boolean) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('messages')
      .update({ is_pinned: status })
      .eq('id', messageId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('[MESSAGES] Pin error:', err)
    return { success: false, error: err.message }
  }
}

// Mark messages as read
export async function markMessagesAsRead(userId: string, therapistId: string) {
  try {
    const supabase = await createAdminClient()

    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', therapistId)
      .eq('receiver_id', userId)
      .eq('read', false)

    if (error) {
      console.error('[MESSAGES] Mark read error:', error)
    }
  } catch (err) {
    console.error('[MESSAGES] Critical error:', err)
  }
}

// Get unread message count per therapist
export async function getUnreadCounts(userId: string): Promise<Record<string, number>> {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('receiver_id', userId)
    .eq('read', false)

  if (error || !data) return {}

  const counts: Record<string, number> = {}
  data.forEach(msg => {
    counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1
  })

  return counts
}

// Update chat color preference
export async function updateChatColorPreference(userId: string, color: string) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .update({ chat_color_preference: color })
      .eq('id', userId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('[MESSAGES] Color preference error:', err)
    return { success: false, error: err.message }
  }
}
