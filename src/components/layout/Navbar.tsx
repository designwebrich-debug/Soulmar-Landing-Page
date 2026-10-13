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

const navLinks = [
  { key: "therapies", href: "/#agendamiento" },
  { key: "ebooks", href: "/#ebooks" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useTranslation()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
    }
    
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] h-16 md:h-20 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-in-out border-b border-transparent transform-gpu",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-full flex items-center">
        {/* LEFT: Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative w-40 h-10 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo-horizontal.png" 
                alt="Soulmar" 
                fill
                quality={100}
                unoptimized={true}
                className="object-contain"
                priority
                sizes="160px"
              />
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className={cn(
              "text-sm font-medium transition-all duration-300 hover:text-primary whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md px-2 py-1",
              pathname === "/" ? "text-primary" : "text-foreground/80"
            )}
          >
            {t('common.home')}
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-primary whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md px-2 py-1",
                pathname.startsWith(link.href)
                  ? "text-primary"
                  : "text-foreground/80"
              )}
            >
              {t(`common.${link.key}`)}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Actions (Desktop & iPad) */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-3.5">
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-bold text-xs tracking-[0.05em]"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
          >
            {language === "es" ? "ES / EN" : "EN / ES"}
          </Button>

          <ThemeToggle />

          <Button asChild className="rounded-full shadow-lg hover:-translate-y-0.5 transition-transform" size="default">
            <Link 
              href="/#agendamiento"
              onClick={(e) => handleNavClick(e, "/#agendamiento")}
            >
              {t("common.book_now")}
            </Link>
          </Button>
        </div>

        {/* RIGHT: Mobile Actions (WhatsApp button + Language button) */}
        <div className="md:hidden flex items-center gap-1.5 ml-auto">
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
            className="h-9 px-3 rounded-full font-bold text-xs tracking-wider bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-foreground/80 flex items-center justify-center active:scale-90 transition-all border border-black/[0.06] dark:border-white/10"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            aria-label="Cambiar idioma"
          >
            {language === "es" ? "ES / EN" : "EN / ES"}
          </button>
        </div>
      </div>
    </header>
  )
}
