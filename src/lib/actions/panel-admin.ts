'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAdminStats() {
  const supabase = await createClient()

  // 1. Get total users
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 2. Get total orders
  const { count: ordersCount, data: orders } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })

  // 3. Get total products
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 4. Get total courses
  const { count: coursesCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  // 5. Get recent orders with user names
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

  return {
    usersCount: usersCount || 0,
    ordersCount: ordersCount || 0,
    productsCount: productsCount || 0,
    coursesCount: coursesCount || 0,
    totalRevenue,
    recentOrders: recentOrders || []
  }
}
