"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Calendar, ShieldCheck, Clock, Plus, ArrowUpRight, ArrowRight, Heart, Users, Brain, BookOpen, Flame, Sparkles, Search, Download, Play, X, ExternalLink, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"
import { format, addDays } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { searchSoulmar, type SearchItem } from "@/lib/searchDatabase"
import { normalizeTime } from "@/lib/utils"

export function CinemaHero() {
  const { t, language } = useTranslation()
  const [nextSlot, setNextSlot] = React.useState<string>("")
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [currentMobileSlide, setCurrentMobileSlide] = React.useState(0)
  const [activeInfoCardIndex, setActiveInfoCardIndex] = React.useState(0)
  const [mobileSearchQuery, setMobileSearchQuery] = React.useState("")

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveInfoCardIndex((prev) => (prev + 1) % 3)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

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
      title: "",
      image: "/images/mobile-hero/slide-1.jpg",
      desktopImage: "/images/desktop-hero/slide-1.png",
      bottomTitle: language === "es" ? "Mi Herida, Mi Reacción" : "My Wound, My Reaction",
      bottomSubtitle: language === "es" ? "Dra. Mariana Caicedo" : "Dr. Mariana Caicedo",
      href: "/#agendamiento",
    },
    {
      id: 2,
      tag: language === "es" ? "★ DESTACADO • SOULMAR" : "★ FEATURED • SOULMAR",
      title: "",
      image: "/images/mobile-hero/slide-2.png",
      desktopImage: "/images/desktop-hero/slide-2.jpg",
      bottomTitle: language === "es" ? "¿Por qué sobrepienso todo?" : "Why do I overthink everything?",
      bottomSubtitle: language === "es" ? "Dra. Mariana Caicedo" : "Dr. Mariana Caicedo",
      href: "/#ebooks",
    },
    {
      id: 3,
      tag: "PODCAST • SOULMAR",
      title: "",
      image: "/images/mobile-hero/podcast.png",
      desktopImage: "/images/desktop-hero/podcast.png",
      bottomTitle: "Soulmar Podcast",
      bottomSubtitle: language === "es" ? "Dra. Mariana Caicedo" : "Dr. Mariana Caicedo",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
    },
  ], [language])

  const [searchResults, setSearchResults] = React.useState<SearchItem[]>([])
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [voiceError, setVoiceError] = React.useState<string | null>(null)
  const searchContainerRef = React.useRef<HTMLDivElement>(null)
  const recognitionInstanceRef = React.useRef<any>(null)

  const stopVoiceSearch = () => {
    if (recognitionInstanceRef.current) {
      try {
        recognitionInstanceRef.current.abort()
      } catch (e) {
        // ignore
      }
      recognitionInstanceRef.current = null
    }
    setIsListening(false)
  }

  const toggleVoiceSearch = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (isListening) {
      stopVoiceSearch()
      return
    }

    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceError(language === "es"
        ? "Reconocimiento de voz no soportado. Usa Chrome o Safari."
        : "Voice recognition not supported. Please use Chrome or Safari.")
      setTimeout(() => setVoiceError(null), 4000)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language === "en" ? "en-US" : (typeof navigator !== "undefined" && navigator.language?.startsWith("es") ? navigator.language : "es-CO")
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setIsSearchFocused(true)
        setVoiceError(null)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }
        const text = finalTranscript || interimTranscript
        if (text) {
          setMobileSearchQuery(text)
          setIsSearchFocused(true)
        }
      }

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error)
        setIsListening(false)
        recognitionInstanceRef.current = null

        // Silently ignore normal dismissals/timeouts
        if (event.error === "no-speech" || event.error === "aborted") {
          return
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceError(language === "es"
            ? "Permite el micrófono en los ajustes de tu navegador."
            : "Please allow microphone access in your browser.")
          setTimeout(() => setVoiceError(null), 4000)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        recognitionInstanceRef.current = null
      }

      recognitionInstanceRef.current = recognition
      recognition.start()
    } catch (err: any) {
      console.error("Speech recognition error on start:", err)
      setIsListening(false)
      recognitionInstanceRef.current = null
      setVoiceError(language === "es"
        ? "No se pudo iniciar el micrófono. Revisa los permisos."
        : "Could not start microphone. Check permissions.")
      setTimeout(() => setVoiceError(null), 4000)
    }
  }

  // Actualizar resultados en tiempo real con motor difuso y semántico
  React.useEffect(() => {
    if (!mobileSearchQuery || mobileSearchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }
    const results = searchSoulmar(mobileSearchQuery)
    setSearchResults(results)
  }, [mobileSearchQuery])

  // Cerrar dropdown al hacer clic afuera
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectSearchResult = (item: SearchItem) => {
    setIsSearchFocused(false)
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer")
      return
    }
    if (item.targetId) {
      const el = document.getElementById(item.targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0])
      return
    }
    const q = mobileSearchQuery.toLowerCase().trim()
    if (!q) {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
      return
    }
    const results = searchSoulmar(q)
    if (results.length > 0) {
      handleSelectSearchResult(results[0])
    } else {
      document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const mobileModules = React.useMemo(() => [
    {
      id: "ansiedad",
      image: "/images/mobile-modules/ansiedad.jpg",
      desktopImage: "/images/desktop-modules/ansiedad.jpg",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
    },
    {
      id: "depresion",
      image: "/images/mobile-modules/depresion.png",
      desktopImage: "/images/desktop-modules/tristeza.png",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
    },
    {
      id: "emuna",
      image: "/images/mobile-modules/emuna.png",
      desktopImage: "/images/desktop-modules/emuna.png",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
    },
    {
      id: "mindset",
      image: "/images/mobile-modules/mindset.png",
      desktopImage: "/images/desktop-modules/mindset.png",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
    },
  ], [])

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
    // 1. Defer fetch to idle time to guarantee 100% smooth First Input and initial render
    const executeWhenIdle = (cb: () => void) => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        ;(window as any).requestIdleCallback(cb, { timeout: 2000 })
      } else {
        setTimeout(cb, 350)
      }
    }

    executeWhenIdle(() => {
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
          const targetSlotNorm = normalizeTime(slot)
          const isBooked = appointments.some((app: any) => {
            return (
              app.appointment_date === formattedDate &&
              app.status !== "cancelled" &&
              normalizeTime(app.appointment_time) === targetSlotNorm
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
    }) // end executeWhenIdle
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
          HERO SECTION UNIFICADO (DISEÑO MODERNO CON EXPERIENCIA COMPLETA EN MÓVIL Y COMPUTADOR)
          Caja carrusel destacada (3 fotos) + Barra de búsqueda Cristal Líquido + Slogan + Grid 4 Cajas YouTube
          ========================================================================= */}
      <div className="flex flex-col w-full pt-4 md:pt-10 pb-12 px-3.5 sm:px-6 md:px-10 max-w-7xl mx-auto space-y-6 md:space-y-10 relative z-10">
        
        {/* FILA SUPERIOR DESKTOP: CAJA DESTACADA EN FORMATO PREMIUM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full">
          
          {/* CAJA PRINCIPAL DE FOTOS (CARRUSEL DE 3 FOTOS) - Ratio 3:4 o adaptado en PC */}
          <div className="lg:col-span-7 xl:col-span-8 w-full relative z-30">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/10] rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col justify-between p-5 md:p-8 select-none bg-black/5 border border-black/5 dark:border-white/10 group">
              
              {/* IMAGEN DEL CARRUSEL DENTRO DE UN CONTENEDOR CON ROUNDED Y OVERFLOW-HIDDEN AISLADO */}
              <div className="absolute inset-0 w-full h-full rounded-[32px] md:rounded-[40px] overflow-hidden pointer-events-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMobileSlide}
                    initial={{ opacity: 0, scale: 1.02 }}
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
                    {/* Versión Móvil */}
                    <Image
                      src={mobileSlides[currentMobileSlide].image}
                      alt={mobileSlides[currentMobileSlide].bottomTitle || "Soulmar"}
                      fill
                      quality={100}
                      unoptimized
                      priority={currentMobileSlide === 0}
                      sizes="(max-width: 768px) 100vw, 1200px"
                      className={`object-cover object-center select-none ${
                        (mobileSlides[currentMobileSlide] as any).desktopImage ? "md:hidden" : ""
                      }`}
                    />
                    {/* Versión PC exclusiva en ultra alta calidad */}
                    {(mobileSlides[currentMobileSlide] as any).desktopImage && (
                      <Image
                        src={(mobileSlides[currentMobileSlide] as any).desktopImage}
                        alt={mobileSlides[currentMobileSlide].bottomTitle || "Soulmar"}
                        fill
                        quality={100}
                        unoptimized
                        priority={currentMobileSlide === 0}
                        sizes="(max-width: 1200px) 100vw, 1600px"
                        className="hidden md:block object-cover object-center select-none"
                      />
                    )}
                    {/* Sutil viñeta para legibilidad y elegancia visual */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ARRIBA DE LA TARJETA: INDICADORES DE CARRUSEL (PUNTOS INTERACTIVOS) */}
              <div className="relative z-10 flex items-center justify-end w-full">
                {/* INDICADOR DE FOTOS */}
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-md">
                  {mobileSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMobileSlide(idx)}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        currentMobileSlide === idx
                          ? "w-6 h-1.5 bg-white"
                          : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Foto ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* ABAJO: BARRA DE BÚSQUEDA INTELIGENTE CON EFECTO DE CRISTAL LÍQUIDO */}
              <div ref={searchContainerRef} className="relative z-50 w-full max-w-xl mx-auto">
                <form
                  onSubmit={handleMobileSearch}
                  className="liquid-glass w-full h-[52px] md:h-[58px] rounded-full flex items-center gap-3 pl-4 md:pl-5 pr-2 shadow-2xl border border-white/40"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-white/90 shrink-0 stroke-[2.2]" />
                  <input
                    type="search"
                    value={mobileSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => {
                      setMobileSearchQuery(e.target.value)
                      setIsSearchFocused(true)
                    }}
                    placeholder={
                      voiceError
                        ? voiceError
                        : isListening
                        ? (language === "es" ? "Escuchando... Di lo que necesitas" : "Listening... Say what you need")
                        : (language === "es" ? "¿Qué necesitas hoy? (Ej: depresión, cita, ansiedad, libros)..." : "What do you need today? (e.g. depression, booking, anxiety)...")
                    }
                    className={`flex-1 min-w-0 bg-transparent text-[13.5px] md:text-[15px] font-medium text-white outline-none border-none p-0 ${
                      voiceError ? "placeholder:text-amber-200" : "placeholder:text-white/70"
                    }`}
                  />
                  {mobileSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileSearchQuery("")
                        setSearchResults([])
                      }}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer mr-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* BOTÓN DE BÚSQUEDA POR VOZ (MICRÓFONO INTELIGENTE) */}
                  <button
                    type="button"
                    onClick={toggleVoiceSearch}
                    aria-label={isListening ? "Detener búsqueda por voz" : "Búsqueda por voz"}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
                      isListening
                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse scale-105"
                        : "bg-white/20 hover:bg-white/30 text-white active:scale-90"
                    }`}
                  >
                    {isListening ? (
                      <Mic className="w-4 h-4 md:w-4.5 md:h-4.5 animate-bounce stroke-[2.5]" />
                    ) : (
                      <Mic className="w-4 h-4 md:w-4.5 md:h-4.5 stroke-[2.2]" />
                    )}
                  </button>

                  <button
                    type="submit"
                    aria-label="Buscar"
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full liquid-glass-pill flex items-center justify-center shrink-0 text-white cursor-pointer active:scale-90 hover:scale-105 transition-transform"
                  >
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                  </button>
                </form>

                {/* DROPDOWN INTELIGENTE DE RESULTADOS EN TIEMPO REAL FLOTANDO POR ENCIMA DE TODO */}
                <AnimatePresence>
                  {isSearchFocused && mobileSearchQuery.trim().length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="absolute left-0 right-0 top-[58px] md:top-[66px] bg-white/98 dark:bg-[#121214]/98 backdrop-blur-2xl rounded-[28px] border border-white/80 dark:border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-3 z-[9999] overflow-hidden max-h-[380px] overflow-y-auto no-scrollbar"
                    >
                      {searchResults.length > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-3 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 text-[#8da9c4]">
                              <Sparkles className="w-3.5 h-3.5 text-[#8da9c4]" />
                              {language === "es" ? "Coincidencias encontradas" : "Best matches"}
                            </span>
                            <span>{searchResults.length} resultados</span>
                          </div>

                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectSearchResult(item)}
                              className="w-full text-left p-3 rounded-2xl hover:bg-[#8da9c4]/15 dark:hover:bg-white/10 transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-[13.5px] font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#8da9c4] transition-colors truncate">
                                    {item.title}
                                  </h5>
                                  {item.badge && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8da9c4]/15 text-[#8da9c4] uppercase tracking-wider shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.subtitle && (
                                  <p className="text-[11.5px] font-semibold text-neutral-500 dark:text-neutral-400 truncate">
                                    {item.subtitle}
                                  </p>
                                )}
                                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 line-clamp-1">
                                  {item.description}
                                </p>
                              </div>

                              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-600 dark:text-white shrink-0 group-hover:bg-[#8da9c4] group-hover:text-white transition-all">
                                {item.href ? (
                                  <ExternalLink className="w-3.5 h-3.5" />
                                ) : (
                                  <ArrowRight className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center space-y-1">
                          <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
                            {language === "es" ? `¿No encuentras "${mobileSearchQuery}"?` : `No direct results for "${mobileSearchQuery}"`}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {language === "es" 
                              ? "Puedes consultar nuestras terapias o agendar una sesión de valoración."
                              : "You can explore our therapies or book an initial assessment."}
                          </p>
                          <div className="pt-2 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchFocused(false)
                                document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
                              }}
                              className="text-[11px] font-bold text-[#8da9c4] hover:underline"
                            >
                              Ver terapias →
                            </button>
                            <span className="text-neutral-300">•</span>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSearchFocused(false)
                                document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                              }}
                              className="text-[11px] font-bold text-[#8da9c4] hover:underline"
                            >
                              Agendar cita →
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* LADO DERECHO EN COMPUTADOR: TARJETAS DE SERVICIOS Y VALOR CLÍNICO */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col justify-between gap-4 h-full">
            {/* Card 1: Próxima cita directa */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 rounded-[28px] p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-neutral-300 dark:hover:border-white/20 transition-all">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-[#8da9c4] uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8da9c4]" />
                  {language === "es" ? "Próxima sesión disponible" : "Next available session"}
                </span>
                <p className="text-[20px] font-black text-neutral-900 dark:text-white leading-tight tracking-tight whitespace-nowrap">{displaySlot}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {language === "es" ? "Modalidad 100% online, privada y confidencial con la Dra. Mariana Caicedo." : "100% online, private and confidential with Dr. Mariana Caicedo."}
                </p>
              </div>
              <Link 
                href="/#agendamiento" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full"
              >
                <Button className="w-full bg-[#8da9c4] hover:bg-[#7b9ab8] text-white font-black text-xs uppercase tracking-widest rounded-full h-11 shadow-md transition-all duration-300 border-none cursor-pointer">
                  {t('hero.cta_secondary')}
                </Button>
              </Link>
            </div>

            {/* Card 2: TARJETA INTERCAMBIABLE ULTRA-FLUIDA (APPLE SMOOTH WHEEL) */}
            <div className="relative w-full h-[105px] rounded-[28px] overflow-hidden [perspective:800px] transform-gpu">
              <AnimatePresence initial={false}>
                {activeInfoCardIndex === 0 && (
                  <motion.div
                    key="card-proceso"
                    initial={{ opacity: 0, y: -24, rotateX: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, rotateX: 20, scale: 0.98 }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute inset-0 bg-neutral-900 border border-white/10 rounded-[28px] p-5 shadow-lg flex items-center justify-between text-white hover:border-white/20 transition-colors select-none transform-gpu will-change-transform"
                  >
                    <div className="space-y-1 max-w-[210px]">
                      <span className="text-[9px] font-black text-[#8da9c4] uppercase tracking-widest block font-sans">
                        {language === "es" ? "Proceso sin prisa" : "Unhurried process"}
                      </span>
                      <p className="text-xs font-bold text-neutral-300 leading-tight">
                        {language === "es" ? "Cada sesión avanza al ritmo que tú necesitas." : "Each session progresses at the pace you need."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <motion.span
                          key={val}
                          className="w-[5px] bg-[#8da9c4] rounded-full"
                          animate={{
                            scaleY: [0.3, 1.2, 0.3],
                            backgroundColor: ["#8da9c4", "#c9cba3", "#8da9c4"]
                          }}
                          transition={{
                            duration: 1.5 + (val * 0.25),
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{ height: '36px', transformOrigin: 'center' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeInfoCardIndex === 1 && (
                  <motion.div
                    key="card-modalidad"
                    initial={{ opacity: 0, y: -24, rotateX: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, rotateX: 20, scale: 0.98 }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute inset-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/15 rounded-[28px] p-5 shadow-lg flex flex-col justify-between text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-white/25 transition-colors select-none transform-gpu will-change-transform"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">
                        {language === "es" ? "Modalidad" : "Modality"}
                      </span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">
                        {language === "es" ? "Terapia donde tú estés" : "Therapy wherever you are"}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight line-clamp-1">
                        {language === "es" ? "Conéctate desde casa, el trabajo o donde te sientas cómodo/a." : "Connect from home, work, or wherever you feel comfortable."}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8da9c4]" />
                      <span className="text-[9px] font-bold text-[#8da9c4] uppercase tracking-wider">Online</span>
                    </div>
                  </motion.div>
                )}

                {activeInfoCardIndex === 2 && (
                  <motion.div
                    key="card-psicologa"
                    initial={{ opacity: 0, y: -24, rotateX: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, rotateX: 20, scale: 0.98 }}
                    transition={{
                      duration: 0.95,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="absolute inset-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/90 dark:border-white/15 rounded-[28px] p-5 shadow-lg flex flex-col justify-between text-neutral-900 dark:text-white hover:border-neutral-300 dark:hover:border-white/25 transition-colors select-none transform-gpu will-change-transform"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                        {language === "es" ? "Tu psicóloga" : "Your psychologist"}
                      </span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white leading-tight">
                        Dra. Mariana Caicedo
                      </h4>
                      <p className="text-[10px] text-[#8da9c4] font-bold uppercase tracking-wider">
                        {language === "es" ? "Psicóloga Clínica • Terapia Online" : "Clinical Psychologist • Online Therapy"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
                      <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        {language === "es" ? "Disponible" : "Available"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Card 3: Espacio Seguro */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 rounded-[28px] p-5 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#1D9E75]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                  {language === "es" ? "Confidencialidad absoluta" : "Absolute confidentiality"}
                </h4>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {language === "es" ? "Un espacio seguro diseñado para ti" : "A safe space designed for you"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SLOGAN SOULMAR: "Tu alma, Tu historia, Tu momento" (Centrado al 100%, responsive fluido en móviles para no cortarse) */}
        <div className="w-full pt-8 md:pt-14 pb-6 md:pb-10 text-center px-4 flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.08] sm:leading-[1.02] md:leading-[0.96] font-sans text-center max-w-full">
            {language === "es" ? (
              <>
                <span className="block text-center">
                  <span>Tu alma</span>,{" "}
                  <span className="text-[#8da9c4]">Tu historia,</span>
                </span>
                <span className="block text-[#c9cba3] text-center -mt-0.5 sm:-mt-1 md:-mt-1.5">
                  Tu momento
                </span>
              </>
            ) : (
              <>
                <span className="block text-center">
                  <span>Your soul</span>,{" "}
                  <span className="text-[#8da9c4]">Your story,</span>
                </span>
                <span className="block text-[#c9cba3] text-center -mt-0.5 sm:-mt-1 md:-mt-1.5">
                  Your moment
                </span>
              </>
            )}
          </h2>
        </div>

        {/* MÓDULOS DE CONTENIDO: 4 CAJAS CON FOTO COMPLETA (FULL BLEED) Y BOTÓN DE YOUTUBE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-2">
          {mobileModules.map((mod) => (
            <Link
              key={mod.id}
              href={mod.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full aspect-[3/4] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg border border-black/5 dark:border-white/10 flex flex-col justify-start p-3 md:p-4 select-none active:scale-[0.98] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Foto para versión móvil (intacta) */}
              <Image
                src={mod.image}
                alt={mod.id}
                fill
                quality={100}
                unoptimized
                className="md:hidden object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Foto exclusiva para versión de computador (PC) en máxima calidad */}
              <Image
                src={mod.desktopImage}
                alt={mod.id}
                fill
                quality={100}
                unoptimized
                className="hidden md:block object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Botón único de reproducir en la esquina superior derecha */}
              <div className="relative z-10 flex justify-end w-full">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-neutral-900 dark:text-white flex items-center justify-center shrink-0 shadow-lg group-hover:bg-[#8da9c4] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <Play className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  )
}
