"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"

export function CinemaHero() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full min-h-screen lg:h-screen overflow-hidden bg-[#0C0C0D] flex items-center pt-24 lg:pt-0">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8da9c4]/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#BA7517]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* COLUMN 1: TEXT CONTENT (Selia Inspired) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6 md:space-y-8 text-left"
          >
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] font-sans">
              {t('hero.title_part1')}{" "}
              <span className="text-[#8da9c4] block sm:inline">
                {t('hero.title_part2')}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm md:text-base text-neutral-400 font-medium leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/#agendamiento" 
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-[#8da9c4] hover:bg-[#8da9c4]/90 text-white font-bold text-xs uppercase tracking-widest rounded-full px-10 h-14 shadow-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 border-none cursor-pointer"
                >
                  {t('hero.cta_primary')}
                </Button>
              </Link>
              <Link 
                href="/book" 
                className="w-full sm:w-auto"
              >
                <Button 
                  size="xl" 
                  variant="outline" 
                  className="w-full sm:w-auto border border-white/20 hover:border-white/40 bg-transparent text-white font-bold text-xs uppercase tracking-widest rounded-full px-10 h-14 hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                >
                  {t('hero.cta_secondary')}
                </Button>
              </Link>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800/80">
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black text-white block">+10k</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_sessions')}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black text-[#1D9E75] block">98%</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_satisfaction')}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xl md:text-2xl font-black text-white block">100%</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_secure')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2: IMAGE (Inspired by Selia / generated cozy wellness image) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-6 relative w-full flex items-center justify-center"
          >
            {/* Ambient Glow behind image */}
            <div className="absolute w-[80%] h-[80%] bg-[#8da9c4]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute w-[50%] h-[50%] bg-[#BA7517]/8 rounded-full blur-[85px] -z-10 -bottom-10 -right-10 pointer-events-none" />

            <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] lg:aspect-[3/2] rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 group">
              <Image 
                src="/images/hero-soulmar-cozy.jpg" 
                alt="Bienestar Soulmar" 
                fill 
                className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
      >
        <button 
           onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
           className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
           aria-label={t('hero.scroll') as string}
        >
           <span className="text-[8px] uppercase tracking-[0.2em] font-black">{t('hero.scroll')}</span>
           <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </motion.div>
    </section>
  )
}
