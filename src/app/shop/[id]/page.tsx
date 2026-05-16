"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Heart,
  Share2
} from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useCart } from "@/context/CartContext"
import { PRODUCT_DATA } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

interface Product {
  id: string | number;
  key: string;
  price: number;
  cat: string;
  img: string;
  gallery?: string[];
  specs?: {
    material?: string;
    dimensions?: string;
    weight?: string;
    finish?: string;
    care?: string;
    origin?: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { addToCart, toggleWishlist, wishlist } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [selectedImg, setSelectedImg] = useState(0)

  const product = PRODUCT_DATA.find(p => p.id === Number(id) || p.key === id) as Product | undefined

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0b0b0c]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.022em]">{t('shop.product_not_found')}</h1>
          <Button asChild>
            <Link href="/shop">{t('shop.back_to_shop')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: t(`shop.products.${product.key}`) as string,
          nameKey: `shop.products.${product.key}`,
          price: product.price,
          image: product.img,
          category: product.cat,
          key: product.key
        })
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 3000)
  }

  const isInWishlist = wishlist.includes(product.key)

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] pt-32 pb-20 transition-colors duration-500 overflow-x-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* BREADCRUMBS & NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button 
              onClick={() => router.back()}
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.05em] text-foreground/40 hover:text-foreground transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </div>
              {t('shop.back_to_shop')}
            </button>
          </motion.div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.08em] text-foreground/20">
             <Link href="/" className="hover:text-foreground transition-colors">{t('shop.start')}</Link>
             <span>/</span>
             <Link href="/shop" className="hover:text-foreground transition-colors">{t('shop.shop')}</Link>
             <span>/</span>
             <span className="text-foreground/40">{t(`shop.products.${product.key}`)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT: IMAGE GALLERY (6 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[4rem] overflow-hidden bg-white dark:bg-white/5 shadow-2xl group cursor-zoom-in"
            >
              <Image 
                src={product.gallery?.[selectedImg] || product.img} 
                alt={t(`shop.products.${product.key}`) as string} 
                fill 
                className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute top-10 right-10 flex flex-col gap-4">
                <button 
                   onClick={() => toggleWishlist(product.key)}
                   className={cn(
                     "w-16 h-16 rounded-full backdrop-blur-3xl flex items-center justify-center transition-all shadow-2xl active:scale-90",
                     isInWishlist ? "bg-red-500 text-white" : "bg-white/40 dark:bg-white/10 text-foreground/60 hover:text-red-500"
                   )}
                >
                  <Heart className={cn("w-7 h-7", isInWishlist && "fill-current")} />
                </button>
                <button className="w-16 h-16 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-3xl flex items-center justify-center text-foreground/60 hover:text-primary transition-all shadow-2xl active:scale-90">
                  <Share2 className="w-7 h-7" />
                </button>
              </div>

              {/* Badges on image */}
              <div className="absolute bottom-10 left-10">
                 <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-6 py-2 rounded-full font-bold uppercase tracking-[0.05em] text-[10px]">
                    {t('common.soulmar_original') || 'Soulmar Original'} • 2026
                 </Badge>
              </div>
            </motion.div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-6 px-4">
              {product.gallery?.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImg(i)}
                  className={cn(
                    "relative aspect-square rounded-[2rem] bg-white dark:bg-white/5 border transition-all duration-500 overflow-hidden",
                    selectedImg === i 
                      ? "border-primary p-1 scale-105 shadow-xl" 
                      : "border-black/5 dark:border-white/5 hover:border-primary/50"
                  )}
                >
                  <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
                    <Image src={img} alt={`${product.key} view ${i}`} fill className={cn("object-cover transition-all duration-700", selectedImg !== i && "grayscale opacity-50 hover:grayscale-0 hover:opacity-100")} />
                  </div>
                </button>
              )) || [0, 1, 2, 3].map((i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImg(i)}
                  className={cn(
                    "relative aspect-square rounded-[2rem] bg-white dark:bg-white/5 border transition-all duration-500 overflow-hidden",
                    selectedImg === i 
                      ? "border-primary p-1 scale-105 shadow-xl" 
                      : "border-black/5 dark:border-white/5 hover:border-primary/50"
                  )}
                >
                  <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
                    <Image src={product.img} alt="Thumb" fill className={cn("object-cover transition-all duration-700", selectedImg !== i && "grayscale opacity-50 hover:grayscale-0 hover:opacity-100")} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO (5 COLS) */}
          <div className="lg:col-span-5 space-y-16 py-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-[#8da9c4] text-white border-none px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em]">
                    {t(`shop.categories.${product.cat}`)}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">4.9</span>
                    <span className="text-[10px] text-foreground/40 font-bold ml-1 uppercase">(124 {t('shop.reviews')})</span>
                  </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.022em] leading-[0.9] uppercase">
                  {t(`shop.products.${product.key}`)}
                </h1>
              </div>

              <div className="flex items-baseline gap-6">
                <p className="text-5xl md:text-6xl font-bold text-primary tracking-[-0.022em]">
                  ${product.price.toLocaleString('es-CO')}
                </p>
                <p className="text-2xl text-foreground/20 line-through font-bold decoration-red-500/30">
                  ${(product.price * 1.25).toLocaleString('es-CO')}
                </p>
                <div className="ml-auto">
                   <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-bold text-[10px] rounded-full px-4 py-1">{t('shop.save')} 25%</Badge>
                </div>
              </div>

              <p className="text-lg md:text-xl text-foreground/50 leading-relaxed font-medium">
                {t('shop.product_desc_fallback')}
              </p>
            </motion.div>

            {/* SELECTION AREA (GLASS BOX) */}
            <div className="space-y-10 p-12 rounded-[4rem] bg-white dark:bg-white/[0.03] border border-white dark:border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 block mb-1">{t('shop.quantity')}</span>
                    <span className="text-xs font-bold text-foreground/20">{t('shop.max_units')}</span>
                  </div>
                  <div className="flex items-center gap-8 p-3 rounded-[2rem] bg-surface dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold w-8 text-center tabular-nums">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  size="xl" 
                  className={cn(
                    "w-full h-24 rounded-[2.5rem] text-2xl font-bold transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative group/btn",
                    isAdded 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                      : "bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:scale-[1.03] active:scale-95"
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.div 
                        key="added"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        className="flex items-center gap-4"
                      >
                        <CheckCircle2 className="w-8 h-8" /> {t<string>('cart.coupon_applied')}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="add"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -30, opacity: 0 }}
                        className="flex items-center gap-4 transition-transform group-hover/btn:scale-105"
                      >
                        <ShoppingBag className="w-8 h-8" /> {t<string>('shop.add_to_cart')}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>

                {/* TRUST ICONS GRID */}
                <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-black/5 dark:border-white/5">
                  {[
                    { icon: <Truck className="w-5 h-5" />, label: t('shop.free_shipping'), sub: "Colombia" },
                    { icon: <ShieldCheck className="w-5 h-5" />, label: t('shop.guarantee'), sub: `12 ${t('shop.months')}` },
                    { icon: <RotateCcw className="w-5 h-5" />, label: t('shop.changes'), sub: `30 ${t('shop.days')}` }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2 group/icon">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover/icon:bg-primary group-hover/icon:text-white transition-all duration-500">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.05em]">{item.label}</p>
                        <p className="text-[8px] font-bold text-foreground/30 uppercase">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PRODUCT CONTENT TABS (APPLE STYLE) */}
            <div className="space-y-10">
              <div className="flex gap-12 border-b border-black/5 dark:border-white/5">
                {[
                  { id: "description", label: t('shop.description') },
                  { id: "details", label: t('shop.details_title') },
                  { id: "shipping", label: t('checkout.steps.shipping') }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-6 text-xs font-bold uppercase tracking-[0.3em] transition-all relative",
                      activeTab === tab.id ? "text-primary" : "text-foreground/30 hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-underline-premium" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-[0_4px_10px_rgba(var(--primary),0.3)]" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div 
                      key="desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <p className="text-xl font-medium text-foreground/60 leading-relaxed">
                        &quot;{t('shop.quote')}&quot;
                      </p>
                      <p className="text-lg text-foreground/50 leading-relaxed">
                        {t('shop.detail_desc')}
                      </p>
                    </motion.div>
                  )}
                  {activeTab === "details" && (
                    <motion.div 
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 gap-y-6 gap-x-12"
                    >
                      {[
                        { l: t('shop.specs.material'), v: product.specs?.material || "Premium Eco-Cotton" },
                        { l: t('shop.specs.dimensions'), v: product.specs?.dimensions || "Variable" },
                        { l: t('shop.specs.weight'), v: product.specs?.weight || "N/A" },
                        { l: t('shop.specs.finish'), v: product.specs?.finish || "Handmade" },
                        { l: t('shop.specs.care'), v: product.specs?.care || "Dry clean only" },
                        { l: t('shop.specs.origin'), v: product.specs?.origin || "Colombia" }
                      ].map((spec, i) => (
                        <div key={i} className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/30 block">{spec.l}</span>
                          <span className="text-sm font-bold text-foreground/70">{spec.v}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === "shipping" && (
                    <motion.div 
                      key="shipping"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-8 rounded-[2.5rem] bg-surface dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4"
                    >
                      <div className="flex items-center gap-4 text-primary">
                         <Truck className="w-8 h-8" />
                         <span className="text-lg font-bold tracking-tight">{t('shop.priority_shipping')}</span>
                      </div>
                      <p className="text-base text-foreground/50 font-medium">
                        {t('shop.priority_desc')}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <section className="mt-40 space-y-16">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.022em] uppercase">{t('shop.related_products')}</h2>
            <Link href="/shop" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.05em] hover:text-primary transition-colors">
              {t('shop.explore_all')} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {PRODUCT_DATA.filter(p => p.key !== product.key).slice(0, 4).map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/shop/${p.key}`} className="group block space-y-6">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-white/5 shadow-lg shadow-black/5 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-3">
                    <Image src={p.img} alt={t(`shop.products.${p.key}`) as string} fill className="object-cover transition-transform duration-[1500ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                       <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                          <Plus className="w-8 h-8" />
                       </div>
                    </div>
                  </div>
                  <div className="px-2 space-y-1">
                    <h4 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors truncate">{t(`shop.products.${p.key}`)}</h4>
                    <p className="text-sm font-bold text-primary">${p.price.toLocaleString('es-CO')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
