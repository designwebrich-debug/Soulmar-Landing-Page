import { createClient } from "@/lib/supabase/server"
import { ShopClient } from "./ShopClient"

export const revalidate = 60 // Revalida el caché cada 60 segundos (ISR para alto rendimiento)

export default async function ShopPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  return <ShopClient initialProducts={products || []} />
}
