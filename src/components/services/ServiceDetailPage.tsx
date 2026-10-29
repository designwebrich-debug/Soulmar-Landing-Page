"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Users,
  Sparkles,
  ClipboardList,
  Brain,
  CloudRain,
  Clock,
  Video,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  ChevronDown,
  MessageCircle,
  Check,
  Award,
  Sparkle,
  Compass,
  FileCheck2,
  Globe2,
  Lock,
} from "lucide-react"
import { FooterSection } from "@/components/home/FooterSection"
import { ServiceData, SERVICES_DATA } from "@/data/servicesData"
import { WHATSAPP_ID } from "@/lib/constants"
import { useTranslation } from "@/context/LanguageContext"
import { useMedia } from "@/context/MediaContext"

interface ServiceDetailPageProps {
  service: ServiceData
}

const ICON_MAP = {
  Heart,
  Users,
  Sparkles,
  ClipboardList,
  Brain,
  CloudRain,
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  const { language } = useTranslation()
  const { getMediaUrl } = useMedia()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Clave del slot multimedia para este servicio con soporte multidispositivo
  const slotKey = `service_page_${service.slug.replace(/-/g, "_")}`
  const desktopImg = getMediaUrl(slotKey, service.heroImage, "desktop")
  const mobileImg = getMediaUrl(slotKey, service.heroImage, "mobile")
  const tabletImg = getMediaUrl(slotKey, service.heroImage, "tablet")
  const therapistImg = getMediaUrl("therapist_mariana", "/images/therapists/mariana.png")

  // Construct other services for cross-navigation
  const otherServices = Object.values(SERVICES_DATA).filter(
    (s) => s.slug !== service.slug
  )

  const whatsappHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_ID}&text=${encodeURIComponent(
    service.whatsappMessage
  )}`

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0b0b0c] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500 overflow-x-hidden selection:bg-[#8da9c4]/30 selection:text-foreground">
      
      {/* =========================================================================
          HERO SECTION (APPLE PRO & SOULMAR CINEMATIC DESIGN)
          ========================================================================= */}
      <section className="relative pt-6 md:pt-12 pb-16 md:pb-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* Ambient background glows */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[70vw] max-w-4xl h-[350px] blur-[140px] rounded-full pointer-events-none opacity-40 dark:opacity-20 transition-all duration-700"
          style={{ backgroundColor: service.themeColor }}
        />
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#8da9c4]/20 blur-[100px] rounded-full pointer-events-none" />

        {/* DRAFT INDICATOR (LOCAL DEV PREVIEW) */}
        <div className="relative z-10 mb-5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Modo Borrador Localhost • Esta página no es visible para usuarios reales en producción</span>
        </div>

        {/* BREADCRUMB NAVIGATION */}
        <div className="relative z-10 flex items-center gap-2 text-xs md:text-sm font-medium text-[#1d1d1f]/60 dark:text-white/50 mb-6">
          <Link
            href="/"
            className="hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Inicio</span>
          </Link>
          <span className="text-[#1d1d1f]/30 dark:text-white/20">/</span>
          <Link
            href="/#servicios"
            className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
          >
            Servicios
          </Link>
          <span className="text-[#1d1d1f]/30 dark:text-white/20">/</span>
          <span className="text-[#1d1d1f] dark:text-white font-semibold">
            {service.shortTitle}
          </span>
        </div>

        {/* HERO CONTENT GRID */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: TITLE, BADGE, SUBTITLE & CTAS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* BADGE PILL */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.08] backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-sm">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: service.themeColor }}
              />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/80 dark:text-white/80">
                {service.categoryBadge}
              </span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.08]">
              {service.title}
            </h1>

            {/* TAGLINE & EMOTIONAL HOOK */}
            <p className="text-xl sm:text-2xl font-semibold text-[#1d1d1f]/90 dark:text-white/90 leading-snug">
              {service.tagline}
            </p>

            {/* HERO CLINICAL DESCRIPTION */}
            <p className="text-base sm:text-lg text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed max-w-2xl font-normal">
              {service.heroDescription}
            </p>

            {/* CTA BUTTONS ROW */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/#agendamiento"
                className="inline-flex items-center justify-center gap-3 px-8 h-14 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-base font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <Calendar className="w-5 h-5 text-[#ffc971]" />
                <span>Agendar Sesión Online</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 h-14 rounded-full bg-white/90 dark:bg-white/[0.06] backdrop-blur-xl border border-black/10 dark:border-white/15 text-[#1d1d1f] dark:text-white text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

            {/* CONFIDENTIALITY BADGE MICRO-BAR */}
            <div className="pt-2 flex items-center gap-5 text-xs text-[#1d1d1f]/60 dark:text-white/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8da9c4]" />
                <span>100% Confidencial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-[#8da9c4]" />
                <span>Videollamada Privada HD</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-[#8da9c4]" />
                <span>Atención Internacional</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HERO VISUAL CARD (GLASS & ARTWORK) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[36px] md:rounded-[44px] overflow-hidden bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.08)] aspect-[4/3] sm:aspect-[16/11]">
              
              {/* Background cover image responsive por dispositivo (PC, Celular, iPad) */}
              {Boolean(desktopImg || mobileImg) && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <picture className="w-full h-full block">
                    <source media="(max-width: 767px)" srcSet={mobileImg || desktopImg} />
                    <source media="(max-width: 1024px)" srcSet={tabletImg || desktopImg} />
                    <img
                      src={desktopImg || mobileImg}
                      alt={service.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            APPLE SPECS BAR (DETALLES TÉCNICOS Y CLÍNICOS EN UN VISTAZO)
            ========================================================================= */}
        <div className="mt-12 md:mt-16 relative z-10">
          <div className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-5 md:p-6 border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/10">
            
            {/* SPEC 1: DURACIÓN */}
            <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/50 dark:text-white/40 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#8da9c4]" />
                <span>Duración</span>
              </div>
              <div className="text-sm md:text-base font-bold text-[#1d1d1f] dark:text-white">
                {service.quickSpecs.duration}
              </div>
            </div>

            {/* SPEC 2: MODALIDAD */}
            <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/50 dark:text-white/40 mb-1">
                <Video className="w-3.5 h-3.5 text-[#8da9c4]" />
                <span>Modalidad</span>
              </div>
              <div className="text-sm md:text-base font-bold text-[#1d1d1f] dark:text-white">
                {service.quickSpecs.modality}
              </div>
            </div>

            {/* SPEC 3: ENFOQUE PROFESIONAL */}
            <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/50 dark:text-white/40 mb-1">
                <Award className="w-3.5 h-3.5 text-[#8da9c4]" />
                <span>Enfoque Clínico</span>
              </div>
              <div className="text-sm md:text-base font-bold text-[#1d1d1f] dark:text-white line-clamp-2">
                {service.quickSpecs.approach}
              </div>
            </div>

            {/* SPEC 4: PROFESIONAL */}
            <div className="pt-2 md:pt-0 md:px-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/50 dark:text-white/40 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8da9c4]" />
                <span>Profesional</span>
              </div>
              <div className="text-sm md:text-base font-bold text-[#1d1d1f] dark:text-white">
                {service.quickSpecs.professional}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ¿CUÁNDO ES PARA TI? (EMPATÍA & RESONANCIA CLÍNICA)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8da9c4] mb-3">
            <Compass className="w-4 h-4" />
            <span>Identificación y Síntomas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15]">
            ¿Sientes que estás viviendo algo de esto?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed">
            Reconocer lo que estamos sintiendo es el primer paso para sanarlo. La mayoría de las personas que inician este proceso experimentan uno o varios de estos escenarios:
          </p>
        </div>

        {/* RESONANCE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {service.resonanceQuestions.map((question, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-black/15 dark:hover:border-white/20 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
                  style={{ backgroundColor: service.themeColor }}
                >
                  0{idx + 1}
                </div>
                <p className="text-base text-[#1d1d1f]/85 dark:text-white/80 leading-relaxed font-medium">
                  {question}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#8da9c4] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Espacio de trabajo guiado</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* REASSURANCE CALLOUT BOX */}
        <div className="mt-10 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#8da9c4]/10 via-[#c9cba3]/10 to-transparent border border-[#8da9c4]/20 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shrink-0 shadow-md">
            <Sparkle className="w-6 h-6 text-[#ffc971]" />
          </div>
          <p className="text-base sm:text-lg font-medium text-[#1d1d1f] dark:text-white/90 leading-relaxed">
            {service.reassuranceNote}
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: METODOLOGÍA PASO A PASO (ROADMAP CLÍNICO DE 4 FASES)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8da9c4] mb-3">
            <FileCheck2 className="w-4 h-4" />
            <span>Ruta Terapéutica</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15]">
            Nuestra Metodología Paso a Paso
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed">
            {service.methodologyOverview}
          </p>
        </div>

        {/* PHASES TIMELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {service.methodologyPhases.map((phase, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-7 md:p-9 border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 opacity-80"
                style={{ backgroundColor: service.themeColor }}
              />

              {/* PHASE HEADER */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]/20 dark:text-white/20 font-mono">
                  FASE {phase.number}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${service.themeColor}20`,
                    color: service.themeColor,
                  }}
                >
                  Paso {idx + 1}
                </span>
              </div>

              {/* TITLE & SUBTITLE */}
              <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f] dark:text-white mb-2">
                {phase.title}
              </h3>
              <p className="text-sm font-semibold text-[#8da9c4] mb-4">
                {phase.subtitle}
              </p>

              {/* DESCRIPTION */}
              <p className="text-[#1d1d1f]/70 dark:text-white/60 text-sm md:text-base leading-relaxed mb-6 font-normal">
                {phase.description}
              </p>

              {/* KEY OUTCOMES BULLETS */}
              <div className="space-y-2.5 pt-4 border-t border-black/5 dark:border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-[#1d1d1f]/60 dark:text-white/50 mb-1">
                  Logros Clave de esta fase:
                </div>
                {phase.keyOutcomes.map((outcome, oIdx) => (
                  <div key={oIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1d1d1f]/80 dark:text-white/80">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: service.themeColor }}
                    />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: EL ENFOQUE DE LA DRA. MARIANA CAICEDO (CREDENTIALS & BIO)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-2xl rounded-[36px] md:rounded-[48px] p-8 md:p-14 border border-black/5 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden">
          
          {/* Ambient inner glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8da9c4]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
            
            {/* LEFT COLUMN: MARIANA PHOTO & VERIFICATION */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 mb-6 group">
                <Image
                  src={therapistImg}
                  alt="Dra. Mariana Caicedo"
                  fill
                  quality={95}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white flex items-center justify-center gap-2">
                <span>Dra. Mariana Caicedo</span>
                <Image
                  src="/images/verified-badge.png"
                  alt="Verificado"
                  width={22}
                  height={22}
                  className="inline-block"
                />
              </h3>
              <p className="text-sm font-semibold text-[#8da9c4] mt-1">
                Psicóloga Clínica • Directora de Terapia en Soulmar
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold text-[#1d1d1f]/80 dark:text-white/80">
                  Enfoque Cognitivo-Conductual
                </span>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold text-[#1d1d1f]/80 dark:text-white/80">
                  Reg. Profesional Activo
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: PHILOSOPHY & PILLARS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8da9c4]">
                <Award className="w-4 h-4" />
                <span>{service.clinicalApproach.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-tight">
                {service.clinicalApproach.title}
              </h2>

              <p className="text-base sm:text-lg text-[#1d1d1f]/75 dark:text-white/70 leading-relaxed font-medium">
                {service.clinicalApproach.lead}
              </p>

              {/* QUOTE BLOCK */}
              <blockquote className="p-5 md:p-6 rounded-2xl bg-black/5 dark:bg-white/[0.04] border-l-4 border-[#8da9c4] text-base sm:text-lg italic text-[#1d1d1f]/90 dark:text-white/90 leading-relaxed">
                "{service.clinicalApproach.quote}"
              </blockquote>

              {/* 4 PILLARS LIST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {service.clinicalApproach.pillars.map((pillar, pIdx) => (
                  <div key={pIdx} className="space-y-1">
                    <div className="text-sm font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8da9c4]" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1d1d1f]/60 dark:text-white/50 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* SCIENTIFIC EVIDENCE FOOTNOTE */}
              <div className="pt-2 text-xs text-[#1d1d1f]/50 dark:text-white/40 italic">
                ℹ️ {service.clinicalApproach.evidenceNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: QUÉ LOGRARÁS (TRANSFORMATION & BENEFITS BENTO)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8da9c4] mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Resultados y Transformación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15]">
            Qué lograrás a través de este proceso
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed">
            La terapia no es solo para desahogarse; es para construir cambios medibles y sostenibles en cómo piensas, sientes y actúas:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {service.transformationBenefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl rounded-3xl p-7 border border-black/5 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform"
                style={{ backgroundColor: service.themeColor }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed font-normal">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CÓMO SE VIVE LA SESIÓN (STEP-BY-STEP FLOW)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8da9c4] mb-3">
            <Video className="w-4 h-4" />
            <span>Experiencia de Consulta</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-[1.15]">
            {service.sessionExperience.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed">
            {service.sessionExperience.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.sessionExperience.steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl rounded-3xl p-6 border border-black/5 dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl font-mono font-bold text-[#8da9c4] mb-3">
                  0{st.step}
                </div>
                <h4 className="text-base font-bold text-[#1d1d1f] dark:text-white mb-2">
                  {st.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#1d1d1f]/70 dark:text-white/60 leading-relaxed font-normal">
                  {st.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PREGUNTAS FRECUENTES (APPLE INTERACTIVE ACCORDION)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-4xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8da9c4]">
            Resolvemos tus dudas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            Preguntas Frecuentes
          </h2>
          <p className="text-base text-[#1d1d1f]/60 dark:text-white/50">
            Todo lo que necesitas saber antes de iniciar tu proceso en {service.shortTitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx
            return (
              <div
                key={idx}
                className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#1d1d1f] dark:text-white hover:text-[#8da9c4] dark:hover:text-[#8da9c4] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#8da9c4]" : "text-[#1d1d1f]/40 dark:text-white/40"
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#1d1d1f]/75 dark:text-white/70 leading-relaxed font-normal border-t border-black/5 dark:border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: OTROS SERVICIOS DE SOULMAR (CROSS-NAVIGATION)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8da9c4]">
              Explora más opciones
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-1">
              Otros Servicios Especializados
            </h2>
          </div>
          <Link
            href="/#servicios"
            className="text-xs sm:text-sm font-bold text-[#8da9c4] hover:underline flex items-center gap-1.5"
          >
            <span>Ver todos los servicios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {otherServices.map((other, idx) => {
            const OtherIcon = ICON_MAP[other.iconName] || Brain
            return (
              <Link
                key={idx}
                href={`/${other.slug}`}
                className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl rounded-2xl p-5 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: other.themeColor }}
                  >
                    <OtherIcon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-[#8da9c4] transition-colors">
                    {other.title}
                  </h4>
                  <p className="text-xs text-[#1d1d1f]/60 dark:text-white/50 line-clamp-2">
                    {other.tagline}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-[#8da9c4] uppercase tracking-wider">
                  <span>Conocer más</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL BOOKING CTA BANNER (APPLE CINEMATIC GLOW)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="relative rounded-[36px] md:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#1d1d1f] via-[#242426] to-[#121214] text-white p-8 sm:p-12 md:p-16 text-center shadow-2xl border border-white/10">
          
          {/* Ambient colored lighting inside the card */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 blur-[130px] rounded-full pointer-events-none opacity-40"
            style={{ backgroundColor: service.themeColor }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc971]" />
              Tu bienestar empieza con una decisión
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Da el primer paso hacia tu calma interior hoy.
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
              Agenda tu sesión de <span className="text-white font-semibold">{service.title}</span> con la Dra. Mariana Caicedo. Espacios 100% privados y en tu horario preferido.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#agendamiento"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 h-14 rounded-full bg-white text-[#1d1d1f] text-base font-bold shadow-xl hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Calendar className="w-5 h-5 text-[#8da9c4]" />
                <span>Reservar Mi Sesión Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-xs text-white/50 flex items-center justify-center gap-4">
              <span>🔒 Pago 100% Seguro</span>
              <span>•</span>
              <span>🛡️ Confidencialidad Médica</span>
              <span>•</span>
              <span>⏱️ 50-60 Minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STICKY MOBILE BOOKING CAPSULE (APPLE DYNAMIC ISLAND STYLE)
          ========================================================================= */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-50 pointer-events-auto">
        <div className="bg-[#1d1d1f]/95 dark:bg-white/95 backdrop-blur-2xl text-white dark:text-[#1d1d1f] p-3 pl-4 rounded-full shadow-2xl border border-white/20 dark:border-black/10 flex items-center justify-between gap-3">
          <div className="truncate">
            <div className="text-xs font-bold truncate">
              {service.title}
            </div>
            <div className="text-[10px] opacity-70 truncate">
              {service.quickSpecs.duration} • Online
            </div>
          </div>
          <Link
            href="/#agendamiento"
            className="shrink-0 px-5 py-2.5 rounded-full bg-[#8da9c4] text-white text-xs font-bold shadow-md hover:bg-[#8da9c4]/90 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Agendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          FOOTER SECTION
          ========================================================================= */}
      <FooterSection />
    </div>
  )
}
