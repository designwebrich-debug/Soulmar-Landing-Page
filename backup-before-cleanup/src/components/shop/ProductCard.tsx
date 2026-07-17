"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Star, Plus } from "lucide-react"
import { cn, formatPrice, formatCOPtoUSD } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { useTranslation } from "@/context/LanguageContext"
import { Badge } from "@/components/ui/Badge"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: string | number
    key: string
    price: number
    category: string
    image_url: string
    isNew?: boolean
  }
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { t } = useTranslation()
  const { addToCart, toggleWishlist, wishlist } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const isLiked = wishlist.includes(product.key)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id.toString(),
      name: t(`shop.products.${product.key}`) as string,
      nameKey: `shop.products.${product.key}`,
      price: product.price,
      image: product.image_url,
      category: product.category,
      key: product.key
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.key)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/shop/${product.key}`} aria-label={t(`shop.products.${product.key}`) as string} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#f5f5f7] dark:bg-[#1c1c1e] transition-all duration-700 ease-[0.22, 1, 0.36, 1] group-hover:shadow-2xl group-hover:shadow-black/10 dark:group-hover:shadow-white/5">
          {/* Product Image */}
          <Image
            src={product.image_url}
            alt={t(`shop.products.${product.key}`) as string}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-[#8da9c4] hover:bg-[#8da9c4] text-white border-none py-1.5 px-4 rounded-full text-xs font-bold tracking-tight shadow-md uppercase">
                {t('courses.badge_new')}
              </Badge>
            )}
            <Badge className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-[#111111] dark:text-white border-none py-1.5 px-4 rounded-full text-[10px] font-bold tracking-[0.02em] uppercase">
              {t(`shop.categories.${product.category}`)}
            </Badge>
          </div>

          {/* Actions Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-20 bg-black/5 flex items-center justify-center gap-4 backdrop-blur-[2px]"
              >
                <button
                  onClick={handleToggleWishlist}
                  aria-label={isLiked ? (t('shop.remove_from_wishlist') as string) : (t('shop.add_to_wishlist') as string)}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                    isLiked 
                      ? "bg-white text-red-500 scale-110" 
                      : "bg-white/90 text-[#111111] hover:bg-white hover:scale-110"
                  )}
                >
                  <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
                </button>
                <button
                  onClick={handleAddToCart}
                  aria-label={t('shop.add_to_cart') as string}
                  className="w-14 h-14 rounded-full bg-white/90 text-[#111111] flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quick Add Button (Mobile Friendly) */}
          <button 
            onClick={handleAddToCart}
            aria-label={t('shop.add_to_cart') as string}
            className="absolute bottom-6 right-6 z-10 md:hidden w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#111111]"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-6 space-y-1.5 px-2">
          <div className="flex justify-between items-start">
            <h4 className="text-lg md:text-xl font-semibold tracking-tight text-[#111111] dark:text-[#f5f5f7] transition-colors duration-300">
              {t(`shop.products.${product.key}`)}
            </h4>
            <div className="flex items-center gap-1.5 bg-secondary-yellow/10 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-secondary-yellow text-secondary-yellow" />
              <span className="text-xs font-bold text-secondary-yellow">4.9</span>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg md:text-xl font-bold text-primary dark:text-[#8da9c4] uppercase tracking-[-0.022em]">
              {formatPrice(product.price)}
            </p>
            <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-tight mt-0.5">
              ({formatCOPtoUSD(product.price)})
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
