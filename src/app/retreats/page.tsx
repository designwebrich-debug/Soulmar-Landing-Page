"use client"

import Link from "next/link"
import { Section, SectionHeading } from "@/components/layout/Section"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Trees, Compass, MapPin, Calendar, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/context/LanguageContext"
import { WHATSAPP_LINK } from "@/lib/constants"

export default function RetreatsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center" />
        </div>
        
        <div className="container mx-auto px-6 relative z-20 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-md border-none text-white px-4 py-1.5">{t('retreats.hero.badge')}</Badge>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-none whitespace-pre-line">
              {t('retreats.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80 max-w-xl mx-auto leading-snug">
              {t('retreats.hero.subtitle')}
            </p>
            <Link href="#destinations">
              <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/90 px-10 h-16 text-lg font-bold shadow-2xl mt-8">
                {t('retreats.hero.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DESCRIPTION SECTION */}
      <Section className="bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1]">
              {t('retreats.intro.title', { span: <span className="text-primary" key="span">{t('retreats.intro.span')}</span> })}
            </h2>
            <p className="text-xl text-foreground/70 font-light leading-relaxed">
              {t('retreats.intro.desc')}
            </p>
            <div className="space-y-4 pt-4">
              {[
                { icon: <Trees className="text-secondary-olive" />, text: t('retreats.intro.features.0') },
                { icon: <Compass className="text-secondary-yellow" />, text: t('retreats.intro.features.1') },
                { icon: <CheckCircle className="text-primary" />, text: t('retreats.intro.features.2') }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-surface">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl bg-[url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
              <div className="h-48 rounded-3xl bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            </div>
            <div className="space-y-4 pt-12">
              <div className="h-48 rounded-3xl bg-[url('https://images.unsplash.com/photo-1528605248644-14dd04d22a57?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
              <div className="h-64 rounded-3xl bg-[url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </Section>

      {/* GALLERY / EXPERIENCES */}
      <Section id="destinations" className="bg-surface/20" container={false}>
        <div className="container mx-auto px-6 mb-12">
          <SectionHeading 
            title={t('retreats.gallery.title') as string} 
            subtitle={t('retreats.gallery.subtitle') as string}
          />
        </div>
        <div className="flex flex-wrap gap-8 justify-center px-6 pb-12 snap-x">
          {[
            { 
              key: "mountain",
              price: "$1,200,000 COP",
              tags: ["level1", "mindfulness"],
              img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
            },
            { 
              key: "sea",
              price: "$1,850,000 COP",
              tags: ["relaxation", "community"],
              img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
            },
            { 
              key: "jungle",
              price: "$4,500,000 COP",
              tags: ["transformation", "intense"],
              img: "https://images.unsplash.com/photo-1514467950453-1fc6efb99f1c?auto=format&fit=crop&q=80&w=1200"
            }
          ].map((retreat, i) => {
            interface RetreatData {
              name: string;
              loc: string;
              date: string;
            }
            const item = t(`retreats.gallery.items.${retreat.key}`, { returnObjects: true }) as unknown as RetreatData
            return (
              <div key={i} className="flex-none w-full max-w-[500px] snap-center group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden mb-6 shadow-lg transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${retreat.img})` }} />
                  
                  <div className="absolute bottom-10 left-10 right-10 z-20 flex justify-between items-end">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {retreat.tags.map(tag => (
                          <Badge key={tag} className="bg-white/20 backdrop-blur-md border-none text-white text-xs">{t(`retreats.gallery.tags.${tag}`)}</Badge>
                        ))}
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold text-white">{item.name}</h3>
                      <div className="flex items-center gap-4 text-white/80 font-medium">
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.loc}</span>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {item.date}</span>
                      </div>
                    </div>
                    <Link href={`/book?retreat=${retreat.key}`}>
                      <Button className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 text-white shadow-xl">
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* PRICING / RESERVATION */}
      <Section id="pricing" className="bg-background">
        <SectionHeading 
          title={t('retreats.pricing.title') as string} 
          subtitle={t('retreats.pricing.subtitle') as string}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["basic", "immersion", "vip"].map((planKey, i) => {
            interface PlanData {
              title: string;
              price: string;
              button: string;
              features: string[];
            }
            const plan = t(`retreats.pricing.plans.${planKey}`, { returnObjects: true }) as unknown as PlanData
            const isPopular = planKey === "immersion"
            
            return (
              <Card key={i} className={cn(
                "p-10 border-none flex flex-col h-full rounded-[3rem] transition-all duration-300",
                isPopular ? "bg-primary text-white shadow-2xl scale-105 z-10" : "bg-surface/20"
              )}>
                <div className="mb-8">
                  {isPopular && <Badge className="bg-white text-primary mb-4 border-none">{t('retreats.pricing.popular_badge')}</Badge>}
                  <h4 className="text-2xl font-bold mb-2">{plan.title}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price === "Consultar" || plan.price === "Enquire" ? t('retreats.cta.enquire') : plan.price}</span>
                    {plan.price !== "Consultar" && plan.price !== "Enquire" && <span className={isPopular ? "text-white/60" : "text-foreground/40"}>{t('retreats.pricing.per_person')}</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {(plan.features as string[]).map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm opacity-90">
                      <CheckCircle className={cn("w-5 h-5 shrink-0", isPopular ? "text-white" : "text-primary")} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/book" className="w-full">
                  <Button className={cn(
                    "w-full rounded-full h-14 font-bold text-lg",
                    isPopular ? "bg-white text-primary hover:bg-white/90" : "bg-primary text-white"
                  )}>
                    {plan.button}
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* SUCCESS CALL TO ACTION */}
      <Section className="py-20 md:py-32 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8 px-6">
          <h2 className="text-4xl md:text-6xl font-bold">{t('retreats.cta.title')}</h2>
          <p className="text-xl text-foreground/70 font-light">{t('retreats.cta.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={WHATSAPP_LINK} target="_blank">
              <Button size="lg" className="rounded-full px-10 h-16 text-lg">{t('retreats.cta.whatsapp')}</Button>
            </Link>
            <Link href="mailto:contacto@soulmar.com">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-2">{t('retreats.cta.contact')}</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
