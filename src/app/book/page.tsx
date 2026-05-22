"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Star,
  MessageSquare,
  Clock,
  ShieldCheck,
  Video,
  ArrowRight,
  Loader2,
  Sparkles,
  HeartHandshake
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/context/LanguageContext"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { cn, formatPrice, formatCOPtoUSD } from "@/lib/utils"
import { WHATSAPP_PHONE } from "@/lib/constants"

type SessionType = "evaluation_15min" | "full_session"

interface Therapist {
  id: string; // Changed to string for UUID simulation
  name: string;
  specKey: string;
  rating: string;
  reviews: number;
  price: number;
  img: string;
  bio: string;
}

const THERAPISTS: Therapist[] = [
  { 
    id: "uuid-1", 
    name: "Dra. Mariana Caicedo", 
    specKey: "mariana", 
    rating: "5.0", 
    reviews: 312,
    price: 210000, 
    img: "/images/therapists/mariana_v2.png",
    bio: "Psicóloga Clínica U. Javeriana. +10 años transformando vidas en Bogotá. Experta en desarmar la ansiedad severa y reestructurar relaciones de pareja en crisis mediante Terapia Cognitivo-Conductual de alta eficacia."
  },
  { 
    id: "uuid-2", 
    name: "Dra. Libertad Mejía", 
    specKey: "libertad", 
    rating: "4.9", 
    reviews: 184,
    price: 180000, 
    img: "/images/therapists/libertad_v3.png",
    bio: "Especialista en trauma y sanación profunda. Acompaño procesos de duelo, depresión silenciosa y dependencia emocional. Un espacio clínico seguro y libre de juicios para reconectar con tu valor personal."
  },
  { 
    id: "uuid-3", 
    name: "Dr. Moshé Musini", 
    specKey: "moshe", 
    rating: "4.8", 
    reviews: 145,
    price: 165000, 
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Psicólogo Organizacional y Estratega Mental. Diseñado para ejecutivos, líderes y emprendedores que enfrentan burnout, síndrome del impostor o parálisis por análisis. Toma el control de tu mente y tus resultados."
  },
]

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
]

