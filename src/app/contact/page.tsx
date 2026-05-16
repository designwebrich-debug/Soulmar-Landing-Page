"use client"

import { Section } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { Mail, MapPin, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WHATSAPP_PHONE, WHATSAPP_LINK } from "@/lib/constants"

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] pt-32 pb-20 transition-colors duration-500">
      <Section className="container mx-auto px-6 max-w-6xl">
        <div className="mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('common.back')}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase mb-6">{t('footer.contact')}</h1>
            <p className="text-xl text-foreground/40 font-medium max-w-2xl">{t('contact.subtitle') || 'Estamos aquí para acompañarte en tu proceso de bienestar.'}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Details */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { icon: <Mail className="w-6 h-6" />, label: 'Email', value: 'hola@soulmar.com' },
                 { icon: <Phone className="w-6 h-6" />, label: 'WhatsApp', value: <Link href={WHATSAPP_LINK} target="_blank" className="hover:text-primary transition-colors">{WHATSAPP_PHONE}</Link> },
                 { icon: <MapPin className="w-6 h-6" />, label: 'Ubicación', value: 'Bogotá, Colombia' },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 rounded-[2.5rem] bg-white dark:bg-white/[0.03] shadow-xl hover:shadow-2xl transition-all group"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-foreground/80">{item.value}</p>
                 </motion.div>
               ))}
            </div>
            
            <div className="p-10 rounded-[3rem] bg-primary/[0.03] border border-primary/10">
               <h4 className="text-xl font-bold uppercase tracking-tight mb-4">{t('contact.hours_title') || 'Horarios de Atención'}</h4>
               <ul className="space-y-3">
                  <li className="flex justify-between text-sm font-medium"><span className="text-foreground/40">Lunes - Viernes</span> <span>8:00 AM - 6:00 PM</span></li>
                  <li className="flex justify-between text-sm font-medium"><span className="text-foreground/40">Sábado</span> <span>9:00 AM - 1:00 PM</span></li>
                  <li className="flex justify-between text-sm font-medium"><span className="text-foreground/40">Domingo</span> <span className="text-primary font-bold">Cerrado</span></li>
               </ul>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 md:p-16 rounded-[4rem] bg-white dark:bg-white/[0.03] shadow-2xl space-y-10"
          >
             <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                       <Label className="pl-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">{t('checkout.form.name')}</Label>
                       <Input className="h-14 rounded-full px-8 bg-surface dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 shadow-inner" placeholder="Tu nombre" />
                   </div>
                   <div className="space-y-2">
                       <Label className="pl-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">{t('checkout.form.email')}</Label>
                       <Input className="h-14 rounded-full px-8 bg-surface dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 shadow-inner" placeholder="Email" />
                   </div>
                </div>
                <div className="space-y-2">
                    <Label className="pl-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">{t('contact.subject') || 'Asunto'}</Label>
                    <Input className="h-14 rounded-full px-8 bg-surface dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 shadow-inner" placeholder="¿En qué podemos ayudarte?" />
                </div>
                <div className="space-y-2">
                    <Label className="pl-4 text-[10px] font-bold uppercase tracking-widest text-foreground/40">{t('contact.message') || 'Mensaje'}</Label>
                    <Textarea className="min-h-[150px] rounded-[2rem] p-8 bg-surface dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 shadow-inner" placeholder="Escribe tu mensaje aquí..." />
                </div>
             </div>
             <Button className="w-full h-18 rounded-full text-lg font-bold uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                {t('contact.send_btn') || 'Enviar Mensaje'}
             </Button>
          </motion.div>
        </div>
      </Section>
    </div>
  )
}
