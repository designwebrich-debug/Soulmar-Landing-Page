'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('key', slug)
    .single()

  if (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return null
  }

  return data
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating product ${id}:`, error)
    throw new Error(error.message)
  }

  return data[0]
}
