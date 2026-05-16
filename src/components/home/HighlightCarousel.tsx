"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"

interface Slide {
  id: number
  image: string
  link: string
}

const slides: Slide[] = [
  { id: 1, image: "/images/highlights/soulmar-brand.png", link: "/book" },
  { id: 2, image: "/images/highlights/soulmar-terapeutas.png", link: "/book" },
  { id: 3, image: "/images/highlights/soulmar-academy.png", link: "/retreats" },
]

export function HighlightCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { t } = useTranslation()

  const slideNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const slidePrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto-play with moderated interval (7 seconds as requested)
  useEffect(() => {
    const timer = setInterval(slideNext, 7000)
    return () => clearInterval(timer)
  }, [slideNext])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  }

  return (
    <section className="w-full bg-background dark:bg-[#0b0b0c] py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 mb-8">
         <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#f5f5f7]">
            {t('home.highlights_title') || "Mira lo más destacado."}
         </h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div 
          className={cn(
            "relative w-full overflow-hidden rounded-[20px] group border border-black/5 dark:border-white/5",
            "h-[160px] md:h-auto md:aspect-[1280/276]",
            "shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
          )}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.4 }
              }}
              className="absolute inset-0"
            >
              <Link href={slides[currentIndex].link} className="block w-full h-full">
                <Image 
                  src={slides[currentIndex].image} 
                  alt={`Slide ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows (Apple Style) */}
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 z-10 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault()
                slidePrev()
              }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 flex items-center justify-center text-white md:text-black dark:md:text-white hover:bg-white/40 dark:hover:bg-black/40 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                slideNext()
              }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 flex items-center justify-center text-white md:text-black dark:md:text-white hover:bg-white/40 dark:hover:bg-black/40 transition-all pointer-events-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1)
                  setCurrentIndex(i)
                }}
                className={cn(
                  "h-1.5 transition-all duration-500 rounded-full",
                  currentIndex === i 
                    ? "w-8 bg-white" 
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

