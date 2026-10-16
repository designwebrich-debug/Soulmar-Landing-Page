"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

export function SocialFloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@Soulmar.Psicologia",
      ariaLabel: "Canal oficial de YouTube de Soulmar",
      icon: (
        <svg className="w-8 h-8 text-[#FF0000] fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Spotify",
      href: "https://open.spotify.com/user/soulmar",
      ariaLabel: "Perfil oficial de Spotify de Soulmar",
      icon: (
        <svg className="w-7 h-7 text-[#1DB954] fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.306c-.215.353-.674.464-1.027.249-2.812-1.718-6.353-2.107-10.522-1.155-.401.092-.803-.16-.895-.561-.092-.401.16-.803.561-.895 4.567-1.043 8.49-.604 11.634 1.335.353.216.464.675.249 1.027zm1.468-3.262c-.27.44-.847.579-1.287.309-3.219-1.978-8.126-2.55-11.933-1.393-.497.151-1.026-.135-1.177-.632-.151-.497.135-1.026.632-1.177 4.354-1.321 9.774-.682 13.456 1.583.44.27.579.847.309 1.31zm.126-3.398C15.24 8.354 8.874 8.14 5.163 9.266c-.604.183-1.246-.164-1.429-.768-.183-.604.164-1.246.768-1.429 4.267-1.295 11.309-1.047 15.753 1.591.543.322.721 1.025.399 1.568-.323.542-1.026.72-1.555.398z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/soulmar/",
      ariaLabel: "LinkedIn oficial de Soulmar",
      icon: (
        <svg className="w-7 h-7 text-[#0A66C2] fill-current drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ]

  return (
    <div
      ref={menuRef}
      className="hidden md:flex items-center justify-end relative select-none"
    >
      {/* Liquid Glass Apple Premium Pill Bar adapting to Dark/Light theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.94 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
            }}
            className="liquid-glass flex items-center gap-4 mr-3.5 px-4 py-2.5 rounded-full bg-white/85 dark:bg-black/80 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden"
          >
            {/* Apple Specular Lens Glare Reflection */}
            <div className="absolute -top-3 left-6 right-6 h-8 rounded-full bg-gradient-to-b from-white/40 dark:from-white/15 to-transparent pointer-events-none" />

            {socialLinks.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.ariaLabel}
                initial={{ opacity: 0, scale: 0.6, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 4 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 26,
                  delay: index * 0.04,
                }}
                whileHover={{ scale: 1.18, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="relative z-10 flex items-center justify-center p-1.5 transition-transform duration-200 group"
              >
                {item.icon}

                {/* Minimalist Apple tooltip matching theme */}
                <span className="absolute -top-8 px-2.5 py-0.5 text-[11px] font-semibold tracking-tight text-neutral-800 dark:text-neutral-100 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-md border border-black/10 dark:border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                  {item.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Apple Liquid Glass Button (+) / (×) adapting to Dark & Light modes */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar redes sociales" : "Ver redes sociales"}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.94 }}
        className={`liquid-glass relative flex items-center justify-center w-16 h-16 rounded-full cursor-pointer overflow-hidden transition-all duration-300 ${
          isOpen
            ? "ring-2 ring-blue-500/80 ring-offset-2 ring-offset-background"
            : ""
        } bg-white/90 text-neutral-900 border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.15),inset_0_1.5px_1px_rgba(255,255,255,0.95)] dark:bg-black/85 dark:text-white dark:border-white/20 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.2)]`}
      >
        {/* Apple liquid glass convex specular highlight */}
        <div className="absolute top-0 left-2 right-2 h-7 rounded-full bg-gradient-to-b from-white/60 dark:from-white/25 via-white/10 dark:via-white/5 to-transparent pointer-events-none" />

        {/* Smooth rotatable + icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 22,
          }}
          className="relative z-10 flex items-center justify-center text-neutral-900 dark:text-white"
        >
          <Plus className="w-6 h-6 stroke-[2.6]" />
        </motion.div>
      </motion.button>
    </div>
  )
}
