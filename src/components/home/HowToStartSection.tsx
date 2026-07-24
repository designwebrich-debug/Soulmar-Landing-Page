"use client"

import React from "react"
import { useTranslation } from "@/context/LanguageContext"

export function HowToStartSection() {
  const { language } = useTranslation()
  const isEn = language === "en"

  const title1 = isEn ? "EASY BOOKING" : "AGENDAR EN FÁCIL"
  const title2 = isEn ? "FOLLOW THESE STEPS" : "SIGUE ESTOS PASOS"

  const steps = [
    { num: isEn ? "STEP 1:" : "PASO 1:", text: isEn ? "Select the date." : "Seleciona el día." },
    { num: isEn ? "STEP 2:" : "PASO 2:", text: isEn ? "Select the time." : "Seleciona la hora." },
    { num: isEn ? "STEP 3:" : "PASO 3:", text: isEn ? "Select reason for consultation." : "Seleciona Motivo de consulta." },
    { num: isEn ? "STEP 4:" : "PASO 4:", text: isEn ? "Enter your full name" : "Agrega tu nombre completo" },
    { num: isEn ? "STEP 5:" : "PASO 5:", text: isEn ? "Enter your phone number" : "Agrega tu número celular" },
    { num: isEn ? "STEP 6:" : "PASO 6:", text: isEn ? "Enter your email" : "Agrega tu correo" },
    { num: isEn ? "STEP 7:" : "PASO 7:", text: isEn ? 'Click on "Confirm session"' : 'Dale clic en "Confirmar sesión"' }
  ]

  return (
    <section id="como-empezar" className="w-full relative overflow-hidden bg-[#f5f4f0]">
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

        {/* Floating Text Overlay - Precisely aligned to laptop display height */}
        <div className="absolute inset-0 flex items-center justify-start z-10 pointer-events-none px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-2 sm:space-y-3 md:space-y-4 pointer-events-auto">
            
            {/* Titles with exact Laptop Display proportionality */}
            <div className="space-y-0.5 sm:space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[34px] xl:text-[40px] font-black tracking-tighter text-[#8da9c4] leading-none uppercase">
                {title1}
              </h2>
              <h3 className="text-base sm:text-xl md:text-2xl lg:text-[24px] xl:text-[28px] font-black tracking-tighter text-[#1d1d1f] leading-none uppercase">
                {title2}
              </h3>
            </div>

            {/* Step Items - Fixed color in dark mode & Soulmar Yellow on hover */}
            <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 sm:gap-3 py-0.5 group"
                >
                  <span className="bg-[#8da9c4] text-white group-hover:bg-[#ffc971] group-hover:text-neutral-900 text-[9px] sm:text-[10px] md:text-xs font-black tracking-wider uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md md:rounded-lg shrink-0 shadow-sm transition-colors duration-300 cursor-pointer">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] font-bold text-[11px] sm:text-xs md:text-sm lg:text-base leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
