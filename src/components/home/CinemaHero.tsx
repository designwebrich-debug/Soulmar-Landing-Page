"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Calendar, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"
import { format, addDays } from "date-fns"
import { es, enUS } from "date-fns/locale"

export function CinemaHero() {
  const { t, language } = useTranslation()
  const [nextSlot, setNextSlot] = React.useState<string>("")

  React.useEffect(() => {
    // 1. Fetch settings and appointments in parallel
    Promise.all([
      fetch("/api/settings").then(res => res.json()),
      fetch("/api/appointments").then(res => res.json())
    ]).then(([settingsData, appointmentsData]) => {
      const settings = settingsData.settings || {}
      const schedules = settings.schedules || {}
      const slotDuration = settings.slot_duration || "1 hora 20 min"
      const holidays = settings.holidays || []
      const appointments = appointmentsData.appointments || []

      // 2. Loop starting from today (up to 30 days into the future) to find the first available slot
      let foundSlot = ""
      let dateToCheck = new Date()

      for (let i = 0; i < 30; i++) {
        const formattedDate = format(dateToCheck, "yyyy-MM-dd")

        // Check if date is a holiday
        const isHoliday = holidays.some((h: any) => {
          const hDate = typeof h === 'string' ? h : h.date;
          return hDate === formattedDate;
        })

        if (isHoliday) {
          dateToCheck = addDays(dateToCheck, 1)
          continue
        }

        // Get weekday name in Spanish
        const weekdaysES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        const dayName = weekdaysES[dateToCheck.getDay()]
        const config = schedules[dayName]

        if (!config || !config.enabled) {
          dateToCheck = addDays(dateToCheck, 1)
          continue
        }

        // Determine duration in minutes
        let durationMins = 30
        if (slotDuration === "45 min") durationMins = 45
        if (slotDuration === "1 hora") durationMins = 60
        if (slotDuration === "1 hora 20 min") durationMins = 80

        const slots: string[] = []

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
            slots.push(`${hourStr}:${minStr} ${ampm}`)
            
            currentMin += durationMins
            if (currentMin >= 60) {
              currentHour += Math.floor(currentMin / 60)
              currentMin = currentMin % 60
            }
          }
        }

        // Generate AM block
        if (config.start && config.end) {
          const s = config.start.split(":")
          const e = config.end.split(":")
          generateBlock(parseInt(s[0]) || 7, parseInt(s[1]) || 0, parseInt(e[0]) || 12, parseInt(e[1]) || 0)
        }

        // Generate PM block
        if (config.startPM && config.endPM) {
          const s = config.startPM.split(":")
          const e = config.endPM.split(":")
          generateBlock(parseInt(s[0]) || 14, parseInt(s[1]) || 0, parseInt(e[0]) || 19, parseInt(e[1]) || 0)
        }

        // Check slots for this date
        const isToday = dateToCheck.toDateString() === new Date().toDateString()
        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()

        for (const slot of slots) {
          // Check if slot is in the past (if today)
          if (isToday) {
            const parts = slot.split(" ")
            const timeParts = parts[0].split(":")
            let slotHour = parseInt(timeParts[0], 10)
            const slotMinute = parseInt(timeParts[1], 10)
            const ampm = parts[1]

            if (ampm === "PM" && slotHour !== 12) {
              slotHour += 12
            } else if (ampm === "AM" && slotHour === 12) {
              slotHour = 0
            }

            if (currentHour > slotHour || (currentHour === slotHour && currentMinute >= slotMinute)) {
              continue
            }
          }

          // Check if already booked
          const isBooked = appointments.some((app: any) => {
            return (
              app.appointment_date === formattedDate &&
              app.appointment_time === slot &&
              app.status !== "cancelled"
            )
          })

          if (!isBooked) {
            // Found it! Format the output beautifully:
            let dayPrefix = ""
            if (isToday) {
              dayPrefix = language === "es" ? "Hoy" : "Today"
            } else {
              const tomorrow = addDays(new Date(), 1)
              const isTomorrow = dateToCheck.toDateString() === tomorrow.toDateString()
              if (isTomorrow) {
                dayPrefix = language === "es" ? "Mañana" : "Tomorrow"
              } else {
                dayPrefix = format(dateToCheck, language === "es" ? "EEEE d 'de' MMMM" : "EEEE, MMMM d", { locale: language === "es" ? es : enUS })
                // Capitalize first letter of dayPrefix
                dayPrefix = dayPrefix.charAt(0).toUpperCase() + dayPrefix.slice(1)
              }
            }
            foundSlot = `${dayPrefix}, ${slot}`
            break
          }
        }

        if (foundSlot) {
          break
        }

        dateToCheck = addDays(dateToCheck, 1)
      }

      setNextSlot(foundSlot || (language === "es" ? "Próximamente disponible" : "Soon available"))
    }).catch(err => {
      console.error("Error calculating next slot:", err)
      setNextSlot(language === "es" ? "Hoy, 4:00 PM" : "Today, 4:00 PM") // Fallback
    })
  }, [language])

  const displaySlot = nextSlot || (language === "es" ? "Agenda cuando estés lista o listo" : "Book when you are ready")

  // Defining the 5 cards dynamically so we can loop them in a marquee
  const cards = [
    // CARD 1: Perfil de la Dra.
    <div key="c1" className="w-[250px] h-[155px] bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-neutral-300/80 transition-all select-none">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">{language === "es" ? "Tu psicóloga" : "Your psychologist"}</span>
        <h4 className="text-sm font-black text-neutral-900 leading-tight">Dra. Mariana Caicedo</h4>
        <p className="text-[10px] text-[#8da9c4] font-bold uppercase tracking-wider">{language === "es" ? "Psicóloga Clínica • Terapia Online" : "Clinical Psychologist • Online Therapy"}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">{language === "es" ? "Disponible" : "Available"}</span>
      </div>
    </div>,

    // CARD 2: Disponibilidad y Botón Verde Soulmar
    <div key="c2" className="w-[250px] h-[155px] bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-neutral-300/80 transition-all select-none">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-[#8da9c4] uppercase tracking-widest block">{language === "es" ? "Próxima sesión" : "Next session"}</span>
        <p className="text-xs font-black text-neutral-900 leading-tight">{displaySlot}</p>
      </div>
      <Link 
        href="/#agendamiento" 
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="block"
      >
        <Button className="w-full bg-[#c9cba3] hover:bg-[#ffc971] text-neutral-900 font-black text-[9px] uppercase tracking-widest rounded-full h-8 shadow-sm transition-all duration-300 border-none cursor-pointer">
          {t('hero.cta_secondary')}
        </Button>
      </Link>
    </div>,

    // CARD 3: Siri Breathing Wave (Dark Contrast Card in Center)
    <div key="c3" className="w-[250px] h-[155px] bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-md flex flex-col justify-between text-white hover:border-white/20 transition-all select-none">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-[#8da9c4] uppercase tracking-widest block font-sans">{language === "es" ? "Proceso sin prisa" : "Unhurried process"}</span>
        <p className="text-xs font-bold text-neutral-300 leading-tight">{language === "es" ? "Cada sesión avanza al ritmo que tú necesitas." : "Each session progresses at the pace you need."}</p>
      </div>
      <div className="flex justify-start">
        <div className="flex items-center gap-1 h-3.5">
          {[1, 2, 3, 4, 5].map((val) => (
            <motion.span
              key={val}
              className="w-[2px] bg-[#8da9c4] rounded-full"
              animate={{
                scaleY: [0.3, 1.2, 0.3],
                backgroundColor: ["#8da9c4", "#c9cba3", "#8da9c4"]
              }}
              transition={{
                duration: 1.5 + (val * 0.25),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ height: '14px', transformOrigin: 'center' }}
            />
          ))}
        </div>
      </div>
    </div>,

    // CARD 4: Confidencialidad
    <div key="c4" className="w-[250px] h-[155px] bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-neutral-300/80 transition-all select-none">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-[#BA7517] uppercase tracking-widest block">{language === "es" ? "Privacidad" : "Privacy"}</span>
        <h4 className="text-sm font-black text-neutral-900 leading-tight">{language === "es" ? "Un espacio solo tuyo" : "A space just yours"}</h4>
        <p className="text-[10px] text-neutral-400 font-bold leading-normal">{language === "es" ? "Todo lo que compartes queda protegido y en absoluta confidencialidad." : "Everything you share remains protected and in absolute confidentiality."}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#1D9E75]" />
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">{language === "es" ? "Espacio Seguro" : "Safe Space"}</span>
      </div>
    </div>,

    // CARD 5: Modalidad Flex
    <div key="c5" className="w-[250px] h-[155px] bg-white border border-neutral-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between hover:border-neutral-300/80 transition-all select-none">
      <div className="space-y-1">
        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest block">{language === "es" ? "Modalidad" : "Modality"}</span>
        <h4 className="text-sm font-black text-neutral-900 leading-tight">{language === "es" ? "Terapia donde tú estés" : "Therapy wherever you are"}</h4>
        <p className="text-[10px] text-neutral-400 font-bold leading-normal">{language === "es" ? "Conéctate desde casa, el trabajo o donde te sientas cómodo/a." : "Connect from home, work, or wherever you feel comfortable."}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-[#8da9c4]" />
        <span className="text-[9px] font-bold text-[#8da9c4] uppercase tracking-wider">Online</span>
      </div>
    </div>
  ]

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-[#f0f7fc] to-[#e1effa] flex flex-col justify-between pt-16 pb-12 overflow-hidden">
      
      {/* CSS Styles injection for smooth GPU-accelerated horizontal scrolling */}
      <style>{`
        @keyframes marqueeRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-right {
          animation: marqueeRight 35s linear infinite;
        }
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        .mask-gradient-edges {
          mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, white 12%, white 88%, transparent);
        }
      `}</style>

      {/* Background Orbs & Light Ambient glows (Brand colors matching Apple Premium) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#8da9c4]/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#c9cba3]/20 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0 opacity-40" />

      {/* TOP & MIDDLE LAYOUT CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex-grow flex items-center mb-16 lg:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          
          {/* COLUMN 1: LEFT SIDE VALUE PROP */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-4 text-left"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1D9E75]/10 border border-[#1D9E75]/20 px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] relative flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1D9E75]" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75]">
                {t('hero.badge')}
              </span>
            </div>

            {/* Apple style headline */}
            <h1 
              className="text-5xl md:text-6xl lg:text-[75px] font-black tracking-tighter text-neutral-900 font-sans pb-4"
              style={{ lineHeight: '0.88' }}
            >
              {t('hero.title_part1')}{" "}
              <span className="text-[#8da9c4]">
                {t('hero.title_part2')}
              </span>
            </h1>

            {/* Persuasive subtitle */}
            <p className="text-base md:text-lg text-neutral-600 font-medium leading-snug max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* Custom Pill Button with circle arrow ↗ */}
            <div>
              <Link 
                href="/#agendamiento" 
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="inline-flex items-center gap-4 bg-[#c9cba3] hover:bg-[#ffc971] text-neutral-900 font-black px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 group cursor-pointer border border-[#c9cba3]/20 hover:border-[#ffc971]/20"
              >
                <span className="text-[10px] uppercase tracking-widest leading-none">{t('hero.cta_primary')}</span>
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-[#c9cba3] group-hover:text-[#ffc971] transition-colors duration-300 shrink-0">
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Rated / Trust Indicators */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1 text-[#BA7517]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-none">
                {t('hero.trust_line')}
              </span>
            </div>

          </motion.div>

          {/* COLUMN 2: RIGHT SIDE DOCTOR PORTRAIT */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[380px] md:max-w-[400px] aspect-[4/5] rounded-[40px] overflow-hidden border border-neutral-200/50 shadow-2xl bg-neutral-100"
            >
              <Image 
                src="/images/hero-soulmar-cozy.jpg" 
                alt="Dra. Mariana Caicedo" 
                fill 
                className="object-cover transition-transform duration-[2000ms] hover:scale-103"
                priority
                sizes="(max-width: 768px) 100vw, 400px"
              />
              
              {/* Soft overlay gradient at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Status Indicator over image */}
              <div className="absolute bottom-6 left-6 right-6 space-y-1 text-left">
                <div className="inline-flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] relative flex">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1D9E75]" />
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white">
                    En línea y disponible
                  </span>
                </div>
                <h3 className="text-lg font-black text-white leading-none">Dra. Mariana Caicedo</h3>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* BOTTOM LAYOUT CONTENT: 5 DYNAMIC CARDS IN INFINITE HORIZONTAL MARQUEE */}
      <div className="relative z-10 w-full overflow-hidden py-2">
        <div className="mask-gradient-edges w-full overflow-hidden py-3">
          {/* Flex container that moves infinitely from left to right (using double set of cards) */}
          <div className="flex gap-4 w-max animate-marquee-right">
            
            {/* First Set of 5 Cards */}
            {cards}
            
            {/* Second Set of 5 Cards (for seamless infinite wrapper loop) */}
            {cards}
            
          </div>
        </div>
      </div>

    </section>
  )
}
