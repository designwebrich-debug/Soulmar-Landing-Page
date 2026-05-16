"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ShieldCheck, 
  Truck, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react"
import { cn, formatPrice, formatCOPtoUSD } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import Image from "next/image"
import confetti from "canvas-confetti"

export default function CartPage() {
  const { t } = useTranslation()
  const { cart, removeFromCart, updateQuantity, subtotal, total, discount, applyCoupon, isFreeShipping, shippingFee, freeShippingThreshold } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponStatus, setCouponStatus] = useState<"idle" | "success" | "error">("idle")
  
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const remaining = Math.max(freeShippingThreshold - subtotal, 0)
  const hasCelebrated = useRef(false)

  useEffect(() => {
    if (progress === 100 && !hasCelebrated.current) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#fbbf24', '#10b981', '#ffffff']
      })
      hasCelebrated.current = true
    } else if (progress < 100) {
      hasCelebrated.current = false
    }
  }, [progress])

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      setCouponStatus("success")
    } else {
      setCouponStatus("error")
      setTimeout(() => setCouponStatus("idle"), 3000)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0b0b0c] p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-white/5 shadow-2xl flex items-center justify-center mx-auto relative group">
              <ShoppingBag className="w-12 h-12 text-foreground/20 group-hover:scale-110 group-hover:text-primary transition-all duration-500" />
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold animate-pulse">0</div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-[-0.022em] uppercase">{t('cart.empty_title')}</h2>
            <p className="text-lg text-foreground/40 font-medium leading-relaxed">{t('cart.empty_desc')}</p>
          </div>
          <Button asChild size="xl" className="rounded-full w-full h-18 text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
            <Link href="/shop">{t('cart.explore')}</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] pt-32 pb-20 transition-colors duration-500">
      <Section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          
          {/* LEFT: TITLE + ITEM LIST (7 COLS) */}
          <div className="lg:col-span-12 lg:hidden mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2 px-2"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.022em] leading-none uppercase">
                 {t('cart.title')}
              </h1>
              <p className="text-xl text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-3">
                 <ShoppingBag className="w-5 h-5" /> {cart.length} {cart.length === 1 ? t('cart.product') : t('cart.products')}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            {/* Desktop Title (Visible only on LG+) */}
            <div className="hidden lg:block px-2 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.022em] leading-none uppercase">
                   {t('cart.title')}
                </h1>
                <p className="text-xl text-foreground/40 font-bold uppercase tracking-wider flex items-center gap-3">
                   <ShoppingBag className="w-5 h-5" /> {cart.length} {cart.length === 1 ? t('cart.product') : t('cart.products')}
                </p>
              </motion.div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="popLayout">
                {cart.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative"
                  >
                    <Card className="border-none bg-white/60 dark:bg-white/[0.03] backdrop-blur-3xl overflow-hidden rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500">
                      <CardContent className="p-8 flex flex-col sm:flex-row items-start gap-8">
                        <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex-1 min-w-0 mt-9">
                          <div className="">
                            <Link href={`/shop/${item.id}`} className="hover:text-primary transition-all inline-block">
                              <h4 className="font-bold text-2xl tracking-tight line-clamp-2 leading-[1.1]">{item.nameKey ? t(item.nameKey) : item.name}</h4>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-6 w-full sm:w-auto">
                          <div className="flex items-center gap-4 p-1.5 rounded-full bg-surface dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-inner self-center sm:self-auto">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-20"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-lg min-w-[2.5rem] text-center tabular-nums">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-12 w-full sm:w-auto">
                             <div className="text-right shrink-0">
                                <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-wider mb-1">Total</p>
                               <div className="flex flex-col items-end">
                                 <p className="font-bold text-2xl tracking-[-0.022em] tabular-nums leading-none">{formatPrice(item.price * item.quantity)}</p>
                                 <p className="text-[9px] font-bold text-foreground/60 uppercase tracking-tight mt-1">({formatCOPtoUSD(item.price * item.quantity)})</p>
                               </div>
                             </div>
                             <button 
                                onClick={() => removeFromCart(item.id)}
                                className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-red-500/10"
                              >
                                <Trash2 className="w-6 h-6" />
                              </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <Button variant="ghost" asChild className="rounded-full h-14 px-8 font-bold uppercase tracking-wider text-xs group">
                      <Link href="/shop" className="flex items-center gap-3">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                        {t('cart.continue')}
                      </Link>
                  </Button>
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                      <ShieldCheck className="w-6 h-6" />
                      <div className="text-left">
                         <p className="text-[10px] font-bold uppercase tracking-wider leading-none mb-1">{t('cart.encrypted_payment')}</p>
                         <p className="text-xs font-bold opacity-80">{t('cart.secure_payment')}</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY BANNER (5 COLS) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col gap-8 items-stretch w-full min-w-0">
            {/* SHIPPING PROGRESS BAR (APPLE STYLE) */}
            <Card className="w-full min-w-full border-none bg-white dark:bg-white/5 p-8 rounded-[3rem] shadow-xl border border-white dark:border-white/10 shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 w-full"
              >
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      {remaining > 0 ? t('cart.shipping_free_remaining', { amount: formatPrice(remaining) }) : t('cart.shipping_free_reached')}
                    </span>
                    <span className={cn("transition-colors", progress >= 100 ? "text-emerald-500" : "text-primary")}>
                      {Math.round(progress)}%
                    </span>
                 </div>
                 <div className="h-2 w-full bg-surface dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn("h-full transition-colors duration-1000", progress >= 100 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]")}
                    />
                 </div>
              </motion.div>
            </Card>

            <Card className="w-full min-w-full border-none bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl text-foreground shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.2)] rounded-[3rem] p-8 sm:p-12 space-y-12 relative overflow-hidden group shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-[3000ms]" />
              
              <div className="relative z-10 space-y-10">
                <h3 className="text-3xl font-bold tracking-[-0.022em] uppercase">{t('cart.summary')}</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-foreground/50 font-bold uppercase tracking-wider text-xs">
                    <span>{t('cart.subtotal')}</span>
                    <div className="text-right">
                      <span className="block text-foreground text-lg font-bold leading-none">{formatPrice(subtotal)}</span>
                      <span className="block text-[10px] text-foreground/60 font-bold uppercase mt-1">({formatCOPtoUSD(subtotal)})</span>
                    </div>
                  </div>
                  
                  {discount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs"
                    >
                      <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> {t('cart.discount')} (20%)</span>
                      <div className="text-right">
                        <span className="block text-lg font-bold leading-none">-{formatPrice(subtotal * discount)}</span>
                        <span className="block text-[10px] text-emerald-500/50 font-bold uppercase mt-1">(-{formatCOPtoUSD(subtotal * discount)})</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex justify-between items-center text-foreground/50 font-bold uppercase tracking-wider text-xs">
                    <span>{t('cart.shipping')}</span>
                    {isFreeShipping ? (
                       <Badge className="bg-emerald-500 text-white border-none rounded-full font-bold uppercase tracking-[-0.022em] text-[10px] py-1">{t('cart.free')}</Badge>
                    ) : (
                       <span className="text-foreground text-lg">{formatPrice(shippingFee)}</span>
                    )}
                  </div>

                  <div className="h-px bg-black/10 dark:bg-white/10 my-6" />
                  
                  <div className="flex justify-between items-baseline pt-6 border-t border-black/5 dark:border-white/5 gap-8">
                    <span className="text-lg font-bold uppercase tracking-[-0.022em] shrink-0">{t('cart.total')}</span>
                    <div className="text-right">
                        <p className="text-2xl md:text-3xl font-bold text-primary tracking-[-0.022em] leading-none whitespace-nowrap">
                          {formatPrice(total)}
                        </p>
                        <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-[-0.022em] mt-1">
                          ({formatCOPtoUSD(total)})
                        </p>
                        <p className="text-[8px] text-foreground/30 font-bold uppercase tracking-wider mt-3">{t('cart.tax_included')}</p>
                    </div>
                  </div>
                </div>

                {/* COUPON SECTION */}
                <div className="space-y-6 pt-6 border-t border-black/10 dark:border-white/10">
                   <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">{t('cart.coupon_label')}</p>
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder={t('cart.coupon_placeholder') as string} 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className={cn(
                          "flex-1 h-14 rounded-[1.5rem] px-6 text-sm font-bold bg-black/5 dark:bg-white/5 border transition-all outline-none placeholder:text-foreground/20",
                          couponStatus === 'success' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 
                          couponStatus === 'error' ? 'border-red-500' : 'border-transparent focus:border-primary/50'
                        )}
                        disabled={discount > 0}
                      />
                      <Button 
                        size="xl"
                        className={cn(
                          "rounded-[1.5rem] px-6 h-14 font-bold tracking-tight transition-all active:scale-95 shrink-0 text-white",
                          discount > 0 ? "bg-emerald-500" : "bg-primary hover:bg-secondary-yellow hover:text-black"
                        )}
                        onClick={handleApplyCoupon}
                        disabled={discount > 0 || !couponCode}
                      >
                        {discount > 0 ? <CheckCircle2 className="w-5 h-5" /> : t('cart.coupon_apply')}
                      </Button>
                   </div>
                   {couponStatus === 'error' && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-red-400 font-bold tracking-wider pl-2">{t('cart.coupon_invalid')}</motion.p>}
                </div>

                {/* PAYMENT LOGOS */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex justify-center mb-2"
                >
                  <div className="relative w-full max-w-[272px] h-12 opacity-80 hover:opacity-100 transition-all duration-500">
                    <Image 
                      src="/images/TARJETASLOGOS.png" 
                      alt="Pasarelas de pago oficiales" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                <Button asChild className="w-full h-20 rounded-[2.5rem] text-xl font-bold shadow-2xl group relative overflow-hidden bg-primary hover:bg-secondary-yellow text-white hover:text-black border-none transition-colors duration-500">
                  <Link href="/checkout" className="flex items-center justify-center gap-4">
                    <span className="relative z-10">{t('cart.checkout')}</span>
                    <ChevronRight className="relative z-10 w-7 h-7 group-hover:translate-x-3 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms]" />
                  </Link>
                </Button>
              </div>
            </Card>

<div className="py-2" />

            <Card className="w-full min-w-full border-none p-8 rounded-[3rem] bg-[#ffc971]/10 dark:bg-[#ffc971]/5 border border-[#ffc971]/20 flex flex-row gap-6 group shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-[#ffc971] flex items-center justify-center text-[#111111] shrink-0 shadow-lg shadow-[#ffc971]/20 group-hover:rotate-12 transition-transform duration-500">
                  <Info className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold tracking-tight">{t('cart.promotion_title')}</p>
                   <p className="text-xs font-medium text-foreground/50 leading-relaxed">{t('cart.promotion_desc', { code: 'SOULMAR20' })}</p>
                </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  )
}
