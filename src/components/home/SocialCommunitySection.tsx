"use client"

import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"

interface SocialPost {
  id: string
  platform: "instagram" | "tiktok"
  title: string
  tag: string
  views: string
  image: string
  href: string
}

const socialPosts: SocialPost[] = [
  {
    id: "post-1",
    platform: "instagram",
    tag: "Instagram Reel",
    title: "Mi herida, mi reacción",
    views: "48.2K",
    image: "/images/mobile-hero/slide-1.jpg",
    href: "https://www.instagram.com/soulmar.org_/?hl=es",
  },
  {
    id: "post-2",
    platform: "instagram",
    tag: "Instagram Post",
    title: "¿Por qué sobrepienso todo?",
    views: "92.5K",
    image: "/images/mobile-hero/slide-2.png",
    href: "https://www.instagram.com/soulmar.org_/?hl=es",
  },
  {
    id: "post-3",
    platform: "instagram",
    tag: "Instagram Reel",
    title: "Tu sesión psicológica a un clic",
    views: "36.8K",
    image: "/images/mobile-hero/slide-3.png",
    href: "https://www.instagram.com/soulmar.org_/?hl=es",
  },
]

export function SocialCommunitySection() {
  const { language } = useTranslation()
  const isEn = language === "en"

  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeDot, setActiveDot] = useState(0)
  const [isFollowingInsta, setIsFollowingInsta] = useState(false)
  const [isFollowingTikTok, setIsFollowingTikTok] = useState(false)

  const handleFollowInsta = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFollowingInsta((prev) => !prev)
  }

  const handleFollowTikTok = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFollowingTikTok((prev) => !prev)
  }

  // Track active slide in mobile carousel
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const itemWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 280
      const index = Math.round(scrollLeft / itemWidth)
      setActiveDot(Math.max(0, Math.min(socialPosts.length - 1, index)))
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (index: number) => {
    const el = scrollRef.current
    if (!el || !el.children[index]) return
    const target = el.children[index] as HTMLElement
    el.scrollTo({
      left: target.offsetLeft - 24,
      behavior: "smooth",
    })
  }

  return (
    <Section id="comunidad" className="pt-20 pb-20 bg-surface dark:bg-[#0b0b0c] transition-colors duration-500 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[350px] bg-gradient-to-r from-[#8da9c4]/10 via-[#c9cba3]/10 to-rose-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* =========================================================================
            1. ENCABEZADO EDITORIAL APPLE CON BADGE EN CRISTAL LÍQUIDO
            ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-bold text-neutral-800 dark:text-white mb-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wider uppercase text-[10.5px]">
              {isEn ? "Soulmar Community" : "Comunidad Soulmar"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-[1.08] font-sans">
            {isEn ? (
              <>
                Mental health that <span className="text-[#8da9c4]">travels</span> with you.
              </>
            ) : (
              <>
                Salud mental que te acompaña a <span className="text-[#8da9c4]">diario</span>.
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#1d1d1f]/60 dark:text-white/60 font-medium max-w-xl mx-auto leading-relaxed">
            {isEn
              ? "Practical tools, clinical reflections, and everyday answers directly on your feed."
              : "Herramientas prácticas, reflexiones clínicas y respuestas a tus dudas en nuestro contenido diario."}
          </p>
        </div>

        {/* =========================================================================
            2. WIDGETS GEMELOS APPLE iOS (INSTAGRAM & TIKTOK)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          
          {/* WIDGET 1: INSTAGRAM */}
          <Link
            href="https://www.instagram.com/soulmar.org_/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-[28px] md:rounded-[32px] p-6 sm:p-7 liquid-glass overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-lg flex flex-col justify-between min-h-[190px] border border-white/40 dark:border-white/10"
          >
            {/* Ambient Instagram subtle glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-amber-500/15 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-[#8da9c4]/30 via-white/50 to-[#8da9c4]/20 dark:from-white/10 dark:to-white/5 shrink-0 shadow-md border border-white/60 dark:border-white/15">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-white/90 dark:bg-neutral-900/90 relative flex items-center justify-center p-1.5">
                    <Image
                      src="/images/logo-soulmar-blue.png"
                      alt="Soulmar"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base sm:text-lg text-[#1d1d1f] dark:text-white tracking-tight">
                      @soulmar.org_
                    </h3>
                    <div className="relative w-4 h-4 shrink-0">
                      <Image
                        src="/images/verified-badge.png"
                        alt="Verificado"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#1d1d1f]/60 dark:text-white/50 font-medium">
                    Instagram • Dra. Mariana Caicedo
                  </p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* BOTÓN SEGUIR 100% CENTRADO EN LA CAJA, FONDO AZUL SOULMAR, LETRA BLANCA */}
            <div className="relative z-10 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center w-full">
              <button
                type="button"
                onClick={handleFollowInsta}
                className="w-full sm:w-auto min-w-[200px] py-2 px-6 rounded-full bg-[#8da9c4] hover:bg-[#7b9ab8] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer text-center"
              >
                {isFollowingInsta ? (isEn ? "Siguiendo" : "Siguiendo") : (isEn ? "Seguir" : "Seguir")}
              </button>
            </div>
          </Link>

          {/* WIDGET 2: TIKTOK */}
          <Link
            href="https://www.tiktok.com/@soulmar.psicologia?_r=1&_t=ZS-9AYEqfc2W28"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-[28px] md:rounded-[32px] p-6 sm:p-7 liquid-glass overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] shadow-lg flex flex-col justify-between min-h-[190px] border border-white/40 dark:border-white/10"
          >
            {/* Ambient TikTok subtle neon glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-cyan-400/20 via-pink-500/15 to-transparent blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-black/20 via-neutral-400 to-black/30 dark:from-white/20 dark:to-neutral-500 shrink-0 shadow-md border border-white/60 dark:border-white/15">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-white/90 dark:bg-neutral-900/90 relative flex items-center justify-center p-1.5">
                    <Image
                      src="/images/logo-soulmar-black.png"
                      alt="Soulmar"
                      fill
                      className="object-contain p-1 dark:invert"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base sm:text-lg text-[#1d1d1f] dark:text-white tracking-tight">
                      @soulmar.psicologia
                    </h3>
                    <div className="relative w-4 h-4 shrink-0">
                      <Image
                        src="/images/verified-badge.png"
                        alt="Verificado"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#1d1d1f]/60 dark:text-white/50 font-medium">
                    TikTok • Salud Mental en 60s
                  </p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full liquid-glass-pill flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>

            {/* BOTÓN SEGUIR 100% CENTRADO EN LA CAJA, FONDO AZUL SOULMAR, LETRA BLANCA */}
            <div className="relative z-10 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center w-full">
              <button
                type="button"
                onClick={handleFollowTikTok}
                className="w-full sm:w-auto min-w-[200px] py-2 px-6 rounded-full bg-[#8da9c4] hover:bg-[#7b9ab8] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 cursor-pointer text-center"
              >
                {isFollowingTikTok ? (isEn ? "Siguiendo" : "Siguiendo") : (isEn ? "Seguir" : "Seguir")}
              </button>
            </div>
          </Link>
        </div>

        {/* =========================================================================
            3. FEED CARRUSEL CINEMÁTICO VERTICAL (3 ÚLTIMAS PUBLICACIONES DE INSTAGRAM)
            ========================================================================= */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4 px-1">
            <h4 className="text-sm sm:text-base font-extrabold text-[#1d1d1f] dark:text-white tracking-tight uppercase">
              {isEn ? "Latest on Instagram" : "Últimas publicaciones en Instagram"}
            </h4>
            <span className="text-xs text-[#8da9c4] font-semibold">
              {isEn ? "Tap to open" : "Toca para ver"}
            </span>
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar touch-momentum -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none"
          >
            {socialPosts.map((post) => (
              <Link
                key={post.id}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start shrink-0 w-[68vw] sm:w-[260px] md:w-auto relative aspect-[9/14] rounded-[28px] overflow-hidden group shadow-lg active:scale-[0.98] transition-transform select-none border border-black/5 dark:border-white/10"
              >
                {/* Full-bleed Photo completely clean */}
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  quality={95}
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
            ))}
          </div>

          {/* Dots de paginación háptica fluida estilo Apple para móvil */}
          <div className="md:hidden flex items-center justify-center gap-2 pt-3">
            <div className="flex items-center gap-1.5 bg-neutral-900/5 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10">
              {socialPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeDot === idx
                      ? "w-6 h-1.5 bg-[#8da9c4]"
                      : "w-1.5 h-1.5 bg-neutral-400/50 dark:bg-white/30 hover:bg-neutral-500"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </Section>
  )
}
