"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { useTranslation } from "@/context/LanguageContext"

export function TherapistsSection() {
  const { t } = useTranslation()

  const therapist = { 
    id: 1, 
    name: "Dra. Mariana Caicedo", 
    specKey: "mariana", 
    rating: "5.0", 
    image: "/images/therapists/mariana_v2.png" 
  }

  return (
    <Section className="py-32 bg-white dark:bg-[#0b0b0c] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20 cursor-pointer">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-4 text-foreground justify-center">
            {t('home.therapists_title')}
          </h2>
          <p className="text-foreground/60 text-lg mt-4 font-medium max-w-xl">
            {t('home.therapists_subtitle')}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="group flex flex-col items-center text-center space-y-8 max-w-sm w-full">
            {/* CIRCULAR AVATAR WITH RINGS */}
            <Link 
              href={`/book`}
              className="relative w-full aspect-square max-w-[260px] block"
            >
              {/* Subtle Ring (Azul 75% focus) */}
              <div className="absolute inset-[-8px] rounded-full border-2 border-[#8da9c4]/75 opacity-0 group-hover:opacity-100 group-hover:inset-[-12px] transition-all duration-500" />
              
              {/* Inner Accent Ring */}
              <div className="absolute inset-0 rounded-full border border-white dark:border-white/10 shadow-inner z-10" />
              
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative z-0 ring-4 ring-[#8da9c4]/10 group-hover:ring-[#8da9c4]/30 transition-all duration-500">
                <Image 
                  src={therapist.image} 
                  alt={therapist.name} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                
                {/* Overlay with subtle Brand Color details */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#8da9c4]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Rating Badge */}
              <div className="absolute bottom-2 right-2 z-20 bg-[#ffc971]/30 backdrop-blur-md px-3 py-1 rounded-full border border-[#ffc971]/20 group-hover:scale-110 transition-transform duration-500">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#ffc971] text-[#ffc971]" />
                  <span className="text-[10px] font-bold tracking-[-0.022em] text-foreground">{therapist.rating}</span>
                </div>
              </div>
            </Link>

            {/* TEXT CONTENT */}
            <div className="space-y-3 w-full">
              <div className="space-y-1 transform group-hover:translate-y-1 transition-transform duration-500">
                <h4 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {therapist.name}
                </h4>
                <p className="text-primary dark:text-[#c9cba3] font-bold text-[10px] tracking-[0.08em] uppercase px-4">
                  {t(`booking.therapists.${therapist.specKey}`)}
                </p>
              </div>

              {/* "Agendar" Button */}
              <div className="pt-4 transition-all duration-500">
                <Button 
                  asChild 
                  className="rounded-full px-10 py-6 bg-primary text-white hover:bg-[#c9cba3] dark:hover:bg-[#ffc971] hover:text-[#111111] transition-all duration-300 font-bold tracking-[0.05em] text-[10px] uppercase shadow-lg shadow-primary/20"
                >
                  <Link href={`/book`}>{t('common.agendar')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
