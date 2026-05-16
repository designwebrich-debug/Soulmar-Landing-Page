'use server'

import { createClient } from '@/lib/supabase/server'

interface OrderItem {
  id: string
  quantity: number
  price: number
}

interface CreateOrderParams {
  userId?: string
  items: OrderItem[]
  total: number
  subtotal: number
  discount: number
  shipping: number
  name: string
  email: string
  address: string
  city: string
  phone: string
}

export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient()

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: params.userId || null,
      guest_name: params.name,
      guest_email: params.email,
      total: params.total,
      status: 'pago_confirmado',
      shipping_address: params.address,
      city: params.city,
      phone: params.phone,
      payment_method: 'credit_card' // Simulation
    })
    .select()
    .single()

  if (orderError) {
    console.error('Error creating order:', orderError)
    throw new Error(orderError.message)
  }

  // 2. Create order items
  const orderItems = params.items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // Note: In production we should handle rollback or use a DB function/transaction
    throw new Error(itemsError.message)
  }

  // 3. Clear cart in DB
  if (params.userId) {
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', params.userId)
  }

  return order.id
}
