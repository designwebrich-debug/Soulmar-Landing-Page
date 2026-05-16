"use client"

import Link from "next/link"
import { ArrowRight, Heart, BookOpen, Calendar } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"

export function ServicesSection() {
  const { t } = useTranslation()

  return (
    <Section className="bg-background dark:bg-[#0b0b0c] py-24 md:py-32 transition-colors duration-500 relative overflow-hidden">
      {/* Cinematic Background Accents */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#8da9c4]/5 blur-[120px] rounded-full -mr-20 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#c9cba3]/5 blur-[100px] rounded-full -ml-20 -mb-20" />

      <div className="max-w-4xl mx-auto text-center mb-24 space-y-4 px-6 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
          {t('services.title')}
        </h2>
        <p className="text-xl text-[#1d1d1f]/50 dark:text-white/40 font-medium">
          {t('services.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6 relative z-10">
        {/* Card 1: Terapia Online */}
        <Link href="/book" className="group relative h-full block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8da9c4]/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 flex flex-col items-center text-center border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(141,169,196,0.15)] transition-all duration-700 hover:-translate-y-2 cursor-pointer h-full">
            <div className="w-24 h-24 rounded-3xl bg-[#8da9c4] flex items-center justify-center mb-12 shadow-2xl shadow-[#8da9c4]/30 transform group-hover:rotate-12 transition-transform duration-500">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-[#1d1d1f] dark:text-white group-hover:text-primary transition-colors">
              {t('services.items.0.title')}
            </h3>
            <p className="text-[#1d1d1f]/50 dark:text-white/40 text-base leading-snug mb-10 flex-1 font-medium">
              {t('services.items.0.desc')}
            </p>
            <div className="text-primary text-sm font-bold flex items-center gap-2 group-hover:gap-5 transition-all tracking-[0.05em] uppercase">
              {t('common.details')} <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Card 2: Cursos Digitales */}
        <Link href="/courses" className="group relative h-full block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc971]/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 flex flex-col items-center text-center border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(255,201,113,0.15)] transition-all duration-700 hover:-translate-y-2 cursor-pointer h-full">
            <div className="w-24 h-24 rounded-3xl bg-[#ffc971] flex items-center justify-center mb-12 shadow-2xl shadow-[#ffc971]/30 transform group-hover:rotate-12 transition-transform duration-500">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-[#1d1d1f] dark:text-white group-hover:text-secondary-yellow transition-colors">
              {t('services.items.1.title')}
            </h3>
            <p className="text-[#1d1d1f]/50 dark:text-white/40 text-base leading-snug mb-10 flex-1 font-medium">
              {t('services.items.1.desc')}
            </p>
            <div className="text-secondary-yellow text-sm font-bold flex items-center gap-2 group-hover:gap-5 transition-all tracking-[0.05em] uppercase">
              {t('common.details')} <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Card 3: Soulmar Camp */}
        <Link href="/retreats" className="group relative h-full block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9cba3]/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-12 flex flex-col items-center text-center border border-white/40 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(201,203,163,0.15)] transition-all duration-700 hover:-translate-y-2 cursor-pointer h-full">
            <div className="w-24 h-24 rounded-3xl bg-[#c9cba3] flex items-center justify-center mb-12 shadow-2xl shadow-[#c9cba3]/30 transform group-hover:rotate-12 transition-transform duration-500">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-[#1d1d1f] dark:text-white group-hover:text-secondary-olive transition-colors">
              {t('services.items.2.title')}
            </h3>
            <p className="text-[#1d1d1f]/50 dark:text-white/40 text-base leading-snug mb-10 flex-1 font-medium">
              {t('services.items.2.desc')}
            </p>
            <div className="text-secondary-olive text-sm font-bold flex items-center gap-2 group-hover:gap-5 transition-all tracking-[0.05em] uppercase">
              {t('common.details')} <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
    </Section>
  )
}
