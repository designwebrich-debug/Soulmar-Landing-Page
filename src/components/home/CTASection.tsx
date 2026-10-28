"use client"

import Link from "next/link"
import { Calendar, ArrowRight, MessageCircle, Sparkles } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { WHATSAPP_LINK } from "@/lib/constants"

export function CTASection() {
  return (
    <Section className="pt-6 md:pt-10 pb-16 md:pb-24 bg-surface dark:bg-[#0b0b0c] transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[36px] md:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#1d1d1f] via-[#242426] to-[#121214] text-white p-8 sm:p-12 md:p-16 text-center shadow-2xl border border-white/10">
          
          {/* Iluminación ambiental cálida con colores oficiales Soulmar */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-[#8da9c4] blur-[140px] rounded-full pointer-events-none opacity-30" />
          <div className="absolute -bottom-20 right-10 w-72 h-72 bg-[#ffc971] blur-[130px] rounded-full pointer-events-none opacity-20" />
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-[#c9cba3] blur-[130px] rounded-full pointer-events-none opacity-15" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#ffc971]" />
              Tu bienestar empieza con una decisión
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Da el primer paso hacia tu calma interior hoy.
            </h2>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
              Agenda tu sesión de terapia con la Dra. Mariana Caicedo. Espacios 100% privados y en tu horario preferido.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#agendamiento"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 h-14 rounded-full bg-white text-[#1d1d1f] text-base font-bold shadow-xl hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-[#8da9c4]" />
                <span>Reservar Mi Sesión Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 text-xs text-white/50 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-medium">
              <span>🔒 Pago 100% Seguro</span>
              <span>•</span>
              <span>🛡️ Confidencialidad Médica</span>
              <span>•</span>
              <span>⏱️ 50-60 Minutos</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
