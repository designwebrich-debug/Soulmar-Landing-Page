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
  Mail,
  Phone,
  Copy,
  Check
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
  const [confirmedBooking, setConfirmedBooking] = useState<{
    fullName: string
    phone: string
    email: string
    dateStr: string
    timeStr: string
    reason: string
    whatsappUrl: string
  } | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Cargar configuraciones de horarios guardados por el admin
  const [schedules, setSchedules] = useState<any>({
    Lunes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Martes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Miércoles: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Jueves: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Viernes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Sábado: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Domingo: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
  })
  const [slotDuration, setSlotDuration] = useState("1 hora 20 min")
  const [holidays, setHolidays] = useState<any[]>([])
  const [existingAppointments, setExistingAppointments] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          if (data.settings.schedules && Object.keys(data.settings.schedules).length > 0) {
            setSchedules(data.settings.schedules)
          }
          if (data.settings.slot_duration) setSlotDuration(data.settings.slot_duration)
          if (data.settings.holidays) setHolidays(data.settings.holidays)
        }
      })
      .catch(err => console.error("Error fetching settings:", err))

    // Cargar todas las citas existentes para inhabilitar turnos ya ocupados
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.appointments)) {
          setExistingAppointments(data.appointments)
        }
      })
      .catch(err => console.error("Error fetching appointments:", err))
  }, [])

  // Generar horarios de slots dinámicamente según la configuración del administrador
  const generatedSlots = useMemo(() => {
    if (!selectedDate) return { am: [], pm: [] }
    
    const weekdaysES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const dayName = weekdaysES[selectedDate.getDay()]
    const config = schedules[dayName]
    
    if (!config || !config.enabled) return { am: [], pm: [] }
    
    let durationMins = 30
    if (slotDuration === "45 min") durationMins = 45
    if (slotDuration === "1 hora") durationMins = 60
    if (slotDuration === "1 hora 20 min") durationMins = 80
    
    const am: string[] = []
    const pm: string[] = []
    
    const generateBlock = (startH: number, startM: number, endH: number, endM: number) => {
      let currentHour = startH
      let currentMin = startM
      
      while (currentHour < endH || (currentHour === endH && currentMin < endM)) {
        let displayHour = currentHour
        let ampm = "AM"
        
        if (currentHour >= 12) {
          ampm = "PM"
          if (currentHour > 12) displayHour = currentHour - 12
        } else if (currentHour === 0) {
          displayHour = 12
        }
        
        const hourStr = displayHour.toString().padStart(2, "0")
        const minStr = currentMin.toString().padStart(2, "0")
        const slotStr = `${hourStr}:${minStr} ${ampm}`
        
        if (ampm === "AM") {
          am.push(slotStr)
        } else {
          pm.push(slotStr)
        }
        
        currentMin += durationMins
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60)
          currentMin = currentMin % 60
        }
      }
    }
    
    // Procesar bloque AM
    if (config.start && config.end) {
      const s = config.start.split(":")
      const e = config.end.split(":")
      generateBlock(parseInt(s[0]) || 10, parseInt(s[1]) || 0, parseInt(e[0]) || 20, parseInt(e[1]) || 0)
    }
    
    // Procesar bloque PM
    if (config.startPM && config.endPM) {
      const s = config.startPM.split(":")
      const e = config.endPM.split(":")
      generateBlock(parseInt(s[0]) || 14, parseInt(s[1]) || 0, parseInt(e[0]) || 19, parseInt(e[1]) || 0)
    }
    
    return { am, pm }
  }, [selectedDate, schedules, slotDuration])


  // Helper to disable slots that are in the past if selectedDate is today
  // OR if the slot has already been booked (confirmed or pending)
  const isSlotDisabled = (timeStr: string): boolean => {
    if (!selectedDate) return true

    // 1. Verificar si el slot ya está reservado (estado != "cancelled")
    const hasBooking = existingAppointments.some(app => {
      return (
        app.appointment_date === formattedSelectedDate &&
        app.appointment_time === timeStr &&
        app.status !== "cancelled"
      )
    })
    if (hasBooking) return true

    // 2. Verificar si el slot es del pasado en caso de ser hoy
    const isToday = selectedDate.toDateString() === new Date().toDateString()
    if (!isToday) return false

    // Parse slot hour and minute (e.g., "08:00 AM" -> hour 8, minute 0)
    const parts = timeStr.split(" ")
    const timeParts = parts[0].split(":")
    let hour = parseInt(timeParts[0], 10)
    const minute = parseInt(timeParts[1], 10)
    const ampm = parts[1]

    if (ampm === "PM" && hour !== 12) {
      hour += 12
    } else if (ampm === "AM" && hour === 12) {
      hour = 0
    }

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    if (currentHour > hour) {
      return true
    } else if (currentHour === hour) {
      return currentMinute >= minute
    }

    return false
  }

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
    setConfirmedBooking(null)
    setIsCopied(false)
  }

  const handleStep1Next = () => {
    if (!selectedDate || !selectedTime) {
      setValidationError(language === "es" ? "Por favor selecciona fecha y hora de sesión." : "Please select a date and time for your session.")
      return
    }
    if (reason.trim().length < 5) {
      setValidationError(language === "es" ? "Por favor escribe un motivo de consulta" : "Please enter a reason for consultation")
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

    const cleanPhone = phone.trim()
    const cleanName = fullName.trim()
    const cleanEmail = email.trim()
    const dateFormatted = dateFormattedOnly || formattedSelectedDate

    // Build the direct WhatsApp notification message for Dra. Mariana (+57 301 303 5158)
    const whatsappMsg = `🌊 *NUEVA RESERVA DE CITA EN SOULMAR.ORG* 🌊\n\n` +
      `👤 *Paciente:* ${cleanName}\n` +
      `📱 *WhatsApp:* ${cleanPhone}\n` +
      `✉️ *Correo:* ${cleanEmail}\n` +
      `📅 *Fecha:* ${dateFormatted}\n` +
      `⏰ *Hora:* ${selectedTime}\n` +
      `💬 *Motivo:* ${reason.trim()}\n` +
      `💻 *Modalidad:* Sesión Online (Google Meet)\n\n` +
      `Hola Dra. Mariana, acabo de agendar mi cita en soulmar.org y te comparto mi confirmación para coordinar los detalles. ¡Muchas gracias!`

    const directWhatsappUrl = `https://api.whatsapp.com/send?phone=573013035158&text=${encodeURIComponent(whatsappMsg)}`

    setConfirmedBooking({
      fullName: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      dateStr: dateFormatted,
      timeStr: selectedTime,
      reason: reason.trim(),
      whatsappUrl: directWhatsappUrl
    })

    // Auto-dispatch: Abrir WhatsApp directamente para notificar a la Dra. Mariana sin fricción
    try {
      window.open(directWhatsappUrl, "_blank", "noopener,noreferrer")
    } catch (popupErr) {
      console.warn("Popup blocked or not allowed, fallback button available on success screen:", popupErr)
    }

    try {
      // 1. Post to API
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          date: formattedSelectedDate,
          time: selectedTime,
          reason: reason.trim()
        })
      })

      // 2. Persistir localmente en el dispositivo para garantía absoluta
      try {
        const localBooking = {
          fullName: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          date: formattedSelectedDate,
          dateFormatted,
          time: selectedTime,
          reason: reason.trim(),
          timestamp: new Date().toISOString()
        }
        const existing = JSON.parse(localStorage.getItem("soulmar_confirmed_appointments") || "[]")
        localStorage.setItem("soulmar_confirmed_appointments", JSON.stringify([localBooking, ...existing]))
      } catch (lsErr) {
        console.warn("Could not save to localStorage", lsErr)
      }
    } catch (err) {
      console.error("Booking API error:", err)
    } finally {
      setIsLoading(false)
      setIsSuccess(true)
    }
  }


  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return ""
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const d = String(selectedDate.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
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
      className="pt-16 md:pt-20 pb-14 md:pb-20 bg-white dark:bg-[#0b0b0c] transition-colors duration-500 border-t border-border/30 scroll-mt-20"
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
        <div 
          id="caja-agendamiento"
          className="scroll-mt-24 md:scroll-mt-28 bg-white dark:bg-[#111112] rounded-[24px] border border-border/70 dark:border-border/10 shadow-2xl overflow-hidden transition-all duration-500"
        >
          
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
                              
                              const y = day.getFullYear()
                              const m = String(day.getMonth() + 1).padStart(2, "0")
                              const d = String(day.getDate()).padStart(2, "0")
                              const dStr = `${y}-${m}-${d}`
                              const isHoliday = holidays.some(h => h.date === dStr);
                              
                              const weekdaysES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                              const dayName = weekdaysES[day.getDay()];
                              const dayConfig = schedules[dayName];
                              const isClosedDay = dayConfig && !dayConfig.enabled;
                              
                              const isDisabled = isPast || isHoliday || isClosedDay;

                              return (
                                <button
                                  key={`day-${idx}`}
                                  type="button"
                                  onClick={() => !isDisabled && handleDateClick(day)}
                                  disabled={isDisabled}
                                  aria-label={`Día ${day.getDate()} de ${monthName}`}
                                  aria-selected={isSelected}
                                  className={cn(
                                    "h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative",
                                    isSelected 
                                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" 
                                      : isToday 
                                        ? "border border-primary text-primary font-extrabold"
                                        : isDisabled 
                                          ? "opacity-25 cursor-not-allowed text-foreground/30" 
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
                                  {generatedSlots.am.length === 0 ? (
                                    <span className="col-span-3 text-[10px] font-bold text-foreground/30 py-2">
                                      {language === "es" ? "Sin cupos en la mañana — prueba en la tarde 🍂" : "No morning slots — try the afternoon 🍂"}
                                    </span>
                                  ) : (
                                    generatedSlots.am.map((time) => {
                                      const isSelected = selectedTime === time;
                                      const isDisabled = !selectedDate || isSlotDisabled(time);
                                      return (
                                        <button
                                          key={time}
                                          type="button"
                                          disabled={isDisabled}
                                          onClick={() => {
                                            setSelectedTime(time)
                                            setValidationError(null)
                                          }}
                                          className={cn(
                                            "h-10 text-xs font-bold rounded-lg border transition-all flex items-center justify-center outline-none select-none",
                                            isDisabled
                                              ? "opacity-30 cursor-not-allowed border-border/40 bg-surface/10 text-foreground/45"
                                              : isSelected
                                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102"
                                                : "border-border/80 dark:border-border/10 bg-background text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                          )}
                                        >
                                            {time}
                                        </button>
                                      )
                                    })
                                  )}
                                </div>
                              </div>

                              {/* SECCIÓN TARDE */}
                              <div className="space-y-2">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-foreground/35 flex items-center gap-1.5 leading-none">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60" />
                                  {language === "es" ? "Tarde (PM)" : "Afternoon (PM)"}
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {generatedSlots.pm.length === 0 ? (
                                    <span className="col-span-3 text-[10px] font-bold text-foreground/30 py-2">
                                      {language === "es" ? "Sin cupos en la tarde — prueba en la mañana 🌅" : "No afternoon slots — try the morning 🌅"}
                                    </span>
                                  ) : (
                                    generatedSlots.pm.map((time) => {
                                      const isSelected = selectedTime === time;
                                      const isDisabled = !selectedDate || isSlotDisabled(time);
                                      return (
                                        <button
                                          key={time}
                                          type="button"
                                          disabled={isDisabled}
                                          onClick={() => {
                                            setSelectedTime(time)
                                            setValidationError(null)
                                          }}
                                          className={cn(
                                            "h-10 text-xs font-bold rounded-lg border transition-all flex items-center justify-center outline-none select-none",
                                            isDisabled
                                              ? "opacity-30 cursor-not-allowed border-border/40 bg-surface/10 text-foreground/45"
                                              : isSelected
                                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-102"
                                                : "border-border/80 dark:border-border/10 bg-background text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                                          )}
                                        >
                                            {time}
                                        </button>
                                      )
                                    })
                                  )}
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
                            placeholder={language === "es" ? "Cuéntame sobre que deseas hablar" : "Tell me what you'd like to talk about"}
                            className="h-11 text-base md:text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full"
                          />
                        </div>
                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-surface/10 dark:bg-surface/3">
                      
                      {/* Left Summary */}
                      <div className="text-center sm:text-left">
                        <span className="block text-[8px] font-extrabold uppercase tracking-widest text-foreground/45">
                          {language === "es" ? "Tu sesión" : "Your session"}
                        </span>
                        <span className="block text-xs font-bold text-primary mt-1">
                          {selectedDate && selectedTime 
                            ? `${formattedSelectedDateLong} (${language === "es" ? "Sesión Virtual vía Google Meet" : "Virtual Session via Google Meet"})`
                            : (language === "es" ? "Completa los datos y nos vemos pronto" : "Complete details and see you soon")}
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
                            {language === "es" ? "Volver" : "Back"}
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
                                  autoComplete="name"
                                  value={fullName}
                                  onChange={(e) => {
                                    setFullName(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder={t("booking.name_placeholder")}
                                  className="h-11 text-base md:text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
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
                                  autoComplete="tel"
                                  inputMode="tel"
                                  value={phone}
                                  onChange={(e) => {
                                    setPhone(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder="+57 302 459 4428"
                                  className="h-11 text-base md:text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
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
                                  autoComplete="email"
                                  inputMode="email"
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (validationError) setValidationError(null)
                                  }}
                                  placeholder={t("booking.email_placeholder")}
                                  className="h-11 text-base md:text-xs font-semibold bg-background border-border/80 text-foreground focus-visible:ring-primary/30 w-full pl-10"
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
                                    {language === "es" ? "(totalmente gratis)" : "(totally free)"}
                                  </strong>
                                  .
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
                                    quality={100}
                                    unoptimized={true}
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
                                    {language === "es" ? "Sesión online por meet" : "Online session via Meet"}
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
                                    {language === "es" ? "$ 120.000 COP" : "$ 120,000 COP"}
                                  </span>
                                </div>
                                <span className="text-[10px] font-extrabold text-foreground/40 pb-0.5 uppercase tracking-wider">
                                  {language === "es" ? "($30.00 USD)" : "($30.00 USD)"}
                                </span>
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
                            className="h-10 px-6 rounded-full font-bold text-xs uppercase tracking-wider bg-primary text-white hover:bg-secondary-yellow hover:text-[#0b0b0c] shadow-lg shadow-primary/20 hover:shadow-secondary-yellow/30 transition-all w-full sm:w-auto flex items-center justify-center transform active:scale-98"
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
                className="p-6 md:p-10 text-center flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-300" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    {language === "es" ? "¡Cita Registrada con Éxito!" : "Appointment Successfully Registered!"}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                    {language === "es" ? "¡Excelente! Ya casi estamos listos" : "Almost Done! Confirm on WhatsApp"}
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed max-w-md mx-auto">
                    {language === "es" 
                      ? "Tu información ha sido registrada de forma segura. Para coordinar tu enlace de Google Meet y confirmar tu espacio con la Dra. Mariana, envía tu mensaje de confirmación por WhatsApp ahora:"
                      : "Your booking details are safely registered. To coordinate your Google Meet link and confirm your session with Dr. Mariana, send your confirmation on WhatsApp now:"}
                  </p>
                </div>

                {/* HIGH-IMPACT WHATSAPP CONFIRMATION CARD (MODO DIOS) */}
                <div className="w-full bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/40 rounded-2xl p-5 md:p-6 space-y-3.5 shadow-xl shadow-emerald-500/10 text-center transition-all">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>{language === "es" ? "Paso Final: Enviar Notificación al Consultorio" : "Final Step: Notify Clinic via WhatsApp"}</span>
                  </div>

                  <a
                    href={confirmedBooking?.whatsappUrl || "https://api.whatsapp.com/send?phone=573013035158"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-full font-black text-xs md:text-sm uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/30 hover:shadow-[#25D366]/50 transition-all flex items-center justify-center gap-3 transform active:scale-95 group cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.697c1.002.596 1.838.884 2.806.884 3.182 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.824 0-3.535-.49-5.019-1.343l-6.981 1.833 1.865-6.804c-.933-1.536-1.465-3.336-1.465-5.263 0-5.514 4.486-10 10-10s10 4.486 10 10z"/>
                    </svg>
                    <span>{language === "es" ? "Confirmar Cita por WhatsApp con Dra. Mariana" : "Confirm with Dr. Mariana via WhatsApp"}</span>
                  </a>

                  <p className="text-[10px] text-foreground/50 tracking-tight">
                    {language === "es"
                      ? "Línea Directa: +57 301 303 5158 • Dra. Mariana Caicedo"
                      : "Direct Line: +57 301 303 5158 • Dr. Mariana Caicedo"}
                  </p>
                </div>

                {/* DETAILED APPOINTMENT SUMMARY CARD */}
                <div className="w-full bg-surface/40 dark:bg-surface/5 rounded-2xl border border-border/20 p-5 space-y-3.5 text-left shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Paciente */}
                    <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{language === "es" ? "Paciente" : "Patient"}</p>
                        <span className="truncate block font-bold text-foreground">{confirmedBooking?.fullName || fullName || "Paciente Soulmar"}</span>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-emerald-500 border border-border/10 shadow-sm shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">WhatsApp</p>
                        <span className="truncate block font-bold text-foreground">{confirmedBooking?.phone || phone}</span>
                      </div>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm shrink-0">
                        <CalendarIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.date")}</p>
                        <span className="truncate block">
                          {confirmedBooking?.dateStr || (selectedDate?.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { day: "numeric", month: "long", year: "numeric" }))}
                        </span>
                      </div>
                    </div>

                    {/* Hora */}
                    <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.time")}</p>
                        <span className="truncate block">{confirmedBooking?.timeStr || selectedTime}</span>
                      </div>
                    </div>

                    {/* Modalidad */}
                    <div className="flex items-center gap-2.5 text-xs text-foreground/80 font-semibold sm:col-span-2">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-primary border border-border/10 shadow-sm shrink-0">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase font-bold text-foreground/40 leading-none mb-0.5">{t("booking.success.link")}</p>
                        <span className="truncate block font-medium">Sesión Online (Google Meet privado)</span>
                      </div>
                    </div>
                  </div>

                  {/* Copy details action */}
                  <div className="pt-2 border-t border-border/10 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const summaryText = `Reserva Soulmar:\nPaciente: ${confirmedBooking?.fullName || fullName}\nFecha: ${confirmedBooking?.dateStr || formattedSelectedDate}\nHora: ${confirmedBooking?.timeStr || selectedTime}\nMotivo: ${confirmedBooking?.reason || reason}\nWhatsApp Consultorio: +57 301 303 5158`
                        navigator.clipboard.writeText(summaryText)
                        setIsCopied(true)
                        setTimeout(() => setIsCopied(false), 3000)
                      }}
                      className="text-[11px] font-semibold text-foreground/60 hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-md hover:bg-surface/60"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">{language === "es" ? "¡Resumen copiado!" : "Copied!"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{language === "es" ? "Copiar resumen de mi cita" : "Copy details"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Secondary action: Schedule another */}
                <div className="pt-2 flex justify-center w-full">
                  <Button 
                    onClick={() => {
                      setIsSuccess(false)
                      handleCancel()
                    }}
                    variant="outline"
                    className="h-11 px-7 rounded-full font-bold text-xs uppercase tracking-wider border-border/40 hover:bg-surface text-foreground/75 hover:text-foreground transition-all w-full max-w-xs flex items-center justify-center transform active:scale-98"
                  >
                    {language === "es" ? "¿Agendar otra cita?" : "Schedule another session"}
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
            <span>{language === "es" ? "Tu información está protegida en todo momento" : "Your information is protected at all times"}</span>
          </div>
        )}

        {/* Mobile Sticky Action Dock (Floating bottom bar for high-conversion on smartphones) */}
        {!isSuccess && selectedDate && selectedTime && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 dark:bg-[#111112]/90 backdrop-blur-2xl border-t border-border/80 p-3.5 pb-safe shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary truncate">
                  {selectedTime} • {selectedDate.getDate()} {selectedDate.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { month: "short" })}
                </span>
                <span className="text-[11px] font-bold text-foreground/80 truncate">
                  {step === 1 ? (language === "es" ? "Paso 1: Fecha lista" : "Step 1: Time ready") : (language === "es" ? "Paso 2: Confirmar datos" : "Step 2: Confirm info")}
                </span>
              </div>
              <Button
                onClick={step === 1 ? handleStep1Next : handleStep2Submit}
                disabled={isLoading}
                className="h-11 px-5 rounded-full font-bold text-xs uppercase tracking-wider bg-primary text-white hover:bg-secondary-yellow hover:text-black shadow-lg shadow-primary/20 shrink-0 flex items-center gap-1.5 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{step === 1 ? (language === "es" ? "Continuar ➔" : "Continue ➔") : t("booking.step3_confirm")}</span>
                )}
              </Button>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
