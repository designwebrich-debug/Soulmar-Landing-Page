"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Calendar, ShieldCheck, Clock, Plus, ArrowUpRight, ArrowRight, Heart, Users, Brain, BookOpen, Flame, Sparkles, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"
import { format, addDays } from "date-fns"
import { es, enUS } from "date-fns/locale"

export function CinemaHero() {
  const { t, language } = useTranslation()
  const [nextSlot, setNextSlot] = React.useState<string>("")
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [currentMobileSlide, setCurrentMobileSlide] = React.useState(0)
  const [mobileSearchQuery, setMobileSearchQuery] = React.useState("")

  const slides = React.useMemo(() => [
    {
      id: 1,
      image: "/images/BannerHero01.jpg",
      titlePart1: t('hero.slide1_title_part1') || t('hero.title_part1'),
      titlePart2: t('hero.slide1_title_part2') || t('hero.title_part2'),
      subtitle: t('hero.slide1_subtitle') || t('hero.subtitle'),
      color: "text-neutral-900", // User requested black titles for all
      gradient: "from-[#f0f7fc]/95 via-[#f0f7fc]/70 to-transparent dark:from-[#0b0b0c]/95 dark:via-[#0b0b0c]/70 dark:to-transparent",
      buttonClass: "bg-[#8da9c4] hover:bg-[#ffc971] text-white hover:text-neutral-900 border-[#8da9c4]/20 hover:border-[#ffc971]/20",
      buttonIconClass: "bg-white text-[#8da9c4] group-hover:text-[#ffc971]"
    },
    {
      id: 2,
      image: "/images/BannerHero03.jpg",
      titlePart1: t('hero.slide2_title_part1'),
      titlePart2: t('hero.slide2_title_part2'),
      subtitle: t('hero.slide2_subtitle'),
      color: "text-neutral-900",
      gradient: "from-[#f0f7fc]/95 via-[#f0f7fc]/70 to-transparent dark:from-[#0b0b0c]/95 dark:via-[#0b0b0c]/70 dark:to-transparent",
      buttonClass: "bg-[#ffc971] hover:bg-neutral-900 text-neutral-900 hover:text-white border-[#ffc971]/20 hover:border-neutral-900/20",
      buttonIconClass: "bg-neutral-900 text-[#ffc971] group-hover:bg-white group-hover:text-neutral-900"
    },
    {
      id: 3,
      image: "/images/BannerHero02.jpg",
      titlePart1: t('hero.slide3_title_part1'),
      titlePart2: t('hero.slide3_title_part2'),
      subtitle: t('hero.slide3_subtitle'),
      color: "text-neutral-900",
      gradient: "",
      buttonClass: "bg-[#8da9c4] hover:bg-neutral-900 text-white hover:text-white border-[#8da9c4]/20 hover:border-neutral-900/20",
      buttonIconClass: "bg-white text-[#8da9c4] group-hover:bg-white group-hover:text-neutral-900"
    }
  ], [t])

  const mobileSlides = React.useMemo(() => [
    {
      id: 1,
      tag: language === "es" ? "★ DESTACADO • DRA. MARIANA CAICEDO" : "★ FEATURED • DR. MARIANA CAICEDO",
      title: language === "es" ? "SANAR ES VOLVER A TI" : "HEALING IS RETURNING TO YOU",
      image: "/images/BannerHero01.jpg",
      bottomTitle: language === "es" ? "Psicoterapia Individual" : "Individual Psychotherapy",
      bottomSubtitle: language === "es" ? "Online • 1 a 1 personalizada" : "Online • 1 on 1 personalized",
      href: "/#agendamiento",
    },
    {
      id: 2,
      tag: language === "es" ? "VÍNCULOS • PSICOLOGÍA CLÍNICA" : "RELATIONSHIPS • CLINICAL PSYCHOLOGY",
      title: language === "es" ? "TERAPIA DE PAREJA" : "COUPLES THERAPY",
      image: "/images/BannerHero03.jpg",
      bottomTitle: language === "es" ? "Sesión para Parejas" : "Couples Session",
      bottomSubtitle: language === "es" ? "Comunicación y acuerdos afectivos" : "Communication and emotional bonds",
      href: "/#agendamiento",
    },
    {
      id: 3,
      tag: language === "es" ? "RECURSOS GRATUITOS • SOULMAR" : "FREE RESOURCES • SOULMAR",
      title: language === "es" ? "GUÍAS Y EBOOKS" : "GUIDES & EBOOKS",
      image: "/images/BannerHero02.jpg",
      bottomTitle: language === "es" ? "Libros & Cuadernos" : "Books & Workbooks",
      bottomSubtitle: language === "es" ? "Descarga 100% gratuita" : "100% free download",
      href: "/#ebooks",
    },
  ], [language])

  const threeTopicButtons = React.useMemo(() => [
    {
      id: "ansiedad",
      label: language === "es" ? "Ansiedad" : "Anxiety",
      icon: Sparkles,
      iconColor: "text-emerald-500 dark:text-emerald-400",
      href: "/#servicios",
    },
    {
      id: "depresion",
      label: language === "es" ? "Depresión" : "Depression",
      icon: Brain,
      iconColor: "text-purple-500 dark:text-purple-400",
      href: "/#servicios",
    },
    {
      id: "emociones",
      label: language === "es" ? "Emociones" : "Emotions",
      icon: Heart,
      iconColor: "text-rose-500 dark:text-rose-400",
      href: "/#servicios",
    },
  ], [language])

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = mobileSearchQuery.toLowerCase().trim()
    if (!q) {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (q.includes("ansiedad") || q.includes("depresion") || q.includes("emocion") || q.includes("terapia") || q.includes("pareja") || q.includes("familiar") || q.includes("servicio")) {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
    } else if (q.includes("cita") || q.includes("agendar") || q.includes("reserva") || q.includes("precio") || q.includes("sesion")) {
      document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
    } else if (q.includes("libro") || q.includes("ebook") || q.includes("pdf") || q.includes("guia")) {
      document.getElementById("ebooks")?.scrollIntoView({ behavior: "smooth" })
    } else {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const mobileModules = React.useMemo(() => [
    {
      id: "individual",
      tag: "1 A 1",
      tagBg: "bg-[#8da9c4]/20 text-[#2b5a80] dark:text-[#8da9c4]",
      title: language === "es" ? "Terapia Individual" : "Individual Therapy",
      desc: language === "es" ? "Acompañamiento clínico" : "Clinical guidance",
      image: "/images/slider/phone-card-1.png",
      cardBg: "bg-[#f2f5f9] dark:bg-[#181d24]",
      href: "/#agendamiento",
    },
    {
      id: "pareja",
      tag: language === "es" ? "PAREJAS" : "COUPLES",
      tagBg: "bg-[#c9cba3]/30 text-[#4c5c36] dark:text-[#c9cba3]",
      title: language === "es" ? "Terapia Pareja" : "Couples Therapy",
      desc: language === "es" ? "Vínculos y acuerdos" : "Bonds & agreements",
      image: "/images/slider/phone-card-2.png",
      cardBg: "bg-[#f1f6ed] dark:bg-[#18221b]",
      href: "/#agendamiento",
    },
    {
      id: "familiar",
      tag: language === "es" ? "FAMILIAS" : "FAMILIES",
      tagBg: "bg-[#ffc971]/25 text-[#8a5d1b] dark:text-[#ffc971]",
      title: language === "es" ? "Orientación Familiar" : "Family Guidance",
      desc: language === "es" ? "Dinámicas afectivas" : "Emotional dynamics",
      image: "/images/slider/phone-card-3.png",
      cardBg: "bg-[#fdf7ee] dark:bg-[#231d16]",
      href: "/#agendamiento",
    },
    {
      id: "ebooks",
      tag: language === "es" ? "GRATIS" : "FREE",
      tagBg: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
      title: language === "es" ? "Libros & PDFs" : "Books & PDFs",
      desc: language === "es" ? "Guías descargables" : "Downloadable guides",
      image: "/images/ebooks/ansiedad.png",
      cardBg: "bg-[#eef3f9] dark:bg-[#161d26]",
      href: "/#ebooks",
    },
  ], [language])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMobileSlide((prev) => (prev + 1) % mobileSlides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [mobileSlides.length])

  const activeSlide = slides[currentSlide]

  React.useEffect(() => {
    // 1. Fetch settings and appointments safely
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url)
        return await res.json()
      } catch (e) {
        return {}
      }
    }
    
    Promise.all([
      safeFetch("/api/settings"),
      safeFetch("/api/appointments")
    ]).then(([settingsData, appointmentsData]) => {
      const settings = settingsData.settings || {}
      let schedules = settings.schedules || {}
      
      // Fallback si no hay horarios configurados en BD
      if (Object.keys(schedules).length === 0) {
        schedules = {
          Lunes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Martes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Miércoles: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Jueves: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Viernes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Sábado: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
          Domingo: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
        }
      }
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
                dayPrefix = format(dateToCheck, language === "es" ? "EEE d MMM" : "EEE, MMM d", { locale: language === "es" ? es : enUS })
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
        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-neutral-400" />
          {language === "es" ? "Tu psicóloga" : "Your psychologist"}
        </span>
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
        <span className="text-[8px] font-black text-[#8da9c4] uppercase tracking-widest flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#8da9c4]" />
          {language === "es" ? "Próxima sesión" : "Next session"}
        </span>
        <p className="text-[17px] font-black text-neutral-900 leading-tight tracking-tighter whitespace-nowrap">{displaySlot}</p>
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
      <div className="flex justify-center w-full">
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4, 5].map((val) => (
            <motion.span
              key={val}
              className="w-[6px] bg-[#8da9c4] rounded-full"
              animate={{
                scaleY: [0.3, 1.2, 0.3],
                backgroundColor: ["#8da9c4", "#c9cba3", "#8da9c4"]
              }}
              transition={{
                duration: 1.5 + (val * 0.25),
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ height: '42px', transformOrigin: 'center' }}
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
    <section id="top" className="relative w-full overflow-hidden">
      
      {/* =========================================================================
          1. VERSIÓN CELULAR EXCLUSIVA (ESTILO APP SPROUTS / RAPPI)
          Caja grande en carrusel de 3 fotos + Píldoras de temas + Grid de 2 módulos
          ========================================================================= */}
      <div className="md:hidden flex flex-col w-full pt-16 pb-8 px-3.5 space-y-3 relative z-10">
        
        {/* CAJA GRANDE EN TODO EL HOME (CARRUSEL DE 3 FOTOS) */}
        <div className="relative w-full h-[510px] rounded-[36px] overflow-hidden shadow-2xl flex flex-col justify-between p-5 select-none bg-neutral-900 border border-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMobileSlide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -35) {
                  setCurrentMobileSlide((prev) => (prev + 1) % mobileSlides.length)
                } else if (info.offset.x > 35) {
                  setCurrentMobileSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length)
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Image
                src={mobileSlides[currentMobileSlide].image}
                alt={mobileSlides[currentMobileSlide].title}
                fill
                quality={100}
                priority
                unoptimized
                className="object-cover"
              />
              {/* Degradados cinemáticos para legibilidad perfecta */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/85" />
            </motion.div>
          </AnimatePresence>

          {/* ARRIBA DE LA TARJETA: BADGE + INDICADORES DE CARRUSEL (3 PUNTOS) */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="bg-white/25 backdrop-blur-md border border-white/30 text-white text-[9.5px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
              {mobileSlides[currentMobileSlide].tag}
            </span>

            {/* INDICADOR DE 3 FOTOS */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-full">
              {mobileSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentMobileSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentMobileSlide === idx
                      ? "w-5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Foto ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* EN MEDIO: TITULAR GRANDE EN TODA LA CAJA (ESTILO FRENCH ROAST) */}
          <div className="relative z-10 mt-6 mb-auto text-left pr-2 pointer-events-none">
            <h2 className="text-[34px] sm:text-[38px] font-black uppercase tracking-tight text-white leading-[0.92] drop-shadow-xl font-sans">
              {mobileSlides[currentMobileSlide].title}
            </h2>
          </div>

          {/* ABAJO: BARRA DE BÚSQUEDA CON EFECTO DE CRISTAL LÍQUIDO (liquid-glass) */}
          <div className="relative z-10 w-full">
            <form
              onSubmit={handleMobileSearch}
              className="liquid-glass w-full h-[52px] rounded-full flex items-center gap-2.5 pl-4 pr-1.5 shadow-2xl"
            >
              <Search className="w-4 h-4 text-white/80 shrink-0 stroke-[2.2]" />
              <input
                type="search"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder={language === "es" ? "¿Qué necesitas hoy? Buscar en Soulmar..." : "What do you need today? Search..."}
                className="flex-1 min-w-0 bg-transparent text-[13.5px] font-medium text-white placeholder:text-white/65 outline-none border-none p-0"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="w-10 h-10 rounded-full liquid-glass-pill flex items-center justify-center shrink-0 text-white cursor-pointer active:scale-90 transition-transform"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>

        {/* BOTONES DEBAJO DEL BANNER: ANSIEDAD, DEPRESIÓN, EMOCIONES (CRISTAL LÍQUIDO) */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          {threeTopicButtons.map((btn) => {
            const Icon = btn.icon
            return (
              <Link
                key={btn.id}
                href={btn.href}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="liquid-glass rounded-full py-2.5 px-1.5 flex items-center justify-center gap-1.5 text-[12px] font-bold text-neutral-800 dark:text-white shadow-sm active:scale-95 transition-transform cursor-pointer select-none text-center"
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] ${btn.iconColor}`} />
                <span className="truncate">{btn.label}</span>
              </Link>
            )
          })}
        </div>

        {/* MÓDULOS QUE LE SIGUEN: GRID 2 COLUMNAS DE CAJAS REDONDEADAS */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {mobileModules.map((mod) => (
            <Link
              key={mod.id}
              href={mod.href}
              onClick={(e) => {
                const target = mod.href.replace("/#", "")
                const el = document.getElementById(target)
                if (el) {
                  e.preventDefault()
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className={`rounded-[28px] p-3 flex flex-col justify-between ${mod.cardBg} border border-black/5 dark:border-white/10 shadow-sm active:scale-[0.98] transition-transform group`}
            >
              {/* Imagen redondeada superior */}
              <div className="h-28 w-full rounded-2xl overflow-hidden relative mb-2.5 bg-white/50 dark:bg-black/20 flex items-center justify-center">
                <Image
                  src={mod.image}
                  alt={mod.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2 left-2 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${mod.tagBg}`}>
                  {mod.tag}
                </span>
              </div>

              {/* Título, descripción y botón (+) */}
              <div className="flex items-end justify-between gap-1 mt-1">
                <div className="min-w-0">
                  <h3 className="text-[13px] font-black text-neutral-900 dark:text-white leading-tight truncate">
                    {mod.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight truncate mt-0.5">
                    {mod.desc}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. VERSIÓN DESKTOP (CINEMA HERO ORIGINAL 100% INTACTO)
          ========================================================================= */}
      <div className="hidden md:flex flex-col justify-between w-full min-h-screen pt-16 pb-12 relative overflow-hidden">
        
        {/* Background Image (Max Quality) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={activeSlide.image} 
                alt="Soulmar Background" 
                fill 
                className="object-cover"
                priority
                quality={100}
                unoptimized={true}
              />
              {/* Dynamic slide-specific gradient overlay */}
              {activeSlide.gradient && (
                <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.gradient} w-full lg:w-3/4 z-10`} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

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
              <div className="min-h-[240px] md:min-h-[280px] lg:min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <h1 
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-[75px] font-black tracking-tighter text-neutral-900 font-sans m-0 p-0 leading-[0.95] sm:leading-[0.85] lg:leading-[0.75]"
                    >
                      {activeSlide.titlePart1}
                      <br />
                      <span className={activeSlide.color}>
                        {activeSlide.titlePart2}
                      </span>
                    </h1>

                    {/* Persuasive subtitle */}
                    <p className="text-base md:text-lg text-neutral-600 font-medium leading-snug max-w-xl">
                      {activeSlide.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Custom Pill Button with circle arrow ↗ */}
              <div className="-mt-6">
                <Link 
                  href="/#agendamiento" 
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className={`inline-flex items-center gap-4 font-black px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-[1.03] active:scale-95 group cursor-pointer border ${activeSlide.buttonClass}`}
                >
                  <span className="text-[10px] uppercase tracking-widest leading-none">{t('hero.cta_primary')}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${activeSlide.buttonIconClass}`}>
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

          </div>
        </div>

        {/* BOTTOM LAYOUT CONTENT: 5 DYNAMIC CARDS MARQUEE */}
        <div className="relative z-10 w-full overflow-hidden py-2">
          <div className="mask-gradient-edges w-full overflow-hidden py-3">
            <div className="flex gap-4 w-max animate-marquee-right">
              {cards}
              {cards}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