export default function BookingPage() {
  const { t, language } = useTranslation()
  const [step, setStep] = useState(1)
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [sessionType, setSessionType] = useState<SessionType>("full_session")
  const [iframeLoading, setIframeLoading] = useState(true)

  // Reset target iframe loading when we switch steps or choices
  useEffect(() => {
    setIframeLoading(true)
  }, [selectedTherapist, sessionType, step])

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const calendlyUrl = useMemo(() => {
    if (!selectedTherapist) return ""
    const baseUrl = process.env.NEXT_PUBLIC_CALENDLY_BASE_URL || "https://calendly.com/soulmar-org"
    const therapistKey = selectedTherapist.specKey
    const sessionKey = sessionType === "evaluation_15min" ? "valoracion" : "sesion"
    const slug = `${sessionKey}-${therapistKey}`
    return `${baseUrl}/${slug}?hide_landing_page_details=1&hide_gdpr_banner=1`
  }, [selectedTherapist, sessionType])

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6 bg-surface/30">
      <div className="max-w-md w-full space-y-8">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
                <div className="relative w-58 h-20">
                    <Image 
                        src="/logo-soulmar-official.png" 
                        alt="Soulmar" 
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('booking.title')}</h1>
            <p className="text-foreground/60">{t('booking.tagline')}</p>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="flex items-center justify-between mb-8 max-w-[280px] mx-auto py-2 px-1">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center shrink-0">
                    <div 
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                            step >= s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-surface text-foreground/40"
                        )}
                    >
                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                        <div className={cn("h-0.5 w-12 transition-all duration-300", step > s ? "bg-primary" : "bg-surface")} />
                    )}
                </div>
            ))}
        </div>

        <Card className="border-none shadow-2xl bg-background overflow-hidden relative">
            <CardContent className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* STEP 1: THERAPISTS */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.choose_specialist')}</h2>
                                    <p className="text-sm text-foreground/60">{t('booking.specialist_desc')}</p>
                                </div>

                                <div className="space-y-3">
                                    {THERAPISTS.map((t_item) => (
                                        <button
                                            key={t_item.id}
                                            onClick={() => setSelectedTherapist(t_item)}
                                            className={cn(
                                                "w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 group",
                                                selectedTherapist?.id === t_item.id 
                                                    ? "border-primary bg-primary/5 shadow-inner" 
                                                    : "border-surface hover:border-primary/30"
                                            )}
                                        >
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                <Image src={t_item.img} alt={t_item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4 className="font-bold text-sm leading-none mb-1">{t_item.name}</h4>
                                                <p className="text-[10px] uppercase text-foreground/70 font-bold">{t(`booking.therapists.${t_item.specKey}`)}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-xs font-bold">{t_item.rating}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <Button 
                                    className="w-full h-14 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 mt-4" 
                                    onClick={nextStep}
                                    disabled={!selectedTherapist}
                                >
                                    {language === 'es' ? 'Continuar' : 'Continue'} <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* STEP 2: SESSION TYPE */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">Tipo de Sesión</h2>
                                    <p className="text-sm text-foreground/60">¿Cómo deseas comenzar tu camino con {selectedTherapist?.name}?</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setSessionType("evaluation_15min")}
                                        className={cn(
                                            "w-full flex flex-col p-6 rounded-2xl border-2 transition-all text-left",
                                            sessionType === "evaluation_15min" 
                                                ? "border-emerald-500 bg-emerald-500/5 shadow-inner" 
                                                : "border-surface hover:border-emerald-500/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center w-full mb-2">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                                <h3 className="font-bold">Valoración 15 Minutos</h3>
                                            </div>
                                            <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-md">GRATIS</span>
                                        </div>
                                        <p className="text-sm text-foreground/70">Una llamada breve para conocer a tu terapeuta, alinear objetivos y entender cómo puede ayudarte. (Limitado a 1 por paciente).</p>
                                    </button>

                                    <button
                                        onClick={() => setSessionType("full_session")}
                                        className={cn(
                                            "w-full flex flex-col p-6 rounded-2xl border-2 transition-all text-left",
                                            sessionType === "full_session" 
                                                ? "border-primary bg-primary/5 shadow-inner" 
                                                : "border-surface hover:border-primary/30"
                                        )}
                                    >
                                        <div className="flex justify-between items-center w-full mb-2">
                                            <div className="flex items-center gap-2">
                                                <HeartHandshake className="w-5 h-5 text-primary" />
                                                <h3 className="font-bold">Sesión Completa</h3>
                                            </div>
                                            <span className="text-sm font-bold text-primary">{formatPrice(selectedTherapist?.price || 0)}</span>
                                        </div>
                                        <p className="text-sm text-foreground/70">Sesión clínica profunda de 60 minutos. Trabajo terapéutico directo, herramientas y plan de acción.</p>
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CALENDLY WIDGET */}
                        {step === 3 && selectedTherapist && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">Agenda tu Cita</h2>
                                    <p className="text-sm text-foreground/60">
                                        Selecciona la fecha y hora para tu <strong>{sessionType === 'evaluation_15min' ? 'Valoración Gratuita' : 'Sesión Completa'}</strong> con <strong>{selectedTherapist.name}</strong>.
                                    </p>
                                </div>

                                <div className="relative rounded-2xl overflow-hidden bg-surface/50 border border-white/10 shadow-inner min-h-[660px] flex items-center justify-center">
                                    {iframeLoading && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md z-10 space-y-4 transition-all duration-300">
                                            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                            <p className="text-xs font-bold text-primary/60 tracking-wider uppercase animate-pulse">Cargando agenda oficial...</p>
                                        </div>
                                    )}
                                    {calendlyUrl && (
                                        <iframe
                                            src={calendlyUrl}
                                            width="100%"
                                            height="660px"
                                            frameBorder="0"
                                            onLoad={() => setIframeLoading(false)}
                                            className="w-full h-[660px] rounded-2xl relative z-0 transition-opacity duration-500"
                                            style={{ opacity: iframeLoading ? 0 : 1 }}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button variant="ghost" className="w-full h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>
                                        {t('booking.back')}
                                    </Button>
                                    <p className="text-center text-[10px] text-foreground/40 leading-relaxed uppercase tracking-[0.05em]">
                                        ¿No puedes ver la agenda?{" "}
                                        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold normal-case">
                                            Abre Calendly en una nueva ventana
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>

        <p className="text-center text-[10px] text-foreground/40 uppercase tracking-[0.05em] leading-relaxed">
            {t('booking.footer_disclaimer')}
        </p>
      </div>
    </div>
  )
}
