"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  LayoutDashboard, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  ShieldCheck,
  Loader2,
  Video,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  Search,
  Users,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Folder,
  Star
} from "lucide-react"

interface Patient {
  name: string
  email: string
  phone?: string
}

interface Appointment {
  id: string
  patient_id: string
  therapist_id: string
  appointment_date: string
  appointment_time: string
  status: "pending" | "confirmed" | "cancelled"
  meeting_link?: string
  reason?: string
  created_at: string
  patient?: Patient
}

interface DaySchedule {
  enabled: boolean
  start: string
  end: string
  startPM?: string
  endPM?: string
}

interface WorkingHours {
  [key: string]: DaySchedule
}

interface Holiday {
  id: string
  date: string
  reason: string
}

const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const formatLocalDateReadable = (dateStr: string): string => {
  if (!dateStr) return ""
  const parts = dateStr.split("-")
  if (parts.length !== 3) return dateStr
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  
  const dateObj = new Date(year, month, day)
  const formatted = dateObj.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const formatLocalDateReadableShort = (dateStr: string): string => {
  if (!dateStr) return ""
  const parts = dateStr.split("-")
  if (parts.length !== 3) return dateStr
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  
  const dateObj = new Date(year, month, day)
  const formatted = dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })
  return formatted
}

const formatCOP = (val: number): string => {
  return `$${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} COP`
}

const getInitials = (name: string): string => {
  if (!name) return ""
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]
const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]

