"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Calendar, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"

function BreathingWave() {
  return (
    <div className="flex items-center justify-center gap-1.5 h-8 px-3.5 py-1 bg-black/60 border border-white/10 rounded-full backdrop-blur-md shadow-xl">
      <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest mr-1">Regulación emocional</span>
      <div className="flex items-center gap-1 h-3.5">
        {[1, 2, 3, 4, 5].map((val) => (
          <motion.span
            key={val}
            className="w-[2px] bg-[#8da9c4] rounded-full"
            animate={{
              scaleY: [0.3, 1.2, 0.3],
              backgroundColor: ["#8da9c4", "#1D9E75", "#8da9c4"]
            }}
            transition={{
              duration: 1.5 + (val * 0.25),
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ height: '14px', transformOrigin: 'center' }}
          />
        ))}
      </div>
    </div>
  )
}

export function CinemaHero() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full min-h-screen lg:h-screen overflow-hidden bg-[#060608] flex items-center pt-24 lg:pt-0">
      {/* Dynamic ambient radial glows (Silicon Valley Visual Depth) */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#8da9c4]/15 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse duration-[10s]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-[#BA7517]/8 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-16 items-center">
          
          {/* COLUMN 1: MARKETING & VALUE PROP */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-6 md:space-y-8 text-left"
          >
            {/* Real-time status badge */}
            <div className="inline-flex items-center gap-2 bg-[#1D9E75]/10 border border-[#1D9E75]/25 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#1D9E75] relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D9E75]" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75]">
                {t('hero.badge')}
              </span>
            </div>

            {/* Apple style headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-tight text-white leading-[1.05] font-sans">
              {t('hero.title_part1')} <br className="hidden sm:inline" />
              <span className="text-[#8da9c4] block mt-1">
                {t('hero.title_part2')}
              </span>
            </h1>

            {/* Persuasive subtitle */}
            <p className="text-sm md:text-base text-neutral-400 font-medium leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button */}
            <div>
              <Link 
                href="/#agendamiento" 
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="inline-block w-full sm:w-auto"
              >
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-black hover:bg-[#8da9c4] hover:text-white font-bold text-xs uppercase tracking-widest rounded-full px-12 h-16 shadow-2xl transition-all duration-300 transform hover:scale-[1.04] active:scale-95 border-none cursor-pointer"
                >
                  {t('hero.cta_primary')}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-900">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#8da9c4] shrink-0 mt-0.5" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_sessions')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1D9E75] shrink-0 mt-0.5" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_satisfaction')}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#BA7517] shrink-0 mt-0.5" />
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block leading-tight">
                  {t('hero.stats_secure')}
                </span>
              </div>
            </div>

          </motion.div>

          {/* COLUMN 2: INTERACTIVE GLASSMORPHIC CONSOLE */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center pt-8 lg:pt-0">
            {/* Layered Interactive Frame */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[360px] sm:max-w-[380px] aspect-[4/5] rounded-[32px] overflow-visible"
            >
              {/* Backglow element on the container */}
              <div className="absolute inset-0 bg-[#8da9c4]/5 rounded-[32px] blur-xl -z-10" />

              {/* Main Card (Doctor Portrait) */}
              <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] bg-neutral-950">
                <Image 
                  src="/images/hero-soulmar-cozy.jpg" 
                  alt="Dra. Mariana Caicedo" 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                
                {/* Visual mask shadow gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Dr. credentials overlay at bottom */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2.5 text-left">
                  <div className="inline-flex items-center gap-1.5 bg-black/45 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] relative flex">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1D9E75]" />
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#1D9E75]">
                      En línea y disponible
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">Dra. Mariana Caicedo</h3>
                    <p className="text-[9px] text-[#8da9c4] font-black uppercase tracking-widest">
                      Psicología Clínica y Bienestar Radical
                    </p>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 1: Siri Breathing Wave (Top Left) */}
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[-24px] left-[-20px] sm:left-[-32px] z-20 pointer-events-auto"
              >
                <BreathingWave />
              </motion.div>

              {/* FLOATING CARD 2: Quick-Book Shortcut Widget (Bottom Left/Center) */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-24px] left-[-24px] sm:left-[-36px] z-20 w-[240px] bg-neutral-950/95 border border-white/15 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-[#8da9c4] uppercase tracking-wider block">
                      Siguiente espacio libre
                    </span>
                    <span className="text-xs font-black text-white block">
                      Hoy, 4:00 PM (Col)
                    </span>
                  </div>
                  
                  <Link 
                    href="/#agendamiento"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block"
                  >
                    <Button 
                      className="w-full bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white font-bold text-[9px] uppercase tracking-widest rounded-full h-9 shadow-lg transition-transform duration-300 transform hover:scale-[1.03] active:scale-95 border-none cursor-pointer"
                    >
                      {t('hero.cta_secondary')}
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* FLOATING CARD 3: Confidentiality Lock (Top Right) */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-[32px] right-[-24px] sm:right-[-36px] z-20 bg-black/70 border border-white/10 rounded-2xl px-3 py-2 shadow-2xl backdrop-blur-md flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#BA7517]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-white block uppercase tracking-wider leading-none">Confidencial</span>
                  <span className="text-[7px] text-neutral-400 font-bold uppercase tracking-widest block leading-none">100% Privado</span>
                </div>
              </motion.div>

            </motion.div>
          </div>

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
