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
          <div className="w-full max-w-lg lg:max-w-xl space-y-3 sm:space-y-4 pointer-events-auto">
            
            {/* Titles */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tighter text-[#8da9c4] leading-none uppercase">
                AGENDAR EN FÁCIL
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-black tracking-tighter text-[#1d1d1f] dark:text-white leading-none uppercase">
                SIGUE ESTOS PASOS
              </h3>
            </div>

            {/* Step Items - Clean without white boxes */}
            <div className="space-y-1.5 sm:space-y-2">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2.5 md:gap-3 py-0.5"
                >
                  <span className="bg-[#8da9c4] text-white text-[9px] md:text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shrink-0 shadow-sm">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] dark:text-white/90 font-bold text-[10px] sm:text-[11px] md:text-xs leading-snug">
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
