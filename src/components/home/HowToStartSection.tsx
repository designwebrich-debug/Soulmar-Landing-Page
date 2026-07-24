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
    <Section className="bg-[#f5f4f0] dark:bg-[#0b0b0c] py-12 md:py-20 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Steps List (5 columns) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6 z-10"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1d1d1f] dark:text-white leading-tight uppercase">
              AGENDAR EN FÁCIL<br />SIGUE ESTOS PASOS.
            </h2>

            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="flex items-center gap-3 bg-white dark:bg-white/10 p-3.5 px-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="bg-[#251e3e] text-white text-[10px] md:text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg shrink-0">
                    {step.num}
                  </span>
                  <p className="text-[#1d1d1f] dark:text-white/90 font-bold text-xs md:text-sm leading-snug">
                    {step.text}
                  </p>
                </motion.div>
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
                className="inline-flex items-center justify-center bg-[#251e3e] dark:bg-white text-white dark:text-neutral-900 font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl text-sm tracking-wide"
              >
                {t('how_to_start.cta') || "Agendar mi sesión"}
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Full-Height Embedded Laptop Video (7 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-7 relative w-full h-[380px] sm:h-[480px] md:h-[560px] lg:h-[620px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-white"
          >
            <video 
              src="/videos/video-mockup.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover object-center rounded-3xl md:rounded-[2.5rem]"
            />
          </motion.div>

        </div>
      </div>
    </Section>
  )
}
