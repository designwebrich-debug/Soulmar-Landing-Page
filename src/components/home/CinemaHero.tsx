"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"

export function CinemaHero() {
  const { t } = useTranslation()

  // Video Cinematic Sequence:
  // 1. Pause/Breath (Nature)
  // 2. Light/Transformation (Golden Hour)
  // Source: 4K Premium Nature Footage
  const videoUrl = "https://static.videezy.com/system/resources/previews/000/004/410/original/P1002244.mp4"
  const posterUrl = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2000"

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-black flex items-center justify-center">
      {/* BACKGROUND VIDEO (Full Viewport) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover scale-[1.01] brightness-75"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Dynamic Overlay (Cinematic Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
      </div>

      {/* CONTENT OVERLAY */}
      <div className="relative z-20 w-full px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
           className="w-full flex flex-col items-center justify-center mx-auto transform -translate-y-[8vh]"
        >
          {/* Logo Section (Apple Style Hero Branding) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-[-2rem] md:mb-[-4rem]"
          >
            <div className="relative w-[80vw] aspect-[2/1] max-w-[1400px]">
              <Image 
                src="/diseño/logos/logoparabannerprincipal.png" 
                alt="Soulmar Logo" 
                fill 
                className="object-contain brightness-0 invert"
                priority
                sizes="(max-width: 768px) 80vw, 1200px"
              />
            </div>
          </motion.div>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="text-lg md:text-2xl text-white/90 font-medium tracking-tight max-w-3xl mx-auto leading-[1.1] mb-12"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link href="/book" className="w-full sm:w-auto">
              <Button 
                size="xl" 
                className="w-full sm:w-auto bg-white text-black hover:bg-primary hover:text-white rounded-full px-12 h-16 text-lg font-medium tracking-tight shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-none"
              >
                {t('hero.cta_primary')}
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                size="xl" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-secondary-yellow hover:border-secondary-yellow hover:text-black rounded-full px-12 h-16 text-lg font-medium tracking-tight shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {t('hero.cta_secondary')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR (Apple Style) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <button 
           onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
           className="flex flex-col items-center gap-2 text-white/40 animate-bounce cursor-pointer"
           aria-label={t('hero.scroll') as string}
        >
           <span className="text-[10px] uppercase tracking-[0.15em] font-bold">{t('hero.scroll')}</span>
           <ChevronDown className="w-6 h-6" />
        </button>
      </motion.div>
    </section>
  )
}
