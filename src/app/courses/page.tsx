"use client"

import { Section } from "@/components/layout/Section"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Search, Play, Clock, ChevronRight, Star, Check, Headphones, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { getCourses } from "@/lib/actions/courses"

type TranslationResult = string | React.ReactNode | React.ReactNode[] | Record<string, any> | any[];

interface Feature {
  id: string;
  name: string;
}

interface PricingPlan {
  id: string;
  key: string;
  price: number;
  period: string;
  color: string;
  featured?: boolean;
}

interface Course {
  id: string | number;
  slug: string;
  title?: string;
  type?: string;
  is_free?: boolean;
  image_url?: string;
  image?: string;
  rating: number | string;
  duration: string;
  price: number;
  instructor?: string;
  category: string;
  nameKey?: string;
}

import esLib from "@/i18n/locales/es.json"
import enLib from "@/i18n/locales/en.json"

const CATEGORIES = [
  { id: "all", key: "courses.categories.all" },
  { id: "anxiety", key: "courses.categories.anxiety" },
  { id: "mindfulness", key: "courses.categories.mindfulness" },
  { id: "growth", key: "courses.categories.growth" },
  { id: "yoga", key: "courses.categories.yoga" },
  { id: "psychology", key: "courses.categories.psychology" },
  { id: "relationships", key: "courses.categories.relationships" }
]

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "sub-student",
    key: "student",
    price: 9890,
    period: "common.per_month",
    color: "secondary-olive"
  },
  {
    id: "sub-group",
    key: "group",
    price: 47989,
    period: "common.per_month",
    featured: true,
    color: "primary"
  },
  {
    id: "sub-basic",
    key: "standard",
    price: 19989,
    period: "common.per_month",
    color: "secondary-yellow"
  }
]

interface CourseCardProps {
  course: Course
  t: (key: string, options?: Record<string, unknown>) => TranslationResult
  onAddToCart: (course: Course) => void
  sectionKey?: string
  index?: number
}

