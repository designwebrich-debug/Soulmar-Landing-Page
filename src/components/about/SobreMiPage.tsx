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
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  Lock,
  FileCheck2,
  Globe2,
  Compass,
  Check
} from "lucide-react"
import { FooterSection } from "@/components/home/FooterSection"
import { useTranslation } from "@/context/LanguageContext"
import { useMedia } from "@/context/MediaContext"
import { WHATSAPP_ID } from "@/lib/constants"

export function SobreMiPage() {
  const { language } = useTranslation()
  const { getMediaUrl } = useMedia()
  const isEn = language === "en"

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
            {isEn
              ? "Core features that set our clinical space apart"
              : "Pilares clínicos que definen nuestro acompañamiento"}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
            {isEn
              ? "Evidence-based Cognitive Behavioral Therapy combined with warmth and unconditional support to guide you back to yourself."
              : "Psicoterapia basada en la más alta evidencia científica internacional, combinada con un espacio humano, libre de juicios y enfocado en devolverte el control de tu vida."}
          </p>
        </div>

        {/* ESTRUCTURA 3 COLUMNAS: 2 CARDS | FOTO CENTRAL | 2 CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* COLUMNA IZQUIERDA (2 Cards apiladas) */}
          <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
            {/* Card 1: Enfoque TCC */}
            <div className="bg-[#f5f5f7] dark:bg-white/[0.03] rounded-[28px] p-7 md:p-8 border border-neutral-200/60 dark:border-white/5 flex flex-col justify-between hover:border-[#8da9c4]/50 transition-all duration-300 shadow-xs h-full min-h-[190px] group">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] dark:bg-[#8da9c4] text-white flex items-center justify-center shrink-0 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 stroke-[2.2]" />
              </div>
              <p className="text-sm md:text-[14.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                <strong className="text-[#1d1d1f] dark:text-white font-bold block sm:inline mr-1">
                  {isEn ? "Cognitive Behavioral Therapy (CBT)" : "Enfoque Cognitivo-Conductual"}
                </strong>
                {isEn
                  ? "Protocol-driven interventions with the highest scientific evidence to dismantle rumination and anxiety."
                  : "Protocolos estructurados con la más alta evidencia científica internacional para desarmar la ansiedad, el sobrepensamiento y patrones limitantes."}
              </p>
            </div>

            {/* Card 2: Terapias de 3ª Generación */}
            <div className="bg-[#f5f5f7] dark:bg-white/[0.03] rounded-[28px] p-7 md:p-8 border border-neutral-200/60 dark:border-white/5 flex flex-col justify-between hover:border-[#8da9c4]/50 transition-all duration-300 shadow-xs h-full min-h-[190px] group">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] dark:bg-[#8da9c4] text-white flex items-center justify-center shrink-0 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 stroke-[2.2]" />
              </div>
              <p className="text-sm md:text-[14.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                <strong className="text-[#1d1d1f] dark:text-white font-bold block sm:inline mr-1">
                  {isEn ? "Third-Generation Therapies (ACT)" : "Aceptación y Mindfulness (ACT)"}
                </strong>
                {isEn
                  ? "Compassionate emotional acceptance and mindfulness skills to relate to your feelings without struggle."
                  : "Herramientas de autocompasión y flexibilidad psicológica para relacionarte con tus emociones sin juzgarte y volver a tu centro."}
              </p>
            </div>
          </div>

          {/* COLUMNA CENTRAL (Retrato cálido de Mariana en sesión) */}
          <div className="lg:col-span-4 relative rounded-[32px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/70 dark:border-white/10 shadow-lg min-h-[420px] lg:min-h-[440px] group">
            <Image
              src="/images/therapists/mariana_v2.png"
              alt="Dra. Mariana Caicedo - Sesión Clínica Online"
              fill
              quality={100}
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Sutil viñeta para contraste */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

            {/* Identificación en la base de la tarjeta central */}
            <div className="absolute bottom-5 inset-x-5 text-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Dra. Mariana Caicedo</h4>
                <p className="text-[11px] text-[#8da9c4] font-medium">Psicóloga Clínica • Fundadora Soulmar</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA (2 Cards apiladas) */}
          <div className="lg:col-span-4 flex flex-col gap-5 justify-between">
            {/* Card 3: Modalidad Online */}
            <div className="bg-[#f5f5f7] dark:bg-white/[0.03] rounded-[28px] p-7 md:p-8 border border-neutral-200/60 dark:border-white/5 flex flex-col justify-between hover:border-[#8da9c4]/50 transition-all duration-300 shadow-xs h-full min-h-[190px] group">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] dark:bg-[#8da9c4] text-white flex items-center justify-center shrink-0 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <Globe2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <p className="text-sm md:text-[14.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                <strong className="text-[#1d1d1f] dark:text-white font-bold block sm:inline mr-1">
                  {isEn ? "Worldwide Online Access" : "Consulta Online Internacional"}
                </strong>
                {isEn
                  ? "Private, encrypted HD sessions on Google Meet, flexible for patients in the US, Europe, and Latin America."
                  : "Sesiones privadas por Google Meet con adaptación horaria para pacientes en Colombia, Estados Unidos, España y Latinoamérica."}
              </p>
            </div>

            {/* Card 4: Seguridad y Secreto Profesional */}
            <div className="bg-[#f5f5f7] dark:bg-white/[0.03] rounded-[28px] p-7 md:p-8 border border-neutral-200/60 dark:border-white/5 flex flex-col justify-between hover:border-[#8da9c4]/50 transition-all duration-300 shadow-xs h-full min-h-[190px] group">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] dark:bg-[#8da9c4] text-white flex items-center justify-center shrink-0 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <p className="text-sm md:text-[14.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                <strong className="text-[#1d1d1f] dark:text-white font-bold block sm:inline mr-1">
                  {isEn ? "Medical Confidentiality" : "Confidencialidad Médica y Ética"}
                </strong>
                {isEn
                  ? "Strict adherence to legal and bioethical standards (Law 1090). Your medical history remains 100% protected."
                  : "Secreto profesional médico blindado conforme a la Ley 1090. Tu proceso clínico y tu privacidad están 100% protegidos."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 3: BENTO GRID APPLE LUXURY (ESTRUCTURA IDÉNTICA A LA SEGUNDA FOTO)
          (4 tarjetas asimétricas: Izquierda alta + 2 superiores + 1 ancha inferior)
          ========================================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          
          {/* TARJETA 1 (IZQUIERDA ALTA - SPAN DE ALTURA COMPLETA) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {/* Contenedor blanco superior con fotografía de mano / joyas / mindfulness */}
            <div className="bg-white dark:bg-[#1f1f23] rounded-[24px] sm:rounded-[28px] p-6 flex items-center justify-center aspect-[4/3] sm:aspect-square w-full overflow-hidden shadow-xs relative group">
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85"
                alt="Mindfulness y conexión terapéutica"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Texto editorial inferior */}
            <div className="mt-6 sm:mt-8 space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                {isEn
                  ? "Handcrafted by clinical evidence and human warmth to deliver lasting calm and unmatched quality."
                  : "Psicoterapia basada en evidencia científica y calidez humana para devolverte la serenidad y el control de tu vida."}
              </h3>

              {/* Botón píldora negro con flecha circular */}
              <Link
                href="/#caja-agendamiento"
                className="inline-flex items-center gap-3 bg-[#1d1d1f] hover:bg-black text-white dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-neutral-200 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 group w-fit cursor-pointer select-none"
              >
                <span>{isEn ? "Explore Therapies" : "Conoce las terapias"}</span>
                <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>

          {/* CONTENEDOR DERECHO (DIVIDIDO EN FILA SUPERIOR CON 2 CARDS + FILA INFERIOR ANCHA) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5 lg:gap-6">
            
            {/* FILA SUPERIOR: 2 CARDS (CARD 2 + CARD 3) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 lg:gap-6">
              
              {/* TARJETA 2 (SUPERIOR IZQUIERDA - ALIANZA TERAPÉUTICA / HANDSHAKE) */}
              <div className="sm:col-span-7 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                {/* Imagen horizontal de apretón de manos / confianza */}
                <div className="rounded-[22px] overflow-hidden relative aspect-[16/10] w-full mb-5 shadow-xs bg-neutral-200 dark:bg-neutral-800">
                  <Image
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=85"
                    alt="Alianza de confianza y acompañamiento terapéutico"
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <h4 className="text-base sm:text-lg leading-snug">
                  <span className="font-bold text-[#1d1d1f] dark:text-white block sm:inline mr-1.5">
                    {isEn ? "Trusted by" : "Alianza terapéutica"}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                    {isEn
                      ? "over 450 patients worldwide with rigorous clinical standards."
                      : "respaldada por más de 450 pacientes y rigor clínico internacional."}
                  </span>
                </h4>
              </div>

              {/* TARJETA 3 (SUPERIOR DERECHA - STAT 50% + REY DE AJEDREZ DE CRISTAL AZUL Y CORONA) */}
              <div className="sm:col-span-5 bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 border border-black/5 dark:border-white/10 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden relative min-h-[200px]">
                {/* Texto de estadística a la izquierda */}
                <div className="space-y-1.5 pr-2 z-10">
                  <div className="text-4xl sm:text-5xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-none">
                    50%
                  </div>
                  <p className="text-xs sm:text-[12.5px] text-neutral-500 dark:text-neutral-400 font-normal leading-snug">
                    {isEn
                      ? "Average reduction in baseline stress & anxiety within the first 6 clinical sessions."
                      : "Reducción promedio de síntomas de ansiedad en las primeras 6 sesiones clínicas."}
                  </p>
                </div>

                {/* Rey de ajedrez en cristal azul y corona de oro idéntico a la foto de referencia */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <svg className="w-20 sm:w-24 h-28 sm:h-32 drop-shadow-[0_10px_20px_rgba(141,169,196,0.35)]" viewBox="0 0 100 140" fill="none">
                    <defs>
                      <linearGradient id="glassKing" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.95" />
                        <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.85" />
                        <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.95" />
                      </linearGradient>
                      <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#a16207" />
                      </linearGradient>
                      <linearGradient id="shineGloss" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Corona dorada con 3 puntas */}
                    <g id="goldCrown">
                      <path d="M 36 28 L 40 13 L 47 22 L 50 9 L 53 22 L 60 13 L 64 28 Z" fill="url(#goldCrownGrad)" stroke="#854d0e" strokeWidth="1" strokeLinejoin="round" />
                      <circle cx="40" cy="12" r="2.2" fill="#fef08a" />
                      <circle cx="50" cy="8" r="2.6" fill="#fef08a" />
                      <circle cx="60" cy="12" r="2.2" fill="#fef08a" />
                      <ellipse cx="50" cy="28" rx="14" ry="2.5" fill="#ca8a04" />
                    </g>

                    {/* Esfera / Cabeza de cristal azul */}
                    <ellipse cx="50" cy="38" rx="11" ry="9" fill="url(#glassKing)" />
                    <ellipse cx="47" cy="35" rx="5" ry="3" fill="url(#shineGloss)" />

                    {/* Cuello y anillo */}
                    <ellipse cx="50" cy="48" rx="14" ry="3.5" fill="url(#glassKing)" />
                    <ellipse cx="48" cy="47" rx="8" ry="1.5" fill="url(#shineGloss)" />

                    {/* Cuerpo de cristal estilizado (reloj de arena) */}
                    <path d="M 41 51 C 43 65, 39 77, 36 94 L 64 94 C 61 77, 57 65, 59 51 Z" fill="url(#glassKing)" />
                    <path d="M 42 53 C 44 65, 40 76, 38 92" stroke="url(#shineGloss)" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Anillo de base */}
                    <ellipse cx="50" cy="96" rx="20" ry="5.5" fill="url(#glassKing)" />
                    <ellipse cx="48" cy="94.5" rx="12" ry="2" fill="url(#shineGloss)" />

                    {/* Pedestal ancho de la pieza de ajedrez */}
                    <path d="M 30 100 C 27 108, 24 116, 20 126 C 28 130, 72 130, 80 126 C 76 116, 73 108, 70 100 Z" fill="url(#glassKing)" />
                    <ellipse cx="50" cy="126" rx="30" ry="7" fill="url(#glassKing)" />
                    <path d="M 24 124 C 32 128, 68 128, 76 124" stroke="url(#shineGloss)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* TARJETA 4 (INFERIOR ANCHA - RETRATO ELEGANTE + TEXTO EDITORIAL) */}
            <div className="bg-[#edeef1] dark:bg-[#151518] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 border border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden relative">
              {/* Texto a la izquierda */}
              <div className="flex-1 max-w-md space-y-2">
                <h4 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                  <span>{isEn ? "Elevates emotional regulation and " : "Fortalece tu regulación emocional y "}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                    {isEn
                      ? "transforms your inner dialogue into lasting clarity, confidence, and authentic peace."
                      : "transforma tu manera de habitar el presente con claridad, autocompasión y paz auténtica."}
                  </span>
                </h4>
              </div>

              {/* Retrato estilizado a la derecha como en la foto de referencia */}
              <div className="relative w-44 sm:w-52 h-44 sm:h-52 shrink-0 rounded-[24px] overflow-hidden bg-neutral-200 dark:bg-neutral-800 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85"
                  alt="Elevación y serenidad personal"
                  fill
                  sizes="(max-width: 768px) 100vw, 250px"
                  className="object-cover object-center hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: FORMACIÓN ACADÉMICA Y CREDENCIALES CLÍNICAS
          ========================================================= */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#121214] border-y border-neutral-200/60 dark:border-white/5 px-4 sm:px-6 md:px-10">
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
