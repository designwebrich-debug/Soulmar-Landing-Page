'use server'

import { createAdminClient } from '@/lib/supabase/server'

export interface UserDocument {
  name: string
  path: string
  size: number
  type: string
  uploadedAt: string
}

// Upload a file to user's private folder
export async function uploadUserDocument(
  userId: string,
  fileName: string,
  fileBase64: string,
  contentType: string
) {
  try {
    const supabase = await createAdminClient()

    // Sanitize filename
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const timestamp = Date.now()
    const path = `${userId}/${timestamp}_${safeName}`

    // Decode base64 to Buffer
    const buffer = Buffer.from(fileBase64, 'base64')

    // Validate size (10MB max)
    if (buffer.length > 10 * 1024 * 1024) {
      return { success: false, error: 'El archivo excede el límite de 10MB.' }
    }

    const { data, error } = await supabase.storage
      .from('user-documents')
      .upload(path, buffer, {
        contentType,
        upsert: false
      })

    if (error) {
      console.error('[STORAGE] Upload error:', error)
      return { success: false, error: `Error al subir: ${error.message}` }
    }

    return { success: true, path: data.path }
  } catch (err: any) {
    console.error('[STORAGE] Critical error:', err)
    return { success: false, error: 'Error crítico del servidor.' }
  }
}

// List all files in user's folder
export async function getUserDocuments(userId: string): Promise<UserDocument[]> {
  try {
    const supabase = await createAdminClient()

    const { data, error } = await supabase.storage
      .from('user-documents')
      .list(userId, {
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) {
      console.error('[STORAGE] List error:', error)
      return []
    }

    return (data || [])
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => ({
        name: f.name.replace(/^\d+_/, ''), // Remove timestamp prefix for display
        path: `${userId}/${f.name}`,
        size: f.metadata?.size || 0,
        type: f.metadata?.mimetype || 'unknown',
        uploadedAt: f.created_at || new Date().toISOString()
      }))
  } catch (err) {
    console.error('[STORAGE] Critical error:', err)
    return []
  }
}

// Get a signed URL for downloading a file
export async function getDocumentUrl(filePath: string) {
  try {
    const supabase = await createAdminClient()

    const { data, error } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(filePath, 3600) // 1 hour

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, url: data.signedUrl }
  } catch (err) {
    return { success: false, error: 'Error al generar enlace.' }
  }
}

// Delete a file
export async function deleteUserDocument(filePath: string) {
  try {
    const supabase = await createAdminClient()

    const { error } = await supabase.storage
      .from('user-documents')
      .remove([filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: 'Error al eliminar archivo.' }
  }
}