function CourseCard({ course, t, onAddToCart, sectionKey, index }: CourseCardProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHoveringButton, setIsHoveringButton] = useState(false)
  const courseData = t(`courses.library.${course.slug}`, { returnObjects: true }) as unknown as { title: string; focus: string; keywords: string }
  const isPodcast = course.type === "podcast" || sectionKey === "podcast"
  const isFree = course.is_free || sectionKey === "free"
  const isNew = sectionKey === "new" && (index !== undefined && index < 4)
  
  const { cart, removeFromCart, updateQuantity } = useCart()
  const cartItem = cart.find(item => item.id === course.slug)
  const quantity = cartItem?.quantity || 0

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      updateQuantity(course.slug, quantity - 1)
    } else {
      removeFromCart(course.slug)
    }
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart({ ...course, title: courseData.title })
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      className="group cursor-pointer flex flex-col h-full bg-background rounded-[2rem] p-3 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
    >
      <Link href={`/courses/${course.slug}`} className="block overflow-hidden rounded-[1.5rem] mb-6 relative aspect-[16/10] shadow-sm">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full relative"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground/20" 
            style={{ backgroundImage: course.image_url ? `url(${course.image_url})` : 'none' }} 
          >
            {!course.image && <span className="font-bold text-sm tracking-[0.05em] uppercase">Soulmar</span>}
          </div>
          
          {/* NUEVO Badge */}
          {isNew && (
            <div className="absolute top-4 right-4 z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary-yellow text-foreground text-[0.65rem] font-bold tracking-[0.05em] px-3 py-1.5 rounded-full shadow-lg"
              >
                {t('courses.badge_new') as string}
              </motion.div>
            </div>
          )}
          
          {/* Play Icon Overlay On Hover */}
          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-2xl"
            >
              <Play className="w-7 h-7 text-white fill-current translate-x-0.5" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
      
      <div className="flex flex-col flex-grow px-2">
        <div className="flex justify-between items-start mb-2 group/title">
          <Link href={`/courses/${course.slug}`} className="flex-grow">
            <h4 className="text-base md:text-lg font-bold leading-[1.1] tracking-tight text-foreground/90 group-hover/title:text-primary transition-colors line-clamp-2">
              {courseData?.title || "Untitled Course"}
            </h4>
          </Link>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "transition-all p-1.5",
              isFavorite ? "text-secondary-yellow" : "text-foreground/20 hover:text-foreground/40"
            )}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Star className={cn("w-5 h-5", isFavorite ? "fill-current" : "")} />
            </motion.div>
          </motion.button>
        </div>
        
        <p className="text-[0.7rem] font-medium tracking-[0.05em] text-foreground/40 mb-3 uppercase">
          {t("home.highlights.1.title") as string || "Academia Soulmar"}
        </p>
        
        <div className="flex items-center gap-3 text-[0.75rem] text-foreground/40 font-light mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-60" /> {course.duration}
          </span>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500/60 fill-yellow-500/60" /> {course.rating}
          </span>
        </div>
        
        <div className={cn(
          "mt-auto flex items-center gap-4 pt-4 border-t border-border/10",
          isPodcast ? "justify-center" : "justify-between"
        )}>
          {!isPodcast && (
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold tracking-tight text-foreground/90 uppercase leading-none">
                {isFree ? "$0 COP" : formatPrice(course.price)}
              </span>
            </div>
          )}
          <Button 
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
            onClick={(e) => {
              if (isFree || isPodcast) {
                e.preventDefault()
                router.push(`/courses/${course.slug}`)
              } else if (quantity === 0) {
                onAddToCart({ ...course, id: course.slug, title: courseData.title })
              }
            }}
            className={cn(
              "rounded-full h-10 transition-all duration-300 shadow-lg flex items-center shrink-0 overflow-hidden",
              (quantity > 0 && isHoveringButton) ? "px-3 gap-2" : "px-6 gap-0",
              isPodcast || isFree
                ? "bg-primary text-background hover:bg-secondary-yellow dark:bg-secondary-yellow dark:text-background dark:hover:bg-secondary-olive dark:hover:text-background hover:-translate-y-1" 
                : "bg-surface border border-border/50 text-foreground/70 dark:bg-surface dark:border-border/10 dark:text-foreground/60 hover:bg-secondary-yellow hover:text-background hover:border-secondary-yellow dark:hover:bg-white dark:hover:text-black dark:hover:border-white"
            )}
          >
            <AnimatePresence>
              {!(isFree || isPodcast) && quantity > 0 && isHoveringButton && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onClick={handleDecrease}
                  className="hover:scale-110 transition-transform p-1.5 bg-foreground/5 dark:bg-white/5 rounded-full"
                >
                  <Minus className="w-3 h-3" />
                </motion.div>
              )}
            </AnimatePresence>

            <span className={cn(
              "text-[0.65rem] font-bold tracking-[0.05em] uppercase whitespace-nowrap",
              (quantity > 0 && isHoveringButton) ? "px-1" : ""
            )}>
              {isPodcast || isFree ? (t("courses.view_free") as string) : (t("courses.buy_now") as string)}
              {!(isFree || isPodcast) && quantity > 0 && ` (${quantity})`}
            </span>

            <AnimatePresence>
              {!(isFree || isPodcast) && quantity > 0 && isHoveringButton && (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onClick={handleIncrease}
                  className="hover:scale-110 transition-transform p-1.5 bg-foreground/5 dark:bg-white/5 rounded-full"
                >
                  <Plus className="w-3 h-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function CourseGrid({ items, t, onAddToCart, sectionKey }: { items: Course[]; t: (key: string, options?: Record<string, unknown>) => TranslationResult; onAddToCart: (item: Course) => void; sectionKey?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {items.map((course, idx) => (
        <CourseCard key={`${course.id}-${idx}`} course={course} t={t} onAddToCart={onAddToCart} sectionKey={sectionKey} index={idx} />
      ))}
    </div>
  )
}

