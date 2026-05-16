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
  { key: "courses", href: "/courses" },
  { key: "retreats", href: "/retreats" },
  { key: "shop", href: "/shop" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { language, setLanguage, t } = useTranslation()
  const { isAuthenticated, logout, user } = useAuth()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setIsAccountMenuOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsAccountMenuOpen(false)
    }, 300)
  }

  if (pathname.startsWith("/panel-admin") || pathname.startsWith("/panel-usuario") || pathname.startsWith("/panel-terapeuta")) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] h-20 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-in-out border-b border-transparent transform-gpu",
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* LEFT: Logo */}
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

        {/* CENTER: Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-foreground/80"
            )}
          >
            {t('common.home')}
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
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
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-bold text-xs tracking-[0.05em]"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            aria-label={(language === "es" ? t('navbar.switch_to_en') : t('navbar.switch_to_es')) as string}
          >
            {language === "es" ? "ES / EN" : "EN / ES"}
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full" asChild aria-label={t('common.cart') as string}>
              <Link href="/cart">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
          </div>
          {isAuthenticated && (
            <div 
              className="relative"
              onMouseEnter={() => {
                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
                setIsAccountMenuOpen(true)
              }}
              onMouseLeave={() => {
                closeTimeoutRef.current = setTimeout(() => setIsAccountMenuOpen(false), 300)
              }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full transition-transform active:scale-95 bg-primary/10 text-primary" 
                asChild 
                aria-label={t('dashboard.user.title') as string}
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              >
                <Link href="/panel-usuario">
                  <span className="font-bold text-sm uppercase">
                    {user?.name ? user.name.substring(0, 2) : "US"}
                  </span>
                </Link>
              </Button>

              <div className="absolute top-10 left-0 right-0 h-4 bg-transparent z-[55]" />

              <div 
                className={cn(
                  "absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl transition-all duration-300 z-[60] overflow-hidden",
                  isAccountMenuOpen 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                <div className="p-2 space-y-1">
                  {user?.role === 'admin' && (
                    <>
                      <Link 
                        href="/dashboard/admin" 
                        className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-primary/10 transition-colors text-primary"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                      <Link 
                        href="/panel-terapeuta" 
                        className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-primary/10 transition-colors"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Panel Terapeuta
                      </Link>
                    </>
                  )}
                  {user?.role === 'terapeuta' && (
                    <Link 
                      href="/panel-terapeuta" 
                      className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-primary/10 transition-colors"
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Panel Terapeuta
                    </Link>
                  )}
                  <Link 
                    href="/panel-usuario" 
                    className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-primary/10 transition-colors"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    Mi Panel (Usuario)
                  </Link>
                  <button 
                    onClick={async () => {
                      setIsAccountMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left flex items-center px-4 py-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-500/10 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}
          {!isAuthenticated && (
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full transition-transform active:scale-95" 
                asChild 
                aria-label={t('common.account') as string}
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              >
                <Link href="/register">
                  <UserPlus className="w-5 h-5" />
                </Link>
              </Button>
              
              {/* Invisible Hover Bridge */}
              <div className="absolute top-10 left-0 right-0 h-4 bg-transparent z-[55]" />

              {/* Intelligent Dropdown */}
              <div 
                className={cn(
                  "absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl transition-all duration-300 z-[60] overflow-hidden",
                  isAccountMenuOpen 
                    ? "opacity-100 translate-y-0 pointer-events-auto" 
                    : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                <div className="p-2 space-y-1">
                  <Link 
                    href="/register" 
                    className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    {t('common.register')}
                  </Link>
                  <Link 
                    href="/login" 
                    className="flex items-center px-4 py-3 text-sm font-bold rounded-2xl hover:bg-secondary-yellow dark:hover:bg-surface transition-colors"
                    onClick={() => setIsAccountMenuOpen(false)}
                  >
                    {t('common.login')}
                  </Link>
                </div>
              </div>
            </div>
          )}
          <ThemeToggle />
          <Button asChild className="rounded-full shadow-lg hover:-translate-y-0.5 transition-transform" size="default">
            <Link href="/book">{t("common.book_now")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
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
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium">{t('common.home')}</Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
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
            <Link href="/book" onClick={() => setMobileMenuOpen(false)}>{t('common.book_now')}</Link>
          </Button>
        </div>
      )}
    </header>
  )
}
