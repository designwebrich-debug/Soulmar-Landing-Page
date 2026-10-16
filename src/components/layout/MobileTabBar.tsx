"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Sparkles, Calendar, BookOpen, Search, Moon, Sun, X, Mic, ExternalLink, ArrowRight } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"
import { searchSoulmar, type SearchItem } from "@/lib/searchDatabase"

export function MobileTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useTranslation()
  const { setTheme, resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<string>("home")
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isOverLightBg, setIsOverLightBg] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const recognitionInstanceRef = useRef<any>(null)

  const isDarkMode = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-focus input when search mode activates
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setSearchQuery("")
    }
  }, [isSearching])

  // Auto-detect section on scroll (Apple-like Dynamic Island navigation)
  useEffect(() => {
    if (pathname !== "/" || isSearching) return

    const handleScroll = () => {
      const scrollPos = window.scrollY + 280
      const ebooksEl = document.getElementById("ebooks")
      const bookingEl = document.getElementById("agendamiento")
      const servicesEl = document.getElementById("servicios")

      if (ebooksEl && scrollPos >= ebooksEl.offsetTop) {
        setActiveTab("ebooks")
      } else if (bookingEl && scrollPos >= bookingEl.offsetTop) {
        setActiveTab("booking")
      } else if (servicesEl && scrollPos >= servicesEl.offsetTop) {
        setActiveTab("services")
      } else if (window.scrollY < 300) {
        setActiveTab("home")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname, isSearching])

  // Smart Contrast: Real-time background luminance detector under the floating dock
  useEffect(() => {
    let ticking = false

    const detectUnderlyingLuminance = () => {
      if (typeof window === "undefined" || typeof document === "undefined") return

      // Sample coordinates at the vertical position of the floating menu (~50px from bottom)
      const sampleY = Math.max(10, window.innerHeight - 50)
      const sampleX = window.innerWidth / 2

      try {
        const elements = document.elementsFromPoint(sampleX, sampleY)
        if (!elements || elements.length === 0) {
          setIsOverLightBg(isDarkMode ? false : true)
          return
        }

        let detectedLight: boolean | null = null

        for (const el of elements) {
          // Skip the floating dock itself and any non-content wrapper
          if (el.closest('[data-floating-dock="true"]')) continue
          if (el.tagName === "HTML") continue

          // Direct check for known light sections
          if (el.closest("#como-empezar")) {
            detectedLight = true
            break
          }

          // Inspect computed background color up the DOM tree
          let cur: HTMLElement | null = el as HTMLElement
          while (cur && cur !== document.body && cur !== document.documentElement) {
            const style = window.getComputedStyle(cur)
            const bg = style.backgroundColor
            if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
              const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
              if (match) {
                const r = parseInt(match[1], 10)
                const g = parseInt(match[2], 10)
                const b = parseInt(match[3], 10)
                const a = match[4] !== undefined ? parseFloat(match[4]) : 1
                if (a > 0.25) {
                  // ITU-R BT.709 relative luminance formula
                  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                  detectedLight = lum > 0.52
                  break
                }
              }
            }
            cur = cur.parentElement
          }

          if (detectedLight !== null) break
        }

        if (detectedLight !== null) {
          setIsOverLightBg(detectedLight)
        } else {
          // Default based on active theme
          setIsOverLightBg(!isDarkMode)
        }
      } catch {
        setIsOverLightBg(!isDarkMode)
      }
    }

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          detectUnderlyingLuminance()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial check
    detectUnderlyingLuminance()

    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [isDarkMode])



  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(10)
      } catch {
        // ignore
      }
    }
  }

  // Smooth scroll & navigation helper
  const handleTabClick = (tabId: string) => {
    triggerHaptic()
    setActiveTab(tabId)

    if (tabId === "home") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        window.location.href = "/"
      }
    } else if (tabId === "services") {
      const el = document.getElementById("servicios")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.href = "/#servicios"
      }
    } else if (tabId === "booking") {
      const el = document.getElementById("agendamiento")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.href = "/#agendamiento"
      }
    } else if (tabId === "ebooks") {
      const el = document.getElementById("ebooks")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        window.location.href = "/#ebooks"
      }
    }
  }

  const toggleTheme = () => {
    triggerHaptic()
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

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
        ? "Micrófono no soportado en este navegador."
        : "Voice recognition not supported in this browser.")
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
          setSearchQuery(text)
        }
      }

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error in MobileTabBar:", event.error)
        setIsListening(false)
        recognitionInstanceRef.current = null

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
      console.error("Speech recognition error on start in MobileTabBar:", err)
      setIsListening(false)
      recognitionInstanceRef.current = null
      setVoiceError(language === "es"
        ? "No se pudo iniciar el micrófono."
        : "Could not start microphone.")
      setTimeout(() => setVoiceError(null), 4000)
    }
  }

  // Actualizar resultados en tiempo real con motor inteligente difuso y semántico
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }
    const results = searchSoulmar(searchQuery)
    setSearchResults(results)
  }, [searchQuery])

  const handleSelectSearchResult = (item: SearchItem) => {
    closeSearch()
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer")
      return
    }
    if (item.targetId) {
      const el = document.getElementById(item.targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        router.push(`/#${item.targetId}`)
      }
    }
  }

  const openSearch = () => {
    triggerHaptic()
    setIsSearching(true)
  }

  const closeSearch = () => {
    triggerHaptic()
    stopVoiceSearch()
    setIsSearching(false)
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle Search Submission (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleSelectSearchResult(searchResults[0])
      return
    }
    const q = searchQuery.toLowerCase().trim()
    if (!q) return

    const results = searchSoulmar(q)
    if (results.length > 0) {
      handleSelectSearchResult(results[0])
    } else {
      closeSearch()
      const el = document.getElementById("servicios")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else window.location.href = "/#servicios"
    }
  }

  const navTabs = [
    {
      id: "home",
      label: language === "es" ? "Inicio" : "Home",
      icon: Home,
    },
    {
      id: "services",
      label: language === "es" ? "Terapias" : "Services",
      icon: Sparkles,
    },
    {
      id: "booking",
      label: language === "es" ? "Agendar" : "Book",
      icon: Calendar,
    },
    {
      id: "ebooks",
      label: language === "es" ? "Libros & PDFs" : "Ebooks",
      icon: BookOpen,
    },
  ]

  if (!mounted || pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <div
      data-floating-dock="true"
      className="md:hidden fixed bottom-6 left-0 right-0 z-[9990] flex items-center justify-center gap-2 pointer-events-none px-3"
    >
      {/* ================= 1. MODO CLARO / OSCURO EN SU PROPIO CÍRCULO (IZQUIERDA) ================= */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!isSearching && (
          <motion.button
            key="theme-circle"
            onClick={toggleTheme}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ borderRadius: 9999 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "liquid-glass w-[52px] h-[52px] shrink-0 flex items-center justify-center pointer-events-auto cursor-pointer select-none rounded-full",
              isOverLightBg && "liquid-glass-light-bg"
            )}
            aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            <span
              className={cn(
                "relative z-10 transition-colors duration-300",
                isOverLightBg
                  ? "text-neutral-800 hover:text-black"
                  : "text-white/80 hover:text-white"
              )}
            >
              {isDarkMode ? (
                <Sun className="w-[19px] h-[19px] stroke-[2.2]" />
              ) : (
                <Moon className="w-[19px] h-[19px] stroke-[2.2]" />
              )}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ================= 2. DOCK PRINCIPAL (Cristal líquido transparente) ================= */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!isSearching && (
          <motion.nav
            key="liquid-dock"
            aria-label="Liquid Glass Dock"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            style={{ borderRadius: 9999 }}
            className={cn(
              "liquid-glass flex items-center gap-1 p-1.5 pointer-events-auto origin-center",
              isOverLightBg && "liquid-glass-light-bg"
            )}
          >
            {/* 1. Inicio, 2. Terapias, 3. Agendar, 4. Libros & PDFs */}
            {navTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "relative z-10 flex items-center justify-center w-10 h-10 rounded-full",
                    "transition-transform active:scale-90 select-none cursor-pointer"
                  )}
                  aria-label={tab.label}
                  title={tab.label}
                >
                  {/* Active liquid drop (Spring Physics) */}
                  {isActive && (
                    <motion.div
                      layoutId="liquidActiveTabPill"
                      className="absolute inset-0 rounded-full liquid-glass-pill"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 flex items-center justify-center transition-colors duration-300",
                      isActive
                        ? "text-[#8da9c4]"
                        : isOverLightBg
                        ? "text-neutral-700 hover:text-black"
                        : "text-white/75 hover:text-white"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                  </span>
                </button>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ================= 3. LUPA EN SU PROPIO CÍRCULO (DERECHA) O BARRA EXPANDIDA ================= */}
      {isSearching ? (
        <div className="relative flex-1 max-w-md pointer-events-auto">
          {/* DROPDOWN FLOTANTE INTELIGENTE POR ENCIMA DE LA BARRA INFERIOR */}
          <AnimatePresence>
            {searchQuery.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-[62px] left-0 right-0 bg-white/98 dark:bg-[#161618]/98 backdrop-blur-2xl rounded-[26px] border border-black/10 dark:border-white/15 shadow-[0_-15px_40px_rgba(0,0,0,0.3)] p-3 z-50 overflow-hidden max-h-[340px] overflow-y-auto no-scrollbar"
              >
                {searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2.5 py-1 text-[10.5px] font-bold text-neutral-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-[#8da9c4]">
                        <Sparkles className="w-3 h-3 text-[#8da9c4]" />
                        {language === "es" ? "Coincidencias encontradas" : "Best matches"}
                      </span>
                      <span>{searchResults.length} resultados</span>
                    </div>

                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full text-left p-2.5 rounded-2xl hover:bg-[#8da9c4]/15 dark:hover:bg-white/10 transition-colors flex items-start justify-between gap-2.5 group cursor-pointer"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-[13px] font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#8da9c4] transition-colors truncate">
                              {item.title}
                            </h5>
                            {item.badge && (
                              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-[#8da9c4]/15 text-[#8da9c4] uppercase tracking-wider shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 truncate">
                              {item.subtitle}
                            </p>
                          )}
                          <p className="text-[10.5px] text-neutral-400 dark:text-neutral-500 line-clamp-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-600 dark:text-white shrink-0 group-hover:bg-[#8da9c4] group-hover:text-white transition-all">
                          {item.href ? (
                            <ExternalLink className="w-3 h-3" />
                          ) : (
                            <ArrowRight className="w-3 h-3" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center space-y-1">
                    <p className="text-[12.5px] font-semibold text-neutral-500 dark:text-neutral-400">
                      {language === "es" ? "No se encontraron coincidencias directas" : "No exact matches found"}
                    </p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                      {language === "es" ? "Presiona Buscar o di tu consulta con el micrófono" : "Press Search or speak your query"}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            key="search-bar"
            layoutId="liquid-search-glass"
            onSubmit={handleSearchSubmit}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ borderRadius: 9999 }}
            className={cn(
              "liquid-glass w-full h-[52px] flex items-center gap-2 pl-3.5 pr-1.5",
              isOverLightBg && "liquid-glass-light-bg"
            )}
          >
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              className="relative z-10 flex items-center w-full gap-2"
            >
              <Search
                className={cn(
                  "w-4 h-4 shrink-0 stroke-[2.2] transition-colors duration-300",
                  isOverLightBg ? "text-neutral-700" : "text-white/80"
                )}
              />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  voiceError
                    ? voiceError
                    : isListening
                    ? (language === "es" ? "Escuchando... Di lo que buscas" : "Listening... Speak now")
                    : (language === "es" ? "Buscar en Soulmar..." : "Search in Soulmar...")
                }
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-[14.5px] font-semibold outline-none border-none p-0 transition-colors duration-300",
                  isOverLightBg
                    ? "text-neutral-900 placeholder:text-neutral-500"
                    : "text-white placeholder:text-white/60",
                  voiceError && "placeholder:text-amber-300"
                )}
              />

              {/* Botón para limpiar texto si escribió algo */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  aria-label="Limpiar texto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Botón de Micrófono por voz */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                aria-label={isListening ? "Detener micrófono" : "Buscar por voz"}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer",
                  isListening
                    ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse scale-105"
                    : isOverLightBg
                    ? "bg-black/10 hover:bg-black/20 text-neutral-800"
                    : "bg-white/20 hover:bg-white/30 text-white"
                )}
              >
                <Mic className={cn("w-4 h-4", isListening ? "animate-bounce stroke-[2.5]" : "stroke-[2.2]")} />
              </button>

              {/* Botón de Cancelar / Cerrar barra */}
              <button
                type="button"
                onClick={closeSearch}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0 liquid-glass-pill",
                  "active:scale-90 transition-transform cursor-pointer",
                  isOverLightBg ? "text-neutral-800" : "text-white"
                )}
                aria-label="Cerrar búsqueda"
                title="Cerrar"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          </motion.form>
        </div>
      ) : (
        <motion.button
          key="search-circle"
          layoutId="liquid-search-glass"
          onClick={openSearch}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ borderRadius: 9999 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "liquid-glass w-[52px] h-[52px] shrink-0 flex items-center justify-center pointer-events-auto cursor-pointer select-none rounded-full",
            isOverLightBg && "liquid-glass-light-bg"
          )}
          aria-label={language === "es" ? "Buscar en la web" : "Search site"}
          title={language === "es" ? "Buscar" : "Search"}
        >
          <span
            className={cn(
              "relative z-10 transition-colors duration-300",
              isOverLightBg
                ? "text-neutral-800 hover:text-black"
                : "text-white/80 hover:text-white"
            )}
          >
            <Search className="w-[19px] h-[19px] stroke-[2.4]" />
          </span>
        </motion.button>
      )}
    </div>
  )
}