function AcademyHero({ t }: { t: (key: string, options?: Record<string, unknown>) => TranslationResult }) {
  const [current, setCurrent] = useState(0)
  interface HeroSlide {
    title: string;
    subtitle: string;
    instructor: string;
  }
  const slides = t('courses.hero_slides', { returnObjects: true }) as HeroSlide[] 
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (slides && Array.isArray(slides) ? slides.length : 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [slides])

  if (!slides || !slides[current]) return null

  return (
    <Section className="pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${current === 0 ? "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000" : current === 1 ? "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=2000" : "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=2000"})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
              <div className="relative z-20 h-full p-10 md:p-20 flex flex-col justify-center max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h1 className="text-white/60 text-lg md:text-xl font-medium mb-4 tracking-wider uppercase">
                    {slides[current].title}
                  </h1>
                  <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                    {slides[current].subtitle}
                  </h2>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="text-white/80">
                      <p className="text-xs uppercase tracking-[0.05em] mb-1 opacity-60">{t('courses.instructor') as string}</p>
                      <p className="font-bold">{slides[current].instructor}</p>
                    </div>
                    <div className="text-white/80">
                      <p className="text-xs uppercase tracking-[0.05em] mb-1 opacity-60">{t('courses.duration') as string}</p>
                      <p className="font-bold">{current === 0 ? "30 min" : current === 1 ? "45 min" : "60 min"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Button asChild className="rounded-full bg-white text-black hover:bg-white/90 px-10 h-14 font-bold text-lg shadow-2xl transition-transform hover:scale-105" size="lg">
                      <Link href={`/courses/course${current + 1}#curriculum`}>
                        <Play className="mr-3 w-6 h-6 fill-current" /> {t('courses.watch_now') as string}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-12 h-1.5 rounded-full transition-all duration-500",
                  current === i ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function PricingSection({ t, onAddToCart }: { t: (key: string, options?: Record<string, unknown>) => TranslationResult; onAddToCart: (item: Course) => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  }

  return (
    <Section className="py-24 bg-surface/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary-yellow/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">{t("courses.pricing.title") as string}</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">{t("courses.pricing.subtitle") as string}</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {PRICING_PLANS.map((plan) => {
            interface PlanData {
              name: string;
              tag?: string;
              description: string;
              features: string[];
            }
            const planData = t(`courses.pricing.${plan.key}`, { returnObjects: true }) as unknown as PlanData
            const isFeatured = plan.featured
            
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="relative group"
              >
                {/* Floating Animation for Featured Card */}
                {isFeatured && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-0 -top-6 flex justify-center z-30"
                  >
                    <Badge className="bg-[#A0C4FF] text-slate-900 border-none px-8 py-2.5 rounded-full font-bold text-xs tracking-[0.05em] uppercase shadow-xl shadow-blue-500/20">
                      {planData.tag as string}
                    </Badge>
                  </motion.div>
                )}

                <div className={cn(
                  "relative h-full p-10 md:p-14 rounded-[3.5rem] border-2 transition-all duration-500 overflow-hidden flex flex-col",
                  // Dark Mode Styles (Transparencies & Blur)
                  "dark:bg-slate-900/40 dark:backdrop-blur-xl",
                  isFeatured 
                    ? "dark:border-primary/40 dark:shadow-blue-500/10" 
                    : plan.color === "secondary-yellow" 
                      ? "dark:border-secondary-yellow/20 dark:hover:border-secondary-yellow/40" 
                      : "dark:border-secondary-olive/20 dark:hover:border-secondary-olive/40",
                  
                  // Light Mode Styles (Pure Solid & Exact Brand Colors)
                  "bg-white border-transparent shadow-xl shadow-black/5",
                  !isFeatured && plan.color === "secondary-yellow" && "bg-white border-secondary-yellow/30",
                  !isFeatured && plan.color === "secondary-olive" && "bg-white border-secondary-olive/30",
                  isFeatured && "bg-white border-primary/30"
                )}>
                  {/* Card Glow Effect - ONLY IN DARK MODE */}
                  <div className={cn(
                    "absolute -inset-1 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10",
                    isFeatured ? "bg-primary/20" : plan.color === "secondary-yellow" ? "bg-secondary-yellow/20" : "bg-secondary-olive/20"
                  )} />

                  <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-[#111111] dark:text-white group-hover:opacity-100 transition-opacity">{planData.name as string}</h3>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className={cn(
                        "text-4xl md:text-5xl font-extrabold transition-all duration-500 group-hover:scale-105 inline-block leading-none whitespace-nowrap",
                        isFeatured ? "text-primary" : plan.color === "secondary-yellow" ? "text-secondary-yellow" : "text-secondary-olive"
                      )}>
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-foreground/40 dark:text-foreground/30 font-bold uppercase text-[0.65rem] tracking-[0.05em]">{t(plan.period) as string}</span>
                    </div>
                    <p className="text-[#111111]/60 dark:text-foreground/50 mt-4 text-sm font-semibold leading-relaxed">{planData.description as string}</p>
                  </div>

                  <ul className="space-y-5 mb-12 flex-grow">
                    {planData.features && Array.isArray(planData.features) && (planData.features as string[]).map((feature, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.5 }}
                        className="flex items-center gap-4 text-[#111111]/70 dark:text-foreground/70 group-hover:text-[#111111] dark:group-hover:text-foreground/90 transition-colors"
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm",
                          isFeatured ? "bg-primary text-white" : plan.color === "secondary-yellow" ? "bg-secondary-yellow text-[#111111]" : "bg-secondary-olive text-[#111111]"
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-bold">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => onAddToCart({ 
                      id: plan.id, 
                      slug: plan.key,
                      title: planData.name as string, 
                      price: plan.price, 
                      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
                      rating: 5,
                      duration: "Life",
                      category: "subscription"
                    })}
                    className={cn(
                      "w-full h-16 rounded-full font-bold text-sm tracking-[0.05em] uppercase transition-all duration-500 shadow-lg active:scale-95",
                      isFeatured 
                        ? "bg-primary hover:bg-primary text-white shadow-primary/20" 
                        : plan.color === "secondary-yellow" 
                          ? "bg-secondary-yellow hover:bg-secondary-yellow text-[#111111] shadow-secondary-yellow/10" 
                          : "bg-secondary-olive hover:bg-secondary-olive text-[#111111] shadow-secondary-olive/10"
                    )}
                  >
                    {t("courses.buy_now") as string}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </Section>
  )
}

