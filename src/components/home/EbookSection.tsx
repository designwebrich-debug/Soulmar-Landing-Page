"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, BookOpen, Download } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { cn } from "@/lib/utils"

import ansiedadImg from "../../../public/images/ebooks/ansiedad.png"
import depresionImg from "../../../public/images/ebooks/depresion.png"
import mindsetImg from "../../../public/images/ebooks/mindset.png"

const EBOOKS = [
  {
    id: "ebook-ansiedad",
    key: "ansiedad",
    downloads: "1,240",
    author: "Dra. Mariana Caicedo Quintero",
    price: 9985,
    image: ansiedadImg.src, // Using src to automatically grab Next.js hashed CDN path
    color: "#8da9c4", // Azul Soulmar
    secondaryColor: "rgba(141, 169, 196, 0.1)",
  },
  {
    id: "ebook-depresion",
    key: "depresion",
    downloads: "856",
    author: "Dra. Mariana Caicedo Quintero",
    price: 9985,
    image: depresionImg.src,
    color: "#ffc971", // Amarillo Soulmar
    secondaryColor: "rgba(255, 201, 113, 0.1)",
  },
  {
    id: "ebook-mindset",
    key: "mindset",
    downloads: "2,103",
    author: "Dra. Mariana Caicedo Quintero",
    price: 9985,
    image: mindsetImg.src,
    color: "#c9cba3", // Verde Soulmar
    secondaryColor: "rgba(201, 203, 163, 0.1)",
  },
]

export function EbookSection() {
  // Sección "Pensamos en ti" (Ebooks) oculta según solicitud del usuario
  return null
}

function EbookCard({ ebook, t }: { 
  ebook: { 
    id: string; 
    key: string; 
    downloads: string; 
    author: string; 
    price: number; 
    image: string; 
    color: string; 
  }; 
  t: <T = string | React.ReactNode | React.ReactNode[]>(key: string, options?: Record<string, unknown>) => T
}) {
  const ebookData = t<{ title: string, description: string }>(`ebooks.${ebook.key}`, { returnObjects: true })
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="snap-center shrink-0 w-[80vw] sm:w-[320px] md:w-auto group relative flex flex-col bg-white rounded-[2rem] p-6 sm:p-8 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-black/[0.03]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] mb-6 md:mb-10 transition-transform duration-700 ease-out">
        {/* Shadow Overlay */}
        <div 
          className="absolute inset-10 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 -z-10"
          style={{ backgroundColor: ebook.color }}
        />
        
        <Image
          src={ebook.image}
          alt={ebookData.title as string}
          fill
          quality={100}
          unoptimized={true}
          className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, 350px"
        />
        
        {/* Rating Badge Mockup */}
        <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-bold text-[#1d1d1f]">4.9</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-8">
        <h3 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
          {ebookData.title as string}
        </h3>
        <p className="text-[#1d1d1f]/40 text-sm font-medium">
          {ebook.author}
        </p>
        <p className="text-[#1d1d1f]/60 text-xs mt-2 leading-relaxed">
          {ebookData.description as string}
        </p>
      </div>

      {/* Bottom Bar: Action Button */}
      <div className="mt-auto flex flex-col items-center pt-8 border-t border-black/[0.03]">
        {/* Action Button (Centered) */}
        <div className="relative h-14 w-full max-w-[200px]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center gap-2 text-white font-bold shadow-lg shadow-black/5 transition-all duration-300"
            )}
            style={{ backgroundColor: ebook.color }}
          >
            <Download className="w-5 h-5" />
            <span>{t('common.download_pdf') as string}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
