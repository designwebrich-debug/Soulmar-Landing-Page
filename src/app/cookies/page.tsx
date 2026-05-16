"use client"

import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiesPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-10">{t('footer.cookies')}</h1>
          <p className="text-lg mb-12">Utilizamos cookies para mejorar tu experiencia de navegación en Soulmar.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">1. ¿Qué son las cookies?</h2>
          <p>Son pequeños archivos de datos que se almacenan en tu dispositivo para recordar tus preferencias y autenticación.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">2. Cookies Esenciales</h2>
          <p>Utilizamos cookies esenciales para que puedas iniciar sesión, mantener tu carrito de compras y asegurar tus pagos. Sin ellas, el sitio no funcionaría correctamente.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">3. Cookies de Rendimiento</h2>
          <p>Estas nos ayudan a entender cómo interactúas con el sitio, qué secciones visitas más y nos permiten mejorar la velocidad de carga.</p>
          
          <h2 className="text-xl uppercase mt-12 mb-6">4. Gestión de Cookies</h2>
          <p>Puedes configurar tu navegador para rechazar todas las cookies, pero esto limitará tu capacidad de uso en Soulmar.</p>
          
          <div className="mt-20 p-8 rounded-3xl bg-surface dark:bg-white/5 border border-border">
             <p className="text-xs font-bold uppercase tracking-widest opacity-40">Última actualización</p>
             <p className="text-sm font-bold">Abril 2026</p>
          </div>
        </motion.div>
      </Section>
    </div>
  )
}
