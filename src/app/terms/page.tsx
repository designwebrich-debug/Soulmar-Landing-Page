"use client"

import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-10">{t('footer.terms')}</h1>
          <p className="text-lg mb-12">Bienvenido a Soulmar. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">1. Uso del Servicio</h2>
          <p>Soulmar proporciona servicios de bienestar emocional y espiritual, incluyendo sesiones de terapia, cursos y productos digitales. Te comprometes a utilizar el servicio de manera responsable.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">2. Cuentas de Usuario</h2>
          <p>Para acceder a ciertos servicios, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">3. Pagos y Reembolsos</h2>
          <p>Los pagos se realizan a través de pasarelas seguras. Los reembolsos de sesiones canceladas con menos de 24 horas de antelación no serán procesados.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">4. Propiedad Intelectual</h2>
          <p>Todo el contenido de Soulmar, incluyendo textos, videos y diseños, es propiedad exclusiva de Soulmar SAS.</p>
          
          <div className="mt-20 p-8 rounded-3xl bg-surface dark:bg-white/5 border border-border">
             <p className="text-xs font-bold uppercase tracking-widest opacity-40">Última actualización</p>
             <p className="text-sm font-bold">Abril 2026</p>
          </div>
        </motion.div>
      </Section>
    </div>
  )
}
