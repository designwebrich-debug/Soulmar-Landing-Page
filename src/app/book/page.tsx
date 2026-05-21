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
    reviews: 248,
    price: 210000, 
    img: "/images/therapists/mariana_v2.png",
    bio: "Psicóloga clínica con +10 años de experiencia. Especialista en terapia cognitivo-conductual y bienestar integral."
  },
  { 
    id: "uuid-2", 
    name: "Dra. Libertad Mejía", 
    specKey: "libertad", 
    rating: "4.9", 
    reviews: 184,
    price: 180000, 
    img: "/images/therapists/libertad_v3.png",
    bio: "Especialista en psicología clínica con enfoque en regulación emocional y procesos de duelo."
  },
  { 
    id: "uuid-3", 
    name: "Dr. Moshé Musini", 
    specKey: "moshe", 
    rating: "4.8", 
    reviews: 120,
    price: 165000, 
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    bio: "Psicólogo organizacional experto en liderazgo consciente, propósito de vida y dinámicas de alto rendimiento."
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
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Personal Data State
  const [personalData, setPersonalData] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#fbbf24', '#10b981', '#ffffff']
      })
    }
  }, [isSuccess])

  const nextStep = () => setStep(s => Math.min(s + 1, 8))
  const prevStep = () => {
      setErrorMessage(null)
      setStep(s => Math.max(s - 1, 1))
  }

  // CALENDAR LOGIC
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    
    const calendarDays = []
    for (let i = 0; i < firstDay; i++) calendarDays.push(null)
    for (let i = 1; i <= days; i++) calendarDays.push(new Date(year, month, i))
    return calendarDays
  }, [currentMonth])

  const monthName = currentMonth.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })
  const daysOfWeek = language === 'es' ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handleBooking = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              therapistId: selectedTherapist?.id,
              sessionType,
              date: new Date(`${selectedDate?.toISOString().split('T')[0]}T${selectedTime}`).toISOString(), // Simplified date merging
              user: personalData
          })
      })

      const data = await response.json()

      if (!response.ok) {
          throw new Error(data.error || 'Ocurrió un error al procesar tu solicitud.')
      }

      if (sessionType === 'full_session' && data.init_point) {
          // Redirect to Mercado Pago
          window.location.href = data.init_point
      } else {
          // Free evaluation success
          setStep(8)
          setIsSuccess(true)
      }

    } catch (error: any) {
        setErrorMessage(error.message)
    } finally {
        setIsLoading(false)
    }
  }

  const finalPrice = sessionType === 'evaluation_15min' ? 0 : (selectedTherapist?.price || 0)

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
                    />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('booking.title')}</h1>
            <p className="text-foreground/60">{t('booking.tagline')}</p>
        </div>

        {/* PROGRESS INDICATOR */}
        {!isSuccess && (
          <div className="flex items-center justify-between mb-8 max-w-[400px] mx-auto py-2 px-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div key={s} className="flex items-center shrink-0">
                      <div 
                          className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                              step >= s ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-surface text-foreground/40"
                          )}
                      >
                          {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                      </div>
                      {s < 7 && (
                          <div className={cn("h-0.5 w-4 transition-all duration-300", step > s ? "bg-primary" : "bg-surface")} />
                      )}
                  </div>
              ))}
          </div>
        )}

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
                                    className="w-full h-12 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 mt-4 h-14" 
                                    onClick={nextStep}
                                    disabled={!selectedTherapist}
                                >
                                    {language === 'es' ? 'Continuar' : 'Continue'} <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* STEP 2: SESSION TYPE (NEW) */}
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

                                <div className="flex gap-3">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: CALENDAR */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.find_moment')}</h2>
                                    <p className="text-sm text-foreground/60">{t('booking.agenda_with', { name: selectedTherapist?.name })}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="font-bold text-sm uppercase">{monthName}</h4>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-transparent" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-transparent" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="text-center text-[10px] font-bold uppercase text-foreground/20 py-1">
                                                {day}
                                            </div>
                                        ))}
                                        {daysInMonth.map((day, idx) => {
                                            if (!day) return <div key={idx} />;
                                            const isSelected = selectedDate?.toDateString() === day.toDateString();
                                            const isPast = day < new Date(new Date().setHours(0,0,0,0));
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => !isPast && setSelectedDate(day)}
                                                    disabled={isPast}
                                                    className={cn(
                                                        "h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                                        isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" :
                                                        isPast ? "opacity-10 cursor-not-allowed" : "hover:bg-primary/10 hover:text-primary"
                                                    )}
                                                >
                                                    {day.getDate()}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep} disabled={!selectedDate}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: TIME SLOTS */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.select_time')}</h2>
                                    <p className="text-sm text-foreground/60">
                                        {(() => {
                                            const formatted = selectedDate?.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                                            if (language === 'es' && formatted) {
                                                const parts = formatted.split(' ');
                                                const day = parts[0];
                                                const month = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                                                const year = parts[4];
                                                return `${day} ${month} ${year}`;
                                            }
                                            return formatted;
                                        })()}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {['morning', 'afternoon'].map((period) => (
                                        <div key={period} className="space-y-2">
                                            <h4 className="text-[10px] font-bold uppercase tracking-[0.05em] text-primary px-2">{t(`booking.${period}`)}</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(period === 'morning' ? TIME_SLOTS.slice(0, 4) : TIME_SLOTS.slice(4)).map((time) => (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={cn(
                                                            "h-10 rounded-xl text-xs font-bold transition-all border-2",
                                                            selectedTime === time 
                                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                                                : "border-surface hover:border-primary/30"
                                                        )}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep} disabled={!selectedTime}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: PRICE SUMMARY */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.price_summary_title')}</h2>
                                    <p className="text-sm text-foreground/60">{t('booking.price_summary_desc')}</p>
                                </div>

                                <div className="bg-surface/50 border-none shadow-inner p-6 space-y-4 rounded-2xl">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground/60">{t('booking.modality')}</span>
                                        <span className="font-bold">{t('booking.private_video')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="text-right">
                                            <span className="block font-bold leading-none">{formatPrice(finalPrice)}</span>
                                            {finalPrice > 0 && <span className="block text-[10px] text-foreground/70 uppercase mt-1">({formatCOPtoUSD(finalPrice)})</span>}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase text-primary tracking-[0.05em]">{t('booking.total')}</span>
                                            <h3 className="text-3xl font-bold tracking-[-0.022em] leading-none">{formatPrice(finalPrice)}</h3>
                                        </div>
                                        {finalPrice > 0 && <p className="text-sm font-bold text-foreground/70 uppercase tracking-[-0.022em]">({formatCOPtoUSD(finalPrice)})</p>}
                                    </div>
                                </div>

                                {finalPrice > 0 ? (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{t('booking.certified_payment')}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <Sparkles className="w-5 h-5 text-blue-500" />
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Llamada de Valoración Gratuita 100% Sin Costo.</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 6: PERSONAL DATA */}
                        {step === 6 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.finish_booking')}</h2>
                                    <p className="text-sm text-foreground/60">{t('booking.finish_desc')}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs ml-1">{t('booking.full_name')}</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 w-5 h-5 text-foreground/30" />
                                            <input 
                                                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-surface border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                                                placeholder={t('booking.name_placeholder') as string}
                                                value={personalData.name}
                                                onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs ml-1">Correo Electrónico</Label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-foreground/30" />
                                            <input 
                                                type="email"
                                                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-surface border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium transition-all"
                                                placeholder="tu@email.com"
                                                value={personalData.email}
                                                onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-full hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                                    <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep} disabled={!personalData.name || !personalData.email}>
                                        {language === 'es' ? 'Siguiente' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 7: FINAL REVIEW */}
                        {step === 7 && (
                            <div className="space-y-6">
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-bold">{t('booking.final_review_title')}</h2>
                                    <p className="text-sm text-foreground/60">{t('booking.final_review_desc')}</p>
                                </div>

                                {errorMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
                                    >
                                        <p className="text-sm text-red-600 dark:text-red-400 font-bold">{errorMessage}</p>
                                    </motion.div>
                                )}

                                <div className="p-6 bg-surface/30 border-none space-y-6 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                                            <Image src={selectedTherapist?.img || ''} alt={selectedTherapist?.name || ''} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{selectedTherapist?.name}</h4>
                                            <p className="text-[10px] text-primary uppercase font-bold">{selectedTherapist ? t(`booking.therapists.${selectedTherapist.specKey}`) : ''}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { 
                                                icon: <CalendarIcon className="w-4 h-4" />, 
                                                text: (() => {
                                                    const formatted = selectedDate?.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                                                    if (language === 'es' && formatted) {
                                                        const parts = formatted.split(' ');
                                                        const day = parts[0];
                                                        const month = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                                                        const year = parts[4];
                                                        return `${day} ${month} ${year}`;
                                                    }
                                                    return formatted;
                                                })()
                                            },
                                            { icon: <Clock className="w-4 h-4" />, text: selectedTime },
                                            { icon: <Video className="w-4 h-4" />, text: t('booking.private_video') },
                                            { icon: <User className="w-4 h-4" />, text: personalData.email }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs text-foreground/60 font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">{item.icon}</div>
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-border flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/40">{t('booking.total')}</span>
                                        <div className="text-right">
                                            <span className="block text-xl font-bold tracking-[-0.022em] leading-none">{formatPrice(finalPrice)}</span>
                                            {finalPrice > 0 && <span className="block text-[10px] text-foreground/70 uppercase mt-1">({formatCOPtoUSD(finalPrice)})</span>}
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full h-12 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 mt-4 h-14" 
                                    onClick={handleBooking}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (finalPrice > 0 ? "Proceder al Pago Seguro" : "Confirmar Valoración Gratuita")}
                                </Button>
                                <Button variant="ghost" className="w-full h-10 rounded-full text-sm hover:bg-secondary-yellow transition-all dark:hover:text-black" onClick={prevStep}>{t('booking.back')}</Button>
                            </div>
                        )}

                        {/* STEP 8: SUCCESS (For Free Evaluation) */}
                        {step === 8 && (
                            <div className="text-center space-y-8 py-4">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-in zoom-in duration-500">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">¡Valoración Confirmada!</h2>
                                    <p className="text-sm text-foreground/60">
                                        Hemos enviado el enlace de Google Meet a tu correo electrónico.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <Button asChild variant="ghost" className="w-full h-12 rounded-full">
                                        <Link href="/">{t('booking.success.go_home')}</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>

        {!isSuccess && (
          <p className="text-center text-[10px] text-foreground/40 uppercase tracking-[0.05em] leading-relaxed">
              {t('booking.footer_disclaimer')}
          </p>
        )}
      </div>
    </div>
  )
}
