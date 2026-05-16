
import { createAdminClient } from './src/lib/supabase/server'

async function checkMessages() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from('messages').select('*').limit(10)
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Messages:', JSON.stringify(data, null, 2))
  }
}

checkMessages()