function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "dd/mm/aaaa", 
  className = "" 
}: { 
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(new Date())

  // Get current year and month
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  // Generate cells
  const cells = useMemo(() => {
    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayIndex = getFirstDayOfMonth(year, month)
    const startDayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1

    const prevMonthDays = getDaysInMonth(year, month - 1)
    const list: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isSelected: boolean }[] = []

    // Previous month padding
    for (let i = startDayOffset - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dNum).padStart(2, "0")}`
      list.push({
        dateStr,
        dayNum: dNum,
        isCurrentMonth: false,
        isSelected: value === dateStr
      })
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      list.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: true,
        isSelected: value === dateStr
      })
    }

    // Next month padding
    const remaining = 42 - list.length
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      list.push({
        dateStr,
        dayNum: i,
        isCurrentMonth: false,
        isSelected: value === dateStr
      })
    }

    return list
  }, [year, month, value])

  const formattedSelectedDate = useMemo(() => {
    if (!value) return ""
    const [y, m, d] = value.split("-")
    return `${d}/${m}/${y}`
  }, [value])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#F8F8FA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-semibold cursor-pointer flex items-center justify-between text-left h-10 ${className}`}
      >
        <span className={value ? "text-black animate-in fade-in" : "text-neutral-400"}>
          {formattedSelectedDate || placeholder}
        </span>
        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 z-50 bg-white border border-neutral-200 rounded-2xl shadow-xl p-4 w-72 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-black uppercase tracking-wider font-sans">
                {MONTHS[month]} {year}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <span key={day} className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  {day}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(cell.dateStr)
                    setIsOpen(false)
                  }}
                  className={`h-8 w-8 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    cell.isSelected
                      ? "bg-[#8da9c4] text-white shadow-sm"
                      : cell.isCurrentMonth
                      ? "text-black hover:bg-neutral-100"
                      : "text-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {cell.dayNum}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] font-black uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                Borrar
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date()
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                  onChange(todayStr)
                  setIsOpen(false)
                }}
                className="text-[#8da9c4] hover:text-[#4c6885] transition-colors cursor-pointer"
              >
                Hoy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar...",
  className = ""
}: {
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#F8F8FA] border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-semibold cursor-pointer flex items-center justify-between text-left h-10 ${className}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 z-50 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 w-full min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200 select-none overflow-hidden">
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#8da9c4]/10 text-[#4c6885]"
                      : "text-black hover:bg-neutral-50"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#4c6885] stroke-[2.5]" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  // ─── AUTH PROPIO (sin NextAuth) ───────────────────────────
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "appointments" | "schedules" | "clients">("dashboard")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Estados de datos
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isCalendarConfigured, setIsCalendarConfigured] = useState(false)
  const [copiedToken, setCopiedToken] = useState(false)
  const [selectedClientHistory, setSelectedClientHistory] = useState<any | null>(null)
  const [revenueActiveTab, setRevenueActiveTab] = useState<"current" | "weekly" | "monthly">("current")
  
  // Estados para reprogramación de citas
  const [reschedulingApp, setReschedulingApp] = useState<any | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  
  // Estado para confirmación de cierre de sesión
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (reschedulingApp) {
      setRescheduleDate(reschedulingApp.appointment_date)
      setRescheduleTime(reschedulingApp.appointment_time)
    }
  }, [reschedulingApp])

  // Filtros de Citas
  const [filterSearch, setFilterSearch] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterService, setFilterService] = useState("Todos")

  // Estados de Horarios
  const [schedules, setSchedules] = useState<WorkingHours>({
    Lunes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Martes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Miércoles: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Jueves: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Viernes: { enabled: true, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Sábado: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
    Domingo: { enabled: false, start: "07:00", end: "11:00", startPM: "14:00", endPM: "19:00" },
  })
  const [slotDuration, setSlotDuration] = useState("1 hora 20 min")
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [newHolidayDate, setNewHolidayDate] = useState("")
  const [newHolidayReason, setNewHolidayReason] = useState("")

  // Estados para credenciales manuales
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Calcular usuarios VIP (mínimo 3 reservas en cualquier semana del año)
  const vipPatients = useMemo(() => {
    const patientWeekCounts: Record<string, Record<string, number>> = {}
    
    appointments.forEach(app => {
      // Solo contar citas confirmadas o pendientes (no canceladas)
      if (app.status === "cancelled" || !app.patient?.email) return
      
      const email = app.patient.email.toLowerCase().trim()
      const dateParts = app.appointment_date.split("-")
      if (dateParts.length !== 3) return
      
      const d = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
      if (isNaN(d.getTime())) return
      
      // Calcular número de semana simple en el año
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1)
      const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000
      const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
      const yearWeekKey = `${d.getFullYear()}-W${weekNum}`
      
      if (!patientWeekCounts[email]) {
        patientWeekCounts[email] = {}
      }
      patientWeekCounts[email][yearWeekKey] = (patientWeekCounts[email][yearWeekKey] || 0) + 1
    })
    
    const vips = new Set<string>()
    Object.entries(patientWeekCounts).forEach(([email, weeks]) => {
      const hasMin3InAnyWeek = Object.values(weeks).some(count => count >= 3)
      if (hasMin3InAnyWeek) {
        vips.add(email)
      }
    })
    return vips
  }, [appointments])

  // Helper para generar link de WhatsApp
  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    // Por defecto, asumimos indicativo de Colombia (57) si tiene 10 dígitos y no empieza por indicativo
    const phoneWithPrefix = (cleaned.length === 10 && !cleaned.startsWith("57")) ? `57${cleaned}` : cleaned
    return `https://wa.me/${phoneWithPrefix}`
  }

  // Cargar citas directamente desde la base de datos (única fuente de verdad)
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true)
      const res = await fetch("/api/appointments")
      if (res.ok) {
        const data = await res.json()
        setAppointments(Array.isArray(data.appointments) ? data.appointments : [])
        setIsCalendarConfigured(data.isCalendarConfigured || false)
      }
    } catch (err) {
      console.error("Error al cargar citas:", err)
    } finally {
      setLoadingAppointments(false)
    }
  }

  // ─── Verificar sesión al montar ───────────────────────────
  useEffect(() => {
    setIsMounted(true)
    fetch("/api/admin-auth")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.authenticated) setAdminEmail(data.email)
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true))
  }, [])

  // ─── Suscribirse a cambios en tiempo real con Supabase ───
  useEffect(() => {
    if (!adminEmail) return

    const supabase = createClient()
    const channel = supabase
      .channel("admin-appointments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          fetchAppointments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [adminEmail])

  useEffect(() => {
    if (adminEmail) {
      fetchAppointments()

      // Cargar configuraciones de horarios
      fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
          if (data.settings) {
            if (data.settings.slot_duration) setSlotDuration(data.settings.slot_duration)
            if (data.settings.schedules && Object.keys(data.settings.schedules).length > 0) {
              setSchedules(data.settings.schedules)
            }
            if (data.settings.holidays) setHolidays(data.settings.holidays)
          }
        })
        .catch(err => console.error("Error loading settings:", err))
    }
  }, [adminEmail])

  // Helper para persistir configuraciones en base de datos
  const persistSettings = async (newSchedules: any, newHolidays: Holiday[], newDuration: string) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules: newSchedules, holidays: newHolidays, slot_duration: newDuration })
      })
      if (!res.ok) throw new Error("Error saving settings")
    } catch (err) {
      console.error("Error persisting settings:", err)
      throw err;
    }
  }

  // Guardar horario
  const handleSaveSchedules = async () => {
    try {
      await persistSettings(schedules, holidays, slotDuration)
      alert("Horario de apertura y festivos guardados con éxito. 🌿")
    } catch (err) {
      console.error(err)
      alert("Hubo un error al guardar los horarios.")
    }
  }

  // Confirmar cita
  const handleConfirm = async (id: string) => {
    try {
      setUpdatingId(id)
      
      // Actualización optimista del UI
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: "confirmed" } : app)
      )

      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "confirmed" }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.appointment) {
          setAppointments(prev => 
            prev.map(app => app.id === id ? data.appointment : app)
          )
        } else {
          throw new Error(data.error || "Respuesta del servidor inválida")
        }
      } else {
        const errText = await res.text()
        throw new Error(errText)
      }
    } catch (err: any) {
      console.error("Error al confirmar cita:", err)
      alert("Error al confirmar cita: " + (err.message || err))
      fetchAppointments()
    } finally {
      setUpdatingId(null)
    }
  }

  // Cancelar cita
  const handleCancel = async (id: string) => {
    try {
      setUpdatingId(id)

      // Actualización optimista del UI
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: "cancelled" } : app)
      )

      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.appointment) {
          setAppointments(prev => 
            prev.map(app => app.id === id ? data.appointment : app)
          )
        } else {
          throw new Error(data.error || "Respuesta del servidor inválida")
        }
      } else {
        const errText = await res.text()
        throw new Error(errText)
      }
    } catch (err: any) {
      console.error("Error al cancelar cita:", err)
      alert("Error al cancelar cita: " + (err.message || err))
      fetchAppointments()
    } finally {
      setUpdatingId(null)
    }
  }

  // Reprogramar cita
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingApp || !rescheduleDate || !rescheduleTime) return

    try {
      setUpdatingId(reschedulingApp.id)
      const appToUpdate = reschedulingApp
      setReschedulingApp(null) // Cerrar modal

      // Actualización optimista de la UI
      setAppointments(prev => 
        prev.map(app => app.id === appToUpdate.id 
          ? { ...app, appointment_date: rescheduleDate, appointment_time: rescheduleTime } 
          : app
        )
      )

      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: appToUpdate.id, 
          date: rescheduleDate, 
          time: rescheduleTime 
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAppointments(prev => 
          prev.map(app => app.id === appToUpdate.id ? data.appointment : app)
        )
      }
    } catch (err) {
      console.error("Error al reprogramar cita:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Agregar festivo
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHolidayDate) return
    const newHol: Holiday = {
      id: Date.now().toString(),
      date: newHolidayDate,
      reason: newHolidayReason.trim() || "Festivo / Cerrado"
    }
    const updatedHolidays = [...holidays, newHol]
    setHolidays(updatedHolidays)
    setNewHolidayDate("")
    setNewHolidayReason("")
    
    // Persistencia automática
    await persistSettings(schedules, updatedHolidays, slotDuration)
  }

  // Eliminar festivo
  const handleDeleteHoliday = async (id: string) => {
    const updatedHolidays = holidays.filter(h => h.id !== id)
    setHolidays(updatedHolidays)
    
    // Persistencia automática
    await persistSettings(schedules, updatedHolidays, slotDuration)
  }

  // --- CÁLCULO DE MÉTRICAS ---
  const kpis = useMemo(() => {
    const todayStr = formatLocalDate(new Date()) // YYYY-MM-DD
    const todayAppointments = appointments.filter(app => app.appointment_date === todayStr && app.status !== "cancelled")
    
    const activeApps = appointments.filter(app => app.status !== "cancelled")
    const confirmedApps = appointments.filter(app => app.status === "confirmed")
    const conversionRate = activeApps.length > 0 
      ? ((confirmedApps.length / activeApps.length) * 100).toFixed(1) 
      : "0.0"

    return {
      todayCount: todayAppointments.length,
      conversionRate,
      totalActiveCount: activeApps.length,
    }
  }, [appointments])

  // --- GRÁFICO SVG INTERACTIVO ---
  const chartData = useMemo(() => {
    const data = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dStr = formatLocalDate(d)
      
      const count = appointments.filter(app => app.appointment_date === dStr).length
      const dayLabel = d.toLocaleDateString("es-ES", { weekday: "short" })
      data.push({ label: dayLabel, count })
    }
    return data
  }, [appointments])

  // SVG Drawing helpers
  const svgDimensions = { width: 600, height: 220 }
  const chartPoints = useMemo(() => {
    const maxVal = Math.max(...chartData.map(d => d.count), 4)
    const stepX = svgDimensions.width / 6
    return chartData.map((d, index) => {
      const x = index * stepX
      const y = svgDimensions.height - 30 - (d.count / maxVal) * (svgDimensions.height - 60)
      return { x, y, label: d.label, count: d.count }
    })
  }, [chartData])

  const pathD = useMemo(() => {
    if (chartPoints.length === 0) return ""
    return chartPoints.reduce((acc, p, index) => {
      if (index === 0) return `M ${p.x} ${p.y}`
      const prev = chartPoints[index - 1]
      const cpX1 = prev.x + (p.x - prev.x) / 2
      const cpY1 = prev.y
      const cpX2 = prev.x + (p.x - prev.x) / 2
      const cpY2 = p.y
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`
    }, "")
  }, [chartPoints])

  const areaD = useMemo(() => {
    if (chartPoints.length === 0) return ""
    return `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${svgDimensions.height} L ${chartPoints[0].x} ${svgDimensions.height} Z`
  }, [chartPoints, pathD])

  // --- TAB CITAS ---
  const appointmentsGroupedByDate = useMemo(() => {
    const filtered = appointments.filter(app => {
      const nameMatch = !filterSearch || 
        app.patient?.name?.toLowerCase().includes(filterSearch.toLowerCase()) ||
        app.patient?.email?.toLowerCase().includes(filterSearch.toLowerCase()) ||
        app.patient?.phone?.includes(filterSearch)
        
      const dateMatch = !filterDate || app.appointment_date === filterDate
      const statusMatch = filterStatus === "Todos" ? app.status !== "cancelled" : app.status === filterStatus
      const serviceMatch = filterService === "Todos" || filterService === "Terapia Online"
      
      return nameMatch && dateMatch && statusMatch && serviceMatch
    })
    
    const groups: { [date: string]: Appointment[] } = {}
    filtered.forEach(app => {
      const d = app.appointment_date
      if (!groups[d]) groups[d] = []
      groups[d].push(app)
    })
    
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => {
        return {
          dateStr: formatLocalDateReadable(date),
          appointments: groups[date].sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
        }
      })
  }, [appointments, filterSearch, filterDate, filterStatus, filterService])

  // --- TAB CLIENTES ---
  const clientsData = useMemo(() => {
    interface ClientEntry {
      name: string
      email: string
      phone: string
      appointments: number
      completed: number
      spent: number
      lastVisit: string
      history: Array<{
        id: string
        date: string
        time: string
        status: string
        price: number
        reason?: string
      }>
    }

    const list: ClientEntry[] = []

    appointments.forEach(app => {
      const email = app.patient?.email?.toLowerCase().trim() || ""
      const phone = app.patient?.phone?.trim() || ""
      const name = app.patient?.name?.trim() || "Paciente"

      // Buscar si ya existe coincidencia por email o celular
      let existingIndex = -1
      for (let i = 0; i < list.length; i++) {
        const client = list[i]
        const emailMatch = email && client.email && client.email.toLowerCase() === email
        const phoneMatch = phone && client.phone && client.phone === phone
        if (emailMatch || phoneMatch) {
          existingIndex = i
          break
        }
      }

      const isCompleted = app.status === "confirmed"
      const sessionPrice = 120000 // $120.000 COP

      const appDetails = {
        id: app.id,
        date: app.appointment_date,
        time: app.appointment_time,
        status: app.status,
        price: isCompleted ? sessionPrice : 0,
        reason: app.reason
      }

      if (existingIndex !== -1) {
        const existing = list[existingIndex]
        existing.appointments += 1
        if (isCompleted) {
          existing.completed += 1
          existing.spent += sessionPrice
        }
        if (app.appointment_date > existing.lastVisit) {
          existing.lastVisit = app.appointment_date
        }
        // Completar datos faltantes para futuras búsquedas
        if (!existing.email && email) existing.email = email
        if (!existing.phone && phone) existing.phone = phone
        existing.history.push(appDetails)
      } else {
        list.push({
          name,
          email,
          phone,
          appointments: 1,
          completed: isCompleted ? 1 : 0,
          spent: isCompleted ? sessionPrice : 0,
          lastVisit: app.appointment_date,
          history: [appDetails]
        })
      }
    })

    // Ordenar historial de citas por fecha/hora desc
    list.forEach(c => {
      c.history.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date)
        if (dateCompare !== 0) return dateCompare
        return b.time.localeCompare(a.time)
      })
    })

    return list.sort((a, b) => b.spent - a.spent)
  }, [appointments])

  // --- CÁLCULO DE INGRESOS ---
  const revenueStats = useMemo(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() // 0-11
    
    // 1. Ingresos Mes Presente
    const currentMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
    const currentMonthApps = appointments.filter(app => {
      return app.status === "confirmed" && app.appointment_date.startsWith(currentMonthStr)
    })
    const currentMonthRevenue = currentMonthApps.length * 120000

    // 2. Desglose Semanal (Últimas 4 semanas)
    const weeklyData = []
    for (let i = 0; i < 4; i++) {
      const start = new Date()
      start.setDate(today.getDate() - (i * 7) - 6)
      start.setHours(0,0,0,0)
      
      const end = new Date()
      end.setDate(today.getDate() - (i * 7))
      end.setHours(23,59,59,999)
      
      const apps = appointments.filter(app => {
        if (app.status !== "confirmed") return false
        const parts = app.appointment_date.split("-")
        if (parts.length !== 3) return false
        const appDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0)
        return appDate >= start && appDate <= end
      })
      
      const label = i === 0 
        ? "Esta Semana" 
        : `Hace ${i} ${i === 1 ? "semana" : "semanas"}`
        
      const dateRangeStr = `${start.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`
      
      weeklyData.push({
        label,
        range: dateRangeStr,
        revenue: apps.length * 120000,
        count: apps.length
      })
    }

    // 3. Desglose Mensual (Últimos 12 meses)
    const monthlyData = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(currentYear, currentMonth - i, 1)
      const year = d.getFullYear()
      const month = d.getMonth()
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`
      
      const apps = appointments.filter(app => {
        return app.status === "confirmed" && app.appointment_date.startsWith(prefix)
      })
      
      const monthLabel = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
      
      monthlyData.push({
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        revenue: apps.length * 120000,
        count: apps.length
      })
    }

    return {
      currentMonthRevenue,
      currentMonthCount: currentMonthApps.length,
      weeklyData,
      monthlyData
    }
  }, [appointments])

  // --- CÁLCULO DE ESTADÍSTICAS DE DEMANDA ---
  const analyticsStats = useMemo(() => {
    const activeApps = appointments.filter(app => app.status !== "cancelled")
    if (activeApps.length === 0) {
      return {
        topDay: "Sin Datos",
        topDayPct: 0,
        lowestDay: "Sin Datos",
        lowestDayPct: 0,
        peakPeriod: "Sin Datos",
        peakHour: "00:00",
        topReason: "Sin Datos",
        topReasonCount: 0
      }
    }

    // 1. Día más solicitado
    const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const dayCounts: { [key: string]: number } = {}
    activeApps.forEach(app => {
      const parts = app.appointment_date.split("-")
      if (parts.length === 3) {
        const dIndex = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getDay()
        const dName = weekdays[dIndex]
        dayCounts[dName] = (dayCounts[dName] || 0) + 1
      }
    })
    
    let topDay = "Sin Datos"
    let maxDayCount = 0
    let lowestDay = "Sin Datos"
    let minDayCount = Infinity
    
    Object.entries(dayCounts).forEach(([day, count]) => {
      if (count > maxDayCount) {
        maxDayCount = count
        topDay = day
      }
      if (count < minDayCount) {
        minDayCount = count
        lowestDay = day
      }
    })
    
    // Si no hay días registrados con citas, corregimos Infinity
    if (minDayCount === Infinity) minDayCount = 0
    
    const topDayPct = Math.round((maxDayCount / activeApps.length) * 100)
    const lowestDayPct = activeApps.length > 0 ? Math.round((minDayCount / activeApps.length) * 100) : 0

    // 2. Horas Pico (AM/PM y hora exacta)
    let amCount = 0
    let pmCount = 0
    const hourCounts: { [key: string]: number } = {}
    
    activeApps.forEach(app => {
      const timeStr = app.appointment_time.trim().toUpperCase()
      
      let isPM = false
      if (timeStr.includes("PM")) {
        isPM = true
      } else if (timeStr.includes("AM")) {
        isPM = false
      } else {
        const hourPart = parseInt(timeStr.split(":")[0])
        isPM = hourPart >= 12
      }
      
      if (isPM) pmCount++
      else amCount++
      
      hourCounts[timeStr] = (hourCounts[timeStr] || 0) + 1
    })
    
    const peakPeriod = pmCount >= amCount ? "Jornada PM" : "Jornada AM"
    
    let peakHour = "Sin Datos"
    let maxHourCount = 0
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxHourCount) {
        maxHourCount = count
        peakHour = hour
      }
    })

    // 3. Motivo de consulta más solicitado
    const reasonCounts: { [key: string]: number } = {}
    const getReasonCategory = (reason?: string): string => {
      if (!reason) return "Consulta General"
      const r = reason.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      if (r.includes("ansiedad")) return "Ansiedad"
      if (r.includes("estres")) return "Estrés"
      if (r.includes("depre")) return "Depresión"
      if (r.includes("pareja") || r.includes("relacion")) return "Terapia de Pareja"
      if (r.includes("autoestima")) return "Autoestima"
      if (r.includes("duelo")) return "Duelo"
      
      const cleanReason = reason.trim()
      return cleanReason.charAt(0).toUpperCase() + cleanReason.slice(1)
    }

    activeApps.forEach(app => {
      const cat = getReasonCategory(app.reason)
      reasonCounts[cat] = (reasonCounts[cat] || 0) + 1
    })
    
    let topReason = "Consulta General"
    let maxReasonCount = 0
    Object.entries(reasonCounts).forEach(([reason, count]) => {
      if (count > maxReasonCount) {
        maxReasonCount = count
        topReason = reason
      }
    })

    return {
      topDay,
      topDayPct,
      lowestDay,
      lowestDayPct,
      peakPeriod,
      peakHour,
      topReason,
      topReasonCount: maxReasonCount
    }
  }, [appointments])

  const pendingCount = useMemo(() => {
    return appointments.filter(app => app.status === "pending").length
  }, [appointments])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!emailInput.trim() || !passwordInput.trim()) {
      setFormError("Por favor ingresa correo y contraseña.")
      return
    }
    setIsSubmittingForm(true)
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setAdminEmail(data.email)
      } else {
        setFormError(data.error || "Credenciales inválidas.")
      }
    } catch (err) {
      setFormError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" })
    setAdminEmail(null)
  }

  // ─── Guardas de pantalla ───────────────────────────────────
  if (!isMounted || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-white font-dm-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
          <p className="font-extrabold text-black/60 tracking-widest text-[10px] uppercase">Cargando...</p>
        </div>
      </div>
    )
  }

  // Pantalla de Acceso (Login) - Stark Black & White Premium
  if (!adminEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9FB] px-6 py-12 font-dm-sans text-black relative">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-neutral-200 relative z-10 animate-in fade-in duration-500">
          <div className="flex flex-col items-center space-y-8">
            <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="h-8 w-8" />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-black font-sans">SOULMAR</h1>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Portal Administrativo</p>
            </div>
            
            <div className="w-full h-px bg-neutral-200" />

            {formError && (
              <div className="w-full p-4 rounded-xl bg-neutral-50 text-neutral-800 border border-neutral-300 flex items-start gap-2.5 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Google OAuth - Deshabilitado en modo manual */}

            {/* Manual Form */}
            <form onSubmit={handleCredentialsSubmit} className="w-full space-y-4">
              <input
                type="email"
                placeholder="Correo de administrador"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full h-12 rounded-xl px-4 bg-[#F8F8FA] border border-neutral-300 text-black font-semibold focus:bg-white focus:border-black outline-none transition-all text-xs"
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full h-12 rounded-xl pl-4 pr-12 bg-[#F8F8FA] border border-neutral-300 text-black font-semibold focus:bg-white focus:border-black outline-none transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full h-12 rounded-full bg-black hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmittingForm ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#F9F9FB] overflow-hidden font-dm-sans text-black relative">
      
      {/* SIDEBAR - Stark Monochromatic Premium */}
      <aside className="hidden md:flex flex-col w-72 bg-black text-white p-8 justify-between relative z-20 shadow-md">
        <div className="space-y-12">
          {/* Logo / Cabecera */}
          <div className="flex justify-start py-1 pl-5">
            <img 
              src="/images/logo-official.png" 
              alt="Soulmar" 
              className="w-full max-w-[165px] h-auto object-contain"
            />
          </div>


          {/* Menú */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-white text-black"
                  : "hover:bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-white text-black"
                  : "hover:bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Citas</span>
              </div>
              {pendingCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white shadow-lg animate-in zoom-in duration-300">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("schedules")}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "schedules"
                  ? "bg-white text-black"
                  : "hover:bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Horarios</span>
            </button>

            <button
              onClick={() => setActiveTab("clients")}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "clients"
                  ? "bg-white text-black"
                  : "hover:bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Clientes</span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-6 pb-6 border-t border-neutral-800 space-y-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold uppercase text-xs">
              CA
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-white truncate">Cuenta Administrador</p>
              <p className="text-[9px] text-neutral-400 truncate">designwebrich@gmail.com</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 text-neutral-300 border border-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 hover:scale-[1.01] transition-all duration-300 font-bold text-[10px] uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* DRAWER MÓVIL */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex flex-col w-72 bg-black text-white p-8 justify-between shadow-2xl h-full z-10 animate-in slide-in-from-left duration-300">
            <div className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/logo-official.png" 
                    alt="Soulmar" 
                    className="w-[124px] h-auto object-contain"
                  />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${
                    activeTab === "dashboard" ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab("appointments"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-xl font-bold transition-all ${
                    activeTab === "appointments" ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Citas</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white shadow-lg">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab("schedules"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${
                    activeTab === "schedules" ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Horarios</span>
                </button>
                <button
                  onClick={() => { setActiveTab("clients"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${
                    activeTab === "clients" ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Clientes</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 pb-6 border-t border-neutral-800 space-y-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold">
                  CA
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Cuenta Administrador</p>
                  <p className="text-[9px] text-neutral-400">designwebrich@gmail.com</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setShowLogoutConfirm(true)
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 text-neutral-300 border border-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 hover:scale-[1.01] transition-all duration-300 font-bold text-[10px] uppercase cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Cabecera superior - Clean Minimalist */}
        <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-8 md:px-12 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg bg-neutral-100 text-black hover:bg-neutral-200 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-black font-sans uppercase">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "appointments" && "Agenda"}
              {activeTab === "schedules" && "Horarios"}
              {activeTab === "clients" && "Clientes"}
            </h1>
          </div>

          <div className="flex items-center gap-2 border border-[#1D9E75]/20 px-4 py-2 rounded-full text-[10px] font-black text-[#1D9E75] bg-[#1D9E75]/8 shadow-sm uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Google Calendar Conectado</span>
          </div>
        </header>

        {/* Viewport del Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 w-full bg-[#F9F9FB]">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* TAB 1: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* KPI 1 - Verde Soulmar */}
                  <div className="bg-[#1D9E75]/[0.02] rounded-3xl p-8 border border-[#1D9E75]/12 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#1D9E75]/25 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75]/80 block">Citas para hoy</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.todayCount}</span>
                      <span className="text-[9px] font-bold text-[#1D9E75] bg-[#1D9E75]/8 border border-[#1D9E75]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Sesiones activas</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/15 flex items-center justify-center text-[#1D9E75]">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>

                  {/* KPI 2 - Amarillo/Ámbar Soulmar */}
                  <div className="bg-[#BA7517]/[0.02] rounded-3xl p-8 border border-[#BA7517]/12 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#BA7517]/25 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#BA7517]/80 block">Conversión de Agenda</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.conversionRate}%</span>
                      <span className="text-[9px] font-bold text-[#BA7517] bg-[#BA7517]/8 border border-[#BA7517]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Confirmación directa</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#BA7517]/10 border border-[#BA7517]/15 flex items-center justify-center text-[#BA7517]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* KPI 3 - Azul Soulmar */}
                  <div className="bg-[#8da9c4]/[0.02] rounded-3xl p-8 border border-[#8da9c4]/15 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#8da9c4]/30 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#4c6885] block">Citas Totales</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.totalActiveCount}</span>
                      <span className="text-[9px] font-bold text-[#4c6885] bg-[#8da9c4]/10 border border-[#8da9c4]/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Reservas Activas</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#8da9c4]/10 border border-[#8da9c4]/20 flex items-center justify-center text-[#8da9c4]">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* SVG Trend Chart - Clean Monochromatic */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Volumen de Citas (Últimos 7 días)</h3>
                      <p className="text-[11px] text-neutral-400 font-semibold">Tendencia diaria de reservas agendadas en la página web.</p>
                    </div>
                     <div className="flex items-center gap-1.5 bg-[#8da9c4]/8 border border-[#8da9c4]/20 px-3 py-1 rounded-full text-[9px] font-black text-[#4c6885] uppercase tracking-widest">
                       <Sparkles className="w-3.5 h-3.5" />
                       <span>Azul Soulmar</span>
                     </div>
                   </div>
                   
                   <div className="relative w-full overflow-x-auto">
                     <div className="min-w-[600px] h-60 flex flex-col justify-between">
                       <svg viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`} className="w-full h-full overflow-visible">
                         <defs>
                           <linearGradient id="blueChartGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#8da9c4" stopOpacity="0.12" />
                             <stop offset="100%" stopColor="#8da9c4" stopOpacity="0.0" />
                           </linearGradient>
                           <filter id="chartLineShadow" x="-10%" y="-10%" width="120%" height="120%">
                             <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#8da9c4" floodOpacity="0.25" />
                           </filter>
                         </defs>
 
                         {/* thin clean grid lines */}
                         {[0, 1, 2, 3, 4].map((gridIndex) => {
                           const y = 20 + (gridIndex / 4) * (svgDimensions.height - 50)
                           return (
                             <line 
                               key={gridIndex} 
                               x1="0" 
                               y1={y} 
                               x2={svgDimensions.width} 
                               y2={y} 
                               stroke="#000000" 
                               strokeOpacity="0.05"
                             />
                           )
                         })}
 
                         {/* Gradient Area under curve */}
                         {areaD && <path d={areaD} fill="url(#blueChartGradient)" className="transition-all duration-700" />}
 
                         {/* Glowing Line Path */}
                         {pathD && (
                           <path 
                             d={pathD} 
                             fill="none" 
                             stroke="#8da9c4" 
                             strokeWidth="3.5" 
                             strokeLinecap="round" 
                             strokeLinejoin="round" 
                             filter="url(#chartLineShadow)"
                             className="transition-all duration-700"
                           />
                         )}
 
                         {/* Nodes with double outer glowing borders */}
                         {chartPoints.map((p, i) => (
                           <g key={i} className="group/node cursor-pointer">
                             <circle 
                               cx={p.x} 
                               cy={p.y} 
                               r="4.5" 
                               fill="#FFFFFF" 
                               stroke="#8da9c4" 
                               strokeWidth="3.5" 
                               className="transition-all duration-300 group-hover/node:stroke-[#8da9c4]/80 group-hover/node:r-5.5"
                             />
                             <text 
                               cx={p.x} 
                               cy={p.y} 
                               x={p.x} 
                               y={p.y - 12} 
                               textAnchor="middle" 
                               className="text-[10px] font-black fill-[#4c6885] font-sans"
                             >
                               {p.count}
                             </text>
                            <text 
                              x={p.x} 
                              y={svgDimensions.height - 5} 
                              textAnchor="middle" 
                              className="text-[9px] font-extrabold fill-neutral-400 uppercase tracking-wider"
                            >
                              {p.label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* METRICAS DE ANALITICAS ADICIONALES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  
                  {/* Card 1: Día de Mayor Demanda */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Día de Mayor Demanda</span>
                      <span className="text-3xl font-black text-black font-sans block truncate max-w-[180px]">{analyticsStats.topDay}</span>
                      <span className="text-[9px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.topDayPct}% de las sesiones
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-black">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: Hora Pico de Sesiones */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Hora Pico de Sesiones</span>
                      <span className="text-3xl font-black text-black font-sans block">{analyticsStats.peakHour}</span>
                      <span className="text-[9px] font-bold text-[#BA7517] bg-[#BA7517]/8 border border-[#BA7517]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.peakPeriod}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#BA7517]/10 border border-[#BA7517]/15 flex items-center justify-center text-[#BA7517]">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {/* Card 3: Motivo más Solicitado */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Motivo más Solicitado</span>
                      <span className="text-3xl font-black text-black font-sans block truncate max-w-[180px]">{analyticsStats.topReason}</span>
                      <span className="text-[9px] font-bold text-[#1D9E75] bg-[#1D9E75]/8 border border-[#1D9E75]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.topReasonCount} {analyticsStats.topReasonCount === 1 ? "reserva" : "reservas"}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/15 flex items-center justify-center text-[#1D9E75]">
                      <Search className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* INGRESOS POR CITAS CARD */}
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-5">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#8da9c4]" />
                        <span>Ingresos por Citas</span>
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-semibold">Resumen de ingresos basados en sesiones de Terapia Online confirmadas ($120.000 COP c/u).</p>
                    </div>
                    
                    {/* Segmented controls / Pill Tabs */}
                    <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 p-1 rounded-full w-fit">
                      <button
                        onClick={() => setRevenueActiveTab("current")}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          revenueActiveTab === "current"
                            ? "bg-black text-white shadow-sm"
                            : "text-neutral-400 hover:text-black"
                        }`}
                      >
                        Mes Actual
                      </button>
                      <button
                        onClick={() => setRevenueActiveTab("weekly")}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          revenueActiveTab === "weekly"
                            ? "bg-black text-white shadow-sm"
                            : "text-neutral-400 hover:text-black"
                        }`}
                      >
                        Semanal
                      </button>
                      <button
                        onClick={() => setRevenueActiveTab("monthly")}
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          revenueActiveTab === "monthly"
                            ? "bg-black text-white shadow-sm"
                            : "text-neutral-400 hover:text-black"
                        }`}
                      >
                        Mensual (12M)
                      </button>
                    </div>
                  </div>

                  {/* Render content based on active tab */}
                  {revenueActiveTab === "current" && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 animate-in fade-in duration-300">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#4c6885] block">Ganancias del Mes en Curso</span>
                        <span className="text-4xl md:text-5xl font-black text-black font-sans block">
                          {formatCOP(revenueStats.currentMonthRevenue)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-semibold block capitalize">
                          {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <div className="p-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">Sesiones Realizadas</span>
                          <span className="text-lg font-black text-black block">{revenueStats.currentMonthCount}</span>
                        </div>
                        <div className="p-4 bg-[#1D9E75]/5 border border-[#1D9E75]/10 rounded-2xl text-center space-y-1">
                          <span className="text-[9px] font-black text-[#1D9E75] uppercase tracking-wider block">Valor de Sesión</span>
                          <span className="text-lg font-black text-black block">$120.000 COP</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {revenueActiveTab === "weekly" && (
                    <div className="space-y-3 py-2 animate-in fade-in duration-300">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Desglose por Citas Semanales (Últimos 30 días)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {revenueStats.weeklyData.map((week, idx) => (
                          <div key={idx} className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex flex-col justify-between hover:bg-neutral-50 transition-all">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-[#BA7517] uppercase tracking-widest block">{week.label}</span>
                              <span className="text-[9px] text-neutral-400 font-bold block">{week.range}</span>
                            </div>
                            <div className="mt-4 space-y-0.5">
                              <span className="text-lg font-black text-black block">{formatCOP(week.revenue)}</span>
                              <span className="text-[9px] font-bold text-neutral-400 block uppercase tracking-wider">{week.count} {week.count === 1 ? "cita" : "citas"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {revenueActiveTab === "monthly" && (
                    <div className="space-y-3 py-2 animate-in fade-in duration-300">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Desglose de Ingresos Mensuales (Últimos 12 meses)</span>
                      <div className="max-h-[300px] overflow-y-auto rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
                        {revenueStats.monthlyData.map((month, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-white hover:bg-neutral-50 transition-all">
                            <span className="text-xs font-bold text-black">{month.label}</span>
                            <div className="flex items-center gap-6">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{month.count} {month.count === 1 ? "sesión" : "sesiones"}</span>
                              <span className="text-sm font-black text-black">{formatCOP(month.revenue)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* API Diagnostics Console */}
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Consola de Conectividad</h3>
                    <p className="text-[11px] text-neutral-400 font-semibold">Integración en tiempo real con Google Calendar y la base de datos Supabase.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Variables de Integración</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 bg-[#F8F8FA] border border-neutral-200 rounded-2xl">
                          <span className="text-xs font-bold text-neutral-700">GOOGLE_CLIENT_ID</span>
                          <span className="text-[9px] font-extrabold text-black bg-neutral-200 border border-neutral-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Activa</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F8F8FA] border border-neutral-200 rounded-2xl">
                          <span className="text-xs font-bold text-neutral-700">GOOGLE_CLIENT_SECRET</span>
                          <span className="text-[9px] font-extrabold text-black bg-neutral-200 border border-neutral-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Activa</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-[#F8F8FA] border border-neutral-200 rounded-2xl">
                          <span className="text-xs font-bold text-neutral-700">Google Calendar</span>
                          <span className="text-[9px] font-extrabold text-black bg-neutral-200 border border-neutral-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Sincronizado</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">OAuth Refresh Token</h4>
                      
                      <div className="p-6 bg-[#F8F8FA] rounded-2xl border border-neutral-200 space-y-4">
                        <div className="flex gap-2.5 text-black">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <p className="text-xs font-black uppercase tracking-wider">Sincronización Local Activa</p>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
                          Las citas agendadas en la sección de reserva del frontend se sincronizan de inmediato con esta consola mediante hooks de bases de datos y Local Storage unificado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CITAS */}
            {activeTab === "appointments" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* KPI 1 - Verde Soulmar */}
                  <div className="bg-[#1D9E75]/[0.02] rounded-3xl p-8 border border-[#1D9E75]/12 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#1D9E75]/25 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#1D9E75]/80 block">Citas para hoy</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.todayCount}</span>
                      <span className="text-[9px] font-bold text-[#1D9E75] bg-[#1D9E75]/8 border border-[#1D9E75]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Sesiones activas</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/15 flex items-center justify-center text-[#1D9E75]">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>

                  {/* KPI 2 - Amarillo/Ámbar Soulmar */}
                  <div className="bg-[#BA7517]/[0.02] rounded-3xl p-8 border border-[#BA7517]/12 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#BA7517]/25 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#BA7517]/80 block">Conversión de Agenda</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.conversionRate}%</span>
                      <span className="text-[9px] font-bold text-[#BA7517] bg-[#BA7517]/8 border border-[#BA7517]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Confirmación directa</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#BA7517]/10 border border-[#BA7517]/15 flex items-center justify-center text-[#BA7517]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* KPI 3 - Azul Soulmar */}
                  <div className="bg-[#8da9c4]/[0.02] rounded-3xl p-8 border border-[#8da9c4]/15 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#8da9c4]/30 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#4c6885] block">Citas Totales</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.totalActiveCount}</span>
                      <span className="text-[9px] font-bold text-[#4c6885] bg-[#8da9c4]/10 border border-[#8da9c4]/20 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Reservas Activas</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#8da9c4]/10 border border-[#8da9c4]/20 flex items-center justify-center text-[#8da9c4]">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Citas Agendadas</h3>
                    <p className="text-[11px] text-neutral-400 font-semibold">Gestiona el estado y enlace virtual de cada sesión clínica.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    <a 
                      href="https://calendar.google.com/calendar/u/0/r"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-black text-white hover:bg-[#8da9c4] transition-colors flex items-center justify-center shadow-sm shrink-0"
                    >
                      <Calendar className="w-5 h-5" />
                    </a>
                    
                    <a 
                      href="https://meet.google.com/landing?hs=197&authuser=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-black text-white hover:bg-[#8da9c4] transition-colors flex items-center justify-center shadow-sm shrink-0"
                    >
                      <Video className="w-5 h-5" />
                    </a>

                    <a 
                      href="https://drive.google.com/drive/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-black text-white hover:bg-[#8da9c4] transition-colors flex items-center justify-center shadow-sm shrink-0"
                    >
                      <Folder className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* FILTROS DE CITAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end bg-[#F8F8FA] p-5 rounded-2xl border border-neutral-200">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Buscar</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Nombre, email o tel" 
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        className="w-full h-10 rounded-full pl-9 pr-4 bg-white border border-neutral-300 text-xs font-semibold focus:border-black outline-none transition-all"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Fecha</label>
                    <CustomDatePicker 
                      value={filterDate}
                      onChange={setFilterDate}
                      className="h-10 rounded-full bg-white border border-neutral-300 text-xs font-semibold focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Estado</label>
                    <CustomSelect 
                      value={filterStatus}
                      onChange={setFilterStatus}
                      options={[
                        { value: "Todos", label: "Todos" },
                        { value: "pending", label: "Pendiente" },
                        { value: "confirmed", label: "Confirmada" },
                        { value: "cancelled", label: "Cancelada" }
                      ]}
                      className="h-10 rounded-full bg-white border border-neutral-300 text-xs font-semibold focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Servicio</label>
                    <CustomSelect 
                      value={filterService}
                      onChange={setFilterService}
                      options={[
                        { value: "Todos", label: "Todos" },
                        { value: "Terapia Online", label: "Terapia Online" },
                        { value: "Cursos", label: "Cursos" },
                        { value: "Retiros", label: "Retiros" }
                      ]}
                      className="h-10 rounded-full bg-white border border-neutral-300 text-xs font-semibold focus:border-black"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setFilterSearch("")
                        setFilterDate("")
                        setFilterStatus("Todos")
                        setFilterService("Todos")
                      }}
                      className="flex-1 h-10 rounded-full border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 text-[10px] uppercase font-bold transition-all cursor-pointer"
                    >
                      Limpiar
                    </button>
                    <button 
                      onClick={fetchAppointments}
                      className="flex-1 h-10 rounded-full bg-black text-white hover:bg-[#8da9c4] text-[10px] uppercase font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Filtrar
                    </button>
                  </div>
                </div>

                {/* LISTADO DE CITAS */}
                {loadingAppointments ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Consultando la nube...</p>
                  </div>
                ) : appointmentsGroupedByDate.length === 0 ? (
                  <div className="h-64 border border-dashed border-neutral-300 rounded-3xl flex flex-col items-center justify-center gap-3 text-neutral-400 p-8">
                    <Calendar className="w-8 h-8 opacity-30" />
                    <p className="text-xs font-semibold">No se encontraron citas con los filtros seleccionados.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {appointmentsGroupedByDate.map((group) => (
                      <div key={group.dateStr} className="space-y-3">
                        <h4 className="text-xs font-black text-black border-b border-neutral-200 pb-2 font-sans uppercase tracking-wider">
                          {group.dateStr}
                        </h4>
                        
                        <div className="space-y-3">
                          {group.appointments.map((app) => (
                            <div 
                              key={app.id} 
                              className="bg-white rounded-2xl p-5 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-center gap-5">
                                <div className="text-center min-w-16">
                                  <p className="text-sm font-black text-black">{app.appointment_time}</p>
                                  <p className="text-[9px] text-neutral-400 font-mono">
                                    {parseInt(app.appointment_time.split(":")[0]) + 1}:00
                                  </p>
                                </div>
                                
                                <div className="h-8 w-px bg-neutral-200 hidden sm:block" />

                                <div className="space-y-0.5">
                                  <p className="font-bold text-sm text-black flex items-center gap-1.5">
                                    <span>{app.patient?.name || "Sin Nombre"}</span>
                                    {app.patient?.email && vipPatients.has(app.patient.email.toLowerCase().trim()) && (
                                      <span title="Cliente VIP: Mínimo 3 reservas por semana">
                                        <Star className="w-3.5 h-3.5 text-[#BA7517] fill-[#BA7517] shrink-0" />
                                      </span>
                                    )}
                                    <span className="text-neutral-400 font-medium font-sans">· Terapia Online</span>
                                  </p>
                                  <p className="text-xs text-neutral-500 font-medium">
                                    {app.patient?.email ? (
                                      <a 
                                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${app.patient.email}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-black hover:underline transition-all duration-200"
                                      >
                                        {app.patient.email}
                                      </a>
                                    ) : (
                                      "Sin Correo"
                                    )}
                                    {" · "}
                                    {app.patient?.phone ? (
                                      <a 
                                        href={getWhatsAppLink(app.patient.phone)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-[#1D9E75] hover:underline transition-all duration-200 font-semibold"
                                      >
                                        {app.patient.phone}
                                      </a>
                                    ) : (
                                      "Sin Teléfono"
                                    )}
                                  </p>
                                  {app.reason && (
                                    <p className="text-[10px] text-neutral-800 font-bold">
                                      Motivo: <span className="font-extrabold text-black">"{app.reason}"</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Mostrar la etiqueta de estado únicamente si es Pendiente o Cancelada */}
                                {app.status !== "confirmed" && (
                                  <span className={`h-8 px-4 inline-flex items-center justify-center rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    app.status === "cancelled"
                                      ? "bg-[#E11D48]/8 text-[#E11D48] border border-[#E11D48]/20"
                                      : "bg-[#BA7517]/8 text-[#BA7517] border border-[#BA7517]/20"
                                  }`}>
                                    {app.status === "cancelled" && "Cancelada"}
                                    {app.status === "pending" && "Pendiente"}
                                  </span>
                                )}

                                {updatingId === app.id ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                                ) : (
                                  <>
                                    {app.status === "confirmed" && app.meeting_link && (
                                      <a
                                        href={app.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-8 px-4 rounded-full border border-black/15 bg-black/5 hover:bg-black/10 text-black font-bold text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Google Meet</span>
                                      </a>
                                    )}

                                    {/* Botón de Reprogramar (Píldora) - Solo si no está cancelada */}
                                    {app.status !== "cancelled" && (
                                      <button
                                        onClick={() => setReschedulingApp(app)}
                                        className="h-8 px-4 rounded-full bg-[#8da9c4]/12 border border-[#8da9c4]/30 text-[#4c6885] hover:bg-[#8da9c4]/22 font-extrabold text-[9px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        Reprogramar
                                      </button>
                                    )}

                                    {/* Botón de Confirmar (Círculo Verde con Icono de Check) - Solo si está pendiente */}
                                    {app.status === "pending" && (
                                      <button
                                        onClick={() => handleConfirm(app.id)}
                                        className="w-8 h-8 rounded-full bg-[#1D9E75]/10 border border-[#1D9E75]/20 text-[#1D9E75] hover:bg-[#1D9E75]/20 flex items-center justify-center transition-all cursor-pointer"
                                        title="Confirmar cita"
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3.0]" />
                                      </button>
                                    )}

                                    {/* Botón de Cancelar (Círculo Rojo con Icono de X) - Solo si no está cancelada */}
                                    {app.status !== "cancelled" && (
                                      <button
                                        onClick={() => {
                                          const confirmCancel = window.confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.")
                                          if (confirmCancel) handleCancel(app.id)
                                        }}
                                        className="w-8 h-8 rounded-full bg-[#E0533C]/10 border border-[#E0533C]/20 text-[#E0533C] hover:bg-[#E0533C]/20 flex items-center justify-center transition-all cursor-pointer"
                                        title="Cancelar cita"
                                      >
                                        <X className="w-3.5 h-3.5 stroke-[3.0]" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              </div>
            )}

            {/* TAB 3: HORARIOS */}
            {activeTab === "schedules" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* METRICAS DE ANALITICAS ADICIONALES (100% arriba y solas) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Día de Mayor Demanda */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Día de Mayor Demanda</span>
                      <span className="text-3xl font-black text-black font-sans block truncate max-w-[180px]">{analyticsStats.topDay}</span>
                      <span className="text-[9px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.topDayPct}% de las sesiones
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-black">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: Hora Pico de Sesiones */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Hora Pico de Sesiones</span>
                      <span className="text-3xl font-black text-black font-sans block">{analyticsStats.peakHour}</span>
                      <span className="text-[9px] font-bold text-[#BA7517] bg-[#BA7517]/8 border border-[#BA7517]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.peakPeriod}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#BA7517]/10 border border-[#BA7517]/15 flex items-center justify-center text-[#BA7517]">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: Día Menos Agendado */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block">Día Menos Agendado</span>
                      <span className="text-3xl font-black text-black font-sans block truncate max-w-[180px]">{analyticsStats.lowestDay}</span>
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        {analyticsStats.lowestDayPct}% de las sesiones
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* BLOQUES DE CONFIGURACIÓN DE HORARIOS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Horario de Apertura */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Horario de Apertura</h3>
                      <p className="text-[11px] text-neutral-400 font-semibold">Define los intervalos de agenda disponibles para reserva en la landing page.</p>
                    </div>

                    <div className="divide-y divide-neutral-200 space-y-4">
                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => {
                        const daySched = schedules[day]
                        if (!daySched) return null
                        return (
                          <div key={day} className="flex items-center justify-between pt-4 first:pt-0">
                            {/* Selector circular customizado */}
                            <div 
                              onClick={() => {
                                setSchedules(prev => ({
                                  ...prev,
                                  [day]: { ...prev[day], enabled: !daySched.enabled }
                                }))
                              }}
                              className="group flex items-center gap-3.5 cursor-pointer select-none"
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-[#8da9c4] group-hover:bg-[#8da9c4] ${
                                daySched.enabled 
                                  ? "border-black bg-black text-white" 
                                  : "border-neutral-300 bg-white"
                              }`}>
                                {daySched.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-xs font-bold text-black uppercase tracking-wider">{day}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {daySched.enabled ? (
                                <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-neutral-400 w-4">AM</span>
                                    <input 
                                      type="text" 
                                      value={daySched.start}
                                      onChange={(e) => {
                                        setSchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], start: e.target.value }
                                        }))
                                      }}
                                      className="w-16 h-8 rounded-lg border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                    />
                                    <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider px-0.5">-</span>
                                    <input 
                                      type="text" 
                                      value={daySched.end}
                                      onChange={(e) => {
                                        setSchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], end: e.target.value }
                                        }))
                                      }}
                                      className="w-16 h-8 rounded-lg border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-neutral-400 w-4">PM</span>
                                    <input 
                                      type="text" 
                                      value={daySched.startPM || "14:00"}
                                      onChange={(e) => {
                                        setSchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], startPM: e.target.value }
                                        }))
                                      }}
                                      className="w-16 h-8 rounded-lg border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                    />
                                    <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-wider px-0.5">-</span>
                                    <input 
                                      type="text" 
                                      value={daySched.endPM || "19:00"}
                                      onChange={(e) => {
                                        setSchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], endPM: e.target.value }
                                        }))
                                      }}
                                      className="w-16 h-8 rounded-lg border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-neutral-300 pr-10 uppercase tracking-widest">Cerrado</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-neutral-200 gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest">Intervalo:</span>
                        <CustomSelect 
                          value={slotDuration}
                          onChange={setSlotDuration}
                          options={[
                            { value: "30 min", label: "30 min" },
                            { value: "45 min", label: "45 min" },
                            { value: "1 hora", label: "1 hora" },
                            { value: "1 hora 20 min", label: "1h + 20m prep" }
                          ]}
                          className="h-10 rounded-xl bg-white border border-neutral-200 text-xs font-semibold focus:border-black min-w-[120px]"
                        />
                      </div>

                      <button 
                        onClick={handleSaveSchedules}
                        className="h-12 px-8 rounded-full bg-black text-white hover:bg-[#8da9c4] transition-all font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center"
                      >
                        Guardar Horario
                      </button>
                    </div>
                  </div>

                  {/* Días Cerrados / Festivos */}
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Días Cerrados</h3>
                      <p className="text-[11px] text-neutral-400 font-semibold">Configura fechas en las que la clínica se encuentre cerrada.</p>
                    </div>

                    <form onSubmit={handleAddHoliday} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Fecha*</label>
                        <CustomDatePicker 
                          value={newHolidayDate}
                          onChange={setNewHolidayDate}
                          className="w-full h-11 rounded-xl px-4 border border-neutral-200 bg-[#F8F8FA] focus:bg-white text-xs font-bold text-black focus:border-black transition-all shadow-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Motivo (Opcional)*</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Ej: Festivo, Vacaciones..."
                            value={newHolidayReason}
                            onChange={(e) => setNewHolidayReason(e.target.value)}
                            className="flex-1 h-11 rounded-xl px-4 border border-neutral-200 bg-[#F8F8FA] focus:bg-white text-xs font-semibold text-black focus:border-black outline-none transition-all shadow-sm"
                          />
                          <button
                            type="submit"
                            className="h-11 px-5 rounded-xl bg-black hover:bg-[#8da9c4] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-97 cursor-pointer"
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Listado de festivos */}
                    <div className="space-y-4 pt-5 border-t border-neutral-200">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Días Registrados</h4>
                      
                      {holidays.length === 0 ? (
                        <p className="text-xs text-neutral-300 font-semibold text-center py-4 uppercase tracking-widest">Sin registros</p>
                      ) : (
                        <div className="space-y-2.5">
                          {holidays.map((h) => (
                            <div 
                              key={h.id}
                              className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] animate-in fade-in duration-300"
                            >
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-black">{formatLocalDateReadable(h.date)}</p>
                                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{h.reason}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteHoliday(h.id)}
                                className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-50 transition-all cursor-pointer"
                                title="Eliminar festivo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 4: CLIENTES */}
            {activeTab === "clients" && (
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-sm space-y-8 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Listado de Clientes</h3>
                  <p className="text-[11px] text-neutral-400 font-semibold">
                    {clientsData.length} clientes registrados en base de datos, ordenados por facturación total.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-50 text-neutral-500 uppercase text-[9px] font-black tracking-widest border-b border-neutral-200">
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4 text-center">Citas</th>
                        <th className="px-6 py-4 text-center">Completadas</th>
                        <th className="px-6 py-4 text-right">Gastado</th>
                        <th className="px-6 py-4 text-right">Última Visita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {clientsData.map((client, index) => (
                        <tr 
                          key={index} 
                          onClick={() => setSelectedClientHistory(client)}
                          className="hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#8da9c4]/10 border border-[#8da9c4]/20 text-[#4c6885] font-black text-[10px] flex items-center justify-center tracking-tighter shrink-0 select-none">
                                {getInitials(client.name)}
                              </div>
                              <div className="space-y-0.5">
                                <p className="font-bold text-black flex items-center gap-1.5">
                                  <span>{client.name}</span>
                                  {client.email && vipPatients.has(client.email.toLowerCase().trim()) && (
                                    <span title="Cliente VIP: Mínimo 3 reservas por semana">
                                      <Star className="w-3.5 h-3.5 text-[#BA7517] fill-[#BA7517] shrink-0" />
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-neutral-400 font-semibold">
                                  {client.email ? (
                                    <a 
                                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${client.email}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      onClick={(e) => e.stopPropagation()}
                                      className="hover:text-black hover:underline transition-all duration-200"
                                    >
                                      {client.email}
                                    </a>
                                  ) : (
                                    "Sin Correo"
                                  )}
                                  {client.phone ? (
                                    <>
                                      {" · "}
                                      <a 
                                        href={getWhatsAppLink(client.phone)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-[#1D9E75] hover:underline transition-all duration-200 font-semibold"
                                      >
                                        {client.phone}
                                      </a>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-center font-bold text-black">
                            {client.appointments}
                          </td>
                          <td className="px-6 py-4.5 text-center font-bold text-neutral-600 bg-neutral-50 border-x border-neutral-100">
                            {client.completed}
                          </td>
                          <td className="px-6 py-4.5 text-right font-black text-black">
                            {formatCOP(client.spent)}
                          </td>
                          <td className="px-6 py-4.5 text-right font-mono text-[10px] text-neutral-400 font-semibold">
                            {formatLocalDateReadableShort(client.lastVisit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL DE HISTORIAL DEL CLIENTE */}
      {selectedClientHistory && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setSelectedClientHistory(null)}
          />
          
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-neutral-100 flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-black uppercase tracking-tight flex items-center gap-2">
                  <span>{selectedClientHistory.name}</span>
                  {selectedClientHistory.email && vipPatients.has(selectedClientHistory.email.toLowerCase().trim()) && (
                    <span title="Cliente VIP: Mínimo 3 reservas por semana">
                      <Star className="w-4 h-4 text-[#BA7517] fill-[#BA7517] shrink-0" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-neutral-400 font-semibold">
                  {selectedClientHistory.email ? (
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedClientHistory.email}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-black hover:underline transition-all duration-200"
                    >
                      {selectedClientHistory.email}
                    </a>
                  ) : (
                    "Sin Correo"
                  )}
                  {selectedClientHistory.phone ? (
                    <>
                      {" · "}
                      <a 
                        href={getWhatsAppLink(selectedClientHistory.phone)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-[#1D9E75] hover:underline transition-all duration-200 font-semibold"
                      >
                        {selectedClientHistory.phone}
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                </p>
                <div className="flex gap-4 pt-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  <span>Citas: <strong className="text-black font-extrabold">{selectedClientHistory.appointments}</strong></span>
                  <span>Completadas: <strong className="text-black font-extrabold">{selectedClientHistory.completed}</strong></span>
                  <span>Gastado: <strong className="text-[#4c6885] font-extrabold">{formatCOP(selectedClientHistory.spent)}</strong></span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClientHistory(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
              <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Historial de Reservas</h5>
              {selectedClientHistory.history.length === 0 ? (
                <p className="text-xs text-neutral-400 font-semibold italic text-center py-8">No hay citas registradas en el historial.</p>
              ) : (
                <div className="space-y-3">
                  {selectedClientHistory.history.map((app: any, appIdx: number) => {
                    const formattedDate = formatLocalDateReadable(app.date)
                    return (
                      <div 
                        key={appIdx} 
                        className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black capitalize">{formattedDate}</span>
                            <span className="text-[10px] text-neutral-400 font-bold font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{app.time}</span>
                          </div>
                          {app.reason && (
                            <p className="text-[10px] text-neutral-800 font-bold">
                              Motivo: <span className="font-extrabold text-black">"{app.reason}"</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${
                            app.status === "confirmed" 
                              ? "bg-[#1D9E75]/8 text-[#1D9E75] border border-[#1D9E75]/20"
                              : app.status === "cancelled"
                              ? "bg-[#E11D48]/8 text-[#E11D48] border border-[#E11D48]/20"
                              : "bg-[#BA7517]/8 text-[#BA7517] border border-[#BA7517]/20"
                          }`}>
                            {app.status === "confirmed" && "Confirmada"}
                            {app.status === "cancelled" && "Cancelada"}
                            {app.status === "pending" && "Pendiente"}
                          </span>
                          <span className="text-xs font-black text-black">
                            {formatCOP(app.price)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE REPROGRAMACIÓN DE CITA */}
      {reschedulingApp && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setReschedulingApp(null)}
          />
          
          <form 
            onSubmit={handleRescheduleSubmit}
            className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-neutral-100 flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="text-base font-black text-black uppercase tracking-tight">Reprogramar Sesión</h4>
                <p className="text-[11px] text-neutral-400 font-semibold">Ajusta la fecha y hora de la sesión del paciente.</p>
              </div>
              <button 
                type="button"
                onClick={() => setReschedulingApp(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 md:p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Paciente</label>
                <p className="text-sm font-bold text-black">{reschedulingApp.patient?.name || "Paciente"}</p>
                <p className="text-xs text-neutral-400 font-semibold">{reschedulingApp.patient?.email}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Nueva Fecha</label>
                <CustomDatePicker 
                  value={rescheduleDate}
                  onChange={setRescheduleDate}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-black font-semibold focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Nueva Hora</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 02:00 PM o 10:30 AM"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-black font-semibold focus:outline-none focus:border-black transition-colors"
                />
                
                {/* Atajos de horas comunes */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setRescheduleTime(h)}
                      className="px-2 py-1 rounded bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-[10px] text-neutral-600 font-bold transition-all cursor-pointer"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:p-8 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReschedulingApp(null)}
                className="px-4 py-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-black hover:bg-neutral-900 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
      {/* MODAL DE CONFIRMACIÓN DE CIERRE DE SESIÓN */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowLogoutConfirm(false)}
          />
          
          <div className="bg-white rounded-[32px] border border-neutral-200 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200 p-8 md:p-10 space-y-6">
            <div className="space-y-2 text-center">
              <h4 className="text-sm font-black text-black uppercase tracking-widest">Cerrar Sesión</h4>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                ¿Estás seguro de que deseas salir del panel de administración?
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={async () => {
                  setShowLogoutConfirm(false)
                  await handleLogout()
                }}
                className="w-full h-11 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg active:scale-97 cursor-pointer flex items-center justify-center"
              >
                Sí, salir
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full h-11 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 font-bold text-xs uppercase tracking-widest transition-all duration-300 active:scale-97 cursor-pointer flex items-center justify-center"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
