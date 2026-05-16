"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  FileText, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  ExternalLink,
  Plus,
  ArrowRight,
  LayoutDashboard,
  Settings
} from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { 
  getTherapistUpcomingSessions, 
  getTherapistPatients, 
  getTherapistStats 
} from "@/lib/actions/sessions"
import { motion, AnimatePresence } from "framer-motion"
import TherapistChat from "@/components/therapist/TherapistChat"

export default function TherapistDashboard() {
  const { t, language } = useTranslation()
  const { user, supabaseUser, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Data State
  const [stats, setStats] = useState({
    activePatients: 0,
    sessionsToday: 0,
    pendingMessages: 0,
    totalHours: 0
  })
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data & Role Check
  useEffect(() => {
    async function loadData() {
      if (!supabaseUser || !user) return
      
      // Safety check: Only therapists can access this panel
      if (user.role !== 'terapeuta' && user.role !== 'admin') {
        router.push('/panel-usuario')
        return
      }

      setIsLoading(true)
      try {
        const [statsData, sessionsData, patientsData] = await Promise.all([
          getTherapistStats(supabaseUser.id),
          getTherapistUpcomingSessions(supabaseUser.id),
          getTherapistPatients(supabaseUser.id)
        ])
        
        setStats(statsData)
        setUpcomingSessions(sessionsData)
        setPatients(patientsData)
        if (patientsData.length > 0) setSelectedPatient(patientsData[0])
      } catch (error) {
        console.error("Error loading therapist data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [supabaseUser, user, router])

  const MENU_ITEMS = [
    { id: 'home', label: t('dashboard.admin.overview', { defaultValue: 'Resumen' }), icon: FileText },
    { id: 'patients', label: t('dashboard.therapist.patients', { defaultValue: 'Pacientes' }), icon: Users },
    { id: 'messages', label: t('dashboard.therapist.messages.title', { defaultValue: 'Mensajes' }), icon: MessageSquare },
    { id: 'agenda', label: t('dashboard.therapist.agenda_title', { defaultValue: 'Agenda' }), icon: Calendar },
  ]

  if (!user) return null

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#050505] overflow-hidden font-dm-sans">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white dark:bg-[#0A0A0A] border-r border-slate-100 dark:border-[#1A1A1A] transition-all duration-500 flex flex-col z-50",
        isSidebarCollapsed ? "w-24" : "w-72"
      )}>
        <div className="p-8 flex items-center justify-between h-24">
          {!isSidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black tracking-tighter text-black dark:text-white"
            >
              SOULMAR<span className="text-black">.</span>
            </motion.span>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            className="p-2 rounded-xl bg-slate-50 dark:bg-[#151515] text-slate-400 hover:text-[#8da9c4] transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm group",
                activeTab === item.id 
                  ? "bg-black text-white shadow-lg shadow-black/20" 
                  : "text-black/60 hover:bg-slate-50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-slate-200"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform")} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}

          {/* specialized panels for admin */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1A1A1A] space-y-1">
              <Link 
                href="/panel-usuario" 
                className={cn("w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm text-black/60 hover:bg-slate-50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-slate-200", isSidebarCollapsed && "justify-center px-0")}
              >
                <LayoutDashboard className="w-5 h-5" />
                {!isSidebarCollapsed && <span>Panel Usuario</span>}
              </Link>
              <Link 
                href="/dashboard/admin" 
                className={cn("w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm text-black/60 hover:bg-slate-50 dark:hover:bg-[#151515] hover:text-black dark:hover:text-slate-200", isSidebarCollapsed && "justify-center px-0")}
              >
                <Settings className="w-5 h-5" />
                {!isSidebarCollapsed && <span>Panel Admin</span>}
              </Link>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-[#1A1A1A] space-y-2">
          {/* WhatsApp Help */}
          <button 
            onClick={() => window.open('https://wa.me/573024594428', '_blank')}
            className={cn("w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[#25D366] hover:bg-[#25D366]/10 transition-all font-bold text-sm group", isSidebarCollapsed && "justify-center px-0")}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.618-.915-2.207-.238-.573-.48-.495-.67-.504-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            {!isSidebarCollapsed && <span>WhatsApp Ayuda</span>}
          </button>

          <button 
            onClick={() => logout()} 
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-all font-bold text-sm group shadow-lg shadow-red-500/20"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {!isSidebarCollapsed && <span>{t('common.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-slate-100 dark:border-[#1A1A1A] px-10 flex items-center justify-between z-40">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('dashboard.therapist.search_placeholder', { defaultValue: "Buscar paciente..." })}
              className="w-full h-12 bg-slate-50 dark:bg-[#151515] rounded-xl pl-12 pr-4 text-sm font-medium outline-none border border-transparent focus:border-[#8da9c4]/30 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-4 pl-6 border-l border-slate-100 dark:border-[#1A1A1A]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[10px] font-black text-black dark:text-white/60 uppercase tracking-widest">{t('dashboard.therapist.role_label', { defaultValue: "Especialista Soulmar" })}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold shadow-lg shadow-black/20 overflow-hidden relative group">
                 {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-12 pb-20">
            {activeTab === 'home' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <header className="space-y-2">
                  <h1 className="text-4xl lg:text-5xl font-bold font-playfair text-slate-950 dark:text-white">
                    {t('dashboard.therapist.greeting', { name: user.name.split(' ')[0] })}
                  </h1>
                  <p className="text-slate-400 font-medium text-lg">
                    {t('dashboard.therapist.today_summary', { count: stats.sessionsToday, min: 15 })}
                  </p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: t('dashboard.therapist.stats.total_patients'), value: stats.activePatients, color: 'text-black dark:text-white', bg: 'bg-black/5 dark:bg-white/5' },
                    { label: t('dashboard.therapist.stats.today_sessions'), value: stats.sessionsToday, color: 'text-black dark:text-white', bg: 'bg-black/5 dark:bg-white/5' },
                    { label: t('dashboard.therapist.stats.pending_messages'), value: stats.pendingMessages, color: 'text-[#ffc971]', bg: 'bg-[#ffc971]/10' },
                    { label: t('dashboard.therapist.stats.monthly_hours', { defaultValue: 'Horas del mes' }), value: `${stats.totalHours}h`, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#111111] p-8 rounded-[2.5rem] border border-slate-100 dark:border-[#1A1A1A] shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-slate-950 dark:text-white tracking-tight">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-[#111111] p-10 rounded-[3.5rem] border border-slate-100 dark:border-[#1A1A1A] shadow-sm">
                      <h3 className="text-2xl font-bold font-playfair text-slate-950 dark:text-white mb-10">{t('dashboard.therapist.sessions_title')}</h3>
                      <div className="space-y-4">
                        {upcomingSessions.length > 0 ? upcomingSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-[#151515] transition-all border border-transparent hover:border-slate-100 dark:hover:border-[#222222]">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white font-bold">{session.profiles?.name?.charAt(0)}</div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{session.profiles?.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                            <button className="p-3 rounded-2xl bg-black text-white hover:bg-slate-800 shadow-lg shadow-black/20 transition-all"><ExternalLink size={18} /></button>
                          </div>
                        )) : (
                          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-[#1A1A1A] rounded-3xl">
                            <p className="text-slate-400 font-medium">{t('dashboard.user.no_sessions_scheduled')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="bg-black p-10 rounded-[3.5rem] text-white shadow-xl shadow-black/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:scale-[1.7] transition-transform duration-1000">
                        <Users size={120} />
                      </div>
                      <h3 className="text-xl font-bold font-playfair mb-4 relative z-10">{t('dashboard.therapist.patients')}</h3>
                      <p className="text-white/70 text-sm mb-8 leading-relaxed relative z-10">{t('dashboard.therapist.manage_patients_desc')}</p>
                      <button onClick={() => setActiveTab('patients')} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all relative z-10">{t('dashboard.therapist.view_patients')}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <div className="h-[calc(100vh-200px)] flex gap-8">
                 <div className="w-80 flex flex-col gap-6">
                     <h3 className="text-2xl font-bold font-playfair text-slate-900 dark:text-white px-4">{t('dashboard.therapist.messages.chats_title')}</h3>
                    <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                       {patients.length > 0 ? patients.map((p) => (
                         <button 
                          key={p.id} 
                          onClick={() => setSelectedPatient(p)}
                          className={cn(
                            "w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300",
                            selectedPatient?.id === p.id 
                              ? "bg-[#8da9c4] text-white shadow-xl shadow-[#8da9c4]/20 scale-105" 
                              : "hover:bg-white dark:hover:bg-[#111111] text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-100 dark:hover:border-[#1A1A1A]"
                          )}
                         >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg", selectedPatient?.id === p.id ? "bg-white/20" : "bg-[#8da9c4]/10 text-[#8da9c4]")}>{p.name?.charAt(0)}</div>
                            <div className="text-left min-w-0">
                               <p className="font-bold text-sm truncate">{p.name}</p>
                               <p className={cn("text-[10px] uppercase tracking-widest font-black", selectedPatient?.id === p.id ? "text-white/60" : "text-slate-400")} style={{ color: selectedPatient?.id === p.id ? undefined : p.status_color }}>
                                 {p.profile_status || t('dashboard.therapist.patient_label')}
                               </p>
                            </div>
                         </button>
                       )) : (
                         <p className="text-center text-slate-400 py-10">{t('dashboard.therapist.messages.no_active_patients')}</p>
                       )}
                    </div>
                 </div>
                 <div className="flex-1">
                    {selectedPatient ? (
                      <TherapistChat 
                        currentUserId={supabaseUser!.id} 
                        receiverId={selectedPatient.id} 
                        receiverName={selectedPatient.name} 
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-[#1A1A1A]">
                         <MessageSquare size={48} className="text-slate-100 mb-4" />
                         <p className="text-slate-400 font-medium">{t('dashboard.therapist.messages.select_chat_instruction')}</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="space-y-12">
                <header className="flex justify-between items-end">
                   <div className="space-y-2">
                      <h3 className="text-4xl font-bold font-playfair text-slate-900 dark:text-white">{t('dashboard.therapist.clinical_directory')}</h3>
                      <p className="text-slate-400 font-medium">{t('dashboard.therapist.manage_patients_desc')}</p>
                   </div>
                   <button className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/20 hover:scale-105 transition-all">
                      <Plus size={16} strokeWidth={3} />
                      {t('dashboard.therapist.link_patient')}
                   </button>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                   {patients.map((p) => (
                     <motion.div 
                      key={p.id} 
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-[#111111] p-10 rounded-[3.5rem] border border-slate-100 dark:border-[#1A1A1A] shadow-sm hover:shadow-2xl transition-all group"
                     >
                        <div className="flex items-center gap-6 mb-8">
                           <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-black to-slate-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-black/20 group-hover:rotate-6 transition-transform">{p.name?.charAt(0)}</div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-xl text-slate-900 dark:text-white truncate">{p.name}</h4>
                               <div className="flex items-center gap-1.5">
                                 <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.status_color || '#10b981' }} />
                                 <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: p.status_color || '#10b981' }}>
                                   {p.profile_status || t('dashboard.chat.online')}
                                 </p>
                               </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <button 
                            onClick={() => { setSelectedPatient(p); setActiveTab('messages') }} 
                            className="py-4 rounded-2xl bg-slate-50 dark:bg-[#1A1A1A] text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                           >
                              <MessageSquare size={14} />
                              {t('dashboard.therapist.message_btn')}
                           </button>
                           <button className="py-4 rounded-2xl bg-slate-50 dark:bg-[#1A1A1A] text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                              <FileText size={14} />
                              {t('dashboard.therapist.history_btn')}
                           </button>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'agenda' && (
               <div className="py-40 text-center space-y-6">
                  <Calendar size={64} className="mx-auto text-black dark:text-white opacity-20" />
                  <h3 className="text-3xl font-bold font-playfair text-slate-900 dark:text-white">{t('dashboard.therapist.agenda_soulmar')}</h3>
                  <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                    {t('dashboard.therapist.agenda_coming_soon')}
                  </p>
                  <button onClick={() => setActiveTab('home')} className="inline-flex items-center gap-2 text-[10px] font-black text-black dark:text-white uppercase tracking-widest hover:underline">
                    {t('dashboard.therapist.back_to_overview')}
                    <ArrowRight size={12} />
                  </button>
               </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-[100]">
         <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-20 h-20 rounded-[2rem] bg-black text-white flex items-center justify-center shadow-2xl shadow-black/40 group"
         >
            <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
         </motion.button>
      </div>
    </div>
  )
}
