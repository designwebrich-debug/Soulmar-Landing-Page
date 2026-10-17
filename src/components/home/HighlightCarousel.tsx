"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"

interface Slide {
  id: number
  image: string
}

const slides: Slide[] = [
  { id: 1, image: "/images/highlights/SLIDER01.png" },
  { id: 2, image: "/images/highlights/SLIDER02.png" },
  { id: 3, image: "/images/highlights/SLIDER03.png" },
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
    <div className="relative w-full">
      <div 
        className={cn(
          "relative w-full overflow-hidden rounded-3xl md:rounded-[3rem] group border border-black/5 dark:border-white/5",
          "aspect-[16/10] sm:aspect-[21/9] md:aspect-[1928/625]",
          "shadow-[0_8px_40px_rgba(0,0,0,0.12)] cursor-grab active:cursor-grabbing"
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -40 || velocity.x < -300) {
                slideNext()
              } else if (offset.x > 40 || velocity.x > 300) {
                slidePrev()
              }
            }}
            transition={{
              x: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0"
          >
            <div className="block w-full h-full pointer-events-none select-none">
              <img 
                src={slides[currentIndex].image} 
                alt={`Slide ${currentIndex + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
                draggable={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows (Apple Style - subtle on mobile, expands on desktop hover) */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 sm:px-4 md:px-8 z-10 pointer-events-none">
          <button
            onClick={(e) => {
              e.preventDefault()
              slidePrev()
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 flex items-center justify-center text-white md:text-black dark:md:text-white hover:bg-white/70 dark:hover:bg-black/70 transition-all pointer-events-auto opacity-70 md:opacity-0 md:group-hover:opacity-100 transform active:scale-90"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              slideNext()
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 flex items-center justify-center text-white md:text-black dark:md:text-white hover:bg-white/70 dark:hover:bg-black/70 transition-all pointer-events-auto opacity-70 md:opacity-0 md:group-hover:opacity-100 transform active:scale-90"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-10">
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
                  ? "w-6 sm:w-8 bg-white shadow-sm" 
                  : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

