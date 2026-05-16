"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import {
  AlertCircle, 
  Loader2,
  Lock,
  ChevronLeft,
  ArrowRight,
  Calendar,
  User,
  Download,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MessageCircle
} from "lucide-react"
import { cn, formatPrice, formatCOPtoUSD } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import Image from "next/image"
import confetti from "canvas-confetti"

import { useAuth } from "@/context/AuthContext"
import { createOrder } from "@/lib/actions/orders"
import { WHATSAPP_ID, WHATSAPP_PHONE } from "@/lib/constants"

interface CheckoutItem {
  id: string;
  name: string;
  nameKey?: string;
  image: string;
  price: number;
  quantity: number;
}

interface PurchaseSummary {
  items: CheckoutItem[];
  subtotal: number;
  total: number;
  discount: number;
  shipping: number;
}

export default function CheckoutPage() {
  const { t, language } = useTranslation()
  const { supabaseUser, isAuthenticated } = useAuth()
  const { cart, total, clearCart, subtotal, discount, isFreeShipping, shippingFee } = useCart()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const [randomSuffix] = useState(() => (Math.random() * 10000).toFixed(0))
  
  const [formData, setFormData] = useState({
    name: supabaseUser?.user_metadata?.full_name || supabaseUser?.user_metadata?.name || '',
    email: supabaseUser?.email || '',
    address: '',
    city: '',
    phone: supabaseUser?.user_metadata?.phone || '',
    cardName: ''
  })

  // Sync form data with authenticated user once when they log in
  // We use a functional update with a 'force sync' check to avoid cascading renders
  useEffect(() => {
    if (supabaseUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => {
        // Only update if fields are currently empty (first sync)
        const nameMatch = prev.name === (supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '')
        const emailMatch = prev.email === (supabaseUser.email || '')
        const phoneMatch = prev.phone === (supabaseUser.user_metadata?.phone || '')
        
        if (nameMatch && emailMatch && phoneMatch) return prev
        if (prev.name || prev.email || prev.phone) return prev // Don't overwrite if user started typing

        return {
          ...prev,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || '',
          email: supabaseUser.email || '',
          phone: supabaseUser.user_metadata?.phone || ''
        }
      })
    }
  }, [supabaseUser])

  const [purchaseSummary, setPurchaseSummary] = useState<PurchaseSummary | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  useEffect(() => {
    if (step === 3) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#fbbf24', '#10b981', '#ffffff']
      })
    }
  }, [step])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)
    
    // Capture summary before clearing
    const summary = {
      items: [...cart],
      subtotal,
      total,
      discount,
      shipping: shippingFee
    }
    setPurchaseSummary(summary)
    
    try {
      const newOrderId = await createOrder({
        userId: isAuthenticated && supabaseUser ? supabaseUser.id : undefined,
        items: cart,
        total,
        subtotal,
        discount,
        shipping: shippingFee,
        ...formData
      })
      setOrderId(newOrderId)

      setIsProcessing(false)
      setStep(3)
      await clearCart()
    } catch (err: unknown) {
      let message = err instanceof Error ? err.message : "Error al procesar el pago"
      
      if (message.includes("Server Components render") || message.includes("digest property") || message.includes("Error al procesar")) {
        message = t('checkout.error_generic')
      }
      
      setError(message as string)
      setIsProcessing(false)
    }
  }

  if (cart.length === 0 && step !== 3) {
    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full text-center space-y-8"
            >
                <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-white/5 shadow-2xl flex items-center justify-center mx-auto">
                    <AlertCircle className="w-12 h-12 text-foreground/20" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-[-0.022em] uppercase">{t('checkout.empty_title')}</h2>
                    <p className="text-lg text-foreground/40 font-medium leading-relaxed">{t('checkout.empty_desc')}</p>
                </div>
                <Button asChild size="xl" className="rounded-full w-full h-18 text-lg font-bold shadow-2xl">
                    <Link href="/shop">{t('checkout.empty_cta')}</Link>
                </Button>
            </motion.div>
        </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] pb-20 transition-colors duration-500 overflow-x-hidden",
      step === 3 ? "pt-12" : "pt-32"
    )}>
      <Section className="max-w-7xl mx-auto px-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-bold text-sm uppercase tracking-tight">{error}</p>
          </motion.div>
        )}
        
        {/* HEADER SECTION */}
        {step !== 3 && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.022em] leading-[1.05] uppercase">
               {t('checkout.shipping_title')}
            </h1>
              <p className="text-xl text-foreground/40 font-bold uppercase tracking-normal flex items-center gap-3">
                 <Lock className="w-5 h-5" /> {t('checkout.secure_payment')}
              </p>
            </motion.div>
          </div>
        )}

        {/* MAIN CONTENT GRID */}
        {step !== 3 ? (
          <div className="space-y-12">
            {/* ROW 1: FORM vs (STEPS + SUMMARY) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-stretch">
              {/* LEFT: FORM CARD */}
              <div className="lg:col-span-12 xl:col-span-7 h-full">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                      <Card className="h-full border-none bg-white dark:bg-white/[0.03] shadow-2xl rounded-[4rem] p-10 md:p-16 backdrop-blur-3xl relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                        
                        <div className="relative z-10 flex-1 flex flex-col justify-between">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.1em] pl-6 text-foreground/40">{t('checkout.form.name')}</label>
                                    <input 
                                      type="text" 
                                      placeholder={t('checkout.form.placeholder_name') as string} 
                                      value={formData.name}
                                      onChange={(e) => handleInputChange('name', e.target.value)}
                                      className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.1em] pl-6 text-foreground/40">{t('checkout.form.email')}</label>
                                    <input 
                                      type="email" 
                                      placeholder={t('footer.placeholder_email') as string} 
                                      value={formData.email}
                                      onChange={(e) => handleInputChange('email', e.target.value)}
                                      className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.1em] pl-6 text-foreground/40">{t('checkout.form.address')}</label>
                                    <input 
                                      type="text" 
                                      placeholder={t('checkout.form.placeholder_address') as string} 
                                      value={formData.address}
                                      onChange={(e) => handleInputChange('address', e.target.value)}
                                      className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-wider pl-6 text-foreground/30">{t('checkout.form.city')}</label>
                                    <input 
                                      type="text" 
                                      placeholder={t('checkout.form.placeholder_city') as string} 
                                      value={formData.city}
                                      onChange={(e) => handleInputChange('city', e.target.value)}
                                      className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-wider pl-6 text-foreground/30">{t('checkout.form.phone')}</label>
                                    <input 
                                      type="tel" 
                                      placeholder={WHATSAPP_PHONE} 
                                      value={formData.phone}
                                      onChange={(e) => handleInputChange('phone', e.target.value)}
                                      className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-16 flex flex-col items-center gap-8 border-t border-black/5 dark:border-white/5 mt-16">
                                <p className="text-xs font-bold uppercase tracking-normal text-foreground/30 text-center w-full">
                                   {language === 'es' ? 'Encriptación de grado bancario activa' : t('checkout.secure_note')}
                                </p>
                                <div className="flex flex-col md:flex-row items-center gap-6 w-full justify-center">
                                    <Button variant="ghost" asChild className="rounded-full h-20 px-10 font-bold text-foreground/30 hover:text-foreground transition-colors group">
                                      <Link href="/cart" className="flex items-center gap-2">
                                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> {language === 'es' ? 'Volver al Carrito' : t('common.back')}
                                      </Link>
                                    </Button>
                                    <Button 
                                      onClick={handleNext} 
                                      size="xl" 
                                      className="w-full md:w-auto rounded-full h-20 px-16 group text-xl font-bold shadow-2xl bg-primary hover:bg-secondary-yellow hover:text-black hover:scale-[1.03] active:scale-95 transition-all duration-500"
                                    >
                                        {language === 'es' ? 'Continuar pago' : t('checkout.continue_to_payment')} <ChevronRight className="ml-3 w-7 h-7 group-hover:translate-x-3 transition-transform duration-500" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full"
                    >
                       <Card className="h-full border-none bg-white dark:bg-white/[0.03] shadow-2xl rounded-[4rem] p-10 md:p-16 backdrop-blur-3xl flex flex-col relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                          
                          <div className="relative z-10 flex-1 flex flex-col">
                             <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                   <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                   <h3 className="text-3xl font-bold uppercase tracking-[-0.022em]">{t('checkout.step_payment')}</h3>
                                   <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.05em]">{t('checkout.secure_payment')}</p>
                                </div>
                             </div>

                             <div className="space-y-8 flex-1">
                                <div className="space-y-4">
                                   <label className="text-[10px] font-semibold uppercase tracking-[0.1em] pl-6 text-foreground/40">{t('checkout.card_name')}</label>
                                    <div className="relative">
                                       <input 
                                         type="text" 
                                         placeholder={language === 'es' ? 'Nombre como aparece en la tarjeta' : 'Name as it appears on card'} 
                                         value={formData.cardName}
                                         onChange={(e) => handleInputChange('cardName', e.target.value)}
                                         className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" 
                                       />
                                       <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                   <label className="text-[10px] font-semibold uppercase tracking-[0.1em] pl-6 text-foreground/40">{t('checkout.card_number')}</label>
                                   <div className="relative">
                                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" />
                                      <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10">
                                   <div className="space-y-4">
                                      <label className="text-[10px] font-bold uppercase tracking-wider pl-6 text-foreground/30">{t('checkout.card_expiry')}</label>
                                      <input type="text" placeholder="MM/YY" className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" />
                                   </div>
                                   <div className="space-y-4">
                                      <label className="text-[10px] font-bold uppercase tracking-wider pl-6 text-foreground/30">{t('checkout.card_cvv')}</label>
                                      <input type="text" placeholder="000" className="w-full h-18 rounded-full px-8 bg-surface dark:bg-white/5 border border-transparent focus:border-primary/30 outline-none transition-all font-bold text-lg shadow-inner placeholder:text-foreground/20" />
                                   </div>
                                </div>
                             </div>

                             <div className="pt-8 flex flex-col items-center gap-6 border-t border-black/5 dark:border-white/5 mt-auto">
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
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
                                <Button 
                                  onClick={handlePayment} 
                                  disabled={isProcessing} 
                                  size="xl" 
                                  className="w-full rounded-full h-24 px-16 group text-2xl font-bold shadow-2xl bg-primary hover:bg-secondary-yellow hover:text-black hover:scale-[1.02] active:scale-95 transition-all duration-500"
                                >
                                   {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : t('checkout.pay_now', { amount: formatPrice(total) })}
                                </Button>
                                <button onClick={handlePrev} className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-foreground/30 hover:text-foreground transition-all">
                                    <ChevronLeft className="w-4 h-4" /> {t('checkout.back')}
                                </button>
                             </div>
                          </div>
                       </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT: STEPS + SUMMARY (Equal Height to Form) */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8 h-full">
                 <div className="flex-1 flex flex-col gap-8">
                    {/* PROGRESS STEPS */}
                    <Card className="w-full border-none bg-white dark:bg-white/5 p-6 rounded-full shadow-xl flex items-center justify-center shrink-0">
                      <div className="flex items-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                                    step === s ? "bg-primary text-white shadow-lg scale-110" : 
                                    step > s ? "bg-emerald-500 text-white shadow-lg" : "bg-black/5 dark:bg-white/5 text-foreground/20"
                                )}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={cn("h-1 w-6 rounded-full transition-all", step > s ? "bg-emerald-500" : "bg-black/5 dark:bg-white/5")} />}
                            </div>
                        ))}
                      </div>
                    </Card>

                    {/* ORDER SUMMARY */}
                    <Card className="flex-1 border-none bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl text-foreground shadow-2xl rounded-[3rem] p-10 flex flex-col relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                       <h3 className="text-2xl font-bold tracking-[-0.015em] uppercase mb-10 relative z-10">{t('checkout.your_purchase')}</h3>
                       
                       <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar min-h-[150px] relative z-10 space-y-8">
                         {cart.map(item => (
                             <div key={item.id} className="flex items-center gap-6 group/item">
                                 <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-xl">
                                     <Image src={item.image} alt={item.name} fill className="object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <h5 className="font-bold text-sm tracking-tight uppercase">{item.nameKey ? t(item.nameKey) : item.name}</h5>
                                     <p className="text-[10px] font-bold uppercase text-foreground/40">{t('common.quantity_abbr')}: {item.quantity}</p>
                                 </div>
                                 <div className="text-right">
                                     <span className="block font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                 </div>
                             </div>
                         ))}
                       </div>

                       <div className="h-px bg-black/5 dark:bg-white/10 my-10 relative z-10" />
                       
                       <div className="space-y-4 mt-auto relative z-10">
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase text-foreground/30">
                           <span>{t('cart.subtotal')}</span>
                           <span className="text-foreground font-bold">{formatPrice(subtotal)}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold uppercase text-foreground/30">
                           <span>{t('cart.shipping')}</span>
                           {isFreeShipping ? (
                             <Badge className="bg-emerald-500 text-white border-none rounded-full font-bold text-[9px] py-1">{t('cart.free')}</Badge>
                           ) : (
                             <span className="text-foreground font-bold">{formatPrice(shippingFee)}</span>
                           )}
                         </div>
                         <div className="h-px bg-black/5 dark:bg-white/10 my-4" />
                         <div className="flex justify-between items-baseline pt-4">
                            <span className="text-xl font-bold uppercase tracking-[-0.022em]">{t('cart.total')}</span>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-primary tracking-[-0.022em] leading-none">{formatPrice(total)}</p>
                              <p className="text-[11px] font-bold text-foreground/50 uppercase mt-2">({formatCOPtoUSD(total)})</p>
                            </div>
                         </div>
                       </div>
                    </Card>
                 </div>
              </div>
            </div>

            {/* ROW 2: DELIVERY ESTIMATE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
              <div className="xl:col-span-7"></div>
              <div className="lg:col-span-12 xl:col-span-5">
                <Card className="w-full border-none bg-white dark:bg-white/5 p-8 rounded-[3rem] shadow-xl border border-white dark:border-white/10 flex items-center justify-center gap-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/30 mb-1">{t('checkout.estimated_shipping')}</p>
                      <p className="text-sm font-bold uppercase tracking-tight">{t('checkout.estimated_date')}</p>
                    </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* CINEMATIC SUCCESS PAGE */
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-16 py-10"
          >
              <div className="relative inline-block">
                  <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                     className="w-40 h-40 bg-emerald-500 rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10"
                  >
                      <CheckCircle2 className="w-16 h-16 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
              </div>

              <div className="space-y-6">
                  <Badge className="bg-[#ffc971] text-[#111111] border-none px-6 py-2 rounded-full font-bold uppercase tracking-wider text-[10px] transform -rotate-2 inline-block">
                    PEDIDO CONFIRMADO #SLM-2026-{randomSuffix}
                  </Badge>
                  <h2 className="text-6xl md:text-8xl font-bold tracking-[-0.025em] uppercase leading-[0.95]">
                     {t('checkout.success_title')}
                  </h2>
                  <p className="text-2xl text-foreground/40 max-w-2xl mx-auto font-medium leading-relaxed">
                     {t('checkout.success_subtitle')}
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">                  <Card className="bg-white dark:bg-white/[0.03] border-none p-12 rounded-[4rem] text-center flex flex-col items-center justify-center space-y-8 shadow-xl group h-full transition-all duration-500 hover:shadow-2xl hover:bg-primary/[0.02]">
                     <div className="w-24 h-24 rounded-[3.5rem] bg-surface dark:bg-white/5 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-700 ease-in-out">
                        <ShoppingCart className="w-10 h-10" />
                     </div>
                     <div className="space-y-4">
                        <span className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-40 block">{t('checkout.shipping_status_label')}</span>
                        <p className="text-base font-medium text-foreground/60 leading-relaxed tracking-tight max-w-[320px] mx-auto opacity-90 transition-colors group-hover:text-foreground">
                           {t('checkout.status_note')}
                        </p>
                     </div>
                  </Card>
 
                  <Card className="bg-white dark:bg-white/[0.03] border-none p-12 rounded-[4rem] text-left flex flex-col items-start justify-center space-y-10 shadow-xl group h-full transition-all duration-500 hover:shadow-2xl hover:bg-primary/[0.02]">
                     <span className="text-[12px] font-bold uppercase tracking-[0.08em] opacity-40 block ml-2">{t('checkout.next_steps')}</span>
                     <div className="flex flex-col items-start space-y-8 ml-2">
                        {[1, 2, 3].map((s) => (
                           <div key={s} className="flex items-center gap-6 group/item">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover/item:bg-primary group-hover/item:text-white transition-all duration-500 text-sm shadow-sm shrink-0">{s}</div>
                              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-foreground/70 transition-colors group-hover/item:text-foreground leading-none">{t(`checkout.step_${s === 1 ? 'review' : s === 2 ? 'packaging' : 'shipment'}`)}</p>
                           </div>
                        ))}
                     </div>
                  </Card>

              </div>

              <div className="pt-12 flex flex-col sm:flex-row justify-center gap-6">
                  <Button 
                    onClick={() => setIsReceiptOpen(true)} 
                    size="xl" 
                    className="h-20 px-16 text-lg font-bold bg-primary shadow-2xl hover:scale-105 transition-transform"
                  >
                          {t('checkout.view_order')} <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <Button asChild variant="outline" size="xl" className="h-20 px-16 text-lg font-bold border-2 border-foreground/10 hover:bg-secondary-yellow hover:text-black hover:border-secondary-yellow transition-all duration-500">
                      <Link href="/shop">{t('checkout.back_to_home')}</Link>
                  </Button>
              </div>
          </motion.div>
        )}
      </Section>

      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        orderId={orderId}
        formData={formData}
        purchaseSummary={purchaseSummary}
        t={t}
        language={language}
        formatPrice={formatPrice}
      />
    </div>
  )
}

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  formData: {
    name: string
    email: string
    city: string
    address: string
    phone: string
  }
  purchaseSummary: PurchaseSummary | null
  t: (key: string, options?: Record<string, unknown>) => string | React.ReactNode
  language: string
  formatPrice: (price: number) => string
}

