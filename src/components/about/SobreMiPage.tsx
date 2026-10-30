"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldCheck,
  Award,
  GraduationCap,
  BookOpen,
  Brain,
  Heart,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Lock,
  FileCheck2,
  Globe2,
  Clock,
  Sparkle,
  Compass,
  Check
} from "lucide-react"
import { FooterSection } from "@/components/home/FooterSection"
import { useTranslation } from "@/context/LanguageContext"
import { useMedia } from "@/context/MediaContext"
import { WHATSAPP_ID, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants"

export function SobreMiPage() {
  const { language } = useTranslation()
  const { getMediaUrl } = useMedia()
  const isEn = language === "en"

  // Audio Player State (Mensaje personal de bienvenida)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Simulation of audio playback with animated soundwave
  useEffect(() => {
    let timer: any
    if (isPlaying) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1.25
        })
      }, 350)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const toggleAudio = () => {
    setIsPlaying((prev) => !prev)
  }

  // Foto de la Dra. Mariana configurada en el sistema multimedia
  const therapistImage = getMediaUrl("therapist_mariana", "/images/therapists/mariana.png", "desktop")

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

  // Formación académica y trayectoria
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
          HERO & AUTORIDAD CLÍNICA
          ========================================================================= */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        {/* Glow ambiental */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[75vw] max-w-4xl h-[360px] bg-[#8da9c4]/20 dark:bg-[#8da9c4]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-48 right-10 w-72 h-72 bg-[#5d7c99]/15 blur-[120px] rounded-full pointer-events-none" />

        {/* BREADCRUMB NAVIGATION */}
        <div className="relative z-10 flex items-center gap-2 text-xs md:text-sm font-medium text-[#1d1d1f]/60 dark:text-white/50 mb-6">
          <Link
            href="/"
            className="hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isEn ? "Home" : "Inicio"}</span>
          </Link>
          <span className="text-[#1d1d1f]/30 dark:text-white/20">/</span>
          <span className="text-[#8da9c4] font-semibold">{isEn ? "About Me" : "Sobre mí"}</span>
        </div>

        {/* CONTENEDOR HERO EN GRID DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* COLUMNA IZQUIERDA: Textos de Autoridad, Titulación y Filosofía */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* BADGE DE IDENTIFICACIÓN PROFESIONAL */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-bold text-[#8da9c4] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#8da9c4]" />
              <span className="tracking-wide uppercase text-[11px]">
                {isEn ? "Clinical Psychologist • Certified Professional" : "Psicóloga Clínica • Registro Profesional Verificado"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-[1.08]">
              {isEn ? (
                <>
                  Dr. Mariana <br />
                  <span className="text-[#8da9c4]">Caicedo Quintero</span>
                </>
              ) : (
                <>
                  Dra. Mariana <br />
                  <span className="text-[#8da9c4]">Caicedo Quintero</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed max-w-2xl">
              {isEn
                ? "Clinical psychologist, founder of Soulmar. I practice evidence-based Cognitive Behavioral Therapy (CBT) and third-generation therapies, providing a compassionate, warm, and confidential space to heal without judgment."
                : "Psicóloga Clínica y fundadora de Soulmar. Ejerzo una psicoterapia basada en evidencia científica (Enfoque Cognitivo-Conductual y 3ª Generación), combinando el más alto rigor clínico con un espacio cálido, cercano y libre de juicios para volver a ti."}
            </p>

            {/* PÍLDORAS DE AUTORIDAD CLÍNICA */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                <Award className="w-3.5 h-3.5 text-[#8da9c4]" />
                {isEn ? "COLPSIC License No. 248910" : "Tarjeta Profesional No. 248910 (COLPSIC)"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                <Brain className="w-3.5 h-3.5 text-[#8da9c4]" />
                {isEn ? "CBT Approach (Cognitive Behavioral)" : "Enfoque Cognitivo-Conductual (TCC)"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                <Globe2 className="w-3.5 h-3.5 text-[#8da9c4]" />
                {isEn ? "100% Online Worldwide" : "Acompañamiento Online Internacional"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10">
                <Lock className="w-3.5 h-3.5 text-[#8da9c4]" />
                {isEn ? "Strict Professional Confidentiality" : "Secreto Profesional Médico"}
              </span>
            </div>

            {/* BOTONES DE ACCIÓN PRINCIPAL */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/#agendamiento"
                className="h-12 px-7 rounded-full bg-[#8da9c4] hover:bg-[#7a9ab8] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#8da9c4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isEn ? "Book Session with Dr. Mariana" : "Agendar Sesión con Dra. Mariana"}</span>
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-6 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-50 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white font-bold text-sm border border-black/10 dark:border-white/15 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{isEn ? "Talk on WhatsApp" : "Hablar por WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* COLUMNA DERECHA: Retrato Clínico de la Dra. Mariana & Reproductor de Voz */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* CARD CON RETRATO OFICIAL Y EFECTO APPLE LIQUID GLASS */}
            <div className="relative rounded-[32px] overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 p-3 shadow-2xl">
              
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={therapistImage}
                  alt="Dra. Mariana Caicedo Quintero - Psicóloga Clínica"
                  fill
                  quality={95}
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />

                {/* Badge de Disponibilidad Activa en la Foto */}
                <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full bg-black/60 dark:bg-black/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-2 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-[#1D9E75] animate-pulse" />
                  <span>{isEn ? "Available for Online Therapy" : "Consulta Online Disponible"}</span>
                </div>

                {/* Badge Inferior de Credenciales */}
                <div className="absolute bottom-3.5 inset-x-3.5 p-3.5 rounded-2xl bg-black/75 dark:bg-black/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">Dra. Mariana Caicedo</h4>
                    <p className="text-[11px] text-[#8da9c4] font-medium">Tarjeta Prof. Colpsic No. 248910</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                </div>
              </div>
            </div>

            {/* TARJETA DE VOZ PERSONAL (Apple Podcasts / Siri Soundwave Style) */}
            <div className="rounded-2xl p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#8da9c4]/20 flex items-center justify-center text-[#8da9c4]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                      {isEn ? "Voice Note from Dr. Mariana" : "Mensaje de bienvenida de Mariana"}
                    </h5>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {isEn ? "Listen to her personal voice (1:12 min)" : "Escucha su voz y mensaje personal (1:12 min)"}
                    </p>
                  </div>
                </div>

                {/* Botón Play / Pause interactivo */}
                <button
                  onClick={toggleAudio}
                  aria-label={isPlaying ? "Pausar mensaje" : "Escuchar mensaje de voz"}
                  className="w-9 h-9 rounded-full bg-[#8da9c4] hover:bg-[#7a9ab8] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>

              {/* Animación de onda sonora estilo Apple */}
              <div className="flex items-center gap-1.5 h-6 px-2 bg-neutral-100 dark:bg-white/5 rounded-xl overflow-hidden">
                {[12, 22, 16, 28, 14, 24, 18, 30, 20, 15, 26, 17, 24, 19, 29, 14, 21, 16, 27, 18].map((h, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? "bg-[#8da9c4] animate-pulse"
                        : "bg-neutral-300 dark:bg-neutral-700"
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(6, (h * (audioProgress % 30 + 10)) / 25)}px` : `${h / 2.5}px`,
                      animationDelay: `${i * 60}ms`
                    }}
                  />
                ))}
              </div>

              {/* Transcripción del mensaje */}
              <p className="text-[11.5px] italic text-neutral-600 dark:text-neutral-400 leading-relaxed pt-1 border-t border-black/5 dark:border-white/5">
                {isEn
                  ? '"Hello, I am Mariana. Therapy is not a place where you come to be judged. It is a warm, evidence-based sanctuary where we dismantle automatic worry, understand your emotions, and build real peace for your daily life."'
                  : '«Hola, soy Mariana. Sé lo difícil que puede ser dar el primer paso hacia la terapia. Quiero que sepas que en este espacio no vienes a ser juzgado/a; vienes a encontrar un lugar seguro donde desarmar lo que te pesa, entender tus emociones y construir herramientas reales para tu día a día.»'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 2: FORMACIÓN ACADÉMICA Y PRUEBA DE AUTORIDAD INAPELABLE
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#121214] border-y border-black/5 dark:border-white/5 px-4 sm:px-6 md:px-10">
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
                  className="p-6 md:p-8 rounded-3xl bg-[#fafaf9] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 hover:border-[#8da9c4]/50 transition-all duration-300 flex items-start gap-5 group shadow-xs"
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
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
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
          SECCIÓN 3: EL ENFOQUE COGNITIVO-CONDUCTUAL Y POR QUÉ FUNCIONA
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black tracking-widest uppercase text-[#8da9c4]">
              {isEn ? "THERAPEUTIC METHODOLOGY" : "ENFOQUE TERAPÉUTICO BASADO EN EVIDENCIA"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight leading-tight">
              {isEn ? (
                <>
                  Cognitive Behavioral Therapy (CBT) & <br />
                  <span className="text-[#8da9c4]">Third-Generation Integration</span>
                </>
              ) : (
                <>
                  El Enfoque Cognitivo-Conductual (TCC) & <br />
                  <span className="text-[#8da9c4]">Terapias de 3ª Generación</span>
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {isEn
                ? "Our work is grounded in scientific rigor. We do not engage in endless, unstructured conversation; we actively map your emotional and cognitive triggers, transforming automatic patterns into practical tools."
                : "La práctica clínica de la Dra. Mariana se basa en el principio de que tus emociones no ocurren por azar: son el resultado de cómo tu mente interpreta la realidad. A través de la TCC, desarmamos el sobrepensamiento, desactivamos las respuestas de alerta innecesarias y reprogramamos tus reacciones para que recuperes el control."}
            </p>

            <div className="space-y-4 pt-2">
              {[
                {
                  title: isEn ? "Reconstructing Automatic Thoughts" : "Reestructuración de Pensamientos Automáticos",
                  desc: isEn
                    ? "Identifying cognitive distortions (catastrophizing, mind reading) and replacing them with objective, calm facts."
                    : "Identificar y reemplazar distorsiones cognitivas (catastrofismo, autocrítica severa) por hechos objetivos y comprobables."
                },
                {
                  title: isEn ? "Somatic Nervous System Regulation" : "Regulación Somática del Sistema Nervioso",
                  desc: isEn
                    ? "Concrete breathing, mindfulness, and sensory anchoring tools to halt anxiety and panic directly in the body."
                    : "Herramientas concretas de respiración diafragmática y anclaje sensorial para frenar la taquicardia y la angustia corporal."
                },
                {
                  title: isEn ? "Real-Life Practical Skills" : "Herramientas Prácticas para Tu Día a Día",
                  desc: isEn
                    ? "Structured exercises between sessions so progress continues in your daily relationships and work."
                    : "Ejercicios claros entre sesiones para que tu evolución continúe en tu vida cotidiana, sin crear dependencia."
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#8da9c4]/20 text-[#8da9c4] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico Visual del Triángulo Cognitivo (Pensamiento - Emoción - Conducta) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-extrabold text-center text-neutral-900 dark:text-white uppercase tracking-wider text-xs">
              {isEn ? "THE COGNITIVE-BEHAVIORAL TRIANGLE" : "EL TRIÁNGULO COGNITIVO DE LA DRA. MARIANA"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#8da9c4]/10 border border-[#8da9c4]/20 space-y-1">
                <Brain className="w-6 h-6 text-[#8da9c4] mx-auto mb-2" />
                <h4 className="text-xs font-black uppercase text-neutral-900 dark:text-white">1. Pensamiento</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Lo que te dices a ti mismo/a sobre lo que pasa</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#8da9c4]/10 border border-[#8da9c4]/20 space-y-1">
                <Heart className="w-6 h-6 text-[#8da9c4] mx-auto mb-2" />
                <h4 className="text-xs font-black uppercase text-neutral-900 dark:text-white">2. Emoción</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Lo que experimenta y siente tu cuerpo</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#8da9c4]/10 border border-[#8da9c4]/20 space-y-1">
                <Compass className="w-6 h-6 text-[#8da9c4] mx-auto mb-2" />
                <h4 className="text-xs font-black uppercase text-neutral-900 dark:text-white">3. Conducta</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">La respuesta o acción que tomas en tu vida</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic border border-black/5 dark:border-white/5 text-center">
              «Al intervenir sobre tus pensamientos e interpretaciones, transformamos cómo se siente tu cuerpo y recuperas la calma en tus decisiones.»
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: PREGUNTAS FRECUENTES (FAQ) DE AUTORIDAD CLÍNICA
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-neutral-100/60 dark:bg-black/40 border-t border-black/5 dark:border-white/5 px-4 sm:px-6 md:px-10">
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
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-[#151518] overflow-hidden transition-all duration-300 shadow-xs"
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
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
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
          SECCIÓN 5: CTA FINAL DE AGENDAMIENTO
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
            href="/#agendamiento"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#8da9c4] hover:bg-[#7a9ab8] text-white font-bold text-sm shadow-xl shadow-[#8da9c4]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{isEn ? "Book Online Session" : "Reservar Sesión Online"}</span>
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-50 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white font-bold text-sm border border-black/10 dark:border-white/15 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
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
