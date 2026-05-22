"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  Video,
  Loader2,
  AlertCircle,
  X,
  User,
  MessageSquare,
  Mail
} from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { cn } from "@/lib/utils"

const AM_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"
]

const PM_SLOTS = [
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
]

import confetti from "canvas-confetti"

export function AgendamientoSection() {
  const { t, language } = useTranslation()
  const [step, setStep] = useState<number>(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isIntroChat, setIsIntroChat] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const successContainerRef = useRef<HTMLDivElement>(null)

  // Trigger confetti on success
  useEffect(() => {
    if (isSuccess) {
      // Delay slightly (350ms) to allow the Step 2 exit animation (250ms) to complete and success screen to mount
      const timer = setTimeout(() => {
        try {
          // Dual side-by-side confetti blast for a cinematic, premium feeling
          // Left cannon shooting up-right
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 70,
            origin: { x: 0.1, y: 0.65 },
            colors: ["#ffc971", "#c9cba3", "#8da9c4"],
            zIndex: 999999
          })
          // Right cannon shooting up-left
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 70,
            origin: { x: 0.9, y: 0.65 },
            colors: ["#ffc971", "#c9cba3", "#8da9c4"],
            zIndex: 999999
          })
        } catch (err) {
          console.error("Failed to trigger confetti", err)
        }

        if (successContainerRef.current) {
          successContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 350)

      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  // CALENDAR LOGIC
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    
    const calendarDays = []
    // Normalizar primer día (domingo = 0 en JS, pero queremos lunes como primer día de la semana si es posible, o seguir la referencia donde MO es el primer día)
    // En la referencia MO es Lunes, por lo que el primer día de la semana es Lunes.
    // Lunes = 1, Martes = 2, ..., Sábado = 6, Domingo = 0.
    // Ajustar offset para que Lunes sea 0: (firstDay + 6) % 7
    const adjustedFirstDay = (firstDay + 6) % 7
    
    for (let i = 0; i < adjustedFirstDay; i++) calendarDays.push(null)
    for (let i = 1; i <= days; i++) calendarDays.push(new Date(year, month, i))
    return calendarDays
  }, [currentMonth])

  const monthName = currentMonth.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "long", year: "numeric" })
  const daysOfWeek = language === "es" ? ["LU", "MA", "MI", "JU", "VI", "SA", "DO"] : ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime("") // Reset hora al cambiar de día
    setValidationError(null)
  }

  const handleCancel = () => {
    setSelectedDate(null)
    setSelectedTime("")
    setReason("")
    setFullName("")
    setPhone("")
    setEmail("")
    setIsIntroChat(false)
    setStep(1)
    setValidationError(null)
  }

  const handleStep1Next = () => {
    if (!selectedDate || !selectedTime) {
      setValidationError(language === "es" ? "Por favor selecciona fecha y hora de sesión." : "Please select a date and time for your session.")
      return
    }
    if (reason.trim().length < 5) {
      setValidationError(language === "es" ? "Por favor escribe un motivo de consulta más descriptivo (mínimo 5 letras)." : "Please enter a descriptive reason for consultation (minimum 5 characters).")
      return
    }
    setValidationError(null)
    setStep(2)
  }

  const handleStep2Submit = async () => {
    if (fullName.trim().length < 2) {
      setValidationError(language === "es" ? "Por favor escribe tu nombre completo." : "Please enter your full name.")
      return
    }
    if (phone.trim().length < 7) {
      setValidationError(language === "es" ? "Por favor escribe un número de WhatsApp válido." : "Please enter a valid WhatsApp number.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setValidationError(language === "es" ? "Por favor escribe un correo electrónico válido." : "Please enter a valid email address.")
      return
    }
    setValidationError(null)
    setIsLoading(true)
    
    // Simular petición
    await new Promise(resolve => setTimeout(resolve, 1800))
    
    setIsLoading(false)
    setIsSuccess(true)
  }


  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return ""
    return selectedDate.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }) // YYYY-MM-DD
  }, [selectedDate])

  const formattedSelectedDateLong = useMemo(() => {
    if (!selectedDate) return language === "es" ? "Selecciona fecha y hora" : "Select date and time"
    const dateStr = selectedDate.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
    return `${dateStr}${selectedTime ? ` - ${selectedTime}` : ""}`
  }, [selectedDate, selectedTime, language])

  const dateFormattedOnly = useMemo(() => {
    if (!selectedDate) return ""
    const day = selectedDate.getDate()
    const year = selectedDate.getFullYear()
    const monthName = selectedDate.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "long" })
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1)
    return `${day} ${capitalizedMonth} ${year}`
  }, [selectedDate, language])

  return (
    <section 
      id="agendamiento" 
      className="pt-16 md:pt-20 pb-24 md:pb-32 bg-white dark:bg-[#0b0b0c] transition-colors duration-500 border-t border-border/30 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-12 md:mb-16 space-y-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
            {language === "es" ? "Agenda tu Sesión" : "Schedule your Session"}
          </h2>
          <p className="text-xl text-[#1d1d1f]/50 dark:text-white/40 font-medium">
            {language === "es" 
              ? "Elige la fecha y hora de tu sesión de forma rápida y sencilla." 
              : "Choose the date and time of your session quickly and easily."}
          </p>
        </div>
        
        {/* WIDGET CONTAINER - EXACT REFERENCE STYLE */}
        <div className="bg-white dark:bg-[#111112] rounded-[24px] border border-border/70 dark:border-border/10 shadow-2xl overflow-hidden transition-all duration-500">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col"
                  >
                    {/* TWO-COLUMN GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/60 dark:border-border/10">
                      
                      {/* LEFT COLUMN: CALENDAR TOP */}
                      <div className="order-1 md:order-1 pt-8 px-6 pb-4 md:pt-9 md:pb-6 md:border-r border-border/60 dark:border-border/10 flex flex-col justify-between">
                        <div>
                          {/* MONTH SELECTOR */}
                          <div className="group flex items-center justify-between mb-6 bg-[#8da9c4] hover:bg-[#c9cba3] dark:bg-[#ffc971] dark:hover:bg-[#c9cba3] px-2.5 py-1.5 rounded-xl border border-transparent transition-all duration-300">
                            <button 
                              type="button"
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className="w-7 h-7 rounded-full bg-white/12 hover:bg-white/24 dark:bg-black/10 dark:hover:bg-black/20 flex items-center justify-center text-white dark:text-[#0b0b0c] hover:scale-105 active:scale-95 transition-all duration-300"
                              aria-label="Previous month"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold uppercase tracking-wider text-white dark:text-[#0b0b0c] transition-colors duration-300">
                              {monthName}
                            </span>
                            <button 
                              type="button"
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                              className="w-7 h-7 rounded-full bg-white/12 hover:bg-white/24 dark:bg-black/10 dark:hover:bg-black/20 flex items-center justify-center text-white dark:text-[#0b0b0c] hover:scale-105 active:scale-95 transition-all duration-300"
                              aria-label="Next month"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* WEEKDAYS */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-3">
                            {daysOfWeek.map((day) => (
                              <span key={day} className="text-[10px] font-extrabold uppercase text-foreground/40 tracking-wider">
                                {day}
                              </span>
                            ))}
                          </div>

                          {/* DAYS GRID */}
                          <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map((day, idx) => {
                              if (!day) return <div key={`empty-${idx}`} className="h-8 w-8" />;
                              const isSelected = selectedDate?.toDateString() === day.toDateString();
                              const isPast = day < new Date(new Date().setHours(0,0,0,0));
                              const isToday = day.toDateString() === new Date().toDateString();
                              return (
                                <button
                                  key={`day-${idx}`}
                                  type="button"
                                  onClick={() => !isPast && handleDateClick(day)}
                                  disabled={isPast}
                                  aria-label={`Día ${day.getDate()} de ${monthName}`}
                                  aria-selected={isSelected}
                                  className={cn(
                                    "h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative",
                                    isSelected 
                                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                                      : isToday 
                                        ? "border border-primary text-primary font-extrabold"
                                        : isPast 
                                          ? "opacity-15 cursor-not-allowed text-foreground/20" 
                                          : "hover:bg-primary/10 hover:text-primary text-foreground"
                                  )}
                                >
                                  {day.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: FIELDS TOP */}
                      <div className="order-3 md:order-2 pt-8 px-6 pb-4 md:pt-9 md:pb-6 border-t border-border/60 dark:border-border/10 md:border-t-0 flex flex-col justify-between">
                        <div>
                          {/* FIELD 1: AVAILABLE HOURS */}
                          <div>
                            <div className="md:h-[42px] flex items-center mb-6">
                              <Label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 leading-none">
                                {language === "es" ? "Horas disponibles*" : "Available times*"}
                              </Label>
                            </div>
                            <div className="space-y-4">
                              {/* SECCIÓN MAÑANA */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-foreground/35 flex items-center gap-1.5 leading-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 dark:bg-amber-400/60" />
                                  {language === "es" ? "Mañana (AM)" : "Morning (AM)"}
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {AM_SLOTS.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        disabled={!selectedDate}
                                        onClick={() => {
                                          setSelectedTime(time)
                                          setValidationError(null)
                                        }}
                                        className={cn(
                                          "h-10 text-xs font-bold rounded-lg border transition-all flex items-center justify-center outline-none select-none",
                                          !selectedDate
                                            ? "opacity-30 cursor-not-allowed border-border/40 bg-surface/10 text-foreground/45"
                                            : isSelected
                                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102"
                                              : "border-border/80 dark:border-border/10 bg-background text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                        )}
                                      >
                                          {time}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* SECCIÓN TARDE */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-foreground/35 flex items-center gap-1.5 leading-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
                                  {language === "es" ? "Tarde (PM)" : "Afternoon (PM)"}
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {PM_SLOTS.map((time) => {
                                    const isSelected = selectedTime === time;
                                    return (
                                      <button
                                        key={time}
                                        type="button"
                                        disabled={!selectedDate}
                                        onClick={() => {
                                          setSelectedTime(time)
                                          setValidationError(null)
                                        }}
                                        className={cn(
                                          "h-10 text-xs font-bold rounded-lg border transition-all flex items-center justify-center outline-none select-none",
                                          !selectedDate
                                            ? "opacity-30 cursor-not-allowed border-border/40 bg-surface/10 text-foreground/45"
                                            : isSelected
                                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102"
                                              : "border-border/80 dark:border-border/10 bg-background text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                        )}
                                      >
                                          {time}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* LEFT COLUMN: SELECTED SESSION FOOTER */}
                      <div className="order-2 md:order-3 px-6 pt-0 pb-6 md:pb-8 md:border-r border-border/60 dark:border-border/10 flex flex-col justify-start">
                        <div className="border-t border-border/20 pt-4 md:h-[76px] flex flex-col justify-start">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-foreground/45 leading-none">
                            {language === "es" ? "Sesión Seleccionada" : "Selected Date"}
                          </p>
                          <p className="text-[11px] font-bold text-foreground/75 mt-1.5 leading-none">
                            {selectedDate 
                              ? formattedSelectedDateLong 
                              : (language === "es" ? "Haz clic en un día del calendario" : "Click on a calendar day")}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: CONSULTATION REASON FOOTER */}
                      <div className="order-4 md:order-4 px-6 pt-0 pb-6 md:pb-8 flex flex-col justify-start">
                        <div className="border-t border-transparent pt-4 md:h-[76px] flex flex-col justify-start space-y-2">
                          <Label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 leading-none">
                            {language === "es" ? "Motivo de consulta*" : "Reason for consultation*"}
                          </Label>
                          <Input 
                            type="text"
                            value={reason}
                            onChange={(e) => {
                              setReason(e.target.value)
                              if (validationError) setValidationError(null)
                            }}
                            placeholder={language === "es" ? "Ej. Manejo del estrés y regulación emocional" : "e.g. Stress management and anxiety regulation"}
                            className="h-10 text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full"
                          />
                        </div>
                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface/10 dark:bg-surface/3">
                      
                      {/* Left Summary */}
                      <div className="text-center sm:text-left">
                        <span className="block text-[8px] font-extrabold uppercase tracking-widest text-foreground/45">
                          {language === "es" ? "RESUMEN DE RESERVA" : "SUMMARY OF BOOKING"}
                        </span>
                        <span className="block text-xs font-bold text-primary mt-1">
                          {selectedDate && selectedTime 
                            ? `${formattedSelectedDateLong} (${language === "es" ? "Sesión Virtual vía Google Meet" : "Virtual Session via Google Meet"})`
                            : (language === "es" ? "Completa la selección en el panel" : "Complete selection above")}
                        </span>
                      </div>

                      {/* Validation and Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {validationError && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full bg-red-500/5 animate-pulse max-w-xs text-center">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{validationError}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button 
                            variant="ghost" 
                            onClick={handleCancel}
                            className="h-10 px-5 rounded-full font-bold text-xs uppercase tracking-wider border border-border/80 hover:bg-surface-hover text-foreground/70 transition-all w-full sm:w-auto"
                          >
                            {language === "es" ? "Cancelar" : "Cancel"}
                          </Button>
                          <Button 
                            onClick={handleStep1Next}
                            className="h-10 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-primary text-white hover:bg-secondary-yellow hover:text-black dark:hover:bg-secondary-yellow shadow-lg shadow-primary/10 transition-all w-full sm:w-auto flex items-center justify-center transform active:scale-98"
                          >
                            <span>{t("booking.confirm_btn")}</span>
                          </Button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col"
                  >
                    {/* TWO-COLUMN GRID LAYOUT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/60 dark:border-border/10">
                      
                      {/* LEFT COLUMN: REGISTRATION FORM */}
                      <div className="pt-8 px-6 pb-6 md:pt-9 md:pb-6 md:border-r border-border/60 dark:border-border/10 flex flex-col justify-between">
                        <div>
                          {/* Section Header */}
                          <div className="space-y-1 mb-5">
                            <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                              {language === "es" ? "DATOS PERSONALES" : "PERSONAL INFO"}
                            </span>
                            <h3 className="text-xl font-bold tracking-tight text-foreground">
                              {t("booking.finish_booking")}
                            </h3>
                            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
                              {t("booking.finish_desc")}
                            </p>
                          </div>

                          {/* Fields */}
                          <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 leading-none">
                                {t("booking.full_name")}*
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                                <Input 
                                  type="text"
                                  value={fullName}
                                  onChange={(e) => {
                                    setFullName(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder={t("booking.name_placeholder")}
                                  className="h-10 text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
                                />
                              </div>
                            </div>

                            {/* WhatsApp for Link */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 leading-none">
                                {t("booking.whatsapp_link")}*
                              </Label>
                              <div className="relative">
                                <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                                <Input 
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => {
                                    setPhone(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder="+57 302 459 4428"
                                  className="h-10 text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/50 leading-none">
                                {t("booking.email")}*
                              </Label>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
                                <Input 
                                  type="email"
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder={t("booking.email_placeholder")}
                                  className="h-10 text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
                                />
                              </div>
                            </div>

                            {/* Marketing 15-Min Courtesy Toggle Card */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsIntroChat(!isIntroChat)
                                setValidationError(null)
                              }}
                              className={cn(
                                "w-full p-4 rounded-xl text-left border transition-all duration-300 flex items-start gap-3 transform active:scale-[0.99] select-none mt-2",
                                isIntroChat 
                                  ? "bg-primary/5 border-primary/45 text-foreground shadow-sm"
                                  : "bg-surface/10 hover:bg-surface/20 border-border/60 dark:border-border/10 text-foreground/80"
                              )}
                            >
                              <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-extrabold flex-shrink-0 mt-0.5 transition-all duration-300",
                                isIntroChat
                                  ? "bg-primary border-primary text-white"
                                  : "border-foreground/30 text-transparent"
                              )}>
                                ✓
                              </span>
                              <div className="space-y-1">
                                <p className="text-xs font-bold leading-none flex items-center gap-1.5">
                                  {t("booking.intro_chat_title")}
                                  {isIntroChat && (
                                    <span className="text-[7px] font-extrabold tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20 leading-none">
                                      {t("booking.intro_chat_badge")}
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
                                  {t("booking.intro_chat_desc")}
                                  <strong className="font-extrabold text-foreground">
                                    {language === "es" ? "totalmente gratis" : "totally free"}
                                  </strong>
                                </p>
                              </div>
                            </button>

                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: REVISIÓN DE AGENDAMIENTO */}
                      <div className="pt-8 px-6 pb-6 md:pt-9 md:pb-6 flex flex-col justify-between bg-surface/3 dark:bg-surface/1 border-t border-border/60 dark:border-border/10 md:border-t-0">
                        <div>
                          {/* Section Header */}
                          <div className="space-y-1 mb-5">
                            <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                              {language === "es" ? "REVISIÓN FINAL" : "FINAL REVIEW"}
                            </span>
                            <h3 className="text-xl font-bold tracking-tight text-foreground">
                              {t("booking.final_review_title")}
                            </h3>
                            <p className="text-[10px] text-foreground/50 leading-relaxed font-semibold">
                              {t("booking.final_review_desc")}
                            </p>
                          </div>

                          {/* Final Review Details Card */}
                          <div className="space-y-4">
                            <div className="p-5 rounded-[20px] border border-border/60 dark:border-border/10 bg-background/50 space-y-5 shadow-sm">
                              
                              {/* Specialist Row */}
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface/50 border border-border/10 flex-shrink-0">
                                  <Image 
                                    src="/images/therapists/mariana.png" 
                                    alt="Dra. Mariana Caicedo" 
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-extrabold text-foreground leading-none mb-1">
                                    Dra. Mariana Caicedo
                                  </p>
                                  <p className="text-[9px] font-extrabold uppercase text-[#8da9c4] dark:text-[#ffc971] tracking-wider leading-none">
                                    {language === "es" ? "PSICOLOGÍA CLÍNICA (ESPECIALISTA)" : "CLINICAL PSYCHOLOGY (SPECIALIST)"}
                                  </p>
                                </div>
                              </div>

                              {/* Details List */}
                              <div className="space-y-3.5 pt-1.5 text-xs font-semibold">
                                {/* Date */}
                                <div className="flex items-center gap-3 text-foreground/80">
                                  <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span>{dateFormattedOnly}</span>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-3 text-foreground/80">
                                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span>{selectedTime}</span>
                                </div>

                                {/* Modality */}
                                <div className="flex items-center gap-3 text-foreground/80">
                                  <Video className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span>
                                    {isIntroChat 
                                      ? (language === "es" ? "Cortesía 15 Min" : "Courtesy 15 Min") 
                                      : (language === "es" ? "Sesión online por meet" : "Online session via Meet")}
                                  </span>
                                </div>
                              </div>

                              {/* Divider & Total */}
                              <div className="border-t border-border/20 pt-4 flex justify-between items-end">
                                <div>
                                  <span className="block text-[9px] font-extrabold uppercase tracking-widest text-foreground/45 leading-none">
                                    TOTAL
                                  </span>
                                  <span className="block text-2xl font-black text-foreground mt-1.5 leading-none">
                                    {isIntroChat 
                                      ? "$ 0 COP" 
                                      : (language === "es" ? "$ 210.000 COP" : "$ 210,000 COP")}
                                  </span>
                                </div>
                                {!isIntroChat ? (
                                  <span className="text-[10px] font-extrabold text-foreground/40 pb-0.5 uppercase tracking-wider">
                                    {language === "es" ? "($52.50 USD)" : "($52.50 USD)"}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 pb-0.5 uppercase tracking-wider">
                                    {language === "es" ? "(¡Cortesía!)" : "(Complimentary!)"}
                                  </span>
                                )}
                              </div>

                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface/10 dark:bg-surface/3">
                      
                      {/* Left Summary Disclaimer */}
                      <div className="text-center sm:text-left max-w-sm">
                        <span className="block text-[8px] font-extrabold uppercase tracking-widest text-foreground/45 leading-relaxed">
                          {t("booking.footer_disclaimer")}
                        </span>
                      </div>

                      {/* Validation and Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {validationError && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full bg-red-500/5 animate-pulse max-w-xs text-center">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{validationError}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button 
                            variant="ghost" 
                            onClick={() => {
                              setStep(1)
                              setValidationError(null)
                            }}
                            className="h-10 px-5 rounded-full font-bold text-xs uppercase tracking-wider border border-border/80 hover:bg-surface-hover text-foreground/70 transition-all w-full sm:w-auto flex items-center justify-center"
                          >
                            <span>{t("booking.step2_back")}</span>
                          </Button>
                          <Button 
                            variant="ghost"
                            onClick={handleStep2Submit}
                            disabled={isLoading}
                            className="h-10 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-soulmar-blue text-white hover:bg-secondary-yellow hover:text-[#0b0b0c] shadow-lg shadow-soulmar-blue/20 hover:shadow-secondary-yellow/30 transition-all w-full sm:w-auto flex items-center justify-center transform active:scale-98"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>{language === "es" ? "AGENDANDO..." : "BOOKING..."}</span>
                              </>
                            ) : (
                              <>
                                <span>{t("booking.step3_confirm")}</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              
              // SUCCESS STATE - WITHIN CARD
              <motion.div 
                key="booking-success"
                ref={successContainerRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/15">
                    {t("booking.success.badge")}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {t("booking.success.title")}
                  </h3>
                  <p className="text-xs text-foreground/50 leading-relaxed max-w-sm mx-auto">
                    {language === "es" 
                      ? "Te hemos enviado los detalles de tu cita a tu WhatsApp y correo electrónico de forma segura."
                      : "We have sent all the details of your appointment to your WhatsApp and email."}
                  </p>
                </div>

                <div className="w-full bg-surface/40 dark:bg-surface/5 rounded-xl border border-border/20 p-5 space-y-3.5 text-left">
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="flex items-center gap-2.5 text-xs text-foreground/75 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm">
                        <CalendarIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.date")}</p>
                        <span>
                          {selectedDate?.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-foreground/75 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.time")}</p>
                        <span>{selectedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-foreground/75 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.link")}</p>
                        <span>Sesión Online (Google Meet)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-center w-full">
                  <Button 
                    onClick={() => {
                      setIsSuccess(false)
                      setSelectedDate(null)
                      setSelectedTime("")
                      setReason("")
                    }}
                    className="h-12 px-8 rounded-full font-bold text-xs uppercase tracking-wider bg-primary text-white hover:bg-secondary-yellow hover:text-[#0b0b0c] dark:hover:bg-secondary-yellow shadow-lg shadow-primary/20 transition-all w-full max-w-xs flex items-center justify-center transform active:scale-98"
                  >
                    {language === "es" ? "¿Agendamos otra cita juntos?" : "Shall we schedule another session?"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom trust disclaimer */}
        {!isSuccess && (
          <div className="flex items-center justify-center gap-2.5 mt-6 text-foreground/30 dark:text-foreground/20 text-[10px] uppercase font-extrabold tracking-wider leading-none">
            <ShieldCheck className="w-4 h-4 text-emerald-500/60 dark:text-emerald-500/40" />
            <span>{t("booking.certified_payment")} • {language === "es" ? "Cifrado SSL de 256-bits" : "256-bit SSL Encryption"}</span>
          </div>
        )}

      </div>
    </section>
  )
}
