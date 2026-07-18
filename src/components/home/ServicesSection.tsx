"use client"

import Link from "next/link"
import { ArrowRight, Heart, Users, Briefcase, ClipboardList, Brain, CloudRain } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"
import { HighlightCarousel } from "./HighlightCarousel"

const services = [
  {
    icon: Heart,
    title: "Terapia Individual",
    desc: "Un espacio de una hora, solo para ti, para hablar de lo que estás viviendo.",
    color: "#8da9c4",      // Azul Soulmar
    shadow: "shadow-[#8da9c4]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(141,169,196,0.18)]",
    glow: "from-[#8da9c4]/20",
  },
  {
    icon: Users,
    title: "Terapia de Pareja",
    desc: "Un espacio compartido para reconectar, sanar y construir desde el diálogo.",
    color: "#ffc971",      // Amarillo Soulmar
    shadow: "shadow-[#ffc971]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(255,201,113,0.18)]",
    glow: "from-[#ffc971]/20",
  },
  {
    icon: Briefcase,
    title: "Talento Humano",
    desc: "Bienestar psicológico para equipos de trabajo, organizaciones y líderes.",
    color: "#c9cba3",      // Verde Soulmar
    shadow: "shadow-[#c9cba3]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(201,203,163,0.18)]",
    glow: "from-[#c9cba3]/20",
  },
  {
    icon: ClipboardList,
    title: "Tests de Personalidad",
    desc: "Evaluaciones clínicas que te ayudan a conocerte mejor y a entender tus patrones.",
    color: "#1d1d1f",      // Negro
    shadow: "shadow-[#1d1d1f]/10",
    hover: "group-hover:shadow-[0_40px_80px_rgba(29,29,31,0.12)]",
    glow: "from-[#1d1d1f]/10",
  },
  {
    icon: Brain,
    title: "Terapia en Ansiedad",
    desc: "Herramientas clínicas para comprender y gestionar la ansiedad desde adentro.",
    color: "#a78bfa",      // Lila
    shadow: "shadow-[#a78bfa]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(167,139,250,0.18)]",
    glow: "from-[#a78bfa]/20",
  },
  {
    icon: CloudRain,
    title: "Terapia en Depresión",
    desc: "Acompañamiento clínico especializado para transitar la depresión con apoyo profesional.",
    color: "#8da9c4",      // Azul Soulmar
    shadow: "shadow-[#8da9c4]/25",
    hover: "group-hover:shadow-[0_40px_80px_rgba(141,169,196,0.18)]",
    glow: "from-[#8da9c4]/20",
  },
]

export function ServicesSection() {
  const { t } = useTranslation()

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

      {/* 3×2 Grid */}
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => {
            const Icon = svc.icon
            return (
              <Link
                key={svc.title}
                href="/#agendamiento"
                className="group relative block"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault()
                    document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${svc.glow} to-transparent rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                {/* Card body */}
                <div className={`relative bg-white/50 dark:bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] p-7 flex flex-col items-center text-center border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${svc.hover} transition-all duration-500 hover:-translate-y-1.5 cursor-pointer h-full`}>

                  {/* Icon pill */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg ${svc.shadow} transform group-hover:rotate-6 transition-transform duration-500`}
                    style={{ backgroundColor: svc.color }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: svc.color === "#1d1d1f" ? "#ffffff" : "#ffffff" }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold mb-2 text-[#1d1d1f] dark:text-white leading-tight">
                    {svc.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#1d1d1f]/50 dark:text-white/40 text-sm leading-snug mb-5 flex-1 font-medium">
                    {svc.desc}
                  </p>

                  {/* CTA link */}
                  <div
                    className="text-xs font-bold flex items-center gap-1.5 group-hover:gap-3 transition-all tracking-[0.05em] uppercase"
                    style={{ color: svc.color === "#1d1d1f" ? "#1d1d1f" : svc.color }}
                  >
                    {t('common.details')} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Highlights Slider */}
      <div className="max-w-5xl mx-auto px-6 pt-14 relative z-10">
        <HighlightCarousel />
      </div>
    </Section>
  )
}
