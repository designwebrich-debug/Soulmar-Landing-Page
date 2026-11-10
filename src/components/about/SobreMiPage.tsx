"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  Award,
  GraduationCap,
  Brain,
  Heart,
  HeartHandshake,
  MessagesSquare,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Lock,
  FileCheck2,
  Globe2,
  Compass,
  Check,
  Volume2,
  VolumeX,
  Play,
  Pause
} from "lucide-react"
import { FooterSection } from "@/components/home/FooterSection"
import { useTranslation } from "@/context/LanguageContext"
import { useMedia } from "@/context/MediaContext"
import { useAtmosphere } from "@/context/AtmosphereContext"
import { WHATSAPP_ID } from "@/lib/constants"
import { OptimizedVideo } from "@/components/ui/OptimizedVideo"
import { isVideoUrl, cn } from "@/lib/utils"

export function SobreMiPage() {
  const { language } = useTranslation()
  const { getMediaUrl } = useMedia()
  const { isPlaying: isAtmospherePlaying, fadeOut: fadeOutAtmosphere } = useAtmosphere()
  const isEn = language === "en"
  const [isMarianaMuted, setIsMarianaMuted] = useState(true)
  const [isMarianaPlaying, setIsMarianaPlaying] = useState(true)

  const toggleMarianaPlay = () => {
    setIsMarianaPlaying((prev) => !prev)
  }

  const toggleMarianaAudio = () => {
    setIsMarianaMuted((prev) => {
      const next = !prev
      if (!next && isAtmospherePlaying) {
        fadeOutAtmosphere(400)
      }
      return next
    })
  }

  // Espacio multimedia central de Mariana (Soporta Fotos HD o Videos MP4 en máxima calidad para PC, Celular e iPad)
  const marianaMediaDesktop = getMediaUrl("sobre_mi_mariana_media", "/videos/mariana_sobre_mi.mp4", "desktop")
  const marianaMediaMobile = getMediaUrl("sobre_mi_mariana_media", "/videos/mariana_sobre_mi.mp4", "mobile")
  const marianaMediaTablet = getMediaUrl("sobre_mi_mariana_media", "/videos/mariana_sobre_mi.mp4", "tablet")

  // Bento Grid Multimedia (Tarjetas de Sobre Mí - Solo fotografía e iconografía)
  const bento1Desktop = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_cozy_sweater.webp", "desktop")
  const bento1Mobile = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_cozy_sweater.webp", "mobile")
  const bento1Tablet = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_cozy_sweater.webp", "tablet")

  const bento2Desktop = getMediaUrl("sobre_mi_bento_2", "/images/therapists/mariana_diploma_horizontal.webp", "desktop")
  const bento2Mobile = getMediaUrl("sobre_mi_bento_2", "/images/therapists/mariana_diploma_horizontal.webp", "mobile")
  const bento2Tablet = getMediaUrl("sobre_mi_bento_2", "/images/therapists/mariana_diploma_horizontal.webp", "tablet")

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeSection, setActiveSection] = useState<string>("perfil")

  // Scroll spy para resaltar la sección activa en el submenú de cristal líquido
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["perfil", "vocacion", "acreditacion", "faq"]
      const triggerY = window.innerWidth >= 768 ? 220 : 180

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          setActiveSection(id)
          return
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollTo = (targetId: string) => {
    setActiveSection(targetId)
    const el = document.getElementById(targetId)
    if (el) {
      // Compensación para limpiar tanto la barra principal como el submenú de cristal líquido
      const navOffset = window.innerWidth >= 768 ? 148 : 124
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = Math.max(0, elementPosition - navOffset)
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  // Asegurar que al entrar a Sobre Mí desde cualquier lugar se inicie en el primer título superior
  useEffect(() => {
    if (typeof window !== "undefined" && (!window.location.hash || window.location.hash === "#mariana-titulo")) {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [])

  const handleBookingClick = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("soulmar_scroll_target", "caja-agendamiento")
    }
  }

  const whatsappHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_ID}&text=${encodeURIComponent(
    isEn
      ? "Hello Dr. Mariana Caicedo 🌿✨ I'd like to book a psychological therapy session with Soulmar 💙"
      : "Hola Dra. Mariana Caicedo 🌿✨ Vengo de leer tu sección Sobre Mí y quisiera coordinar mi primera sesión de terapia en Soulmar 💙"
  )}`

  // Preguntas Frecuentes de Autoridad Clínica y Metodología
  const faqs = [
    {
      q: isEn
        ? "How can I verify Dr. Mariana's academic and professional credentials?"
        : "¿Cómo puedo verificar la formación académica y tarjeta profesional de Mariana?",
      a: isEn
        ? "Mariana Caicedo Quintero is a professional psychologist graduated from Universidad El Bosque in Bogotá, Colombia (degree awarded on June 19, 2024), and holds Professional License No. 292729 issued by the Colombian College of Psychologists (COLPSIC). Her professional credential is fully registered and verifiable under Colombian law, complying with Law 1090 of 2006 (Deontological and Bioethical Code of Psychology)."
        : "Mariana Caicedo Quintero es psicóloga profesional graduada de la Universidad El Bosque en Bogotá, Colombia (título otorgado el 19 de junio de 2024), y cuenta con Tarjeta Profesional No. 292729 expedida por el Colegio Colombiano de Psicólogos (COLPSIC). Su registro profesional activo puede verificarse públicamente ante el Colegio Colombiano de Psicólogos y el ReTHUS, cumpliendo rigurosamente con la Ley 1090 de 2006 (Código Deontológico y Bioético de Psicología)."
    },
    {
      q: isEn
        ? "What is the Cognitive Behavioral (CBT) approach and how does it work?"
        : "¿Qué es el Enfoque Cognitivo-Conductual (TCC) y cómo funciona en las sesiones?",
      a: isEn
        ? "Cognitive Behavioral Therapy (CBT) is an evidence-based psychotherapeutic approach recognized worldwide (APA and WHO). Rather than passive listening without direction, CBT is a collaborative, structured, and goal-oriented process. We explore the direct connection between thoughts, emotions, and behaviors, providing clear tools to transform limiting patterns into genuine autonomy and well-being."
        : "El Enfoque Cognitivo-Conductual (TCC) es una corriente psicoterapéutica estructurada y respaldada por la mayor evidencia científica internacional (reconocida por la APA y la OMS). En lugar de una conversación pasiva y sin rumbo, la TCC es un proceso colaborativo y orientado a objetivos prácticos. Trabajamos sobre la relación directa entre pensamientos, emociones y conductas, entregándote herramientas claras para transformar patrones limitantes en autonomía y bienestar real."
    },
    {
      q: isEn
        ? "How are sessions conducted, what is the format, and what is the fee?"
        : "¿Cómo se realizan las sesiones y qué valor tienen?",
      a: isEn
        ? "Individual sessions are conducted 100% online via Google Meet from the comfort and privacy of your home. Each session lasts approximately 50 to 60 minutes and has a fee of $120,000 COP (or its equivalent in USD for international clients). It is a warm, confidential, and structured space designed to progress at your own pace."
        : "Las sesiones individuales se realizan 100% online a través de Google Meet desde la comodidad y privacidad de tu casa. Cada sesión tiene una duración aproximada de 50 a 60 minutos y un valor de $120.000 COP (o su equivalente en USD para consultantes en el exterior). Es un espacio seguro, confidencial y estructurado para avanzar a tu propio ritmo."
    },
    {
      q: isEn
        ? "Do you offer online sessions for clients living outside Colombia?"
        : "¿Atiendes a personas que viven fuera de Colombia?",
      a: isEn
        ? "Yes, absolutely. A significant portion of Soulmar's clients are Spanish-speaking individuals residing in the United States, Spain, Canada, Mexico, Chile, and throughout Latin America. Sessions are held via encrypted Google Meet video calls with flexible, coordinated time zones."
        : "Sí, absolutamente. Una parte importante de los consultantes de Soulmar son hispanohablantes que residen en Estados Unidos, España, Canadá, México, Chile y diversos países de Latinoamérica. Las sesiones se coordinan con flexibilidad horaria y se llevan a cabo mediante videollamada cifrada por Google Meet."
    },
    {
      q: isEn
        ? "How is privacy and professional confidentiality guaranteed?"
        : "¿Cómo se garantiza la confidencialidad y el secreto profesional?",
      a: isEn
        ? "Everything discussed in session is strictly protected by professional confidentiality under Law 1090 of 2006. Soulmar uses encrypted digital channels and follows bioethical standards to ensure your complete privacy, respect, and peace of mind."
        : "Todo lo compartido en sesión está estrictamente protegido por el secreto profesional conforme a la Ley 1090 de 2006. Soulmar utiliza canales digitales cifrados y rigurosos estándares bioéticos para asegurar tu absoluta privacidad, respeto y tranquilidad."
    }
  ]

  // Formación académica y credenciales verificadas
  const credentials = [
    {
      icon: GraduationCap,
      title: isEn ? "Psychologist — Universidad El Bosque" : "Psicóloga — Universidad El Bosque",
      institution: isEn ? "University Professional Degree • Bogotá, Colombia" : "TÍTULO PROFESIONAL UNIVERSITARIO · BOGOTÁ, COLOMBIA",
      description: isEn
        ? "Professional Psychologist, graduated from Universidad El Bosque, degree awarded on June 19, 2024. University education supporting her professional practice and commitment to psychological wellbeing."
        : "Profesional en Psicología, graduada de la Universidad El Bosque, con título otorgado el 19 de junio de 2024. Formación universitaria que respalda su ejercicio profesional y su compromiso con el bienestar psicológico."
    },
    {
      icon: ShieldCheck,
      title: isEn ? "Professional License No. 292729 (COLPSIC)" : "Tarjeta Profesional No. 292729 (COLPSIC)",
      institution: isEn ? "Colombian College of Psychologists" : "COLEGIO COLOMBIANO DE PSICÓLOGOS",
      description: isEn
        ? "Professional accreditation as a psychologist in Colombia, endorsed by the professional license issued by the Colombian College of Psychologists."
        : "Acreditación profesional como psicóloga en Colombia, respaldada por la tarjeta profesional expedida por el Colegio Colombiano de Psicólogos."
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500 overflow-x-clip selection:bg-[#8da9c4]/30 selection:text-foreground">
      
      {/* =========================================================================
          ENCABEZADO PRINCIPAL DE LA PÁGINA (Apple Premium Spacing)
          ========================================================================= */}
      <section className="pt-8 sm:pt-10 md:pt-12 pb-3 sm:pb-4 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div id="mariana-titulo" className="scroll-mt-28 md:scroll-mt-36 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
            {isEn
              ? "Mariana Caicedo | Psychologist at Soulmar"
              : "Mariana Caicedo | Psicóloga en Soulmar"}
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isEn
              ? "Clinical Psychologist • Universidad El Bosque (Bogotá, Colombia). Evidence-based psychotherapy, human warmth, and a safe space to guide you back to yourself."
              : "Psicóloga Clínica • Universidad El Bosque (Bogotá, Colombia). Psicoterapia basada en evidencia, calidez humana y un espacio seguro para volver a ti."}
          </p>
        </div>
      </section>

      {/* CONTENEDOR RELATIVO PARA QUE EL SUBMENÚ STICKY ACOMPAÑE TODAS LAS SECCIONES */}
      <div className="relative">
        {/* SUBMENÚ SECUNDARIO STICKY (Oculto en móvil, visible solo en PC y iPad) */}
        <div className="hidden md:flex sticky md:top-[86px] z-40 py-2 px-4 justify-center pointer-events-none mb-10 sm:mb-12 md:mb-14">
          <div className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-2.5 max-w-[95vw] overflow-x-auto no-scrollbar">
            {[
              { label: isEn ? "My Profile" : "Mi perfil", targetId: "perfil" },
              { label: isEn ? "My Vocation" : "Mi vocación", targetId: "vocacion" },
              { label: isEn ? "Accreditation" : "Acreditación", targetId: "acreditacion" },
              { label: "FAQ", targetId: "faq" },
            ].map((btn) => {
              const isActive = activeSection === btn.targetId
              return (
                <button
                  key={btn.targetId}
                  onClick={() => handleScrollTo(btn.targetId)}
                  className={cn(
                    "px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-[13px] tracking-tight transition-all duration-200 active:scale-95 cursor-pointer select-none text-center whitespace-nowrap",
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-[#1d1d1f] font-semibold shadow-xs"
                      : "bg-black/85 hover:bg-black text-white/90 hover:text-white dark:bg-white/85 dark:hover:bg-white dark:text-[#1d1d1f] font-medium"
                  )}
                >
                  {btn.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* =========================================================================
            SECCIÓN 1: CORE FEATURES (3-COLUMN LAYOUT CON FOTO DE MARIANA EN EL CENTRO)
            ========================================================================= */}
        <section className="pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
          {/* ESTRUCTURA 3 COLUMNAS: 2 CARDS | FOTO CENTRAL | 2 CARDS */}
          <div id="perfil" className="scroll-mt-36 md:scroll-mt-44 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* COLUMNA IZQUIERDA (2 Cards en Grid de 2 filas para alineación horizontal matemática perfecta) */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-5">
            {/* Card 1: Formación profesional - Icono Azul Soulmar */}
            <div className="relative group flex flex-col h-full">
              {/* Luz / Glow suave detrás de la caja en hover (Sin borde de color) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#8da9c4]/14 dark:from-[#8da9c4]/20 to-transparent rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative bg-[#f5f5f7] dark:bg-[#151518]/90 dark:backdrop-blur-xl rounded-[28px] p-7 md:p-8 border border-neutral-200/50 dark:border-white/5 flex flex-col justify-start group-hover:shadow-[0_12px_28px_rgba(141,169,196,0.08)] dark:group-hover:shadow-[0_14px_35px_rgba(141,169,196,0.15)] transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full">
                <div className="w-10 h-10 rounded-2xl bg-[#8da9c4] text-white flex items-center justify-center shrink-0 mb-5 shadow-sm shadow-[#8da9c4]/15 group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[16px] text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-2.5 min-h-[26px] flex items-center">
                    {isEn ? "Professional Background" : "Formación profesional"}
                  </h3>
                  <p className="text-sm md:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {isEn
                      ? "Psychologist graduated from Universidad El Bosque in Bogotá, Colombia. My academic background and clinical experience back a professional, ethical, and deeply human accompaniment."
                      : "Psicóloga graduada de la Universidad El Bosque en Bogotá, Colombia. Mi preparación académica y experiencia clínica respaldan un acompañamiento profesional, ético y profundamente humano."}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Enfoque terapéutico - Icono Verde Soulmar Oficial */}
            <div className="relative group flex flex-col h-full">
              {/* Luz / Glow suave detrás de la caja en hover (Sin borde de color) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#c9cba3]/16 dark:from-[#c9cba3]/22 to-transparent rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative bg-[#f5f5f7] dark:bg-[#151518]/90 dark:backdrop-blur-xl rounded-[28px] p-7 md:p-8 border border-neutral-200/50 dark:border-white/5 flex flex-col justify-start group-hover:shadow-[0_12px_28px_rgba(201,203,163,0.10)] dark:group-hover:shadow-[0_14px_35px_rgba(201,203,163,0.15)] transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full">
                <div className="w-10 h-10 rounded-2xl bg-[#c9cba3] text-white flex items-center justify-center shrink-0 mb-5 shadow-sm shadow-[#c9cba3]/15 group-hover:scale-105 transition-transform duration-300">
                  <Brain className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[16px] text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-2.5 min-h-[26px] flex items-center">
                    {isEn ? "Therapeutic Approach" : "Enfoque terapéutico"}
                  </h3>
                  <p className="text-sm md:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {isEn
                      ? "I guide each individual process under the Cognitive-Behavioral Therapy (CBT) approach, addressing the direct link between thoughts, emotions, and behaviors to transform limiting beliefs into real autonomy."
                      : "Guío cada proceso individual bajo el Enfoque Cognitivo-Conductual (TCC), trabajando sobre la relación directa entre pensamientos, emociones y conductas para transformar creencias limitantes en autonomía real."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA CENTRAL (Retrato o Video MP4 en alta resolución de Mariana en sesión) */}
          <div className="lg:col-span-4 relative rounded-[32px] overflow-hidden bg-neutral-900 border border-neutral-200/50 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.25)] min-h-[440px] lg:min-h-[480px] group">
            {/* Controles interactivos: En pausa solo aparece Play; en reproducción aparecen Pausa y Volumen */}
            {(isVideoUrl(marianaMediaDesktop) || isVideoUrl(marianaMediaMobile) || isVideoUrl(marianaMediaTablet)) && (
              <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                {/* Botón Play / Pausa */}
                <button
                  type="button"
                  onClick={toggleMarianaPlay}
                  className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  title={isMarianaPlaying ? (isEn ? "Pause video" : "Pausar video") : (isEn ? "Play video" : "Reproducir video")}
                  aria-label={isMarianaPlaying ? "Pausar video" : "Reproducir video"}
                >
                  {isMarianaPlaying ? (
                    <Pause className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  )}
                </button>

                {/* Botón Silenciar / Activar sonido (SOLO visible cuando el video se está reproduciendo, NO en foto estática) */}
                {isMarianaPlaying && (
                  <button
                    type="button"
                    onClick={toggleMarianaAudio}
                    className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    title={isMarianaMuted ? (isEn ? "Unmute video" : "Activar sonido") : (isEn ? "Mute video" : "Silenciar")}
                    aria-label={isMarianaMuted ? "Activar sonido" : "Silenciar"}
                  >
                    {isMarianaMuted ? (
                      <VolumeX className="w-4 h-4 text-white/90" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#8da9c4]" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Contenedor multimedia: Video con cambio fluido a foto estática al pausar */}
            <div className="w-full h-full absolute inset-0">
              {isVideoUrl(marianaMediaDesktop) || isVideoUrl(marianaMediaMobile) || isVideoUrl(marianaMediaTablet) ? (
                <>
                  <OptimizedVideo
                    src={marianaMediaDesktop || marianaMediaMobile || marianaMediaTablet}
                    priority
                    muted={isMarianaMuted}
                    isPlaying={isMarianaPlaying}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: "center 60%" }}
                  />

                  {/* Foto estática oficial que aparece cuando el video es pausado */}
                  <div
                    className={cn(
                      "absolute inset-0 w-full h-full transition-opacity duration-500",
                      isMarianaPlaying ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                    )}
                  >
                    <Image
                      src="/images/therapists/mariana_sobre_mi.webp"
                      alt="Dra. Mariana Caicedo - Psicóloga Clínica"
                      fill
                      quality={100}
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: "center 60%" }}
                    />
                  </div>
                </>
              ) : (
                <Image
                  src={marianaMediaDesktop || marianaMediaMobile || marianaMediaTablet}
                  alt="Dra. Mariana Caicedo - Sesión Clínica Online"
                  fill
                  quality={100}
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: "center 60%" }}
                />
              )}
            </div>

            {/* Sutil viñeta para contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none z-10" />

            {/* Identificación en la base de la tarjeta central */}
            <div className="absolute bottom-5 inset-x-5 text-white flex items-center justify-between z-20 pointer-events-none">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Dra. Mariana Caicedo</h4>
                <p className="text-[11px] text-[#8da9c4] font-medium">Psicóloga Clínica • Fundadora Soulmar</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (2 Cards en Grid de 2 filas para alineación horizontal matemática perfecta) */}
          <div className="lg:col-span-4 grid grid-rows-2 gap-5">
            {/* Card 3: Mi filosofía - Icono Morado Soulmar Oficial */}
            <div className="relative group flex flex-col h-full">
              {/* Luz / Glow suave detrás de la caja en hover (Sin borde de color) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#a78bfa]/14 dark:from-[#a78bfa]/20 to-transparent rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative bg-[#f5f5f7] dark:bg-[#151518]/90 dark:backdrop-blur-xl rounded-[28px] p-7 md:p-8 border border-neutral-200/50 dark:border-white/5 flex flex-col justify-start group-hover:shadow-[0_12px_28px_rgba(167,139,250,0.08)] dark:group-hover:shadow-[0_14px_35px_rgba(167,139,250,0.15)] transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full">
                <div className="w-10 h-10 rounded-2xl bg-[#a78bfa] text-white flex items-center justify-center shrink-0 mb-5 shadow-sm shadow-[#a78bfa]/15 group-hover:scale-105 transition-transform duration-300">
                  <HeartHandshake className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[16px] text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-2.5 min-h-[26px] flex items-center">
                    {isEn ? "My Philosophy" : "Mi filosofía"}
                  </h3>
                  <p className="text-sm md:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {isEn
                      ? "I strongly believe in creating a safe, close, and confidential space where you can truly be yourself, feel deeply heard, and explore your emotions free from judgment or labels."
                      : "Creo en construir un espacio seguro, cercano y confidencial donde puedas ser tú mismo/a, sentirte verdaderamente escuchado/a y comprender tus emociones sin juicios ni etiquetas."}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Nuestras sesiones - Icono Amarillo Soulmar Oficial */}
            <div className="relative group flex flex-col h-full">
              {/* Luz / Glow suave detrás de la caja en hover (Sin borde de color) */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ffc971]/16 dark:from-[#ffc971]/22 to-transparent rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative bg-[#f5f5f7] dark:bg-[#151518]/90 dark:backdrop-blur-xl rounded-[28px] p-7 md:p-8 border border-neutral-200/50 dark:border-white/5 flex flex-col justify-start group-hover:shadow-[0_12px_28px_rgba(255,201,113,0.10)] dark:group-hover:shadow-[0_14px_35px_rgba(255,201,113,0.15)] transition-all duration-500 shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-full">
                <div className="w-10 h-10 rounded-2xl bg-[#ffc971] text-white flex items-center justify-center shrink-0 mb-5 shadow-sm shadow-[#ffc971]/15 group-hover:scale-105 transition-transform duration-300">
                  <MessagesSquare className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[16px] text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-2.5 min-h-[26px] flex items-center">
                    {isEn ? "Our Sessions" : "Nuestras sesiones"}
                  </h3>
                  <p className="text-sm md:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {isEn
                      ? "100% online individual sessions via Google Meet from the comfort and privacy of your home ($120,000 COP per session), designed to move forward closely at your own pace."
                      : "Sesiones individuales 100% online por Google Meet desde la comodidad y privacidad de tu casa ($120.000 COP por sesión), diseñadas para avanzar con cercanía a tu propio ritmo."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 3: BENTO GRID ESTRATÉGICO DE PRESENTACIÓN DE MARIANA CAICEDO
          (4 tarjetas asimétricas con separación premium uniforme Apple UX/UI)
          ========================================================================= */}
      <section id="vocacion" className="scroll-mt-36 md:scroll-mt-44 pt-6 sm:pt-10 md:pt-12 pb-16 md:pb-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* ENCABEZADO CENTRADO DE SECCIÓN - APPLE HIG DESIGN */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
            {isEn ? "A little more about me" : "Un poco más sobre mí"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* CAJA 1 (IZQUIERDA - lg:col-span-5) — LA HISTORIA DETRÁS DE SOULMAR */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
            {/* Fotografía de Mariana Caicedo - Contenedor expandido al máximo espacio disponible sin alterar la caja ni el texto */}
            <div className="bg-neutral-200 dark:bg-[#1f1f23] rounded-[22px] sm:rounded-[24px] overflow-hidden w-full relative shadow-xs group mb-5 flex-1 min-h-[300px] sm:min-h-[340px] aspect-[4/3.6] lg:aspect-auto">
              <Image
                src={bento1Desktop || bento1Mobile || bento1Tablet || "/images/therapists/mariana_cozy_sweater.webp"}
                alt="Mariana Caicedo, psicóloga y fundadora de Soulmar"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-[center_15%] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>

            {/* Contenido editorial humano y cercano (sin botón) */}
            <div className="space-y-2 flex flex-col shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                {isEn ? "I am Mariana" : "Soy Mariana"}
              </span>

              <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                {isEn
                  ? "“I believe we all deserve a safe space to be heard.”"
                  : "«Creo que todos merecemos un espacio para ser escuchados.»"}
              </h2>

              <p className="text-sm sm:text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal">
                {isEn
                  ? "I am Mariana Caicedo, psychologist and founder of Soulmar. My purpose is to guide you to understand your emotions and build a kinder relationship with yourself."
                  : "Soy Mariana Caicedo, psicóloga y fundadora de Soulmar. Mi propósito es acompañarte a comprender tus emociones y construir una relación más amable contigo mismo."}
              </p>
            </div>
          </div>

          {/* CONTENEDOR DERECHO (lg:col-span-7 flex flex-col gap-5 lg:gap-6 - Separación uniforme idéntica a horizontal) */}
          <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-6">
            
            {/* FILA SUPERIOR: CAJA 2 (MI VOCACIÓN) + CAJA 3 (CONFIANZA PROFESIONAL) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 lg:gap-6 items-stretch">
              
              {/* CAJA 2 (sm:col-span-7) — MI VOCACIÓN */}
              <div className="sm:col-span-7 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
                {/* Imagen horizontal de ambiente clínico cálido */}
                <div className="rounded-[22px] overflow-hidden relative aspect-[16/10] w-full mb-4 shadow-xs bg-neutral-200 dark:bg-neutral-800 group">
                  <Image
                    src={bento2Desktop || bento2Mobile || bento2Tablet || "/images/therapists/mariana_diploma_horizontal.webp"}
                    alt="Mariana Caicedo Quintero con su diploma oficial de Psicóloga de la Universidad El Bosque"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-[center_20%] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                    {isEn ? "My Vocation" : "Mi vocación"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                    {isEn ? "Why did I choose psychology?" : "¿Por qué elegí la psicología?"}
                  </h3>
                  <p className="text-sm sm:text-[14px] text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed italic pt-0.5">
                    {isEn
                      ? "“Behind every story there is a person who deserves to be truly understood.”"
                      : "«Detrás de cada historia hay una persona que merece ser comprendida.»"}
                  </p>
                </div>
              </div>

              {/* CAJA 3 (sm:col-span-5) — CONFIANZA PROFESIONAL (UNIVERSIDAD EL BOSQUE) */}
              <div className="sm:col-span-5 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
                <div className="flex flex-col items-center justify-center">
                  {/* Icono académico minimalista */}
                  <div className="w-12 h-12 rounded-2xl bg-[#8da9c4]/15 dark:bg-[#8da9c4]/25 text-[#8da9c4] dark:text-[#a5c0db] flex items-center justify-center mb-3 shadow-xs">
                    <GraduationCap className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#8da9c4] dark:text-[#a5c0db] mb-1 block">
                    {isEn ? "Academic Credential" : "Formación Profesional"}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-1.5">
                    Universidad El Bosque
                  </h3>

                  <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed max-w-[210px] mb-4">
                    {isEn
                      ? "University Degree in Psychology · Bogotá, Colombia."
                      : "Formación universitaria en Psicología · Bogotá, Colombia."}
                  </p>

                  {/* Botón con enlace oficial a la Universidad El Bosque - Azul Soulmar, hover Verde Soulmar (Modo Claro) / hover Amarillo Soulmar (Modo Oscuro) */}
                  <a
                    href="https://www.unbosque.edu.co/programas-academicos/facultad-psicologia/psicologia?utm_source=google&utm_medium=cpl&utm_campaign=lead-ok_psicologia&utm_content=texto&gad_source=1&gad_campaignid=18440125824&gbraid=0AAAAADRwOneygcoauUxFffKntGLDp9gNZ&gclid=CjwKCAiAtbvXBhB_EiwAjwv9JkEcdjHNAqz5G9fm_W5-rL055Lqn658K_Qf8WqpGdiTKO_5ZlSf4uxoCgGEQAvD_BwE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8da9c4] text-white hover:bg-[#c9cba3] hover:text-[#1d1d1f] dark:bg-[#8da9c4] dark:text-white dark:hover:bg-[#ffc971] dark:hover:text-[#1d1d1f] text-xs font-semibold transition-all duration-200 shadow-xs active:scale-95 group/btn focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8da9c4]"
                  >
                    <span>{isEn ? "Learn more" : "Conoce más"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* CAJA 4 (INFERIOR ANCHA) — UN LUGAR PARA TU HISTORIA */}
            <div className="bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="space-y-1.5 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                  {isEn ? "A place for your story" : "Un lugar para tu historia"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                  {isEn
                    ? "You don’t have to have all the answers to begin."
                    : "No tienes que tener todas las respuestas para comenzar."}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
                  {isEn
                    ? "Sometimes, the first step is finding a place where you can speak freely and feel accompanied."
                    : "A veces, el primer paso es encontrar un lugar donde puedas hablar con libertad y sentirte acompañado."}
                </p>
              </div>

              {/* Botón hacia el flujo de agendamiento oficial - hover Azul Soulmar (Modo Claro) / hover Amarillo Soulmar (Modo Oscuro) */}
              <div className="shrink-0 pt-2 sm:pt-0">
                <Link
                  href="/#caja-agendamiento"
                  onClick={handleBookingClick}
                  className="inline-flex items-center gap-3 bg-[#1d1d1f] text-white hover:bg-[#8da9c4] hover:text-white dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-[#ffc971] dark:hover:text-[#1d1d1f] px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95 group/btn whitespace-nowrap cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8da9c4]"
                >
                  <span>{isEn ? "Book your first session" : "Agenda tu primera sesión"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 group-hover/btn:bg-white/20 dark:group-hover/btn:bg-black/20 flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: FORMACIÓN ACADÉMICA Y CREDENCIALES CLÍNICAS
          ========================================================================= */}
      <section id="acreditacion" className="py-16 md:py-24 bg-neutral-50/60 dark:bg-[#121214] border-y border-neutral-200/60 dark:border-white/5 px-4 sm:px-6 md:px-10 scroll-mt-36 md:scroll-mt-44">
        <div id="historia" className="scroll-mt-36 md:scroll-mt-44 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest uppercase text-[#8da9c4]">
              {isEn ? "ACCREDITATIONS & CLINICAL CREDENTIALS" : "FORMACIÓN ACADÉMICA & ACREDITACIONES"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight">
              {isEn ? "Evidence-Based Clinical Authority" : "Prueba de Autoridad y Formación Clínica"}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {isEn
                ? "Your mental health deserves a licensed, legally authorized professional with continuous scientific updates."
                : "Tu salud mental merece estar en manos de una profesional colegiada, legalmente habilitada y con continua actualización científica."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred, idx) => {
              const Icon = cred.icon
              return (
                <div
                  key={idx}
                  className="p-6 md:p-8 rounded-3xl bg-[#fafaf9] dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 hover:border-[#8da9c4]/50 transition-all duration-300 flex items-start gap-5 group shadow-xs"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#8da9c4]/15 dark:bg-[#8da9c4]/20 text-[#8da9c4] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#8da9c4] transition-colors">
                      {cred.title}
                    </h3>
                    <p className="text-xs font-bold text-[#8da9c4] uppercase tracking-wider">
                      {cred.institution}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1">
                      {cred.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sello de Garantía Legal & Secreto Profesional */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1D9E75]/15 text-[#1D9E75] flex items-center justify-center shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {isEn ? "Full Healthcare Registration (ReTHUS & COLPSIC)" : "Registro Nacional en Salud (ReTHUS y COLPSIC)"}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isEn
                    ? "Legally authorized to conduct psychotherapeutic sessions under strict healthcare and ethical compliance."
                    : "Habilitación legal completa conforme al Código Deontológico y Bioético de Psicología (Ley 1090 de 2006)."}
                </p>
              </div>
            </div>
            <a
              href="https://www.colpsic.org.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#8da9c4] hover:text-[#7a9ab8] flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>{isEn ? "Verify at Colpsic.org.co" : "Verificar en Colpsic.org.co"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 5: PREGUNTAS FRECUENTES (FAQ) DE AUTORIDAD CLÍNICA
          ========================================================================= */}
      <section id="faq" className="py-16 md:py-24 bg-neutral-100/60 dark:bg-black/40 border-t border-neutral-200/60 dark:border-white/5 px-4 sm:px-6 md:px-10 scroll-mt-36 md:scroll-mt-44">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black tracking-widest uppercase text-[#8da9c4]">
              {isEn ? "CLINICAL TRANSPARENCY" : "TRANSPARENCIA CLÍNICA"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight">
              {isEn ? "Frequently Asked Questions about Dr. Mariana" : "Preguntas Frecuentes sobre la Dra. Mariana"}
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-white dark:bg-[#151518] overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors group select-none"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pr-2">
                      {/* Número circular en la esquina izquierda (Verde Soulmar Oficial #c9cba3 -> Azul Soulmar #8da9c4 en hover o al abrir) */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm text-white transition-all duration-300 shadow-xs",
                          isOpen
                            ? "bg-[#8da9c4]"
                            : "bg-[#c9cba3] group-hover:bg-[#8da9c4]"
                        )}
                      >
                        {index + 1}
                      </div>

                      {/* Texto de la pregunta */}
                      <span className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#8da9c4] transition-colors">
                        {faq.q}
                      </span>
                    </div>

                    {/* Icono de flecha en el extremo derecho con la misma función de color */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white transition-all duration-300 shadow-xs",
                        isOpen
                          ? "rotate-180 bg-[#8da9c4]"
                          : "bg-[#c9cba3] group-hover:bg-[#8da9c4]"
                      )}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      </div>

      {/* =========================================================================
          SECCIÓN 6: CTA FINAL DE AGENDAMIENTO DIRECTO
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto text-center space-y-6">
        <span className="text-xs font-black tracking-widest uppercase text-[#8da9c4]">
          {isEn ? "START YOUR JOURNEY" : "DA EL PRIMER PASO HOY"}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-tight">
          {isEn ? (
            <>
              Your Mental Well-being Starts with <br />
              <span className="text-[#8da9c4]">A Single Conscious Decision</span>
            </>
          ) : (
            <>
              Tu Bienestar Emocional Empieza con <br />
              <span className="text-[#8da9c4]">Una Decisión Consciente</span>
            </>
          )}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Book your session directly with Dr. Mariana Caicedo. 100% private, confidential, and tailored to your pace."
            : "Agenda tu sesión online directamente con la Dra. Mariana Caicedo. 100% privado, confidencial y a tu ritmo, desde donde te encuentres."}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#caja-agendamiento"
            onClick={handleBookingClick}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#8da9c4] hover:bg-[#7a9ab8] text-white font-bold text-sm shadow-xl shadow-[#8da9c4]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{isEn ? "Book Online Session" : "Reservar Sesión Online"}</span>
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-50 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white font-bold text-sm border border-neutral-200/80 dark:border-white/15 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>{isEn ? "WhatsApp Direct Line" : "Línea Directa WhatsApp"}</span>
          </a>
        </div>
      </section>

      {/* FOOTER OFICIAL CON ENLACES SOCIALES DE SOULMAR */}
      <FooterSection />
    </div>
  )
}
