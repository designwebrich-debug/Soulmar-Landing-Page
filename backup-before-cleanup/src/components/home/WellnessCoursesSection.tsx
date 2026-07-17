"use client"

import Link from "next/link"
import Image from "next/image"
import { Play, GraduationCap } from "lucide-react"
import { Section } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useTranslation } from "@/context/LanguageContext"

export function WellnessCoursesSection() {
  const { t } = useTranslation()

  return (
    <Section className="py-24 bg-[#0A0A0B] text-white transition-colors duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-4">
          <Badge className="bg-secondary-yellow text-[#111111] border-none rounded-full px-4">{t('home.courses_badge')}</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4">
            {t('home.courses_title')}
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-secondary-yellow" strokeWidth={1.5} />
          </h2>
          <p className="text-white/60 max-w-2xl">{t('home.courses_subtitle')}</p>
        </div>
        <Button className="rounded-full px-8 bg-secondary-yellow text-[#111111] hover:bg-secondary-yellow/90 font-bold" asChild>
          <Link href="/courses">{t('home.courses_cta')}</Link>
        </Button>
      </div>

      <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth px-4 -mx-4">
        {[
          { id: 1, title: t('courses.library.course1.title') as string, instructor: "Dra. Mariana Caicedo", episodes: "12", image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800" },
          { id: 2, title: t('courses.library.course2.title') as string, instructor: "Dr. Moshé Musini", episodes: "8", image: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&q=80&w=800" },
          { id: 3, title: t('courses.library.course3.title') as string, instructor: "Dra. Libertad Mejía", episodes: "15", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=800" },
          { id: 4, title: t('courses.library.course4.title') as string, instructor: "Dra. Mariana Caicedo", episodes: "10", image: "https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=800" }
        ].map((course) => (
          <div key={course.id} className="min-w-[320px] md:min-w-[400px] group cursor-pointer">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 shadow-2xl transition-all group-hover:-translate-y-2">
              <Image src={course.image} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
              </div>
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <Badge className="bg-white/20 backdrop-blur-md border-none text-white font-bold">{course.episodes} {t('common.courses_episodes') || t('courses.episodes')}</Badge>
              </div>
            </div>
            <h4 className="text-xl font-bold mb-1 truncate text-white">{course.title}</h4>
            <p className="text-white/40 text-sm">{course.instructor}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
