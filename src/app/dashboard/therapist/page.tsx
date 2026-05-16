"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Calendar as CalendarIcon, 
  DollarSign, 
  TrendingUp, 
  Video, 
  Bell,
  MoreVertical,
  ArrowUpRight,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  Plus,
  Activity,
  Menu,
  X
} from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/layout/Section"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTranslation } from "@/context/LanguageContext"

export default function TherapistDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const stats = [
    { label: t('dashboard.therapist.stats.today_sessions'), value: "8", icon: <CalendarIcon className="w-6 h-6" />, trend: "+12%", color: "primary" },
    { label: t('dashboard.therapist.stats.total_patients'), value: "124", icon: <Users className="w-6 h-6" />, trend: "+5%", color: "secondary-olive" },
    { label: t('dashboard.therapist.stats.monthly_income'), value: "$4.8M", icon: <DollarSign className="w-6 h-6" />, trend: "+18%", color: "primary" },
    { label: t('dashboard.therapist.stats.avg_rating'), value: "4.9", icon: <TrendingUp className="w-6 h-6" />, trend: "0%", color: "secondary-yellow" },
  ]

  const upcomingSessions = [
    { id: 1, time: "09:00 AM", name: "Mariana Londoño", type: t('dashboard.therapist.sessions_types.first_session'), channel: "Video", img: "https://i.pravatar.cc/150?u=mariana", status: "ready" },
    { id: 2, time: "11:00 AM", name: "Julián Martínez", type: t('dashboard.therapist.sessions_types.follow_up'), channel: "Video", img: "https://i.pravatar.cc/150?u=julian", status: "scheduled" },
    { id: 3, time: "02:00 PM", name: "Sofía Restrepo", type: t('dashboard.therapist.sessions_types.couple'), channel: "Audio", img: "https://i.pravatar.cc/150?u=sofia", status: "scheduled" },
  ]

  const recentMessages = [
    { id: 1, name: "Juan Pérez", text: t('dashboard.therapist.messages.j_perez'), time: "12:30 PM", unread: true, img: "https://i.pravatar.cc/150?u=juan" },
    { id: 2, name: "Maria L.", text: "Perfecto, muchas gracias.", time: "10:15 AM", unread: false, img: "https://i.pravatar.cc/150?u=maria" },
    { id: 3, name: "Carlos G.", text: t('dashboard.therapist.messages.c_g'), time: "Ayer", unread: false, img: "https://i.pravatar.cc/150?u=carlos" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0b0b0c] flex transition-colors duration-500">
      
      {/* PROFESSIONAL SIDEBAR (APPLE STYLE) */}
      <aside className={cn(
        "fixed lg:sticky top-0 h-screen w-80 bg-white dark:bg-white/[0.02] border-r border-black/5 dark:border-white/5 p-10 flex flex-col gap-12 z-50 transition-transform duration-500",
        !isSidebarOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-primary/20">S</div>
            <h2 className="text-2xl font-bold tracking-[-0.022em] uppercase">Soulmar <span className="text-primary">Pro</span></h2>
        </div>

        <nav className="flex-1 space-y-4">
            {[
                { id: "overview", label: t('dashboard.admin.overview'), icon: <Activity className="w-5 h-5" /> },
                { id: "calendar", label: t('dashboard.therapist.agenda_title'), icon: <CalendarIcon className="w-5 h-5" /> },
                { id: "patients", label: t('dashboard.admin.users'), icon: <Users className="w-5 h-5" /> },
                { id: "messages", label: t('dashboard.therapist.messages_title'), icon: <MessageSquare className="w-5 h-5" /> },
                { id: "payments", label: t('dashboard.admin.sales'), icon: <DollarSign className="w-5 h-5" /> },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                        "w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold uppercase tracking-[0.05em] text-[10px] transition-all",
                        activeTab === item.id 
                            ? "bg-primary text-white shadow-xl shadow-primary/10" 
                            : "text-foreground/40 hover:bg-surface dark:hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    {item.icon} {item.label}
                </button>
            ))}
        </nav>

        <div className="pt-10 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-4 px-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-surface">
                    <Image src="https://i.pravatar.cc/150?u=elena" alt="Dra. Elena" fill className="object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-xs uppercase tracking-tight">Dra. Elena G.</h4>
                    <p className="text-[8px] font-bold uppercase tracking-[0.05em] text-emerald-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Online</p>
                </div>
                <button className="ml-auto w-8 h-8 rounded-full bg-surface dark:bg-white/5 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all">
                    <X className="w-4 h-4 cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
                </button>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT DASHBOARD */}
      <main className="flex-1 p-8 lg:p-16 space-y-16 max-w-7xl mx-auto overflow-hidden">
        
        {/* TOP BAR */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] text-[10px]">
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.022em] leading-[0.9] uppercase">
                    {t('dashboard.therapist.greeting', { name: 'Elena' }) as string}
                </h1>
                <p className="text-xl text-foreground/40 font-bold max-w-xl">
                    {t('dashboard.therapist.today_summary', { count: 8, min: 25 }) as string}
                </p>
            </div>

            <div className="flex gap-4 self-start md:self-auto">
                <button className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 shadow-xl group relative">
                    <Bell className="w-6 h-6 text-foreground/40 group-hover:text-primary transition-colors" />
                    <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-black" />
                </button>
                <button className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-white/5 lg:hidden flex items-center justify-center border border-black/5 dark:border-white/10 shadow-xl" onClick={() => setIsSidebarOpen(true)}>
                    <Menu className="w-6 h-6" />
                </button>
                <Button size="xl" className="rounded-[1.5rem] h-16 px-8 font-bold uppercase tracking-[0.05em] text-[10px] shadow-2xl bg-primary hover:scale-[1.03] active:scale-95 transition-all">
                   <Plus className="w-5 h-5 mr-3" /> {t('dashboard.therapist.new_session') as string}
                </Button>
            </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
               key="overview"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-16"
            >
                {/* STATUS CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <Card key={i} className="border-none bg-white dark:bg-white/[0.03] shadow-2xl rounded-[3rem] group hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
                            {i === 0 && <div className="absolute top-0 left-0 w-full h-1 bg-primary" />}
                            <CardContent className="p-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                        stat.color === 'primary' ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-500"
                                    )}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-[-0.022em]">
                                        <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-foreground/30">{stat.label}</p>
                                    <h3 className="text-4xl font-bold tracking-[-0.022em]">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* UPCOMING SESSIONS (8 COLS) */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="flex items-center justify-between px-2">
                             <h2 className="text-3xl font-bold uppercase tracking-[-0.022em] flex items-center gap-4">
                                <CalendarIcon className="w-8 h-8 text-primary" /> {t('dashboard.therapist.sessions_title')}
                             </h2>
                             <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-all">{t('dashboard.therapist.view_calendar')}</button>
                        </div>

                        <div className="space-y-6">
                            {upcomingSessions.map((s, i) => (
                                <Card key={s.id} className="border-none bg-white dark:bg-white/[0.03] shadow-2xl rounded-[3rem] group overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all duration-500">
                                    <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="flex items-center gap-10 w-full md:w-auto">
                                            <div className="bg-surface dark:bg-white/5 p-6 rounded-[2.5rem] text-center min-w-[120px] shadow-inner group-hover:bg-primary/5 transition-colors">
                                                <p className="text-2xl font-bold tracking-[-0.022em] leading-none">{s.time.split(' ')[0]}</p>
                                                <p className="text-xs font-bold uppercase tracking-[0.05em] text-foreground/20 leading-none mt-1">{s.time.split(' ')[1]}</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-black shadow-xl group-hover:scale-110 transition-transform">
                                                    <Image src={s.img} alt={s.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl tracking-[-0.022em] uppercase leading-none">{s.name}</h4>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-foreground/30 mt-2">{s.type} • {s.channel}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                                            {s.status === 'ready' && (
                                                <Badge className="bg-emerald-500/10 text-emerald-500 animate-pulse border-none px-4 py-2 rounded-full font-bold text-[9px] uppercase tracking-[0.05em] whitespace-nowrap">
                                                    {t('dashboard.therapist.patient_waiting')}
                                                </Badge>
                                            )}
                                            <Button 
                                               className={cn(
                                                  "rounded-[1.5rem] h-14 px-8 font-bold uppercase tracking-[0.05em] text-[10px] shadow-xl group",
                                                  s.status === 'ready' ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]" : "bg-primary"
                                               )}
                                            >
                                               {s.status === 'ready' ? <Video className="w-4 h-4 mr-3" /> : null}
                                               {s.status === 'ready' ? t('dashboard.therapist.enter_session') : t('dashboard.therapist.view_details')}
                                               <ChevronRight className={cn("ml-3 w-4 h-4 transition-transform group-hover:translate-x-1", s.status === 'ready' ? "hidden" : "")} />
                                            </Button>
                                            <button className="w-14 h-14 rounded-full bg-surface dark:bg-white/5 flex items-center justify-center text-foreground/20 hover:text-foreground transition-all">
                                                <MoreVertical className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* MESSAGES & NOTES (4 COLS) */}
                    <div className="lg:col-span-4 space-y-10">
                         <div className="flex items-center justify-between px-2">
                             <h2 className="text-3xl font-bold uppercase tracking-[-0.022em] flex items-center gap-4">
                                <MessageSquare className="w-8 h-8 text-primary" /> {t('dashboard.therapist.messages_title')}
                             </h2>
                             <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-all">{t('dashboard.therapist.go_to_chat')}</button>
                        </div>

                        <div className="space-y-4">
                            {recentMessages.map((m) => (
                                <motion.div 
                                    key={m.id} 
                                    whileHover={{ x: 10 }}
                                    className={cn(
                                        "p-6 rounded-[2.5rem] shadow-xl flex items-start gap-6 cursor-pointer transition-all border-2",
                                        m.unread ? "bg-white dark:bg-white/5 border-primary/20" : "bg-surface/50 dark:bg-white/[0.02] border-transparent"
                                    )}
                                >
                                    <div className="relative shrink-0">
                                        <Image src={m.img} alt={m.name} width={48} height={48} className="rounded-2xl" />
                                        {m.unread && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-black" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h5 className="font-bold text-sm uppercase truncate">{m.name}</h5>
                                            <span className="text-[10px] font-bold text-foreground/30">{m.time}</span>
                                        </div>
                                        <p className="text-xs font-medium text-foreground/50 leading-relaxed truncate">{m.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* ANALYTICS PREVIEW MINI CARD */}
                        <Card className="border-none bg-[#111111] dark:bg-black text-white rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-[3000ms]" />
                            <div className="relative z-10">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-6">{t('dashboard.therapist.performance_title')}</h3>
                                <div className="space-y-6">
                                    <div className="flex items-end justify-between gap-1 h-20">
                                        {[40, 60, 45, 90, 70, 85, 100].map((h, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                                className={cn(
                                                    "w-full rounded-full transition-all",
                                                    i === 6 ? "bg-primary" : "bg-white/10"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold uppercase tracking-[-0.022em]">+24% <span className="text-white/40 text-[10px]">{t('dashboard.therapist.vs_last_month')}</span></p>
                                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div 
                key="calendar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-10"
            >
                <div className="w-32 h-32 rounded-[3.5rem] bg-surface dark:bg-white/5 flex items-center justify-center text-foreground/10">
                    <CalendarIcon className="w-16 h-16" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-bold tracking-[-0.022em] uppercase leading-none">{t('dashboard.therapist.agenda_title')}</h2>
                    <p className="text-xl text-foreground/40 font-bold max-w-lg mx-auto">{t('dashboard.therapist.agenda_desc')}</p>
                </div>
                <Button variant="outline" size="xl" onClick={() => setActiveTab('overview')} className="rounded-full h-16 px-10 border-2 font-bold uppercase tracking-[0.05em] text-xs">{t('dashboard.therapist.back_to_overview')}</Button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
