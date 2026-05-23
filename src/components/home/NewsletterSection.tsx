"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"

export function NewsletterSection() {
  const { t } = useTranslation()

  return (
    <Section className="pt-16 pb-[6.5rem] bg-surface dark:bg-[#0b0b0c] transition-colors duration-500">
      <div className="max-w-6xl mx-auto rounded-[4rem] bg-[#0d0d0d] p-12 md:p-24 shadow-2xl relative overflow-hidden group border border-white/5">
        {/* Dynamic Brand Background Accents */}
        <div className="absolute top-0 right-0 w-[70%] h-[100%] bg-[#8da9c4]/10 rounded-full blur-[120px] -mr-[20%] opacity-40 group-hover:opacity-70 group-hover:bg-[#8da9c4]/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[60%] bg-[#c9cba3]/5 rounded-full blur-[100px] -ml-[10%] opacity-30 group-hover:opacity-60 group-hover:bg-[#c9cba3]/15 transition-all duration-1000 delay-100" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#ffc971]/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 group-hover:bg-[#ffc971]/10 transition-all duration-1000 delay-200" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <Badge className="bg-white/10 text-white border-transparent px-6 py-2 rounded-full uppercase tracking-[0.1em] text-[10px] font-bold hover:bg-[#ffc971] hover:border-[#ffc971] hover:text-[#0b0b0c] cursor-pointer transition-all duration-300">
              {t('footer.newsletter_title')}
            </Badge>
            <h3 className="text-5xl md:text-7xl font-bold text-white leading-[0.9] tracking-[-0.022em] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-700">
              {t('home.newsletter_title_alt')}
            </h3>
            <p className="text-white/50 text-xl font-medium max-w-md mx-auto lg:mx-0 group-hover:text-white/70 transition-colors duration-700 leading-relaxed">
              {t('footer.newsletter_desc')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-md space-y-8">
            <div className="flex flex-col gap-5">
              <div className="relative group/input">
                <input 
                  type="email" 
                  placeholder={t('booking.name_placeholder') as string} 
                  className="w-full h-20 rounded-[2rem] px-10 bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:border-[#8da9c4]/50 focus:bg-white/[0.07] outline-none transition-all shadow-inner text-lg font-medium"
                />
                <div className="absolute inset-0 rounded-[2rem] bg-[#8da9c4]/10 opacity-0 group-focus-within/input:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </div>
              
              <Button className="w-full rounded-[2rem] h-20 bg-white text-black hover:bg-[#ffc971] hover:text-black hover:shadow-[0_0_40px_rgba(255,201,113,0.4)] text-xl font-bold shadow-2xl transition-all duration-500 group/btn">
                <span className="relative z-10">{t('footer.subscribe_btn')}</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover/btn:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
            
            <Link href="/privacy" className="block text-[10px] text-center text-white/20 hover:text-[#c9cba3] uppercase tracking-[0.08em] font-bold transition-colors duration-300">
              {t('footer.privacy_accept')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
