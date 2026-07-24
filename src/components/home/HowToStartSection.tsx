"use client"

import React from "react"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"

export function HowToStartSection() {
  const { t } = useTranslation()

  const steps = [
    { num: "PASO 1:", text: "Seleciona el día." },
    { num: "PASO 2:", text: "Seleciona la hora." },
    { num: "PASO 3:", text: "Seleciona Motivo de consulta." },
    { num: "PASO 4:", text: "Agrega tu nombre completo" },
    { num: "PASO 5:", text: "Agrega tu número celular" },
    { num: "PASO 6:", text: "Agrega tu correo" },
    { num: "PASO 7:", text: 'Dale clic al botón que dice "Confirmar sesión" y listo Bienvenido a Soulmar.' }
  ]

  return (
    <section id="como-empezar" className="w-full relative overflow-hidden bg-[#f5f4f0] dark:bg-[#0b0b0c]">
      {/* Master Relative Container */}
      <div className="w-full relative">
        
        {/* Uncropped Edge-to-Edge Video Background */}
        <video 
          src="/videos/video-mockup.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-auto block"
        />

        {/* Floating Text Overlay - Directly over left side of the video */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none px-6 md:px-12 lg:px-20">
          <div className="w-full max-w-lg lg:max-w-xl space-y-3 sm:space-y-4 md:space-y-5 pointer-events-auto">
            
            {/* Clean Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-[#1d1d1f] leading-none uppercase">
              AGENDAR EN FÁCIL<br />SIGUE ESTOS PASOS.
            </h2>

            {/* Step Pills */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 md:gap-3 bg-white/85 backdrop-blur-md p-2 sm:p-2.5 md:p-3 px-3.5 sm:px-4 md:px-5 rounded-xl md:rounded-2xl border border-black/5 shadow-sm hover:scale-[1.01] transition-all"
                >
                  <span className="bg-[#251e3e] text-white text-[9px] md:text-xs font-black tracking-wider uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg shrink-0">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] font-bold text-[11px] sm:text-xs md:text-sm leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-1 md:pt-2">
              <Link
                href="/#agendamiento"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault()
                    document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="inline-flex items-center justify-center bg-[#251e3e] text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl text-xs md:text-sm tracking-wide"
              >
                {t('how_to_start.cta') || "Agendar mi sesión"}
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
