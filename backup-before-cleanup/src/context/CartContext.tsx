"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/context/ToastContext'
import { useTranslation } from '@/context/LanguageContext'

interface CartItem {
  id: string
  name: string
  nameKey?: string
  price: number
  image: string
  category?: string
  quantity: number
}

interface CartProduct {
  id: string | number
  name: string
  nameKey?: string
  price: number
  image: string
  category?: string
  key?: string
}

interface CartContextType {
  cart: CartItem[]
  wishlist: string[]
  addToCart: (product: CartProduct) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  toggleWishlist: (id: string) => void
  clearCart: () => Promise<void>
  applyCoupon: (code: string) => boolean
  discount: number
  totalItems: number
  subtotal: number
  total: number
  isFreeShipping: boolean
  shippingFee: number
  freeShippingThreshold: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabaseUser, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { t } = useTranslation()
  const supabase = React.useMemo(() => createClient(), [])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [discount, setDiscount] = useState(0)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // 1. Load wishlist from localStorage
      const savedWishlist = localStorage.getItem('soulmar-wishlist')
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

      if (isAuthenticated && supabaseUser) {
        // 2. Load cart from DB for authenticated users
        const { data, error } = await supabase
          .from('cart_items')
          .select('id, quantity, products(id, key, price, image_url, category)')
          .eq('user_id', supabaseUser.id)

        if (data && !error) {
          interface DbCartItem {
            id: string;
            quantity: number;
            products: {
              id: string;
              key: string;
              price: number;
              image_url: string;
              category: string;
            } | null;
          }

          const dbCart: CartItem[] = (data as unknown as DbCartItem[])
            .map((item) => {
              const product = item.products;
              if (!product) return null;
              
              const cartItem: CartItem = {
                id: product.id,
                name: '', 
                nameKey: `shop.products.${product.key}`,
                price: product.price,
                image: product.image_url,
                category: product.category,
                quantity: item.quantity
              };
              return cartItem;
            })
            .filter((item): item is CartItem => item !== null);
          
          setCart(dbCart)
        }
      } else {
        // 3. Load cart from localStorage for guests
        const savedCart = localStorage.getItem('soulmar-cart')
        if (savedCart) setCart(JSON.parse(savedCart))
      }
    }
    loadData()
  }, [isAuthenticated, supabaseUser, supabase])

  // Save guest cart / wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('soulmar-cart', JSON.stringify(cart))
    }
    localStorage.setItem('soulmar-wishlist', JSON.stringify(wishlist))
  }, [cart, wishlist, isAuthenticated])

  const addToCart = async (product: CartProduct) => {
    const productId = product.id.toString()
    
    if (isAuthenticated && supabaseUser) {
      // DB Update
      const existing = cart.find(item => item.id === productId)
      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('user_id', supabaseUser.id)
          .eq('product_id', productId)
      } else {
        await supabase
          .from('cart_items')
          .insert({ 
            user_id: supabaseUser.id, 
            product_id: productId, 
            quantity: 1 
          })
      }
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === productId)
      if (existing) {
        return prev.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { 
        id: productId, 
        name: product.name,
        nameKey: product.nameKey, 
        price: product.price, 
        image: product.image, 
        category: product.category,
        quantity: 1 
      }]
    })

    showToast(`${product.nameKey ? t(product.nameKey) : product.name} ha sido añadido al carrito`, "success")
  }

  const removeFromCart = async (id: string) => {
    if (isAuthenticated && supabaseUser) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', supabaseUser.id)
        .eq('product_id', id)
    }
    setCart(prev => prev.filter(item => item.id !== id))
    showToast("Producto eliminado del carrito", "info")
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return
    
    if (isAuthenticated && supabaseUser) {
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', supabaseUser.id)
        .eq('product_id', id)
    }
    
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const clearCart = async () => {
    if (isAuthenticated && supabaseUser) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', supabaseUser.id)
    }
    setCart([])
    showToast("Carrito vaciado correctamente", "info")
  }

  const applyCoupon = (code: string) => {
    if (code.toUpperCase() === 'SOULMAR20') {
      setDiscount(0.20)
      return true
    }
    return false
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  const FREE_SHIPPING_THRESHOLD = 100000
  const SHIPPING_FEE = 15000
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0
  const shippingFee = (subtotal > 0 && !isFreeShipping) ? SHIPPING_FEE : 0
  
  const total = (subtotal * (1 - discount)) + shippingFee

  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      toggleWishlist, 
      clearCart,
      applyCoupon,
      discount,
      totalItems,
      subtotal,
      total,
      isFreeShipping,
      shippingFee,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
