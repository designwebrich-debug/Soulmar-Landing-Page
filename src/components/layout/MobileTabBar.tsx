"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Sparkles, Calendar, BookOpen, Search, Moon, Sun, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"

export function MobileTabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { language } = useTranslation()
  const { setTheme, resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<string>("home")
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isOverLightBg, setIsOverLightBg] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const openSearch = () => {
    triggerHaptic()
    setIsSearching(true)
  }

  const closeSearch = () => {
    triggerHaptic()
    setIsSearching(false)
    setSearchQuery("")
  }

  // Handle Search Submission (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.toLowerCase().trim()
    if (!q) return

    closeSearch()

    if (q.includes("ansiedad") || q.includes("depresion") || q.includes("mindset") || q.includes("ebook") || q.includes("libro") || q.includes("pdf")) {
      const el = document.getElementById("ebooks")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else window.location.href = "/#ebooks"
    } else if (q.includes("terapia") || q.includes("servicio") || q.includes("individual") || q.includes("pareja") || q.includes("familiar") || q.includes("estres") || q.includes("burnout")) {
      const el = document.getElementById("servicios")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else window.location.href = "/#servicios"
    } else if (q.includes("cita") || q.includes("agendar") || q.includes("reserva") || q.includes("mariana") || q.includes("sesion") || q.includes("precio")) {
      const el = document.getElementById("agendamiento")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else window.location.href = "/#agendamiento"
    } else if (q.includes("pasos") || q.includes("empezar") || q.includes("guia")) {
      const el = document.getElementById("como-empezar")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else window.location.href = "/#como-empezar"
    } else if (q.includes("camp") || q.includes("retiro")) {
      router.push("/retreats")
    } else if (q.includes("tienda") || q.includes("shop")) {
      router.push("/shop")
    } else {
      // Default fallback: scroll to services or highlight
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

      {/* ================= 3. LUPA EN SU PROPIO CÍRCULO (DERECHA) ================= */}
      {isSearching ? (
        <motion.form
          key="search-bar"
          layoutId="liquid-search-glass"
          onSubmit={handleSearchSubmit}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ borderRadius: 9999 }}
          className={cn(
            "liquid-glass flex-1 max-w-md h-[52px] flex items-center gap-2.5 pl-4 pr-1.5 pointer-events-auto",
            isOverLightBg && "liquid-glass-light-bg"
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.2 }}
            className="relative z-10 flex items-center w-full gap-2.5"
          >
            <Search
              className={cn(
                "w-5 h-5 shrink-0 stroke-[2.2] transition-colors duration-300",
                isOverLightBg ? "text-neutral-700" : "text-white/80"
              )}
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "es" ? "Buscar en Soulmar..." : "Search in Soulmar..."}
              className={cn(
                "flex-1 min-w-0 bg-transparent text-[16px] font-semibold outline-none border-none p-0 transition-colors duration-300",
                isOverLightBg
                  ? "text-neutral-900 placeholder:text-neutral-500"
                  : "text-white placeholder:text-white/60"
              )}
            />
            <button
              type="button"
              onClick={closeSearch}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 liquid-glass-pill",
                "active:scale-90 transition-transform cursor-pointer",
                isOverLightBg ? "text-neutral-800" : "text-white"
              )}
              aria-label="Cancelar búsqueda"
              title="Cancelar"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        </motion.form>
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
