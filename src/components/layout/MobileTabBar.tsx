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
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  // Don't show in admin panel
  if (pathname?.startsWith("/admin")) {
    return null
  }

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

  if (!mounted) return null

  const isDarkMode = resolvedTheme === "dark"

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-[9990] flex items-center justify-center pointer-events-none px-4">
      {/* Liquid Glass Capsule (Morphs between Compact Dock and Full Search Bar) */}
      <motion.nav
        aria-label="Liquid Glass Dock"
        layout
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className={cn(
          "relative flex items-center pointer-events-auto rounded-full",
          // Liquid Glass gradient background with extreme refraction
          "bg-gradient-to-b from-white/90 via-white/70 to-white/80",
          "dark:from-white/15 dark:via-white/[0.08] dark:to-white/10",
          "backdrop-blur-3xl backdrop-saturate-[200%]",
          // Micro translucent optical border
          "border border-white/80 dark:border-white/20",
          // Deep layered shadows + inner specular rim highlights
          "shadow-[0_20px_40px_-8px_rgba(0,0,0,0.18),0_8px_16px_-4px_rgba(0,0,0,0.06),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.95),inset_0_-1.5px_2px_0_rgba(0,0,0,0.04)]",
          "dark:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.6),0_8px_16px_-4px_rgba(0,0,0,0.3),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.25),inset_0_-1.5px_2px_0_rgba(0,0,0,0.2)]",
          isSearching ? "w-full max-w-md p-1.5 pl-3.5 pr-1.5" : "w-auto gap-1 p-1.5"
        )}
      >
        {/* Specular Liquid Glare - Top Curved Convex Reflection */}
        <div
          aria-hidden="true"
          className="absolute inset-x-4 top-[1px] h-[45%] rounded-t-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none opacity-80"
        />
        {/* Optical Sharp Rim Highlight */}
        <div
          aria-hidden="true"
          className="absolute -top-[0.5px] left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none opacity-90"
        />

        <AnimatePresence mode="wait">
          {isSearching ? (
            /* ================= MODE 2: MORPHED EXPANDED SEARCH BAR (SIN RECUADRO ARRIBA) ================= */
            <motion.form
              key="search-input-mode"
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="flex items-center w-full gap-2.5 relative z-10"
            >
              <Search className="w-5 h-5 text-neutral-400 shrink-0 stroke-[2.2]" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "es" ? "Buscar en Soulmar..." : "Search in Soulmar..."}
                className="flex-1 bg-transparent text-[16px] font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none border-none p-0"
              />
              
              {/* Cancel (X) Button to morph back to normal menu */}
              <button
                type="button"
                onClick={closeSearch}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  "bg-neutral-200/70 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20",
                  "text-neutral-600 dark:text-neutral-200 active:scale-90 transition-all cursor-pointer"
                )}
                aria-label="Cancelar búsqueda"
                title="Cancelar"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.form>
          ) : (
            /* ================= MODE 1: NORMAL MENU WITH ICONS ================= */
            <motion.div
              key="menu-icons-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1 relative z-10"
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
                      "relative flex items-center justify-center w-10 h-10 rounded-full",
                      "transition-transform active:scale-90 select-none cursor-pointer"
                    )}
                    aria-label={tab.label}
                    title={tab.label}
                  >
                    {/* Active Elevated Liquid White Capsule (Spring Physics) */}
                    {isActive && (
                      <motion.div
                        layoutId="liquidActiveTabPill"
                        className={cn(
                          "absolute inset-0 rounded-full",
                          "bg-white dark:bg-[#28282b]",
                          "shadow-[0_3px_10px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.08)]",
                          "border border-black/[0.04] dark:border-white/10"
                        )}
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}

                    {/* Tab Icon */}
                    <span
                      className={cn(
                        "relative z-10 flex items-center justify-center transition-colors duration-200",
                        isActive
                          ? "text-[#007aff] dark:text-[#38bdf8]"
                          : "text-neutral-500/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-[18px] h-[18px] stroke-[2.2]" />
                    </span>
                  </button>
                )
              })}

              {/* Divider line between Nav and Actions */}
              <div className="w-[1px] h-5 bg-black/10 dark:bg-white/15 mx-0.5" />

              {/* 5. Theme Toggle (MODO CLARO/OSCURO: ANTES DE LA LUPA, CON EL MISMO COLOR NEUTRO) */}
              <button
                onClick={toggleTheme}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full",
                  "text-neutral-500/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                  "transition-transform active:scale-90 select-none cursor-pointer"
                )}
                aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              >
                {isDarkMode ? (
                  <Sun className="w-[18px] h-[18px] stroke-[2.2] transition-transform duration-300" />
                ) : (
                  <Moon className="w-[18px] h-[18px] stroke-[2.2] transition-transform duration-300" />
                )}
              </button>

              {/* 6. Search Button (LUPA DE BÚSQUEDA: AHORA ES EL ÚLTIMO ICONO DE LA BARRA AL EXTREMO DERECHO) */}
              <button
                onClick={openSearch}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full",
                  "text-neutral-500/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                  "transition-transform active:scale-90 select-none cursor-pointer"
                )}
                aria-label={language === "es" ? "Buscar en la web" : "Search site"}
                title={language === "es" ? "Buscar" : "Search"}
              >
                <Search className="w-[18px] h-[18px] stroke-[2.2]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  )
}
