"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/context/LanguageContext"
import { Section } from "@/components/layout/Section"

export function HowToStartSection() {
  const { t } = useTranslation()

  const steps = [
    {
      num: "1.",
      title: t('how_to_start.step1_title'),
      desc: t('how_to_start.step1_desc')
    },
    {
      num: "2.",
      title: t('how_to_start.step2_title'),
      desc: t('how_to_start.step2_desc')
    },
    {
      num: "3.",
      title: t('how_to_start.step3_title'),
      desc: t('how_to_start.step3_desc')
    }
  ]

  return (
    <Section className="bg-[#f5f4f0] dark:bg-[#0b0b0c] py-20 md:py-32 relative overflow-hidden transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text and Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#1d1d1f] dark:text-white leading-[1.05]">
              {t('how_to_start.title')}
            </h2>

            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <span className="text-5xl font-black text-[#1d1d1f] dark:text-white tracking-tighter leading-none shrink-0">
                    {step.num}
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[#1d1d1f]/70 dark:text-white/60 font-medium text-base md:text-lg leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
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
                {t('how_to_start.cta')}
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[320px] aspect-[9/19] bg-black rounded-[45px] shadow-2xl border-[12px] border-[#1d1d1f] overflow-hidden flex flex-col">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1d1d1f] rounded-b-[20px] z-20"></div>
              
              {/* Video Mockup Container */}
              <div className="w-full h-full relative overflow-hidden bg-black">
                <video 
                  src="/videos/video-mockup.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              </div>
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
