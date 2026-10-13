"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { Section, SectionHeading } from "@/components/layout/Section"
import { useTranslation } from "@/context/LanguageContext"

export function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <Section className="pt-20 pb-6 bg-surface dark:bg-[#0b0b0c]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          title={t('home.testimonials_title') as string} 
          subtitle={t('home.testimonials_subtitle') as string}
          align="center"
          className="mb-10 md:mb-24"
        />
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar touch-momentum -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-10 md:pb-0">
          {(() => {
            const safeList = t<Array<{ author: string; text: string; image: string }>>('home.testimonials', { returnObjects: true }) || [];
            return Array.isArray(safeList) ? safeList.map((testimonial, i) => (
              <div 
                key={i} 
                className="snap-center shrink-0 w-[84vw] sm:w-[360px] md:w-auto bg-white/40 dark:bg-white/[0.02] backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-7 md:p-12 flex flex-col items-start border border-white/40 dark:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
              >
                <div className="flex gap-1 mb-5 md:mb-8">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} className="w-4 h-4 fill-[#ffc971] text-[#ffc971]" />
                  ))}
                </div>
                <p className="text-base sm:text-lg md:text-xl font-bold text-[#1d1d1f] dark:text-white/90 mb-6 md:mb-10 leading-snug tracking-tight">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-4 mt-auto">
                    <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden bg-[#8da9c4]/20 border border-white/20 shrink-0">
                        <Image 
                          src={`https://i.pravatar.cc/150?img=${testimonial.image}`} 
                          alt={testimonial.author}
                          width={48}
                          height={48}
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1d1d1f] dark:text-white tracking-wide">{testimonial.author}</p>
                      <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-[-0.022em]">{t('home.verified_user')}</p>
                    </div>
                </div>
              </div>
            )) : null;
          })()}
        </div>
      </div>
    </Section>
  )
}
