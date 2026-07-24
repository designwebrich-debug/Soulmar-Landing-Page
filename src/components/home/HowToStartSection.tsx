"use client"

import React from "react"

export function HowToStartSection() {
  const steps = [
    { num: "PASO 1:", text: "Seleciona el día." },
    { num: "PASO 2:", text: "Seleciona la hora." },
    { num: "PASO 3:", text: "Seleciona Motivo de consulta." },
    { num: "PASO 4:", text: "Agrega tu nombre completo" },
    { num: "PASO 5:", text: "Agrega tu número celular" },
    { num: "PASO 6:", text: "Agrega tu correo" },
    { num: "PASO 7:", text: 'Dale clic en "Confirmar sesión"' }
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

        {/* Floating Text Overlay - Perfectly Centered Vertically on the Left Side */}
        <div className="absolute inset-0 flex items-center justify-start z-10 pointer-events-none px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6 md:space-y-8 pointer-events-auto">
            
            {/* Titles with Apple/Silicon Valley Responsive Typography */}
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#8da9c4] leading-none uppercase">
                AGENDAR EN FÁCIL
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-[#1d1d1f] dark:text-white leading-none uppercase">
                SIGUE ESTOS PASOS
              </h3>
            </div>

            {/* Step Items - High legibility, crisp proportions */}
            <div className="space-y-2.5 sm:space-y-3.5 md:space-y-4">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 md:gap-4 py-0.5"
                >
                  <span className="bg-[#8da9c4] text-white text-[11px] sm:text-xs md:text-sm font-black tracking-wider uppercase px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg md:rounded-xl shrink-0 shadow-md">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] dark:text-white/95 font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-snug">
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