export default function CoursesPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true)
      const data = await getCourses()
      setCourses(data)
      setIsLoading(false)
    }
    loadCourses()
  }, [])

  const handleAddToCart = (item: Course) => {
    let nameKey = item.nameKey
    
    if (!nameKey) {
      if (item.id.toString().startsWith('sub-')) {
        nameKey = `courses.pricing.${item.slug}.name`
      } else {
        const slug = item.slug || item.id
        nameKey = `courses.library.${slug}.title`
      }
    }

    addToCart({
      id: item.id,
      name: item.title || "",
      nameKey: nameKey,
      price: item.price,
      image: item.image || "https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800"
    })
  }

  // Filter courses based on search query or category
  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory
    if (searchQuery === "") return matchesCategory

    // Advanced Normalization (Lowercase + Remove Accents)
    const normalize = (str: string) => 
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || ""

    const q = normalize(searchQuery)
    
    // Get translations for BOTH languages to allow cross-language searching
    // Typed casting for library lookup to satisfy zero-any policy
    const esLibrary = esLib.courses.library as unknown as Record<string, Record<string, string>>
    const enLibrary = enLib.courses.library as unknown as Record<string, Record<string, string>>
    
    const es = esLibrary[course.slug as string] || {}
    const en = enLibrary[course.slug as string] || {}
    
    // Create a rich search pool from all available metadata
    const searchPool = [
      es.title, es.focus, es.keywords,
      en.title, en.focus, en.keywords,
      course.instructor,
      course.slug,
      course.category
    ].filter((s): s is string => typeof s === 'string').map(s => normalize(s)).join(" ")

    // Multi-word matching: check if every word (min 2 chars) of query matches something in pool
    const queryWords = q.split(/\s+/).filter(w => w.length >= 2)
    
    if (queryWords.length === 0) return matchesCategory && searchPool.includes(q)
    
    const matchesSearch = queryWords.every(word => searchPool.includes(word))
    
    return matchesCategory && matchesSearch
  })

  // Group default sections using database fields
  const newCourses = courses.filter(c => c.type === 'course' && !c.is_free).slice(0, 10)
  const freeCourses = courses.filter(c => c.is_free && c.type !== 'podcast')
  const podcasts = courses.filter(c => c.type === 'podcast')
  
  const sections = [
    { title: "courses.sections.new", key: "new", items: newCourses },
    { title: "courses.sections.free", key: "free", items: freeCourses },
    { title: "courses.sections.podcast", key: "podcast", items: podcasts }
  ]

  return (
    <div className="flex flex-col w-full pb-32 bg-background">
      <AcademyHero t={t} />

      {/* SEARCH & FILTERS - MINIMALIST */}
      <section className="pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="relative group max-w-xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#111111]/40 dark:text-foreground/20 group-focus-within:text-primary transition-all" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={(t("courses.categories.all") as string) + "..."} 
                className="w-full h-14 pl-14 pr-8 rounded-full bg-white dark:bg-surface/30 border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium tracking-wide text-[#111111] dark:text-foreground placeholder:text-[#111111]/40 dark:placeholder:text-foreground/20"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <motion.button 
                  key={cat.id}
                  layout
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-6 py-2 text-[0.7rem] font-bold tracking-[0.05em] uppercase rounded-full transition-all border relative",
                    activeCategory === cat.id
                      ? "bg-[#111111] text-white border-[#111111] dark:bg-foreground dark:text-background dark:border-foreground shadow-lg z-10" 
                      : "bg-transparent text-[#111111]/60 border-border hover:border-[#111111]/30 hover:text-[#111111] dark:text-foreground/40 dark:border-border/50 dark:hover:border-foreground/20 dark:hover:text-foreground/60"
                  )}
                >
                  {t(cat.key)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEARCH RESULTS OR SECTIONS */}
      {searchQuery !== "" || activeCategory !== "all" ? (
        <section className="py-24">
          <div className="container mx-auto px-6">
            <h3 className="text-3xl font-bold uppercase tracking-tight mb-12 flex items-center gap-4">
              {searchQuery !== "" ? t("courses.search_results") : t(`courses.categories.${activeCategory}`)}
              <span className="text-foreground/20 text-xl">({filteredCourses.length})</span>
            </h3>
            {filteredCourses.length > 0 ? (
              <CourseGrid 
                items={filteredCourses} 
                t={t} 
                onAddToCart={handleAddToCart} 
              />
            ) : (
              <div className="text-center py-20 bg-surface/30 rounded-[3rem] border border-dashed border-border">
                <p className="text-2xl font-bold text-foreground/40">{t("courses.no_results_found")}</p>
                <Button 
                  variant="ghost" 
                  className="mt-6 text-primary font-bold uppercase tracking-[0.05em] text-xs"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                >
                  {t("courses.clear_filters")}
                </Button>
              </div>
            )}
          </div>
        </section>
      ) : (
        sections.map((section, idx) => (
          <section 
            key={idx} 
            className={cn(
              "py-32 border-t border-border/30 overflow-hidden",
              section.key === "free" ? "bg-primary" : "bg-transparent"
            )}
          >
            <div className="container mx-auto px-6 mb-20 flex justify-between items-end">
              <div className="space-y-4">
                <h3 className={cn(
                  "text-4xl md:text-6xl font-bold leading-none transition-colors flex items-center gap-4 flex-wrap",
                  section.key === "free" ? "text-background tracking-[-0.022em]" : "text-foreground/90",
                  section.key === "podcast" ? "tracking-normal" : "tracking-[-0.022em]"
                )}>
                  {t(section.title)}
                  {section.key === "podcast" && (
                    <Headphones className="w-10 h-10 md:w-16 md:h-16 opacity-90" />
                  )}
                </h3>
                <div className={cn(
                  "w-24 h-2 rounded-full",
                  section.key === "free" ? "bg-background/20" : "bg-primary/20"
                )} />
              </div>
              <Button 
                variant="link" 
                className={cn(
                  "font-bold text-[0.8rem] tracking-[0.05em] uppercase h-auto p-0 flex items-center gap-2 transition-all",
                  section.key === "free" ? "text-background/60 hover:text-background" : "text-foreground/40 hover:text-primary"
                )}
              >
                {t('courses.explore_all')} <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="container mx-auto px-6">
              <CourseGrid 
                sectionKey={section.key}
                items={section.items} 
                t={t} 
                onAddToCart={handleAddToCart} 
              />
            </div>
          </section>
        ))
      )}

      {/* PRICING SECTION */}
      <PricingSection t={t} onAddToCart={handleAddToCart} />

      {/* CALL TO ACTION */}
      <Section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-[#000000] border-2 border-white/10 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-3xl mx-auto tracking-tight text-white">
                {t('courses.cta_ready')}
              </h2>
              <p className="text-xl text-white/60 mb-12 max-w-xl mx-auto font-light">
                {t('courses.cta_desc')}
              </p>
              <Button asChild size="lg" className="rounded-full h-20 px-16 text-xl font-bold bg-primary hover:bg-primary/90 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                <Link href="/register">{t('courses.cta_btn')}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  )
}
