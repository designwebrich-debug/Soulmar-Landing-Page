"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"

interface Slide {
  id: number
  image: string
  link: string
  hoverColor: "blue" | "yellow"
}

const slides: Slide[] = [
  { id: 1, image: "/images/highlights/human-connections.png", link: "/book", hoverColor: "blue" },
  { id: 3, image: "/images/highlights/camp_v4.png", link: "/retreats", hoverColor: "blue" },
]

export function HighlightCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()

  const handleScroll = () => {
    if (!containerRef.current || containerRef.current.children.length === 0) return
    const scrollLeft = containerRef.current.scrollLeft
    const item = containerRef.current.children[0] as HTMLElement
    const itemWidth = item.offsetWidth + 32 // 32 is the gap (gap-8)
    const index = Math.round(scrollLeft / itemWidth)
    setActiveIndex(Math.min(index, slides.length - 1))
  }

  const scrollTo = (index: number) => {
    if (!containerRef.current || containerRef.current.children.length === 0) return
    const item = containerRef.current.children[0] as HTMLElement
    const itemWidth = item.offsetWidth + 32
    containerRef.current.scrollTo({
      left: index * itemWidth,
      behavior: "smooth"
    })
  }

  // Effect to handle window resize and recalculate state if needed
  useEffect(() => {
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  interface SlideContent {
    title: string
    subtitle: string
    cta: string
  }
  
  // Get translated content for slides
  const translatedSlides = t<SlideContent[]>('home.highlights', { returnObjects: true }) || []

  return (
    <div className="w-full bg-background dark:bg-[#0b0b0c] py-20 transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-12 flex items-baseline justify-between">
         <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#111111] dark:text-[#f5f5f7]">
            {t('home.highlights_title') || "Mira lo más destacado."}
         </h2>
         <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
              className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all disabled:opacity-30"
              disabled={activeIndex === 0}
              aria-label={(t('common.previous') as string) || "Anterior"}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scrollTo(Math.min(slides.length - 1, activeIndex + 1))}
              className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground hover:bg-black/10 dark:hover:bg-white/10 transition-all disabled:opacity-30"
              disabled={activeIndex === slides.length - 1}
              aria-label={(t('common.next') as string) || "Siguiente"}
            >
               <ChevronRight className="w-6 h-6" />
            </button>
         </div>
      </div>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[calc((100vw-min(1440px,100vw-48px))/2)] pb-12 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'auto' }}
      >
        {slides.map((slide, i) => {
          const content = translatedSlides[i] || {}
          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="min-w-[85vw] md:min-w-[800px] lg:min-w-[1000px] aspect-[16/9] md:aspect-[21/9] snap-center rounded-[2.5rem] overflow-hidden relative group shadow-2xl border border-black/5 dark:border-white/5"
            >
              {/* Background Image with Hover Scale */}
              <div className="absolute inset-0 z-0">
                 <Image 
                   src={slide.image} 
                   alt={content.title || `Highlight ${slide.id}`} 
                   fill 
                   className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                   sizes="(max-width: 768px) 100vw, 1200px"
                 />
                 
                 {/* 
                    LEGIBILITY OVERLAY (REQUESTED)
                    Bottom-left focused gradient to ensure text readability 
                    Opacity 20-35% as suggested 
                 */}
                 <div className={cn(
                   "absolute inset-0 z-10 transition-opacity duration-500",
                   "bg-gradient-to-tr from-black/25 via-black/10 to-transparent dark:from-black/40 dark:via-black/20",
                   "opacity-100 group-hover:opacity-90"
                 )} />
              </div>

              {/* Content Container - Responsive positioning and styling */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16 lg:p-20">
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.6, delay: 0.3 }}
                   className="max-w-2xl space-y-3"
                 >
                   <h3 className="text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-white dark:text-white drop-shadow-md transition-colors duration-500">
                     {content.title}
                   </h3>
                   <p className="text-base md:text-lg font-medium text-white/80 dark:text-white/70 max-w-lg leading-snug transition-colors duration-500 drop-shadow-sm">
                     {content.subtitle}
                   </p>
                   <div className="pt-6">
                      <Link href={slide.link}>
                        <Button 
                          className={cn(
                            "rounded-full px-10 h-14 text-base font-semibold shadow-xl group/btn transition-all duration-300 ease-in-out hover:scale-[1.03]",
                            "bg-white text-[#111111] border-transparent hover:text-white",
                            slide.hoverColor === "blue" ? "hover:bg-[#8da9c4] hover:border-[#8da9c4]" : "hover:bg-[#ffc971] hover:border-[#ffc971]"
                          )}
                        >
                          {content.cta}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                   </div>
                 </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1.5 transition-all duration-700 rounded-full",
              activeIndex === i 
                ? "w-8 bg-[#111111] dark:bg-white" 
                : "w-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
            )}
            aria-label={`${t('common.go_to_slide') || 'Go to slide'} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
