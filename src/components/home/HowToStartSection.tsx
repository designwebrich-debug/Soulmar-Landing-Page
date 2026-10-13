"use client"

import React from "react"
import { useTranslation } from "@/context/LanguageContext"

export function HowToStartSection() {
  const { language } = useTranslation()
  const isEn = language === "en"

  const title1 = isEn ? "EASY BOOKING" : "AGENDAR EN FÁCIL"
  const title2 = isEn ? "FOLLOW THESE STEPS" : "SIGUE ESTOS PASOS"

  const steps = [
    { num: isEn ? "STEP 1:" : "PASO 1:", text: isEn ? "Select the date" : "Seleciona el día" },
    { num: isEn ? "STEP 2:" : "PASO 2:", text: isEn ? "Select the time" : "Seleciona la hora" },
    { num: isEn ? "STEP 3:" : "PASO 3:", text: isEn ? "Select reason for consultation" : "Seleciona Motivo de consulta" },
    { num: isEn ? "STEP 4:" : "PASO 4:", text: isEn ? "Enter your full name" : "Agrega tu nombre completo" },
    { num: isEn ? "STEP 5:" : "PASO 5:", text: isEn ? "Enter your phone number" : "Agrega tu número celular" },
    { num: isEn ? "STEP 6:" : "PASO 6:", text: isEn ? "Enter your email" : "Agrega tu correo" },
    { num: isEn ? "STEP 7:" : "PASO 7:", text: isEn ? 'Click on "Confirm session"' : 'Dale clic en "Confirmar sesión"' }
  ]

  return (
    <section id="como-empezar" className="w-full relative overflow-hidden bg-[#f5f4f0]">
      {/* Master Container: Stacks vertically on mobile (video on top, steps below), absolute overlay on desktop */}
      <div className="w-full relative flex flex-col md:block">
        
        {/* Laptop Video Mockup - Positioned at top and centered on mobile, full-width background on desktop */}
        <div className="w-full relative overflow-hidden">
          <video 
            src="/videos/video-mockup.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-auto block laptop-mockup-mobile-centered md:aspect-auto md:object-fill"
          />
        </div>

        {/* Text & Steps: Below the laptop on mobile, Floating overlay on desktop */}
        <div className="w-full px-6 pt-6 pb-12 md:p-0 md:absolute md:inset-0 md:flex md:items-center md:justify-start md:z-10 md:pointer-events-none md:pl-24 lg:pl-32 xl:pl-44 md:pr-6">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl pointer-events-auto">
            
            {/* Titles with exact Laptop Display proportionality */}
            <div className="space-y-0.5 sm:space-y-1 mb-4 md:mb-5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[34px] xl:text-[40px] font-black tracking-tighter text-[#8da9c4] leading-tight md:leading-none uppercase">
                {title1}
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[24px] xl:text-[28px] font-black tracking-tighter text-[#1d1d1f] leading-tight md:leading-none uppercase">
                {title2}
              </h3>
            </div>

            {/* Step Items - iOS Inset Grouped Card on mobile, clean list on desktop */}
            <div className="bg-white/90 dark:bg-[#1c1c1e]/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-0 md:bg-transparent md:backdrop-blur-none border border-black/[0.06] dark:border-white/[0.08] md:border-none shadow-sm md:shadow-none space-y-2 md:space-y-2.5">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 sm:gap-3 py-1 md:py-0.5 group active:scale-[0.98] transition-transform"
                >
                  <span className="bg-[#8da9c4] text-white group-hover:bg-[#ffc971] group-hover:text-neutral-900 text-[10px] md:text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg shrink-0 shadow-sm transition-colors duration-300">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] dark:text-white font-bold text-xs sm:text-xs md:text-sm lg:text-base leading-snug">
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
