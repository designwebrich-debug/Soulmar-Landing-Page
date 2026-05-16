"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { COURSE_DATA } from "@/lib/constants"
import { useTranslation } from "@/context/LanguageContext"
import { useCart } from "@/context/CartContext"
import { 
  ChevronLeft,
  ArrowLeft, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Share2,
  Lock,
  ChevronRight,
  Maximize2,
  Volume2,
  Settings,
  SkipForward,
  MessageSquare,
  MoreVertical,
  Send
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeLesson, setActiveLesson] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0) // Default to first lesson expanded
  const [activeClass, setActiveClass] = useState<string | null>(null)
  
  const course = COURSE_DATA.find(c => c.id === id)
  const courseTranslation = t(`courses.library.${id}`, { returnObjects: true }) as unknown as {
    title: string;
    focus: string;
    level?: string;
  }

  const togglePlayer = () => setShowPlayer(!showPlayer)

  if (!course || !courseTranslation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0b0b0c]">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-[-0.022em] uppercase text-primary">404</h1>
          <h2 className="text-2xl font-bold">{t('courses.course_not_found')}</h2>
          <Button onClick={() => router.push('/courses')}>{t('courses.back_to_academy')}</Button>
        </div>
      </div>
    )
  }

  const lessons = Array.from({ length: course.episodes || 10 }).map((_, i) => ({
    id: i,
    title: `${t('courses.lesson_label')} ${i + 1}: ${i === 0 ? t('courses.intro_lesson_title') : t('courses.deep_lesson_title')}`,
    duration: "12:45",
    completed: i < activeLesson,
    active: i === activeLesson,
    classes: [
        { title: `${t('courses.lesson_label')} ${i + 1}.1: Introducción y Contexto`, duration: "05:20" },
        { title: `${t('courses.lesson_label')} ${i + 1}.2: Herramientas de Aplicación`, duration: "07:25" }
    ]
  }))

  const handleEnroll = () => {
    addToCart({
      id: course.id,
      name: courseTranslation.title,
      nameKey: `courses.library.${course.id}.title`,
      price: course.price,
      image: course.image,
      category: course.category
    })
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 pb-20",
      showPlayer ? "bg-black text-white" : "bg-[#f5f5f7] dark:bg-[#0b0b0c] text-foreground"
    )}>
      
      <AnimatePresence mode="wait">
        {!showPlayer ? (
          /* --- COURSE DETAIL VIEW (LANDING) --- */
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-0"
          >
            {/* PREMIUM HERO SECTION - REFINED SUBTLETY */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden bg-black pb-12">
                {/* Background Image with sophisticated masking */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
                    <Image 
                        src={course.image} 
                        alt={courseTranslation.title} 
                        fill 
                        className="object-cover brightness-[0.6] scale-100"
                        priority
                    />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-5xl"
                    >
                        {/* Back Button - Minimalist */}
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-3 text-white/60 hover:text-white transition-all font-medium uppercase tracking-[0.08em] text-[10px] mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('courses.back_to_courses')}
                        </button>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Badge className="bg-primary/20 text-primary border border-primary/20 px-4 py-1 rounded-full font-bold uppercase text-[9px] tracking-[0.05em] backdrop-blur-md">
                                    {t(`courses.categories.${course.category}`)} • {courseTranslation.level || 'Premium Content'}
                                </Badge>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] tracking-tight max-w-4xl">
                                    {courseTranslation.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl leading-relaxed">
                                    {t('courses.focus_quote_alt') || t('courses.focus_quote', { focus: courseTranslation.focus.toLowerCase() })}
                                </p>
                            </div>

                            {/* Metadata Pills */}
                            <div className="flex flex-wrap items-center gap-8 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                        <Image src="/images/therapists/mariana_v2.png" alt={course.instructor} width={40} height={40} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.05em] text-white/30">{t('courses.instructor')}</p>
                                        <p className="text-sm font-bold text-white/90">{course.instructor}</p>
                                    </div>
                                </div>
                                
                                <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.05em] text-white/30">{t('courses.duration')}</p>
                                        <p className="text-sm font-bold">{course.duration}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-white/90">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.05em] text-white/30">{t('courses.rating')}</p>
                                        <p className="text-sm font-bold">{course.rating}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Elite CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                <Button 
                                    onClick={handleEnroll}
                                    size="lg" 
                                    className="rounded-full px-10 h-16 text-lg font-bold shadow-2xl bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] transition-all"
                                >
                                    {t('courses.buy_course')}
                                </Button>
                                <Button 
                                    onClick={togglePlayer}
                                    variant="outline" 
                                    size="lg" 
                                    className="rounded-full px-10 h-16 text-lg font-bold bg-white/5 backdrop-blur-md text-white border-white/20 hover:bg-white hover:text-black transition-all group"
                                >
                                    <Play className="mr-3 w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                    {t('courses.watch_free_sample') || 'Ver muestra gratis'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:block"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
            </section>

            {/* CURRICULUM & ABOUT SECTION */}
            <div className="container mx-auto px-6 md:px-12 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
                    {/* LEFT: Curriculum (7 cols) */}
                    <div className="lg:col-span-7 space-y-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-[-0.022em] uppercase">{t('courses.curriculum_title')}</h2>
                                <p className="text-lg text-foreground/40 font-medium">{t('courses.modules_badge_desc', { count: course.episodes })}</p>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/40">{t('courses.rate_course')}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-5 h-5 transition-colors cursor-pointer hover:scale-110", i < Math.floor(course.rating) ? "fill-primary text-primary dark:fill-secondary-yellow dark:text-secondary-yellow" : "text-foreground/15 hover:text-primary/40 dark:hover:text-secondary-yellow/40")} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-foreground ml-1">{course.rating}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {lessons.slice(0, 7).map((l, i) => (
                                <div key={i} className="space-y-4">
                                    <motion.div 
                                        onClick={() => setExpandedLesson(expandedLesson === i ? null : i)}
                                        className={cn(
                                            "p-8 rounded-[32px] transition-all duration-500 flex items-center justify-between group cursor-pointer border",
                                            expandedLesson === i 
                                                ? "bg-white dark:bg-white/[0.05] border-secondary-olive/30 shadow-2xl shadow-secondary-olive/10 scale-[1.02]" 
                                                : "bg-white dark:bg-white/[0.02] border-foreground/[0.05] hover:border-primary/20 dark:hover:border-secondary-yellow/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-8">
                                            <span className={cn(
                                                "text-3xl font-bold transition-colors duration-500",
                                                expandedLesson === i 
                                                    ? "text-secondary-olive" 
                                                    : "text-primary/30 dark:text-secondary-yellow group-hover:text-secondary-olive dark:group-hover:text-primary"
                                            )}>
                                                0{i+1}
                                            </span>
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-xl text-foreground tracking-tight uppercase">{l.title}</h4>
                                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/30">
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {l.duration} {t('courses.min')}</span>
                                                    {i === 0 ? (
                                                        <span className="text-emerald-500 font-bold">{t('courses.free_badge')}</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> {t('courses.locked_badge')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500",
                                            expandedLesson === i 
                                                ? "bg-secondary-olive border-secondary-olive text-white rotate-90" 
                                                : "border-primary/20 text-primary dark:border-secondary-yellow dark:text-secondary-yellow group-hover:border-secondary-olive group-hover:text-secondary-olive dark:group-hover:border-primary dark:group-hover:text-primary"
                                        )}>
                                            <ChevronRight className={cn("w-5 h-5 transition-transform", expandedLesson === i && "hidden")} />
                                            {expandedLesson === i && <ChevronRight className="w-5 h-5" />}
                                        </div>
                                    </motion.div>

                                    {/* EXPANDED CLASSES (SUB-MODULES) */}
                                    <AnimatePresence>
                                        {expandedLesson === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                className="overflow-hidden px-4"
                                            >
                                                <div className="py-2 space-y-2">
                                                    {l.classes.map((cls, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            onClick={() => { setActiveClass(`${i}-${idx}`); togglePlayer(); }}
                                                            className={cn(
                                                                "flex items-center justify-between p-6 rounded-2xl border transition-all group/class cursor-pointer",
                                                                activeClass === `${i}-${idx}`
                                                                    ? "bg-secondary-olive/5 border-secondary-olive/20"
                                                                    : "bg-foreground/[0.02] border-foreground/[0.03] hover:bg-white dark:hover:bg-white/5"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <span className={cn(
                                                                    "text-2xl font-bold transition-colors",
                                                                    activeClass === `${i}-${idx}`
                                                                        ? "text-secondary-olive"
                                                                        : "text-primary dark:text-secondary-yellow group-hover/class:text-secondary-olive dark:group-hover/class:text-secondary-olive"
                                                                )}>
                                                                    {idx + 1}
                                                                </span>
                                                                <div>
                                                                    <h5 className={cn(
                                                                        "font-bold text-sm transition-colors uppercase tracking-tight",
                                                                        activeClass === `${i}-${idx}` ? "text-secondary-olive" : "text-foreground/80 group-hover/class:text-foreground"
                                                                    )}>{cls.title}</h5>
                                                                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.05em]">{cls.duration} {t('courses.min')}</p>
                                                                </div>
                                                            </div>
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full border flex items-center justify-center transition-all transform",
                                                                activeClass === `${i}-${idx}`
                                                                    ? "opacity-100 bg-secondary-olive border-secondary-olive text-white scale-100"
                                                                    : "opacity-0 border-foreground/5 group-hover/class:opacity-100 group-hover/class:bg-secondary-olive group-hover/class:border-secondary-olive dark:group-hover/class:bg-secondary-olive dark:group-hover/class:border-secondary-olive group-hover/class:text-white scale-90 group-hover/class:scale-100"
                                                            )}>
                                                                <Play className="w-3 h-3 fill-current ml-0.5" />
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                            {course.episodes > 7 && (
                                <div className="pt-12 text-center">
                                    <Button variant="ghost" className="rounded-full px-12 h-14 font-bold uppercase tracking-[0.05em] text-xs opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-all">
                                        {t('courses.view_all_lessons', { count: course.episodes - 7 })}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: About the course (5 cols) */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                                {t('courses.about_course')}
                            </h2>
                            <div className="h-1.5 w-20 bg-primary rounded-full" />
                        </div>
                        
                        <div className="space-y-10">
                            <div className="text-xl md:text-2xl text-foreground font-medium leading-[1.1]">
                                {t('courses.course_desc_prefix')}
                                <span className="text-primary font-bold"> {t('courses.course_desc_suffix', { count: course.episodes })}</span>
                            </div>
                            
                            {/* Instructor + Rating + Modules Row */}
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                {/* Circular Instructor Photo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                                        <Image src="/images/therapists/mariana_v2.png" alt={course.instructor} width={40} height={40} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground leading-[1.1]">{course.instructor}</p>
                                        <p className="text-[10px] text-foreground/40">{t(`courses.categories.${course.category}`)}</p>
                                    </div>
                                </div>

                                <div className="h-8 w-[1px] bg-foreground/10" />

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-3.5 h-3.5", i < Math.floor(course.rating) ? "fill-amber-400 text-amber-400" : "text-foreground/10")} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-foreground">{course.rating}</span>
                                </div>

                                <div className="h-8 w-[1px] bg-foreground/10" />

                                {/* Total Modules */}
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold text-foreground">{course.episodes} {t('courses.modules_badge')}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 pt-4">

                                {[
                                    { t: t('courses.features.hd.title', { count: course.episodes }), d: t('courses.features.hd.desc') },
                                    { t: t('courses.features.lifetime.title'), d: t('courses.features.lifetime.desc') },
                                    { t: t('courses.features.downloadable.title'), d: t('courses.features.downloadable.desc') },
                                    { t: t('courses.features.certificate.title'), d: t('courses.features.certificate.desc') }
                                ].map((item, i) => (
                                    <div key={i} className="group/item p-5 rounded-3xl bg-foreground/[0.06] dark:bg-foreground/[0.02] border border-transparent hover:border-primary/10 dark:hover:border-secondary-yellow/10 transition-all flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary dark:bg-secondary-yellow flex items-center justify-center text-white dark:text-black shrink-0 group-hover/item:bg-secondary-yellow group-hover/item:text-black transition-colors duration-300">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold uppercase tracking-[0.05em] text-foreground leading-[1.1]">{item.t}</p>
                                            <p className="text-[11px] text-foreground/40 font-medium leading-snug">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* REVIEWS BOX */}
                            <div className="mt-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] shadow-lg shadow-black/[0.03] dark:shadow-none overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-black/[0.04] dark:border-white/[0.05]">
                                    <MessageSquare className="w-4 h-4 text-primary dark:text-secondary-yellow" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-foreground/40">{t('courses.reviews_title')}</span>
                                    <span className="text-[9px] font-bold text-foreground/20 ml-auto">3</span>
                                </div>

                                {/* Reviews List */}
                                <div className="max-h-[240px] overflow-y-auto">
                                    {[
                                        { name: "Valentina R.", img: "/images/reviewers/valentina.png", comment: t('courses.reviews.r1'), time: "2d" },
                                        { name: "Carlos M.", img: "/images/reviewers/carlos.png", comment: t('courses.reviews.r2'), time: "5d" },
                                        { name: "Sofía L.", img: "/images/reviewers/sofia.png", comment: t('courses.reviews.r3'), time: "1w" },
                                    ].map((r, i) => (
                                        <div key={i} className={cn("px-5 py-4 space-y-2", i > 0 && "border-t border-black/[0.03] dark:border-white/[0.04]")}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-2 ring-black/[0.04] dark:ring-white/[0.08]">
                                                        <Image src={r.img} alt={r.name} width={28} height={28} className="object-cover w-full h-full" />
                                                    </div>
                                                    <span className="text-[11px] font-bold text-foreground">{r.name}</span>
                                                </div>
                                                <span className="text-[9px] text-foreground/20 font-medium">{r.time}</span>
                                            </div>
                                            <p className="text-[11px] text-foreground/50 font-medium leading-relaxed pl-[38px]">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="px-5 py-3.5 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center gap-3 bg-black/[0.01] dark:bg-white/[0.01]">
                                    <input 
                                        type="text" 
                                        placeholder={t('courses.reviews_placeholder') as string}
                                        className="flex-1 bg-transparent text-xs text-foreground placeholder:text-foreground/20 outline-none font-medium"
                                    />
                                    <button className="w-7 h-7 rounded-full bg-primary dark:bg-secondary-yellow flex items-center justify-center text-white dark:text-black hover:scale-110 active:scale-95 transition-transform shrink-0 shadow-sm">
                                        <Send className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



          </motion.div>
        ) : (
          /* --- CINEMATIC VIDEO PLAYER VIEW --- */
          <motion.div 
            key="player"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
          >
            {/* PLAYER TOP BAR */}
            <div className="p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent relative z-20">
                <div className="flex items-center gap-10">
                    <button 
                        onClick={togglePlayer}
                        className="w-14 h-14 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all group"
                    >
                        <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <Badge className="bg-primary/20 text-primary border-none text-[8px] font-bold tracking-[0.3em] uppercase mb-1">{t('courses.playing_badge')}</Badge>
                        <h2 className="text-2xl font-bold tracking-tight uppercase leading-none">{lessons[activeLesson].title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all text-white/40 hover:text-white"><Share2 className="w-5 h-5" /></button>
                    <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all text-white/40 hover:text-white"><Settings className="w-5 h-5" /></button>
                    <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all text-white/40 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* VIDEO CONTAINER */}
                <div className="flex-1 relative group cursor-none hover:cursor-default">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0b0b0c]">
                        <Image 
                            src={course.image} 
                            alt="Video Thumbnail" 
                            fill 
                            className="object-cover opacity-50 blur-sm"
                        />
                        <div className="relative z-10 w-full aspect-video max-w-6xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 group/player">
                            <Image src={course.image} alt="Main" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover/player:opacity-100 opacity-0 transition-opacity">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-3xl flex items-center justify-center text-white border border-white/20"
                                >
                                    {isPlaying ? <div className="w-8 h-10 flex gap-2"><div className="w-3 h-full bg-white rounded-full"/><div className="w-3 h-full bg-white rounded-full"/></div> : <Play className="w-12 h-12 fill-current ml-2" />}
                                </motion.button>
                            </div>

                            {/* PLAYER CONTROLS HUB */}
                            <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover/player:translate-y-0 translate-y-10 transition-all duration-700">
                                <div className="space-y-8">
                                    {/* PROGRESS BAR */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.05em] text-white/40">
                                            <span>04:20</span>
                                            <span>12:45</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative cursor-pointer group/bar">
                                            <div className="h-full w-[35%] bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] relative">
                                                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* BUTTONS HUB */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-10">
                                            <button className="text-white/60 hover:text-white transition-colors"><SkipForward className="w-8 h-8 rotate-180" /></button>
                                            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:scale-110 transition-transform">
                                                {isPlaying ? <div className="w-6 h-8 flex gap-2"><div className="w-2.5 h-full bg-white rounded-full"/><div className="w-2.5 h-full bg-white rounded-full"/></div> : <Play className="w-10 h-10 fill-current" />}
                                            </button>
                                            <button className="text-white/60 hover:text-white transition-colors"><SkipForward className="w-8 h-8" /></button>
                                            <div className="flex items-center gap-4 text-white/60 group/vol">
                                                <Volume2 className="w-6 h-6 hover:text-white cursor-pointer" />
                                                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-white group-hover/vol:bg-primary" /></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <button className="text-xs font-bold uppercase tracking-[0.05em] text-white/40 hover:text-white">1.0x</button>
                                            <button className="text-white/60 hover:text-white transition-colors"><Maximize2 className="w-6 h-6" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR: LESSONS & EXTRAS (400px fixed) */}
                <div className="w-full lg:w-[450px] bg-[#0b0b0c] border-l border-white/5 flex flex-col relative z-20">
                    <div className="p-10 space-y-10 flex-1 overflow-y-auto no-scrollbar">
                        <div className="flex gap-10 border-b border-white/5">
                            {["curriculum", "overview", "notes"].map((tab) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "pb-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative",
                                        tab === "curriculum" ? "text-primary" : "text-white/30 hover:text-white"
                                    )}
                                >
                                    {tab === 'curriculum' ? t('courses.content_tab') : tab === 'overview' ? t('courses.overview_tab') : t('courses.notes_tab')}
                                    {tab === "curriculum" && <motion.div layoutId="player-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            {lessons.map((lesson, idx) => (
                                <motion.div 
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(idx)}
                                    className={cn(
                                        "p-6 rounded-3xl border transition-all duration-500 cursor-pointer flex items-center justify-between group",
                                        idx === activeLesson 
                                            ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.1)]" 
                                            : "bg-white/5 border-transparent hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            idx === activeLesson ? "bg-primary text-white" : "bg-white/5 text-white/20 group-hover:text-white/40"
                                        )}>
                                            {lesson.completed ? <CheckCircle2 className="w-6 h-6" /> : <Play className={cn("w-5 h-5", idx === activeLesson && "fill-current")} />}
                                        </div>
                                        <div>
                                            <h5 className={cn("font-bold text-sm tracking-tight uppercase", idx === activeLesson ? "text-white" : "text-white/40")}>{lesson.title}</h5>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-white/20">Lección {idx + 1} • {lesson.duration}m</p>
                                        </div>
                                    </div>
                                    {idx === activeLesson && <motion.div layoutId="active-indicator" className="w-1.5 h-6 bg-primary rounded-full" />}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* PLAYER SIDEBAR FOOTER */}
                    <div className="p-10 bg-black/50 border-t border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-white/30">{t('courses.next_lesson')}</span>
                            <span className="text-primary font-bold tracking-tight cursor-pointer hover:underline">{t('courses.skip')} →</span>
                        </div>
                        <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0">
                                <Image src={course.image} alt="Next" fill className="object-cover opacity-60" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-tight truncate">{lessons[activeLesson + 1]?.title || t('courses.end_of_course')}</p>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showPlayer && (
        /* RATE COURSE SECTION */
        <section className="py-32 bg-white dark:bg-[#0b0b0c]">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto p-16 md:p-32 rounded-[4rem] bg-[#f5f5f7] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 relative overflow-hidden group text-center">
                    {/* Subtle aesthetic backdrop */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-150" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -ml-32 -mb-32 transition-transform duration-1000 group-hover:scale-150" />
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative z-10 space-y-8"
                    >
                        <div className="space-y-4">
                            <h3 className="text-3xl md:text-5xl font-bold text-foreground tracking-[-0.022em] uppercase leading-[1.1] max-w-3xl mx-auto">
                                {t('courses.rate_course_title')}
                            </h3>
                            <div className="h-1.5 w-16 bg-primary dark:bg-secondary-yellow rounded-full mx-auto" />
                            <p className="text-lg md:text-xl text-foreground/40 font-medium max-w-2xl mx-auto leading-relaxed">
                                {t('courses.rate_course_subtitle')}
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={cn(
                                    "w-12 h-12 md:w-14 md:h-14 cursor-pointer transition-all duration-300 hover:scale-130 hover:-translate-y-1",
                                    i < Math.floor(course.rating) 
                                        ? "fill-secondary-yellow text-secondary-yellow" 
                                        : "text-foreground/10 hover:fill-secondary-yellow/30 hover:text-secondary-yellow/30"
                                )} />
                            ))}
                        </div>

                        <p className="text-xs font-medium text-foreground/30 pt-4 uppercase tracking-[0.05em]">
                            {course.rating} / 5.0
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
      )}
    </div>
  )
}
