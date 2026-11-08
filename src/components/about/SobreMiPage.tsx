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
  const bento1Desktop = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_sobre_mi.webp", "desktop")
  const bento1Mobile = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_sobre_mi.webp", "mobile")
  const bento1Tablet = getMediaUrl("sobre_mi_bento_1", "/images/therapists/mariana_sobre_mi.webp", "tablet")

  const bento2Desktop = getMediaUrl("sobre_mi_bento_2", "/images/hero-soulmar-cozy.jpg", "desktop")
  const bento2Mobile = getMediaUrl("sobre_mi_bento_2", "/images/hero-soulmar-cozy.jpg", "mobile")
  const bento2Tablet = getMediaUrl("sobre_mi_bento_2", "/images/hero-soulmar-cozy.jpg", "tablet")

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const whatsappHref = `https://api.whatsapp.com/send?phone=${WHATSAPP_ID}&text=${encodeURIComponent(
    isEn
      ? "Hello Dr. Mariana Caicedo 🌿✨ I'd like to book a psychological therapy session with Soulmar 💙"
      : "Hola Dra. Mariana Caicedo 🌿✨ Vengo de leer tu sección Sobre Mí y quisiera coordinar mi primera sesión de terapia en Soulmar 💙"
  )}`

  // Preguntas Frecuentes de Autoridad Clínica
  const faqs = [
    {
      q: isEn ? "How can I verify Dr. Mariana's professional credentials?" : "¿Cómo puedo verificar la tarjeta profesional de la Dra. Mariana?",
      a: isEn
        ? "Dr. Mariana Caicedo Quintero is a registered clinical psychologist accredited by the Colombian College of Psychologists (COLPSIC). Her active professional license is verifiable through the National Registry of Psychologists. Every session and diagnostic document meets the strictest legal, bioethical, and healthcare standards."
        : "La Dra. Mariana Caicedo Quintero cuenta con Tarjeta Profesional No. 248910 expedida por el Colegio Colombiano de Psicólogos (COLPSIC) y avalada por el Ministerio de Salud. Su registro clínico activo puede verificarse públicamente en el Registro Único Nacional de Talento Humano en Salud (ReTHUS). Cada proceso cumple con la Ley 1090 de 2006 (Código Deontológico y Bioético de Psicología)."
    },
    {
      q: isEn ? "What is the Cognitive Behavioral (CBT) approach and why is it recommended?" : "¿Qué es el Enfoque Cognitivo-Conductual (TCC) y por qué es el más recomendado?",
      a: isEn
        ? "Cognitive Behavioral Therapy (CBT) is the gold standard approach with the highest worldwide scientific evidence for treating anxiety, depression, and emotional dysregulation. Rather than just passive listening, CBT actively investigates how your thoughts, emotions, and behaviors interact, providing real tools to modify automatic patterns and achieve lasting autonomy."
        : "El Enfoque Cognitivo-Conductual (TCC) es el estándar de oro con mayor evidencia científica internacional (reconocido por la APA y la OMS). A diferencia de enfoques pasivos donde solo se habla sin rumbo, la TCC es un proceso colaborativo, estructurado y enfocado en objetivos. Trabajamos en cómo tus pensamientos automáticos influyen en lo que sientes y haces, entregándote herramientas prácticas para regular tu sistema nervioso y transformar patrones limitantes en la vida real."
    },
    {
      q: isEn ? "What third-generation therapies are integrated in sessions?" : "¿Qué terapias de tercera generación se integran en las sesiones?",
      a: isEn
        ? "Dr. Mariana integrates Acceptance and Commitment Therapy (ACT), Mindfulness, and Emotion Regulation techniques. This combination unites scientific rigor with deep self-compassion, helping you accept difficult feelings without judgment and take action aligned with your core values."
        : "La Dra. Mariana complementa la TCC clásica con Terapias de Tercera Generación: Terapia de Aceptación y Compromiso (ACT), Mindfulness Clínico y Técnicas de Regulación Emocional Somática. Este abordaje integrativo une el rigor científico con una profunda calidez humana, permitiéndote relacionarte de una forma compasiva con tus emociones en lugar de luchar contra ellas."
    },
    {
      q: isEn ? "Do you see international patients outside of Colombia?" : "¿Atiendes a personas que viven fuera de Colombia?",
      a: isEn
        ? "Yes. Over 60% of Soulmar's consultations are with Hispanic and international patients residing in the United States, Europe, Mexico, and Latin America via encrypted Google Meet sessions, with flexible time zones."
        : "Sí, absolutamente. Más del 60% de los consultantes de Soulmar son hispanohablantes que residen en Estados Unidos, España, Canadá, México, Chile y toda Latinoamérica. Las sesiones se realizan por videollamada cifrada de alta definición (Google Meet) con adaptación horaria personalizada."
    },
    {
      q: isEn ? "How does privacy and medical confidentiality work?" : "¿Cómo se garantiza la confidencialidad médica y el secreto profesional?",
      a: isEn
        ? "Everything discussed in therapy is protected by professional medical confidentiality. Soulmar complies with HIPAA guidelines for online health privacy, encrypted communications, and strict bioethical codes."
        : "Todo lo compartido en sesión está estrictamente blindado por el Secreto Profesional Médico y Psicológico según la Ley 1090. Soulmar utiliza canales cifrados de extremo a extremo, almacenamiento protegido de historia clínica y protocolos éticos internacionales para asegurar tu máxima privacidad."
    }
  ]

  // Formación académica y credenciales
  const credentials = [
    {
      icon: GraduationCap,
      title: isEn ? "Clinical Psychology Degree" : "Licenciada en Psicología Clínica",
      institution: isEn ? "Accredited University • Health Sciences Faculty" : "Universidad Acreditada de Alta Calidad • Facultad de Ciencias de la Salud",
      description: isEn
        ? "Solid scientific foundation in psychopathology, clinical assessment, and evidence-based psychotherapy."
        : "Formación científica rigurosa en psicopatología, evaluación clínica y psicoterapia basada en la evidencia."
    },
    {
      icon: Brain,
      title: isEn ? "Mastery in Cognitive Behavioral Psychotherapy" : "Especialización en Psicoterapia Cognitivo-Conductual (TCC)",
      institution: isEn ? "Postgraduate Institute of Clinical Psychology" : "Formación de Posgrado y Posgrados Clínicos Continuos",
      description: isEn
        ? "Specialized training in protocol-driven intervention for mood, anxiety, and panic disorders."
        : "Entrenamiento especializado en protocolos de intervención para trastornos del estado de ánimo, ansiedad, sobrepensamiento y pánico."
    },
    {
      icon: Award,
      title: isEn ? "Certified in Third-Generation Therapies (ACT & Mindfulness)" : "Certificación en Terapias de Tercera Generación (ACT y Mindfulness)",
      institution: isEn ? "International Contextual Psychology Association" : "Entrenamiento Clínico en Terapia de Aceptación y Compromiso",
      description: isEn
        ? "Skills for emotional acceptance, distress tolerance, psychological flexibility, and nervous system regulation."
        : "Herramientas de aceptación emocional, tolerancia al malestar, flexibilidad psicológica y regulación somática del sistema nervioso."
    },
    {
      icon: ShieldCheck,
      title: isEn ? "Professional License No. 248910 (COLPSIC)" : "Tarjeta Profesional No. 248910 (COLPSIC)",
      institution: isEn ? "Colombian College of Psychologists & Ministry of Health (ReTHUS)" : "Colegio Colombiano de Psicólogos y Ministerio de Salud (ReTHUS)",
      description: isEn
        ? "Active legal clinical accreditation ensuring compliance with ethical, deontological, and healthcare laws."
        : "Acreditación legal y habilitación clínica activa para el ejercicio profesional de la psicoterapia individual y de adultos."
    }
  ]

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0b0b0c] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500 overflow-x-hidden selection:bg-[#8da9c4]/30 selection:text-foreground">
      
      {/* =========================================================================
          SECCIÓN 1: CORE FEATURES (3-COLUMN LAYOUT CON FOTO DE MARIANA EN EL CENTRO)
          ========================================================================= */}
      <section className="pt-8 sm:pt-12 md:pt-16 pb-20 md:pb-28 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        
        {/* ENCABEZADO CENTRADO */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18 space-y-3.5">
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

        {/* ESTRUCTURA 3 COLUMNAS: 2 CARDS | FOTO CENTRAL | 2 CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
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
          (4 tarjetas asimétricas: Caja 1 Izquierda Alta + Caja 2 Mi Vocación +
           Caja 3 Formación Universidad El Bosque + Caja 4 Un Lugar Para Tu Historia)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* CAJA 1 (IZQUIERDA ALTA - lg:col-span-5) — LA HISTORIA DETRÁS DE SOULMAR */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
            {/* Fotografía de Mariana Caicedo - Protagonista, encuadre natural y elegante */}
            <div className="bg-neutral-200 dark:bg-[#1f1f23] rounded-[24px] sm:rounded-[28px] overflow-hidden aspect-[4/4.5] sm:aspect-[4/4.2] w-full relative shadow-xs group">
              <Image
                src={bento1Desktop || "/images/therapists/mariana_sobre_mi.webp"}
                alt="Mariana Caicedo, psicóloga y fundadora de Soulmar"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-[center_18%] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>

            {/* Contenido editorial humano y cercano */}
            <div className="mt-6 sm:mt-7 space-y-3.5 flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                {isEn ? "I am Mariana" : "Soy Mariana"}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                {isEn
                  ? "“I believe we all deserve a safe space to be heard.”"
                  : "«Creo que todos merecemos un espacio para ser escuchados.»"}
              </h2>

              <p className="text-sm sm:text-[14.5px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal">
                {isEn
                  ? "I am Mariana Caicedo, psychologist and founder of Soulmar. My purpose is to guide you to understand your emotions and build a kinder relationship with yourself."
                  : "Soy Mariana Caicedo, psicóloga y fundadora de Soulmar. Mi propósito es acompañarte a comprender tus emociones y construir una relación más amable contigo mismo."}
              </p>

              {/* Botón hacia la sección biográfica real (#historia) */}
              <div className="pt-2">
                <Link
                  href="#historia"
                  className="inline-flex items-center gap-3 bg-[#1d1d1f] hover:bg-black text-white dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-neutral-200 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 group/btn w-fit cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8da9c4]"
                >
                  <span>{isEn ? "Read my story" : "Conoce mi historia"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* CONTENEDOR DERECHO (lg:col-span-7 flex flex-col justify-between gap-5 lg:gap-6) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5 lg:gap-6">
            
            {/* FILA SUPERIOR: CAJA 2 (MI VOCACIÓN) + CAJA 3 (CONFIANZA PROFESIONAL) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 lg:gap-6">
              
              {/* CAJA 2 (sm:col-span-7) — MI VOCACIÓN */}
              <div className="sm:col-span-7 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
                {/* Imagen horizontal de ambiente clínico cálido */}
                <div className="rounded-[22px] overflow-hidden relative aspect-[16/10] w-full mb-5 shadow-xs bg-neutral-200 dark:bg-neutral-800 group">
                  <Image
                    src={bento2Desktop || "/images/hero-soulmar-cozy.jpg"}
                    alt="Espacio terapéutico cálido, seguro y acogedor en Soulmar"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                    {isEn ? "My Vocation" : "Mi vocación"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                    {isEn ? "Why did I choose psychology?" : "¿Por qué elegí la psicología?"}
                  </h3>
                  <p className="text-sm sm:text-[14.5px] text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed italic pt-1">
                    {isEn
                      ? "“Behind every story there is a person who deserves to be truly understood.”"
                      : "«Detrás de cada historia hay una persona que merece ser comprendida.»"}
                  </p>
                </div>
              </div>

              {/* CAJA 3 (sm:col-span-5) — CONFIANZA PROFESIONAL (UNIVERSIDAD EL BOSQUE) */}
              <div className="sm:col-span-5 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] min-h-[220px] transition-all duration-200">
                {/* Icono académico minimalista */}
                <div className="w-14 h-14 rounded-2xl bg-[#8da9c4]/15 dark:bg-[#8da9c4]/25 text-[#8da9c4] dark:text-[#a5c0db] flex items-center justify-center mb-4 shadow-xs">
                  <GraduationCap className="w-7 h-7 stroke-[2.2]" />
                </div>

                <span className="text-[11px] font-bold tracking-wider uppercase text-[#8da9c4] dark:text-[#a5c0db] mb-1.5 block">
                  {isEn ? "Academic Credential" : "Formación Profesional"}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug mb-2">
                  Universidad El Bosque
                </h3>

                <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed max-w-[210px]">
                  {isEn
                    ? "University Degree in Psychology · Bogotá, Colombia."
                    : "Formación universitaria en Psicología · Bogotá, Colombia."}
                </p>
              </div>
            </div>

            {/* CAJA 4 (INFERIOR ANCHA) — UN LUGAR PARA TU HISTORIA */}
            <div className="bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-200">
              <div className="space-y-2 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8da9c4] dark:text-[#a5c0db] block">
                  {isEn ? "A place for your story" : "Un lugar para tu historia"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                  {isEn
                    ? "You don’t have to have all the answers to begin."
                    : "No tienes que tener todas las respuestas para comenzar."}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
                  {isEn
                    ? "Sometimes, the first step is finding a place where you can speak freely and feel accompanied."
                    : "A veces, el primer paso es encontrar un lugar donde puedas hablar con libertad y sentirte acompañado."}
                </p>
              </div>

              {/* Botón hacia el flujo de agendamiento oficial */}
              <div className="shrink-0 pt-2 sm:pt-0">
                <Link
                  href="/#caja-agendamiento"
                  className="inline-flex items-center gap-3 bg-[#1d1d1f] hover:bg-black text-white dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-neutral-200 px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 group/btn whitespace-nowrap cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8da9c4]"
                >
                  <span>{isEn ? "Book your first session" : "Agenda tu primera sesión"}</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">
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
      <section id="historia" className="py-16 md:py-24 bg-white dark:bg-[#121214] border-y border-neutral-200/60 dark:border-white/5 px-4 sm:px-6 md:px-10 scroll-mt-20">
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
                ? "Your mental health deserves registered, certified, and constantly updated clinical guidance."
                : "Tu salud mental merece estar en manos de un profesional colegiado, legalmente habilitado y con continua actualización científica."}
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
      <section className="py-16 md:py-24 bg-neutral-100/60 dark:bg-black/40 border-t border-neutral-200/60 dark:border-white/5 px-4 sm:px-6 md:px-10">
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
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#1d1d1f] dark:text-white pr-2">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#8da9c4] text-white" : "text-neutral-500"}`}>
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
