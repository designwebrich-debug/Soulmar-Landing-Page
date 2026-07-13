"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/Button"
import { Menu, X, ShoppingBag, UserPlus, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { useTranslation } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"

const navLinks = [
  { key: "therapies", href: "/#agendamiento" },
  { key: "ebooks", href: "/#ebooks" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useTranslation()

  if (pathname?.startsWith("/admin")) {
    return null
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") return // Only intercept if we are already on the home page

    if (href === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      setMobileMenuOpen(false)
    } else if (href.startsWith("/#")) {
      e.preventDefault()
      const id = href.replace("/#", "")
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    // Check initial scroll position on mount (fixes transparent background after refresh)
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] h-20 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-in-out border-b border-transparent transform-gpu",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 h-full flex items-center">
        {/* LEFT: Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative w-40 h-10 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo-horizontal.png" 
                alt="Soulmar" 
                fill
                className="object-contain"
                priority
                sizes="160px"
              />
            </div>
          </Link>
        </div>

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

        {/* RIGHT: Actions */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-4">
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

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link 
            href="/" 
            onClick={(e) => handleNavClick(e, "/")} 
            className="py-2 text-lg font-medium"
          >
            {t('common.home')}
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (pathname === "/") {
                  handleNavClick(e, link.href);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="py-2 text-lg font-medium"
            >
              {t(`common.${link.key}`)}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-bold text-xs tracking-[0.05em] justify-start px-0"
            onClick={() => {
              setLanguage(language === "es" ? "en" : "es")
              setMobileMenuOpen(false)
            }}
          >
            {language === "es" ? t('navbar.switch_to_en') : t('navbar.switch_to_es')}
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link 
              href="/#agendamiento" 
              onClick={(e) => {
                handleNavClick(e, "/#agendamiento")
                setMobileMenuOpen(false)
              }}
            >
              {t('common.book_now')}
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}
