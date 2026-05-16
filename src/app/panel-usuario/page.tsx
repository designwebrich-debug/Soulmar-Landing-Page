"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import {
  LayoutDashboard,
  Settings,
  Bell,
  Calendar as CalendarIcon,
  BookOpen,
  Play,
  ArrowRight,
  Clock,
  TrendingUp,
  Video,
  ShoppingBag,
  MessageCircle,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageSquare,
  Menu,
  X,
  Sun,
  Trash2,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Search,
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/context/LanguageContext"
import { ProgressSection } from "@/components/dashboard/ProgressSection"
import { BookingModal } from "@/components/dashboard/BookingModal"
import { useAuth } from "@/context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { useTheme } from "next-themes"

import { getUserOrders, updateProfileStatus } from "@/lib/actions/user"
import {
  getUpcomingSessions,
  getNextSession,
  getTherapistNotes,
  getUserStats,
  addCustomEvent,
  deleteCustomEvent,
  getCustomEvents
} from "@/lib/actions/sessions"
import DocumentUpload from "@/components/dashboard/DocumentUpload"
import ChatSlideOver from "@/components/dashboard/ChatSlideOver"
import { getUnreadCounts, getConversation, type Message, markMessagesAsRead } from "@/lib/actions/messages"
import { initCache, setCachedMessages, CHAT_CACHE } from "@/lib/chat-cache"
import { ALL_THERAPIST_IDS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"

// --- TYPES ---
interface Session {
  id: string
  therapist_name: string
  therapist_specialty: string
  therapist_image: string
  session_date: string
  duration_minutes: number
  platform: string
  meeting_url: string
  status: string
  notes?: string
  color?: string
}

interface TherapistNote {
  id: string
  therapist_name: string
  note_text: string
  created_at: string
}

interface UserStats {
  totalSessions: number
  completedSessions: number
  totalOrders: number
  activeCourses: number
}

// --- SKELETON COMPONENTS ---
const StatSkeleton = () => (
  <div className="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-slate-100 dark:border-[#222222] shadow-sm animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-6" />
    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3" />
    <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg" />
  </div>
)

const EventSkeleton = () => (
  <div className="p-5 rounded-[1.5rem] flex items-center gap-5 border border-slate-100 dark:border-[#222222] bg-white dark:bg-slate-800 animate-pulse">
    <div className="flex flex-col items-center gap-2 min-w-[45px]">
      <div className="w-8 h-2 bg-slate-100 dark:bg-slate-700 rounded-full" />
      <div className="w-10 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg" />
    </div>
    <div className="flex-1 space-y-2">
      <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-700 rounded-full" />
      <div className="w-1/2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full" />
    </div>
    <div className="w-12 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg" />
  </div>
)

// --- MAIN COMPONENT ---
export default function UserDashboard() {
  const { t, language, setLanguage } = useTranslation()
  const { logout, supabaseUser, user, updateProfileData } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeView, setActiveView] = useState("home")
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [customEvents, setCustomEvents] = useState<Session[]>([])
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingTherapist, setBookingTherapist] = useState<{ id: string, name: string, role: string, img: string } | null>(null)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [selectedEventColor, setSelectedEventColor] = useState("#8da9c4") // Default Azul Soulmar
  const [isSavingEvent, setIsSavingEvent] = useState(false)
  const [isEventsLoading, setIsEventsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedTherapist, setSelectedTherapist] = useState<{ name: string; role: string; img: string; id: string } | null>(null)

  // Data State
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<UserStats>({ totalSessions: 0, completedSessions: 0, totalOrders: 0, activeCourses: 0 })
  const [therapistNote, setTherapistNote] = useState<TherapistNote | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({})

  // Profile Status State
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false)
  const [profileStatus, setProfileStatus] = useState("En línea")
  const [statusColor, setStatusColor] = useState("#10b981")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const statusMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      setProfileStatus(user.profile_status || "En línea")
      setStatusColor(user.status_color || "#10b981")
    }
  }, [user])

  const handleStatusUpdate = (status: string, color: string) => {
    // 1. Instant UI update
    setProfileStatus(status)
    setStatusColor(color)
    setIsStatusMenuOpen(false)
    
    // 2. Local Persistence (Immediate for the user)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`soulmar_status_${supabaseUser?.id}`, JSON.stringify({ status, color }))
    }
    
    // 3. Global & Remote Persistence
    if (supabaseUser?.id) {
      updateProfileData({ profile_status: status, status_color: color })
      updateProfileStatus(supabaseUser.id, status, color);
    }
  }

  // Initial load from LocalStorage for extra speed
  useEffect(() => {
    if (supabaseUser?.id && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`soulmar_status_${supabaseUser.id}`)
      if (saved) {
        const { status, color } = JSON.parse(saved)
        setProfileStatus(status)
        setStatusColor(color)
      }
    }
  }, [supabaseUser])

  // Handle Close Status Menu on Click Outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target)) {
        setIsStatusMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isStatusMenuOpen])
  const [sessions, setSessions] = useState<Session[]>([])
  const [nextSession, setNextSession] = useState<Session | null>(null)

  // --- OVERLAY MANAGEMENT ---
  const closeOverlays = () => {
    setIsChatOpen(false)
    setIsBookingModalOpen(false)
    setIsEventModalOpen(false)
    setShowConfirmLogout(false)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // --- ELITE BACKGROUND PREFETCHING & REAL-TIME ---
  useEffect(() => {
    if (mounted && supabaseUser?.id) {
      // 1. Prefetch inicial usando constantes compartidas
      ALL_THERAPIST_IDS.forEach(tId => {
        getConversation(supabaseUser.id, tId).then(msgs => {
          if (msgs && msgs.length > 0) {
            setCachedMessages(tId, msgs)
          }
        }).catch(err => console.error(`[PREFETCH] Error para ${tId}:`, err))
      })

      // 2. Suscripción Global Real-time (Sincronización Total)
      const supabase = createClient()
      const channel = supabase
        .channel('global-chat-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages', filter: `receiver_id=eq.${supabaseUser.id}` },
          (payload) => {
            const newMsg = payload.new as Message
            const oldMsg = payload.old as Message
            
            if (payload.eventType === 'INSERT') {
              setUnreadCounts(prev => ({
                ...prev,
                [newMsg.sender_id]: (prev[newMsg.sender_id] || 0) + 1
              }))
              const currentCache = CHAT_CACHE[newMsg.sender_id] || []
              if (!currentCache.some(m => m.id === newMsg.id)) {
                setCachedMessages(newMsg.sender_id, [...currentCache, newMsg])
              }
            } else if (payload.eventType === 'UPDATE') {
              const therapistId = newMsg.sender_id
              const currentCache = CHAT_CACHE[therapistId] || []
              setCachedMessages(therapistId, currentCache.map(m => m.id === newMsg.id ? { ...m, ...newMsg } : m))
            } else if (payload.eventType === 'DELETE') {
              // Limpiar de todos los caches posibles
              ALL_THERAPIST_IDS.forEach(tId => {
                const currentCache = CHAT_CACHE[tId] || []
                if (currentCache.some(m => m.id === oldMsg.id)) {
                  setCachedMessages(tId, currentCache.filter(m => m.id !== oldMsg.id))
                }
              })
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [mounted, supabaseUser?.id])

  const userName = user?.name || supabaseUser?.user_metadata?.full_name || "Richard Moshé"

  // Load Cached Data Instantly
  useEffect(() => {
    if (mounted) {
      const cachedSessions = localStorage.getItem(`soulmar_sessions_${supabaseUser?.id}`)
      const cachedCustom = localStorage.getItem(`soulmar_custom_${supabaseUser?.id}`)
      
      if (cachedSessions) setSessions(JSON.parse(cachedSessions))
      if (cachedCustom) setCustomEvents(JSON.parse(cachedCustom))
      
      // If we have cache, we can turn off initial events loading early for better UX
      if (cachedSessions || cachedCustom) {
        setIsEventsLoading(false)
      }
    }
  }, [mounted, supabaseUser?.id])

  // Fetch Data Independently
  useEffect(() => {
    if (!supabaseUser) return

    async function loadEvents() {
      try {
        const [upcoming, fetchedCustomEvents] = await Promise.all([
          getUpcomingSessions(supabaseUser.id),
          getCustomEvents(supabaseUser.id)
        ])
        
        setSessions(upcoming || [])
        setCustomEvents(fetchedCustomEvents || [])
        
        // Update Cache
        localStorage.setItem(`soulmar_sessions_${supabaseUser.id}`, JSON.stringify(upcoming || []))
        localStorage.setItem(`soulmar_custom_${supabaseUser.id}`, JSON.stringify(fetchedCustomEvents || []))
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsEventsLoading(false)
      }
    }

    async function loadStats() {
      try {
        const [next, note, userStats] = await Promise.all([
          getNextSession(supabaseUser.id),
          getTherapistNotes(supabaseUser.id),
          getUserStats(supabaseUser.id)
        ])
        setNextSession(next || null)
        setTherapistNote(note || null)
        setStats(userStats)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setIsStatsLoading(false)
      }
    }

    async function loadOrders() {
      try {
        const userOrders = await getUserOrders(supabaseUser.id)
        setOrders(userOrders || [])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsOrdersLoading(false)
      }
    }

    async function loadUnread() {
      try {
        const counts = await getUnreadCounts(supabaseUser.id)
        setUnreadCounts(counts)
      } catch (error) {
        console.error("Error loading unread counts:", error)
      }
    }

    // Fire all requests in parallel but update state independently
    loadEvents()
    loadStats()
    loadOrders()
    loadUnread()
    setIsLoading(false)
  }, [supabaseUser])

  // Real-time for Unread Counts
  useEffect(() => {
    if (!supabaseUser) return

    const supabase = createClient()
    const channel = supabase
      .channel('unread-counts-dashboard')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id.eq.${supabaseUser.id}`
        },
        () => {
          // Refresh counts on new message
          getUnreadCounts(supabaseUser.id).then(setUnreadCounts)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id.eq.${supabaseUser.id}`
        },
        () => {
          // Refresh counts on update (e.g. mark as read)
          getUnreadCounts(supabaseUser.id).then(setUnreadCounts)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabaseUser])

  // --- CALENDAR HELPERS ---
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const date = new Date(year, month, 1)
    const days = []

    const firstDayIndex = date.getDay()
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({ day: prevMonthLastDay - i + 1, current: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) })
    }

    const lastDay = new Date(year, month + 1, 0).getDate()
    for (let i = 1; i <= lastDay; i++) {
      days.push({ day: i, current: true, date: new Date(year, month, i) })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, current: false, date: new Date(year, month + 1, i) })
    }

    return days
  }, [currentMonth])

  const allEvents = useMemo(() => {
    return [...sessions, ...customEvents].sort((a, b) => 
      new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
    )
  }, [sessions, customEvents])

  const sessionsForSelectedDate = useMemo(() => {
    return allEvents.filter(s => {
      const sDate = new Date(s.session_date)
      return sDate.getDate() === selectedDate.getDate() &&
        sDate.getMonth() === selectedDate.getMonth() &&
        sDate.getFullYear() === selectedDate.getFullYear()
    })
  }, [allEvents, selectedDate])

  const handleAddEvent = async () => {
    if (!newEventTitle.trim() || !supabaseUser?.id) {
      console.error("Missing title or user ID", { title: newEventTitle, userId: supabaseUser?.id })
      return
    }

    const newEvent: Session = {
      id: `custom-${Date.now()}`,
      therapist_name: newEventTitle,
      therapist_specialty: t('dashboard.user.personal_event', { defaultValue: 'Evento Personal' }),
      therapist_image: '/images/default-avatar.png',
      session_date: selectedDate.toISOString(),
      user_id: supabaseUser.id,
      duration_minutes: 60,
      platform: 'personal',
      meeting_url: '',
      status: 'scheduled',
      color: selectedEventColor
    }

    setIsSavingEvent(true)
    console.log("[FRONTEND] Attempting to save event...", newEvent);

    try {
      const response = await addCustomEvent(newEvent)
      
      if (response.success && response.data) {
        console.log("[FRONTEND] Event saved successfully");
        setCustomEvents(prev => [...prev, response.data])
        setNewEventTitle("")
        setSelectedEventColor("#8da9c4")
        setIsEventModalOpen(false)
      } else {
        const errorMsg = response.error || "Error desconocido al guardar"
        console.error("[FRONTEND] Server returned error:", errorMsg);
        alert(`No se pudo guardar el evento: ${errorMsg}`)
      }
    } catch (error: any) {
      console.error("[FRONTEND] Network or execution error:", error);
      alert("Error de conexión. Por favor verifica tu internet o intenta de nuevo.")
    } finally {
      setIsSavingEvent(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    const success = await deleteCustomEvent(id)
    if (success) {
      setCustomEvents(prev => prev.filter(e => e.id !== id))
    }
  }
  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1))
  }

  const handleOpenBooking = (therapist: any) => {
    closeOverlays()
    setBookingTherapist(therapist)
    setIsBookingModalOpen(true)
  }

  const handleWhatsApp = () => {
    const message = "Hola! Estoy teniendo problemas tecnicos con mi panel de usuario, necesito ayuda"
    window.open(`https://wa.me/573024594428?text=${encodeURIComponent(message)}`, "_blank")
  }

  if (!mounted) return null

  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={cn(
          "absolute top-6 transition-all duration-500 p-2 rounded-lg text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#222222] z-50",
          isSidebarCollapsed ? "right-1/2 translate-x-1/2" : "right-4"
        )}
        title={isSidebarCollapsed ? t('dashboard.user.sidebar.expand', { defaultValue: 'Expandir' }) : t('dashboard.user.sidebar.collapse', { defaultValue: 'Contraer' })}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform duration-500", isSidebarCollapsed && "rotate-180")}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </button>

      <div className={cn("flex flex-col items-center justify-center transition-all flex-shrink-0 pt-16 2xl:pt-24 pb-4", isSidebarCollapsed ? "h-[120px] 2xl:h-[160px]" : "h-[180px] 2xl:h-[260px]")}>
        <div className={cn("relative flex items-center justify-center transition-all duration-500", isSidebarCollapsed ? "w-10 h-10 2xl:w-12 2xl:h-12" : "w-44 h-44 2xl:w-56 2xl:h-56")}>
          <Image
            src={isSidebarCollapsed ? "/logo-trebol.png" : "/diseño/logos/logoparabannerprincipal.png"}
            alt="Soulmar Logo"
            fill
            className={cn("object-contain dark:brightness-0 dark:invert transition-transform duration-500 hover:scale-105", !isSidebarCollapsed && "scale-110")}
            priority
          />
        </div>
      </div>

      <div className={cn("flex-1 flex flex-col overflow-y-auto no-scrollbar", isSidebarCollapsed ? "px-2" : "px-4 2xl:px-6")}>
        <nav className="space-y-1 w-full">
          {[
            { id: 'home', label: t('dashboard.user.home', { defaultValue: 'Inicio' }), icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />, active: activeView === 'home', onClick: () => { closeOverlays(); setActiveView('home'); } },
            { id: 'sessions', label: t('dashboard.user.upcoming_sessions', { defaultValue: 'Próximas Sesiones' }), icon: <CalendarIcon className="w-5 h-5 flex-shrink-0" />, active: activeView === 'sessions', onClick: () => { closeOverlays(); setActiveView('sessions'); } },
            { id: 'courses', label: t('dashboard.user.courses', { defaultValue: 'Cursos' }), icon: <BookOpen className="w-5 h-5 flex-shrink-0" />, href: "/courses" },
            { id: 'shop', label: t('dashboard.user.store', { defaultValue: 'Tienda' }), icon: <ShoppingBag className="w-5 h-5 flex-shrink-0" />, href: "/shop" },
            { id: 'settings', label: t('dashboard.user.settings', { defaultValue: 'Ajustes' }), icon: <Settings className="w-5 h-5 flex-shrink-0" />, active: activeView === 'settings', onClick: () => { closeOverlays(); setActiveView('settings'); } },
          ].map((item, i) => {
            const btnClass = cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              item.active
                ? "text-white bg-[#8da9c4] dark:bg-[#8da9c4] dark:text-white shadow-md shadow-[#8da9c4]/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#222222]",
              isSidebarCollapsed && "justify-center px-0"
            );
            return item.href ? (
              <Link key={i} href={item.href} className={btnClass} title={item.label}>
                {item.icon}
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            ) : (
              <button key={i} onClick={item.onClick} className={btnClass} title={item.label}>
                {item.icon}
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            )
          })}
          {/* Specialized Panels for Admin/Therapist */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#222222] space-y-1">
              <Link href="/panel-terapeuta" className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-white hover:bg-[#8da9c4]", isSidebarCollapsed && "justify-center px-0")}>
                <UserIcon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Panel Terapeuta</span>}
              </Link>
              <Link href="/dashboard/admin" className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-white hover:bg-slate-900", isSidebarCollapsed && "justify-center px-0")}>
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Panel Admin</span>}
              </Link>
            </div>
          )}
          {user?.role === 'terapeuta' && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#222222]">
              <Link href="/panel-terapeuta" className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-slate-500 hover:text-white hover:bg-[#8da9c4]", isSidebarCollapsed && "justify-center px-0")}>
                <UserIcon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">Panel Terapeuta</span>}
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className={cn("flex-shrink-0 flex flex-col gap-1 border-t border-slate-100 dark:border-[#222222] pt-4 pb-6 mt-2", isSidebarCollapsed ? "px-2" : "px-6")}>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#222222]", isSidebarCollapsed && "justify-center px-0")}>
          {theme === 'dark' ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!isSidebarCollapsed && <span className="whitespace-nowrap">{theme === 'dark' ? t('dashboard.user.light_mode', { defaultValue: 'Modo Claro' }) : t('dashboard.user.dark_mode', { defaultValue: 'Modo Oscuro' })}</span>}
        </button>

        <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#222222]", isSidebarCollapsed && "justify-center px-0")}>
          <Globe className="w-5 h-5 flex-shrink-0" />
          {!isSidebarCollapsed && <span className="whitespace-nowrap">{language === 'es' ? 'Idioma: ES' : 'Language: EN'}</span>}
        </button>

        <button onClick={handleWhatsApp} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-[#25D366] hover:bg-[#25D366]/10", isSidebarCollapsed && "justify-center px-0")}>
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.67-1.618-.915-2.207-.238-.573-.48-.495-.67-.504-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {!isSidebarCollapsed && <span className="whitespace-nowrap">{t('dashboard.user.whatsapp_help', { defaultValue: 'WhatsApp Ayuda' })}</span>}
        </button>

        <button onClick={() => { closeOverlays(); setShowConfirmLogout(true); }} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10", isSidebarCollapsed && "justify-center px-0")}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isSidebarCollapsed && <span className="whitespace-nowrap">{t('dashboard.user.logout', { defaultValue: 'Cerrar Sesión' })}</span>}
        </button>

        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 px-2 pt-4 mt-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative flex-shrink-0">
              <Image src={supabaseUser?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${userName}&background=1D9E75&color=fff`} alt="Avatar" fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{userName}</p>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('dashboard.user.standard_plan', { defaultValue: 'ESTÁNDAR' })}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#000000] font-dm-sans text-slate-800 dark:text-slate-100 relative overflow-x-hidden -mt-20 selection:bg-[#8da9c4]/30">

      {/* ─── SIDEBAR ─── */}
      <aside className={cn(
        "hidden lg:flex bg-white dark:bg-[#111111] border-r border-slate-100 dark:border-[#222222] flex-col fixed h-full z-[1001] transition-all duration-500 shadow-sm",
        isSidebarCollapsed ? "w-[72px]" : "w-[240px] 2xl:w-[280px]"
      )}>
        <SidebarContent />
      </aside>

      {/* ─── MOBILE HEADER ─── */}
      <div className="lg:hidden fixed top-20 left-0 right-0 h-20 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-slate-100 dark:border-[#222222] px-6 flex items-center justify-between z-[1000]">
        <div className="relative w-40 h-10">
          <Image src="/diseño/logos/logoparabannerprincipal.png" alt="Soulmar" fill className="object-contain dark:brightness-0 dark:invert" />
        </div>
        <button onClick={() => { const next = !isMobileMenuOpen; closeOverlays(); setIsMobileMenuOpen(next); }} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="lg:hidden fixed inset-0 top-20 z-[1002] bg-white dark:bg-[#111111] flex flex-col overflow-y-auto pt-10">
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN WRAPPER ─── */}
      <div className={cn(
        "flex-1 min-h-screen flex flex-col pt-20 lg:pt-0 transition-all duration-500",
        isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px] 2xl:ml-[280px]"
      )}>

        <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-10 xl:p-14">
          <AnimatePresence mode="wait">
            {activeView === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div className="space-y-2 text-left">
                    <h1 className="text-3xl lg:text-5xl font-bold font-playfair text-slate-950 dark:text-white tracking-tight">
                      {t('dashboard.user.welcome', { name: userName.split(' ')[0] })}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base lg:text-lg">{t('dashboard.user.subtitle', { defaultValue: "Tu espacio personal de bienestar y crecimiento." })}</p>
                  </div>
                  <div ref={statusMenuRef} className="flex items-center gap-4 bg-white dark:bg-[#111111] p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-[#222222] relative">
                    <button 
                      onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{ 
                        backgroundColor: `${statusColor}10`,
                        borderColor: `${statusColor}30` 
                      }}
                    >
                      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: statusColor }}>
                        {profileStatus}
                      </span>
                    </button>

                    {/* Status Dropdown Menu */}
                    <AnimatePresence>
                      {isStatusMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#151515] rounded-2xl shadow-2xl border border-slate-100 dark:border-[#222222] p-3 z-[9999] space-y-3 pointer-events-auto"
                        >
                          <div className="space-y-1.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2">Estado de Actividad</p>
                            <div className="space-y-0.5">
                              {[
                                { label: "Online", color: "#10b981" },
                                { label: "Offline", color: "#ef4444" },
                                { label: "En Terapia", color: "#3b82f6" },
                                { label: "Meditando", color: "#f59e0b" }
                              ].map((option) => (
                                <button 
                                  key={option.label}
                                  type="button"
                                  onPointerDown={() => handleStatusUpdate(option.label, option.color)}
                                  className={cn(
                                    "w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-2",
                                    profileStatus === option.label 
                                      ? "bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" 
                                      : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                                  )}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: option.color }} />
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                    </button>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-12 gap-10 lg:gap-14">

                  {/* Left Column (Main) */}
                  <div className="col-span-12 xl:col-span-8 space-y-12">

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {isStatsLoading && allEvents.length === 0 ? (
                        <>
                          <StatSkeleton />
                          <StatSkeleton />
                          <StatSkeleton />
                        </>
                      ) : (
                        [
                          { label: t('dashboard.user.stats.sessions', { defaultValue: 'SESIONES' }).toUpperCase(), value: stats.totalSessions, icon: <CalendarIcon className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                          { label: t('dashboard.user.stats.courses', { defaultValue: 'CURSOS' }).toUpperCase(), value: stats.activeCourses, icon: <BookOpen className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                          { label: t('dashboard.user.stats.orders', { defaultValue: 'PEDIDOS' }).toUpperCase(), value: stats.totalOrders, icon: <ShoppingBag className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-slate-100 dark:border-[#222222] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
                              {stat.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">{stat.label}</p>
                            <div className="flex items-end gap-3">
                              <span className="text-4xl lg:text-5xl font-bold font-playfair text-slate-950 dark:text-white leading-none">{stat.value}</span>
                              <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Calendar Section Overhaul */}
                    <section className="bg-white dark:bg-[#111111] rounded-[3rem] p-8 lg:p-12 border border-slate-100 dark:border-[#222222] shadow-sm">
                      <div className="flex flex-col lg:flex-row gap-12">
                        {/* Interactive Calendar */}
                        <div className="w-full lg:w-[360px] flex-shrink-0">
                          <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold font-playfair text-slate-950 dark:text-white uppercase tracking-tight">{t('dashboard.user.calendar', { defaultValue: "Calendario" })}</h2>
                            <div className="flex gap-1">
                              <button onClick={() => changeMonth(-1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                              <button onClick={() => changeMonth(1)} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-6 uppercase tracking-widest text-left">{currentMonth.toLocaleDateString(language, { month: 'long', year: 'numeric' })}</p>

                          <div className="grid grid-cols-7 gap-y-3 mb-4 text-center">
                            {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(d => (
                              <div key={d} className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase">
                                {t(`dashboard.user.calendar_days.${d}`, { defaultValue: d.charAt(0).toUpperCase() })}
                              </div>
                            ))}
                            {daysInMonth.map((item, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedDate(item.date)}
                                className={cn(
                                  "aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all relative group mx-auto w-9 h-9",
                                  !item.current && "opacity-10 pointer-events-none",
                                  selectedDate.toDateString() === item.date.toDateString()
                                    ? "bg-[#8da9c4] text-white shadow-lg shadow-[#8da9c4]/30 scale-110"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-110"
                                )}
                              >
                                {item.day}
                                  {allEvents.some(s => new Date(s.session_date).toDateString() === item.date.toDateString()) && (
                                    <span className={cn("absolute bottom-1.5 w-1.5 h-1.5 rounded-full", selectedDate.toDateString() === item.date.toDateString() ? "bg-white" : "bg-[#ffc971]")} />
                                  )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Events (RESTORED PREMIUM CARDS) */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-[#222222] pb-4">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              {t('dashboard.user.scheduled_events', { defaultValue: "Eventos Programados" })}
                            </span>
                            <div className="flex items-center gap-3">
                              <Badge className={cn("rounded-full transition-colors", allEvents.length > 0 ? "bg-[#8da9c4] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400")}>{allEvents.length} {t('dashboard.user.events', { defaultValue: "EVENTOS" })}</Badge>
                              <button onClick={() => { closeOverlays(); setIsEventModalOpen(true); }} className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-[#222222] hover:bg-[#8da9c4] hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md active:scale-95" title="Crear Evento">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4 max-h-[600px] overflow-y-auto px-4 pt-4 pb-12 custom-scrollbar">
                            {isEventsLoading && allEvents.length === 0 ? (
                              <>
                                <EventSkeleton />
                                <EventSkeleton />
                                <EventSkeleton />
                              </>
                            ) : allEvents.length > 0 ? (
                              allEvents.map((item, i) => (
                                <motion.div 
                                  key={item.id} 
                                  initial={{ opacity: 0, x: 20 }} 
                                  animate={{ opacity: 1, x: 0 }} 
                                  className={cn(
                                    "p-5 rounded-[1.5rem] flex items-center gap-5 border transition-all hover:scale-[1.01] relative group/card shadow-none",
                                    new Date(item.session_date).toDateString() === selectedDate.toDateString() 
                                      ? "ring-2 ring-[#8da9c4]/20 border-transparent" 
                                      : "border-slate-100 dark:border-[#222222]",
                                    item.color === "#8da9c4" ? "bg-[#8da9c4]/80 text-white border-[#8da9c4]/10" :
                                    item.color === "#ffc971" ? "bg-[#ffc971]/80 text-slate-950 border-[#ffc971]/10" :
                                    item.color === "#c9cba3" ? "bg-[#c9cba3]/80 text-slate-950 border-[#c9cba3]/10" :
                                    "bg-white dark:bg-slate-800 text-slate-950 dark:text-white"
                                  )}
                                >
                                  <div className="flex flex-col items-center leading-none min-w-[45px]">
                                    <span className={cn("text-[9px] uppercase font-black tracking-widest mb-1", (item.color || new Date(item.session_date).toDateString() === selectedDate.toDateString()) ? "opacity-90" : "opacity-30")}>
                                      {new Date(item.session_date).toLocaleDateString(language, { month: 'short' })}
                                    </span>
                                    <span className="text-2xl font-bold font-playfair">{new Date(item.session_date).getDate()}</span>
                                  </div>

                                  <div className="flex-1 min-w-0 text-left">
                                    <h4 className="font-bold text-base truncate tracking-tight mb-0.5">{item.therapist_name}</h4>
                                    <p className={cn("text-[9px] font-black uppercase tracking-widest truncate", (item.color || new Date(item.session_date).toDateString() === selectedDate.toDateString()) ? "opacity-90" : "text-slate-400 dark:text-slate-500")}>
                                      {item.therapist_specialty.includes('DASHBOARD.USER') ? t('dashboard.user.personal_event', { defaultValue: 'Evento Personal' }) : item.therapist_specialty}
                                    </p>
                                  </div>

                                  <div className={cn("font-bold text-[10px] px-3 py-1.5 rounded-lg backdrop-blur-md", (item.color || new Date(item.session_date).toDateString() === selectedDate.toDateString()) ? "bg-black/20 dark:bg-white/20" : "bg-slate-50 dark:bg-slate-900")}>
                                    {new Date(item.session_date).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                                  </div>

                                  {/* Delete Button (Minimalist Apple Style) */}
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(item.id); }}
                                    className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:scale-110 shadow-lg z-10 border-2 border-white dark:border-slate-900"
                                    title="Eliminar"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </motion.div>
                              ))
                            ) : (
                              <div className="py-16 text-center border-2 border-dashed border-slate-100 dark:border-[#222222] rounded-[2.5rem] flex flex-col items-center gap-4 group">
                                <p className="text-slate-300 dark:text-slate-700 font-bold uppercase tracking-widest text-[10px]">{t('dashboard.user.no_events', { defaultValue: "Sin eventos programados" })}</p>
                                <button 
                                  onClick={() => { closeOverlays(); setIsEventModalOpen(true); }}
                                  className="text-[10px] font-black uppercase tracking-widest text-[#8da9c4] hover:text-slate-950 dark:hover:text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                                >
                                  <Plus className="w-3 h-3" /> {t('dashboard.user.create_event', { defaultValue: "Crear Evento" })}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Mi Progreso & Analytics Section */}
                    <ProgressSection language={language} t={t} />

                    {/* Courses Overhaul */}
                    <section className="space-y-8">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl lg:text-3xl font-bold font-playfair text-slate-950 dark:text-white uppercase tracking-tight">{t('dashboard.user.my_courses', { defaultValue: "Mis Cursos" })}</h2>
                        <Link href="/courses" className="group flex items-center gap-2 text-xs font-bold text-[#8da9c4] uppercase tracking-widest hover:text-slate-950 dark:hover:text-white transition-colors text-left">
                          {t('dashboard.user.explore_all', { defaultValue: "Explorar todos" })} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { title: t('dashboard.user.mock_courses.ansiedad', { defaultValue: "Control de Ansiedad" }), img: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800", progress: 75, instructor: "Dr. Elena Smith" },
                          { title: t('dashboard.user.mock_courses.mindfulness', { defaultValue: "Mindfulness Diario" }), img: "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&q=80&w=800", progress: 45, instructor: "Coach Mark" }
                        ].map((course, i) => (
                          <div key={i} className="bg-white dark:bg-[#111111] rounded-[3rem] p-6 border border-slate-100 dark:border-[#222222] shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                            <div className="flex gap-8 items-center">
                              <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-[2rem] overflow-hidden relative shadow-lg flex-shrink-0">
                                <Image src={course.img} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                              </div>
                              <div className="flex-1 space-y-4 text-left">
                                <h4 className="text-xl font-bold font-playfair text-slate-950 dark:text-white leading-tight">{course.title}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.instructor}</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[9px] font-black uppercase text-slate-300 dark:text-slate-600">
                                    <span>{t('dashboard.user.progress', { defaultValue: "progreso" })}</span>
                                    <span>{course.progress}%</span>
                                  </div>
                                  <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-[#222222]">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} className="h-full bg-gradient-to-r from-[#8da9c4] to-[#ffc971]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Secondary) - RESTORING EXACT DESIGN FROM IMAGE */}
                  <aside className="col-span-12 xl:col-span-4 space-y-12">

                    {/* Acciones Rápidas (EXACT RESTORATION) */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white text-left">{t('dashboard.user.actions', { defaultValue: "Acciones Rápidas" })}</h3>
                      <div className="space-y-4">
                        <Link href="/book" className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-[#8da9c4] text-white shadow-xl shadow-[#8da9c4]/10 hover:scale-[1.02] transition-all group text-left">
                          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <CalendarIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-lg leading-tight mb-1">{t('dashboard.user.book_session', { defaultValue: "Agendar Sesión" })}</p>
                            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{t('dashboard.user.choose_specialist', { defaultValue: "SELECCIONA TU TERAPEUTA" })}</p>
                          </div>
                        </Link>
                        <Link href="/shop" className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-[#ffc971] text-slate-900 shadow-xl shadow-[#ffc971]/10 hover:scale-[1.02] transition-all group text-left">
                          <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6 text-slate-900" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-lg leading-tight mb-1">{t('dashboard.user.go_to_store', { defaultValue: "Ir a la Tienda" })}</p>
                            <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">{t('dashboard.user.store_catalog', { defaultValue: "CATÁLOGO SOULMAR" })}</p>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Nota de tu Terapeuta (EXACT RESTORATION) */}
                    <div className="bg-white dark:bg-[#111111] border border-slate-100 dark:border-[#222222] rounded-[3rem] p-10 space-y-6 shadow-sm text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{t('dashboard.user.therapist_note', { defaultValue: "Nota de tu Terapeuta" })}</p>
                      </div>
                      <p className="text-[11px] font-medium italic text-slate-400 dark:text-slate-500 leading-relaxed">
                        "{therapistNote?.note_text || t('dashboard.user.therapist_note_default', { defaultValue: 'Hola Richard, espero que estés aplicando las herramientas de respiración que vimos en la última sesión. Nos vemos pronto.' })}"
                      </p>
                      <button className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                        {t('dashboard.user.respond_message', { defaultValue: "RESPONDER MENSAJE" })} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Tus Terapeutas (EXACT RESTORATION) */}
                    <section className="space-y-6 text-left">
                      <h3 className="text-xl font-bold text-[#1a1a1a] dark:text-white">{t('dashboard.user.therapists_title', { defaultValue: "Tus Terapeutas" })}</h3>
                      <div className="bg-white dark:bg-[#111111] rounded-[3.5rem] border border-slate-100 dark:border-[#222222] p-10 space-y-10 shadow-sm">
                        {[
                          { name: "Dra. Mariana Caicedo", role: t('dashboard.user.therapists.mariana_role', { defaultValue: "PSICOLOGÍA CLÍNICA (ESPECIALISTA)" }), img: "/images/therapists/mariana_v2.png", id: "a1b2c3d4-1111-4000-8000-000000000001" },
                          { name: "Dra. Libertad Mejía", role: t('dashboard.user.therapists.libertad_role', { defaultValue: "PSICOLOGÍA CLÍNICA" }), img: "/images/therapists/libertad_v3.png", id: "a1b2c3d4-2222-4000-8000-000000000002" },
                          { name: "Dr. Moshé Musini", role: t('dashboard.user.therapists.moshe_role', { defaultValue: "PSICOLOGÍA ORGANIZACIONAL" }), img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", id: "a1b2c3d4-3333-4000-8000-000000000003" }
                        ].map((tInfo, i) => (
                          <div key={i} className="flex items-center justify-between group cursor-pointer relative">
                            {/* ... existing content ... */}
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md relative">
                                <Image src={tInfo.img} alt={tInfo.name} fill className="object-cover" />
                                {unreadCounts[tInfo.id] > 0 && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#111111] flex items-center justify-center animate-bounce shadow-lg z-10">
                                    {unreadCounts[tInfo.id]}
                                  </div>
                                )}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-base text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                  {tInfo.name}
                                  {unreadCounts[tInfo.id] > 0 && (
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                  )}
                                </p>
                                <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-1">{tInfo.role}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                  onClick={() => { 
                                    closeOverlays();
                                    setSelectedTherapist(tInfo); 
                                    setIsChatOpen(true);
                                    setUnreadCounts(prev => ({ ...prev, [tInfo.id]: 0 }));
                                  }}
                                  className={cn(
                                    "relative w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm",
                                    (isChatOpen && selectedTherapist?.id === tInfo.id) 
                                      ? "bg-[#ffc971] text-slate-950 scale-110 shadow-[#ffc971]/20" 
                                      : unreadCounts[tInfo.id] > 0 
                                        ? "bg-[#8da9c4] text-white" 
                                        : "bg-[#8da9c4]/10 dark:bg-[#ffc971]/10 text-[#8da9c4] dark:text-[#ffc971] hover:bg-[#c9cba3] hover:text-[#111111]"
                                  )}
                                >
                                  <MessageSquare className="w-5 h-5" />
                                  {unreadCounts[tInfo.id] > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white dark:border-[#111111] flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                      {unreadCounts[tInfo.id]}
                                    </div>
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleOpenBooking(tInfo)}
                                  className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm",
                                    (isBookingModalOpen && bookingTherapist?.id === tInfo.id)
                                      ? "bg-[#c9cba3] text-slate-950 scale-110 shadow-[#c9cba3]/20"
                                      : "bg-[#8da9c4] text-white hover:bg-[#7392ad]"
                                  )}
                                >
                                  <CalendarIcon className="w-5 h-5" />
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Upload Section */}
                    {supabaseUser?.id && (
                      <DocumentUpload userId={supabaseUser.id} t={t} />
                    )}

                  </aside>
                </div>
              </motion.div>
            )}

            {activeView === 'sessions' && <SessionsView t={t} sessions={sessions} language={language} />}
            {activeView === 'settings' && <SettingsView t={t} user={user} />}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          therapist={bookingTherapist} 
          language={language}
          t={t}
        />
      )}

      {/* Logout Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white dark:bg-[#111111] p-10 lg:p-14 max-w-md w-full space-y-10 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-[#222222]">
              <div className="space-y-4">
                <Badge className={cn("border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors", 
                  selectedEventColor === "#8da9c4" ? "bg-[#8da9c4]/10 text-[#8da9c4]" :
                  selectedEventColor === "#ffc971" ? "bg-[#ffc971]/10 text-[#ffc971]" :
                  "bg-[#c9cba3]/10 text-[#c9cba3]"
                )}>
                  {selectedDate.toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' })}
                </Badge>
                <h2 className="text-3xl font-bold font-playfair text-slate-950 dark:text-white leading-tight">
                  {t('dashboard.user.new_event_title', { defaultValue: "Nuevo Evento Personal" })}
                </h2>
                <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
                  {t('dashboard.user.new_event_desc', { defaultValue: "Asigna un nombre a tu recordatorio o evento para este día." })}
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">{t('dashboard.user.event_name', { defaultValue: "NOMBRE DEL EVENTO" })}</Label>
                  <input
                    autoFocus
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder={t('dashboard.user.event_placeholder', { defaultValue: "Ej. Terminar curso de React..." })}
                    className="w-full h-16 rounded-2xl bg-slate-50 dark:bg-[#0A0A0A] border-slate-100 dark:border-[#222222] text-slate-950 dark:text-white font-bold px-8 shadow-inner outline-none focus:ring-2 focus:ring-[#8da9c4]/20 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">{t('dashboard.user.choose_color', { defaultValue: "ELIGE UN COLOR" })}</Label>
                  <div className="flex items-center gap-4 px-2">
                    {[
                      { hex: "#8da9c4", label: "Azul" },
                      { hex: "#ffc971", label: "Amarillo" },
                      { hex: "#c9cba3", label: "Verde" }
                    ].map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedEventColor(color.hex)}
                        className={cn(
                          "w-12 h-12 rounded-2xl transition-all flex items-center justify-center relative",
                          selectedEventColor === color.hex ? "scale-110 shadow-lg" : "hover:scale-105 opacity-60 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedEventColor === color.hex && (
                          <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleAddEvent}
                  disabled={!newEventTitle.trim() || isSavingEvent}
                  className={cn(
                    "w-full h-16 rounded-2xl text-white font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all disabled:opacity-50 disabled:grayscale",
                    selectedEventColor === "#8da9c4" ? "bg-[#8da9c4] shadow-[#8da9c4]/20 hover:bg-[#7392ad]" :
                    selectedEventColor === "#ffc971" ? "bg-[#ffc971] text-slate-900 shadow-[#ffc971]/20 hover:bg-[#eeb860]" :
                    "bg-[#c9cba3] text-slate-900 shadow-[#c9cba3]/20 hover:bg-[#b8ba92]"
                  )}
                >
                  {isSavingEvent ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('dashboard.user.saving', { defaultValue: "Guardando..." })}</span>
                    </div>
                  ) : (
                    t('dashboard.user.save_event', { defaultValue: "Guardar Evento" })
                  )}
                </Button>
                <Button 
                  onClick={() => { setIsEventModalOpen(false); setNewEventTitle(""); setSelectedEventColor("#8da9c4"); }} 
                  variant="ghost" 
                  className="w-full h-16 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t('dashboard.user.cancel', { defaultValue: "Cancelar" })}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmLogout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#111111] p-10 lg:p-14 max-w-sm w-full text-center space-y-10 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-[#222222]">
              <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mx-auto shadow-sm"><LogOut className="w-10 h-10" /></div>
              <div className="space-y-3"><h2 className="text-2xl lg:text-3xl font-bold font-playfair text-slate-950 dark:text-white">{t('dashboard.user.logout_confirm_title', { defaultValue: "¿Deseas salir?" })}</h2><p className="text-slate-400 dark:text-slate-500 font-medium">{t('dashboard.user.logout_confirm_desc', { defaultValue: "Cerraremos tu sesión de forma segura." })}</p></div>
              <div className="flex flex-col gap-4">
                <Button onClick={logout} className="w-full h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-red-500/20">{t('dashboard.user.confirm_logout', { defaultValue: "Confirmar salida" })}</Button>
                <Button onClick={() => setShowConfirmLogout(false)} variant="ghost" className="w-full h-16 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800">{t('dashboard.user.cancel', { defaultValue: "Cancelar" })}</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Slide-Over */}
      {supabaseUser?.id && (
        <ChatSlideOver
          key={`${selectedTherapist?.id}-${supabaseUser.id}`}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          therapist={selectedTherapist}
          userId={supabaseUser.id}
          t={t}
        />
      )}
    </div>
  )
}

// --- SUB-VIEWS ---

function SessionsView({ t, sessions, language }: any) {
  return (
    <div className="space-y-14 w-full text-left">
      <header className="space-y-3"><h2 className="text-3xl lg:text-5xl font-bold font-playfair text-slate-950 dark:text-white">{t('dashboard.user.full_agenda', { defaultValue: "Agenda Completa" })}</h2><p className="text-slate-500 dark:text-slate-400 text-base lg:text-xl font-medium">{t('dashboard.user.full_agenda_desc', { defaultValue: "Todos tus encuentros programados en un solo lugar." })}</p></header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sessions.length > 0 ? sessions.map((session: any) => (
          <div key={session.id} className="bg-white dark:bg-[#111111] p-10 space-y-10 border border-slate-100 dark:border-[#222222] rounded-[3rem] shadow-sm hover:shadow-2xl transition-all group text-left">
            <div className="flex justify-between items-start"><div className="w-16 h-16 rounded-2xl bg-[#1D9E75]/10 flex flex-col items-center justify-center text-[#1D9E75] border border-emerald-100 dark:border-emerald-500/10 shadow-sm"><span className="text-2xl font-black leading-none">{new Date(session.session_date).getDate()}</span><span className="text-[10px] font-black uppercase mt-1">{new Date(session.session_date).toLocaleDateString(language, { month: 'short' })}</span></div><Badge className="bg-emerald-500 text-white border-none px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{session.status}</Badge></div>
            <div className="space-y-2"><h4 className="text-2xl font-bold font-playfair text-slate-950 dark:text-white truncate">{session.therapist_name}</h4><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{session.therapist_specialty}</p></div>
            <Button className="w-full rounded-2xl bg-[#8da9c4] hover:bg-[#7392ad] text-white border-none font-black uppercase tracking-widest text-[10px] h-16 shadow-lg shadow-blue-500/10">{t('dashboard.user.session_details', { defaultValue: "Detalles de sesión" })}</Button>
          </div>
        )) : (<div className="col-span-full py-32 text-center bg-white dark:bg-[#111111] rounded-[3rem] border border-slate-100 dark:border-[#222222]"><p className="text-slate-400 font-medium">{t('dashboard.user.no_sessions_scheduled', { defaultValue: "No tienes sesiones programadas próximamente." })}</p></div>)}
      </div>
    </div>
  )
}

function SettingsView({ t, user }: any) {
  return (
    <div className="space-y-14 w-full text-left">
      <h2 className="text-3xl lg:text-5xl font-bold font-playfair text-slate-950 dark:text-white">{t('dashboard.user.configuration', { defaultValue: "Configuración" })}</h2>
      <div className="bg-white dark:bg-[#111111] p-10 lg:p-14 max-w-5xl border border-slate-100 dark:border-[#222222] rounded-[3.5rem] shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3"><Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-4">{t('dashboard.user.full_name', { defaultValue: "NOMBRE COMPLETO" })}</Label><Input value={user?.name || "Richard Moshé"} readOnly className="h-16 rounded-2xl bg-slate-50 dark:bg-[#0A0A0A] border-slate-100 dark:border-[#222222] text-slate-950 dark:text-white font-bold px-8 shadow-inner" /></div>
          <div className="space-y-3"><Label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-4">{t('dashboard.user.email_address', { defaultValue: "CORREO ELECTRÓNICO" })}</Label><Input value={user?.email || ""} readOnly className="h-16 rounded-2xl bg-slate-50 dark:bg-[#0A0A0A] border-slate-100 dark:border-[#222222] text-slate-950 dark:text-white font-bold px-8 shadow-inner" /></div>
        </div>
        <div className="mt-14 flex justify-end"><Button className="rounded-2xl h-16 px-14 bg-slate-950 dark:bg-white dark:text-black hover:scale-105 transition-transform text-white font-bold uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 w-full sm:w-auto">{t('dashboard.user.save_changes', { defaultValue: "Guardar Cambios" })}</Button></div>
      </div>
    </div>
  )
}