const ReceiptModal = ({ 
  isOpen, 
  onClose, 
  orderId, 
  formData, 
  purchaseSummary, 
  t, 
  language,
  formatPrice 
}: ReceiptModalProps) => {
  const handleDownload = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 no-print">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0b0b0c] rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 print:shadow-none print:border-none print:rounded-none print:max-w-none print:m-0"
            id="soulmar-receipt"
          >
            {/* Receipt Header */}
            <div className="bg-primary p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative z-10 space-y-2">
                <div className="flex justify-between items-start">
                  <Badge className="bg-white/20 text-white border-none px-4 py-1 rounded-full font-bold uppercase text-[9px] mb-4">
                    {t('checkout.receipt.title')}
                  </Badge>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors no-print"
                  >
                    <ArrowRight className="w-5 h-5 rotate-45" />
                  </button>
                </div>
                <h3 className="text-4xl font-bold tracking-[-0.022em] uppercase leading-none">
                  {orderId}
                </h3>
                <p className="opacity-60 font-medium text-sm">
                  {new Date().toLocaleDateString(language === 'es' ? 'es-CO' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-12 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar print:max-h-none print:overflow-visible">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-8 pb-10 border-b border-black/5 dark:border-white/10">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-30">{t('checkout.receipt.customer')}</span>
                  <div className="space-y-1">
                    <p className="font-bold uppercase text-sm">{formData.name || 'Invitado Soulmar'}</p>
                    <p className="text-xs text-foreground/50 font-medium">{formData.email}</p>
                    <p className="text-xs text-foreground/50 font-medium">{formData.phone}</p>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-30">{t('checkout.steps.shipping')}</span>
                  <div className="space-y-1">
                    <p className="text-xs text-foreground/50 font-medium">{formData.address}</p>
                    <p className="text-xs text-foreground/50 font-medium uppercase font-bold">{formData.city}</p>
                    <div className="bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-xl inline-block mt-2">
                       <p className="text-[10px] font-bold uppercase tracking-[-0.022em]">
                         {t('checkout.receipt.courier')}
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-30">{t('checkout.receipt.summary')}</span>
                <div className="space-y-4">
                  {purchaseSummary?.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-surface dark:bg-white/5 flex items-center justify-center text-[10px] font-bold">
                          {item.quantity}x
                        </div>
                        <p className="font-bold text-xs uppercase tracking-tight">{item.nameKey ? t(item.nameKey) : item.name}</p>
                      </div>
                      <span className="font-bold text-xs">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="pt-10 border-t border-black/5 dark:border-white/10 space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase opacity-40">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatPrice(purchaseSummary?.subtotal || 0)}</span>
                </div>
                {purchaseSummary && purchaseSummary.discount > 0 && (
                  <div className="flex justify-between text-[10px] font-bold uppercase text-emerald-500">
                    <span>{t('cart.discount')}</span>
                    <span>-{formatPrice(purchaseSummary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-bold uppercase opacity-40">
                  <span>{t('cart.shipping')}</span>
                  <span>{purchaseSummary?.shipping === 0 ? t('cart.free') : formatPrice(purchaseSummary?.shipping || 0)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-2xl font-bold uppercase tracking-[-0.022em]">{t('cart.total')}</span>
                  <p className="text-3xl font-bold text-primary tracking-[-0.022em]">{formatPrice(purchaseSummary?.total || 0)}</p>
                </div>
              </div>
            </div>

            {/* Receipt Actions & Footer */}
            <div className="p-12 bg-surface dark:bg-white/5 border-t border-black/5 dark:border-white/10 no-print flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleDownload}
                className="flex-1 h-16 rounded-2xl bg-foreground text-background font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-secondary-yellow hover:text-black transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-4 h-4 mr-3" />
                {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
              </Button>
              <Button 
                onClick={() => {
                  const message = encodeURIComponent(`Hola Soulmar! Acabo de realizar mi pedido ${orderId}. ¡Estoy muy emocionado/a!`);
                  window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_ID}&text=${message}`, '_blank');
                }}
                className="flex-1 h-16 rounded-2xl bg-[#25D366] text-white font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-[#128C7E] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                {language === 'es' ? 'Enviar a WhatsApp' : 'Send to WhatsApp'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
