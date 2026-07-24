"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"
import { Section } from "@/components/layout/Section"

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
    <Section className="bg-[#f5f4f0] dark:bg-[#0b0b0c] py-16 md:py-24 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text and Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-[#1d1d1f] dark:text-white leading-tight uppercase">
              AGENDAR EN FÁCIL SIGUE ESTOS PASOS.
            </h2>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-3.5 px-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:scale-[1.01] transition-all"
                >
                  <span className="bg-[#251e3e] text-white text-[10px] md:text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg shrink-0">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] dark:text-white/90 font-bold text-xs md:text-sm leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/#agendamiento"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault()
                    document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
                  }
                }}
                className="inline-flex items-center justify-center bg-[#251e3e] dark:bg-white text-white dark:text-neutral-900 font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-sm tracking-wide"
              >
                {t('how_to_start.cta') || "Agendar mi sesión"}
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Clean Video Player without iPhone mockup frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[360px] md:max-w-[400px] rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black group">
              <video 
                src="/videos/video-mockup.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover rounded-3xl md:rounded-[2.5rem]"
              />
            </div>
            
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -right-10 w-64 h-64 bg-[#8da9c4]/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute bottom-1/4 -left-10 w-64 h-64 bg-[#ffc971]/20 rounded-full blur-[80px] -z-10" />
          </motion.div>

        </div>
      </div>
    </Section>
  )
}
