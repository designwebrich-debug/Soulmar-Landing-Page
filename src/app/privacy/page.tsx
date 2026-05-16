"use client"

import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] pt-32 pb-20 transition-colors duration-500">
      <Section className="container mx-auto px-6 max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('common.back')}
        </Link>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="prose prose-sm md:prose-base dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-foreground/60 prose-p:font-medium"
        >
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-10">{t('footer.privacy')}</h1>
          <p className="text-lg mb-12">En Soulmar respetamos tu privacidad. Esta política explica cómo manejamos tus datos personales.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">1. Datos Recopilados</h2>
          <p>Solo recopilamos la información necesaria para brindarte nuestros servicios: nombre, email, historial de pedidos y preferencias de bienestar.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">2. Uso de la Información</h2>
          <p>Tus datos se utilizan para personalizar tu experiencia, procesar tus pedidos y enviarte información relevante sobre tus sesiones.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">3. Confidencialidad Terapéutica</h2>
          <p>Toda la información compartida durante las sesiones de terapia es estrictamente confidencial y está protegida bajo el secreto profesional.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">4. Tus Derechos</h2>
          <p>Puedes solicitar el acceso, rectificación o eliminación de tus datos en cualquier momento enviando un correo a privacidad@soulmar.com.</p>
          
          <div className="mt-20 p-8 rounded-3xl bg-surface dark:bg-white/5 border border-border">
             <p className="text-xs font-bold uppercase tracking-widest opacity-40">Última actualización</p>
             <p className="text-sm font-bold">Abril 2026</p>
          </div>
        </motion.div>
      </Section>
    </div>
  )
}
