"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight, ShoppingBag } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/shop/ProductCard"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

interface Product {
  id: string | number;
  key: string;
  category: string;
  price: number;
  image_url: string;
}

export function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const { t } = useTranslation()
  const [activeCat, setActiveCat] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // We utilize the initial products fetched securely from the Server Component
  const products = initialProducts
  
  const containerRef = useRef<HTMLDivElement>(null)

  const categories = ["all", "accessories", "clothing", "souvenirs", "ebooks"]

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCat === "all" || (p.category as string)?.toLowerCase() === activeCat.toLowerCase()
    const matchesSearch = (t(`shop.products.${p.key}`) as string).toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const newDrops = products.slice(0, 3).map((p: Product) => ({ ...p, isNew: true }))

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#0b0b0c] transition-colors duration-500">
      
      {/* 1. EDITORIAL HERO SECTION (APPLE STYLE) */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 scale-105">
           <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white dark:from-black/40 dark:via-transparent dark:to-[#0b0b0c] z-10" />
           <div 
             className="w-full h-full bg-cover bg-center animate-subtle-zoom opacity-30 dark:opacity-100 transition-opacity duration-1000"
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545231027-63b3f162ad0e?auto=format&fit=crop&q=80&w=2000")' }}
           />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-[#111111] dark:text-white text-[10px] font-bold tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer hover:bg-secondary-yellow hover:text-[#111111] dark:hover:bg-secondary-yellow dark:hover:text-[#111111]">
              {t('shop.hero_badge')}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.05] whitespace-pre-line drop-shadow-sm dark:drop-shadow-lg">
              {t('shop.hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-[#111111]/60 dark:text-white/80 max-w-xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              {t('shop.hero_subtitle')}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button 
               onClick={() => containerRef.current?.scrollIntoView({ behavior: 'smooth' })}
               className="rounded-full h-14 px-10 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#8da9c4] dark:hover:bg-[#8da9c4] hover:text-white transition-all duration-500 font-semibold group shadow-2xl"
            >
              {t('shop.hero_cta')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. NAVIGATION & SEARCH BAR (MINIMALIST) */}
      <div id="shop-content" ref={containerRef} className="sticky top-20 z-40 bg-white/80 dark:bg-[#0b0b0c]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-4 transition-all">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto py-2 px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 whitespace-nowrap",
                  activeCat === cat 
                    ? "bg-[#111111] text-white dark:bg-white dark:text-[#111111] shadow-lg scale-105" 
                    : "text-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                {t(`shop.categories.${cat}`)}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('shop.search_placeholder') as string} 
              className="w-full h-11 pl-11 pr-6 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-24">
        
        {/* 3. NEW DROPS SECTION (IF NO SEARCH) */}
        {!searchQuery && activeCat === "all" && (
          <section className="space-y-10">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-primary font-bold tracking-[0.08em] text-[10px] uppercase">
                  {t('shop.featured')}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#111111] dark:text-[#f5f5f7]">
                  {t('shop.new_drops')}
                </h2>
              </div>
              <div className="h-[2px] flex-grow mx-10 bg-black/5 dark:bg-white/5 hidden lg:block" />
              <ShoppingBag className="w-8 h-8 text-foreground/20 hidden lg:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {newDrops.map((p, i) => (
                <ProductCard key={`${p.id}-new`} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 4. MAIN PRODUCT GRID */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#f5f5f7]">
              {searchQuery ? `${t('shop.search_placeholder')} "${searchQuery}"` : t('shop.all_products')}
            </h2>
            <div className="flex-grow h-px bg-black/5 dark:bg-white/5" />
            <Badge variant="outline" className="rounded-full border-black/10 dark:border-white/10 font-medium">
              {filteredProducts.length} {(t('shop.products_word') as string || "").toLowerCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-40 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-foreground/20" />
              </div>
              <p className="text-xl font-medium text-foreground/40">
                {t('shop.no_results')}
              </p>
            </motion.div>
          )}
        </section>
      </div>

      {/* 5. EDITORIAL FOOTER / NEWSLETTER BANNER (REFLOW) */}
      <section className="container mx-auto px-6 pb-20 pt-10">
        <div className="w-full bg-[#ffc971] dark:bg-[#ffc971]/90 rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-[3000ms] group-hover:scale-150" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-[#111111] leading-[1.1] tracking-[-0.022em]">
              {t('shop.bring_calm')}
            </h2>
            <p className="text-[#111111]/70 text-lg font-medium max-w-md">
              {t('shop.subscribe_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <input 
                 type="email" 
                 placeholder={t('footer.placeholder_email') as string}
                 className="h-14 px-8 rounded-full bg-white/50 backdrop-blur-md border border-black/5 outline-none focus:bg-white transition-all flex-grow font-medium placeholder:text-black/30"
              />
              <Button className="h-14 px-12 rounded-full bg-[#111111] text-white hover:bg-black/80 shadow-2xl transition-all font-bold tracking-tight">
                {t('shop.subscribe_btn')}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
