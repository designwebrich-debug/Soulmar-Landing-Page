"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/Button"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { WHATSAPP_LINK } from "@/lib/constants"

const navItems = [
  { key: "home", href: "/" },
  { key: "therapies", href: "/#caja-terapias" },
  { key: "tutorial", href: "/#como-empezar" },
  { key: "agendar", href: "/sobre-mi" },
  { key: "follow_us", href: "/#comunidad" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeKey, setActiveKey] = useState<string>("home")
  const pathname = usePathname()
  const { language, setLanguage, t } = useTranslation()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, key: string, href: string) => {
    setActiveKey(key)

    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (pathname !== "/") return

    if (href === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (href.startsWith("/#")) {
      e.preventDefault()
      const id = href.replace("/#", "")
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      if (pathname === "/sobre-mi") {
        setActiveKey("agendar")
        return
      }

      if (pathname !== "/") return

      const scrollPos = window.scrollY + 280
      const comunidadEl = document.getElementById("comunidad")
      const agendamientoEl = document.getElementById("caja-agendamiento") || document.getElementById("agendamiento")
      const tutorialEl = document.getElementById("como-empezar")
      const therapiesEl = document.getElementById("caja-terapias") || document.getElementById("servicios")

      if (comunidadEl && scrollPos >= comunidadEl.offsetTop) {
        setActiveKey("follow_us")
      } else if (agendamientoEl && scrollPos >= agendamientoEl.offsetTop) {
        setActiveKey("agendar")
      } else if (tutorialEl && scrollPos >= tutorialEl.offsetTop) {
        setActiveKey("tutorial")
      } else if (therapiesEl && scrollPos >= therapiesEl.offsetTop) {
        setActiveKey("therapies")
      } else if (window.scrollY < 300) {
        setActiveKey("home")
      }
    }
    
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return (
    <>
      {/* MOBILE TOP BAR (Diseño original de la mañana) */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[999] h-16 md:hidden transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-in-out border-b border-transparent transform-gpu flex items-center px-4",
          isScrolled
            ? "bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md shadow-xs border-neutral-200/60 dark:border-white/10"
            : "bg-transparent"
        )}
      >
        <div className="w-full flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link 
            href="/" 
            onClick={(e) => handleNavClick(e, "home", "/")}
            className="flex items-center"
          >
            <div className="relative w-36 h-9">
              <Image 
                src="/logo-horizontal.png" 
                alt="Soulmar" 
                fill
                quality={90}
                className="object-contain"
                priority
                sizes="144px"
              />
            </div>
          </Link>

          {/* RIGHT: WhatsApp icon + Language pill button (Original) */}
          <div className="flex items-center gap-1.5 ml-auto">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-neutral-500/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-transform active:scale-90 select-none cursor-pointer"
              aria-label="WhatsApp"
              title="Chat en WhatsApp"
            >
              <MessageCircle className="w-[18px] h-[18px] stroke-[2.2]" />
            </a>
            <button
              type="button"
              className="h-9 px-3 rounded-full font-bold text-xs tracking-wider bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground/80 flex items-center justify-center active:scale-90 transition-all border border-black/[0.06] dark:border-white/10 cursor-pointer"
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              aria-label="Cambiar idioma"
            >
              {language === "es" ? "ES / EN" : "EN / ES"}
            </button>
          </div>
        </div>
      </header>

      {/* DESKTOP & IPAD FLOATING CAPSULE */}
      <header className="hidden md:block fixed top-2.5 sm:top-3 md:top-4 inset-x-0 z-[999] pointer-events-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-10">
        <div
          className={cn(
            "relative pointer-events-auto w-full h-14 sm:h-16 rounded-full px-5 sm:px-7 md:px-8 flex items-center justify-between transition-all duration-300 ease-out overflow-hidden",
            isScrolled
              ? "bg-white/94 dark:bg-[#111113]/94 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/80 dark:border-white/15 shadow-[0_16px_45px_-8px_rgba(0,0,0,0.12),inset_0_1.5px_0_rgba(255,255,255,0.95)] dark:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.6),inset_0_1.5px_0_rgba(255,255,255,0.25)]"
              : "bg-transparent border-transparent shadow-none backdrop-blur-none"
          )}
        >
          {/* Apple Optical Lens Specular Glare (solo visible cuando se activa la píldora al hacer scroll) */}
          <div 
            className={cn(
              "absolute inset-x-6 top-0 h-[46%] rounded-t-full bg-gradient-to-b from-white/70 dark:from-white/12 via-white/15 dark:via-white/3 to-transparent pointer-events-none z-0 transition-opacity duration-300",
              isScrolled ? "opacity-100" : "opacity-0"
            )} 
          />
          
          {/* Bottom Refracted Light Catch */}
          <div 
            className={cn(
              "absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none z-0 transition-opacity duration-300",
              isScrolled ? "opacity-100" : "opacity-0"
            )} 
          />

          {/* LEFT: Logo */}
          <div className="flex items-center shrink-0 z-10">
            <Link 
              href="/" 
              onClick={(e) => handleNavClick(e, "home", "/")}
              className="flex items-center group"
            >
              <div className="relative w-28 sm:w-32 md:w-36 h-7 sm:h-8 group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/logo-horizontal.png" 
                  alt="Soulmar" 
                  fill
                  quality={90}
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>
            </Link>
          </div>

          {/* CENTER: Navigation Links (Desktop & iPad) 100% Centered */}
          <nav className="flex items-center gap-1 lg:gap-2 absolute left-1/2 -translate-x-1/2 pointer-events-auto z-10">
            {navItems.map((item) => {
              const isActive = activeKey === item.key
              const label = item.key === "home" ? t("common.home") : t(`common.${item.key}`)

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.key, item.href)}
                  className={cn(
                    "text-xs sm:text-[13px] tracking-tight transition-colors duration-200 px-3 py-1.5 whitespace-nowrap cursor-pointer select-none",
                    isActive
                      ? "text-[#8da9c4] font-bold"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white font-medium"
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT: Actions (Desktop & iPad) - Restaurados a su diseño original */}
          <div className="flex items-center gap-2.5 lg:gap-3.5 shrink-0 z-10 ml-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-bold text-xs tracking-[0.05em]"
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
            >
              {language === "es" ? "ES / EN" : "EN / ES"}
            </Button>

            <ThemeToggle />

            <Link 
              href="/#agendamiento"
              onClick={(e) => handleNavClick(e, "agendar", "/#agendamiento")}
              className="h-9 px-5 rounded-full bg-[#8da9c4] hover:bg-[#7b9ab8] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <span>{t("common.book_now")}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  </>
  )
}
