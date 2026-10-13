"use client"

import Link from "next/link"
import { ArrowRight, Heart, Users, Sparkles, ClipboardList, Brain, CloudRain } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { HighlightCarousel } from "./HighlightCarousel"
import { useTranslation } from "@/context/LanguageContext"

const serviceConfigs = [
  {
    icon: Heart,
    color: "#8da9c4",      // Azul Soulmar
    shadow: "shadow-[#8da9c4]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(141,169,196,0.18)]",
    glow: "from-[#8da9c4]/20",
  },
  {
    icon: Users,
    color: "#ffc971",      // Amarillo Soulmar
    shadow: "shadow-[#ffc971]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(255,201,113,0.18)]",
    glow: "from-[#ffc971]/20",
  },
  {
    icon: Sparkles,
    color: "#c9cba3",      // Verde Soulmar
    shadow: "shadow-[#c9cba3]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(201,203,163,0.18)]",
    glow: "from-[#c9cba3]/20",
  },
  {
    icon: ClipboardList,
    color: "#1d1d1f",      // Negro
    shadow: "shadow-[#1d1d1f]/10",
    hover: "group-hover:shadow-[0_40px_80px_rgba(29,29,31,0.12)]",
    glow: "from-[#1d1d1f]/10",
  },
  {
    icon: Brain,
    color: "#a78bfa",      // Lila
    shadow: "shadow-[#a78bfa]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(167,139,250,0.18)]",
    glow: "from-[#a78bfa]/20",
  },
  {
    icon: CloudRain,
    color: "#8da9c4",      // Azul Soulmar
    shadow: "shadow-[#8da9c4]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(141,169,196,0.18)]",
    glow: "from-[#8da9c4]/20",
  },
]

export function ServicesSection() {
  const { t } = useTranslation()
  const items = t<Array<{ title: string; desc: string }>>('services.items', { returnObjects: true }) || []

  return (
    <Section className="bg-background dark:bg-[#0b0b0c] pt-20 md:pt-28 pb-16 md:pb-20 transition-colors duration-500 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#8da9c4]/5 blur-[120px] rounded-full -mr-20 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#c9cba3]/5 blur-[100px] rounded-full -ml-20 -mb-20" />

      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-14 space-y-3 px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-[1.1]">
          {t('services.title')}
        </h2>
        <p className="text-lg text-[#1d1d1f]/50 dark:text-white/40 font-medium">
          {t('services.subtitle')}
        </p>
      </div>

      {/* 3×2 Grid / iOS 2-Column Widgets on Mobile */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {serviceConfigs.map((cfg, index) => {
            const Icon = cfg.icon
            const item = items[index] || { title: "", desc: "" }
            return (
              <Link
                key={index}
                href="/#agendamiento"
                className="group relative block active:scale-[0.97] transition-transform duration-200"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault()
                    document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                {/* Hover/Tap glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cfg.glow} to-transparent rounded-2xl sm:rounded-[2rem] blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Card body - iOS Health Widget Style */}
                <div className={`relative bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-7 md:p-9 flex flex-col items-center text-center border border-white/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${cfg.hover} transition-all duration-300 sm:duration-500 hover:-translate-y-1.5 cursor-pointer h-full`}>

                  {/* Squircle Icon */}
                  <div
                    className={`w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6 shadow-md sm:shadow-lg ${cfg.shadow} transform group-hover:rotate-6 transition-transform duration-500 ${cfg.color === "#1d1d1f" ? "bg-[#1d1d1f] dark:bg-white" : ""}`}
                    style={cfg.color !== "#1d1d1f" ? { backgroundColor: cfg.color } : undefined}
                  >
                    <Icon
                      className={`w-5 h-5 sm:w-8 sm:h-8 ${cfg.color === "#1d1d1f" ? "text-white dark:text-[#1d1d1f]" : "text-white"}`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-lg font-bold mb-1.5 sm:mb-3 text-[#1d1d1f] dark:text-white leading-tight line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#1d1d1f]/60 dark:text-white/50 text-xs sm:text-base leading-snug mb-3 sm:mb-6 flex-1 font-medium line-clamp-3 sm:line-clamp-none">
                    {item.desc}
                  </p>

                  {/* CTA link */}
                  <div
                    className={`text-[11px] sm:text-sm font-bold flex items-center gap-1 sm:gap-2 group-hover:gap-3 transition-all tracking-wider uppercase ${cfg.color === "#1d1d1f" ? "text-[#1d1d1f] dark:text-white" : ""}`}
                    style={cfg.color !== "#1d1d1f" ? { color: cfg.color } : undefined}
                  >
                    {t('common.details')} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Highlight Carousel */}
      <div className="max-w-5xl mx-auto px-6 pt-16 relative z-10">
        <HighlightCarousel />
      </div>
    </Section>
  )
}
