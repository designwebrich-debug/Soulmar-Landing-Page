'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCourses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return data
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error(`Error fetching course ${slug}:`, error)
    return null
  }

  return data
}

export async function updateCourse(id: string, updates: Record<string, unknown>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error(`Error updating course ${id}:`, error)
    throw new Error(error.message)
  }

  return data[0]
}
