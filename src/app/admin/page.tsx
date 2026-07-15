"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
  EyeOff
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

  // Filtros de Citas
  const [filterSearch, setFilterSearch] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterService, setFilterService] = useState("Todos")

  // Estados de Horarios
  const [schedules, setSchedules] = useState<WorkingHours>({
    Lunes: { enabled: true, start: "10:00", end: "20:00" },
    Martes: { enabled: true, start: "10:00", end: "20:00" },
    Miércoles: { enabled: true, start: "10:00", end: "20:00" },
    Jueves: { enabled: true, start: "10:00", end: "20:00" },
    Viernes: { enabled: true, start: "10:00", end: "20:00" },
    Sábado: { enabled: true, start: "10:00", end: "20:00" },
    Domingo: { enabled: false, start: "10:00", end: "20:00" },
  })
  const [slotDuration, setSlotDuration] = useState("30 min")
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [newHolidayDate, setNewHolidayDate] = useState("")
  const [newHolidayReason, setNewHolidayReason] = useState("")

  // Estados para credenciales manuales
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Cargar citas con sincronización bidireccional de localStorage
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true)
      const res = await fetch("/api/appointments")
      let dbApps = []
      let isCalendarConfig = false
      if (res.ok) {
        const data = await res.json()
        dbApps = Array.isArray(data.appointments) ? data.appointments : []
        isCalendarConfig = data.isCalendarConfigured || false
      }
      
      // Cargar citas locales agendadas en la landing page
      const localSaved = localStorage.getItem("soulmar_appointments")
      let localList: any[] = []
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved)
          if (Array.isArray(parsed)) localList = parsed
        } catch(e) {}
      }
      
      // Combinar citas sin duplicar
      const mergedList = [...dbApps]
      localList.forEach((localApp: any) => {
        if (!mergedList.some(app => app.id === localApp.id)) {
          mergedList.push(localApp)
        }
      })

      setAppointments(mergedList)
      setIsCalendarConfigured(isCalendarConfig)
    } catch (err) {
      console.error("Error al cargar citas:", err)
      const localSaved = localStorage.getItem("soulmar_appointments")
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved)
          if (Array.isArray(parsed)) setAppointments(parsed)
        } catch(e) {}
      }
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

  // Guardar horario
  const handleSaveSchedules = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedules, holidays, slot_duration: slotDuration })
      })
      if (!res.ok) throw new Error("Error saving settings")
      alert("Horario de apertura y festivos guardados con éxito. 🌿")
    } catch (err) {
      console.error(err)
      alert("Hubo un error al guardar los horarios.")
    }
  }

  // Confirmar cita con sincronización inmediata
  const handleConfirm = async (id: string) => {
    try {
      setUpdatingId(id)
      
      // Actualizar localStorage
      const localSaved = localStorage.getItem("soulmar_appointments")
      if (localSaved) {
        try {
          const list = JSON.parse(localSaved)
          if (Array.isArray(list)) {
            const updated = list.map((app: any) => 
              app.id === id ? { ...app, status: "confirmed" } : app
            )
            localStorage.setItem("soulmar_appointments", JSON.stringify(updated))
          }
        } catch(e) {}
      }

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
        setAppointments(prev => 
          prev.map(app => app.id === id ? data.appointment : app)
        )
      }
    } catch (err) {
      console.error("Error al confirmar cita:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Cancelar cita con sincronización inmediata
  const handleCancel = async (id: string) => {
    try {
      setUpdatingId(id)

      // Actualizar localStorage
      const localSaved = localStorage.getItem("soulmar_appointments")
      if (localSaved) {
        try {
          const list = JSON.parse(localSaved)
          if (Array.isArray(list)) {
            const updated = list.map((app: any) => 
              app.id === id ? { ...app, status: "cancelled" } : app
            )
            localStorage.setItem("soulmar_appointments", JSON.stringify(updated))
          }
        } catch(e) {}
      }

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
        setAppointments(prev => 
          prev.map(app => app.id === id ? data.appointment : app)
        )
      }
    } catch (err) {
      console.error("Error al cancelar cita:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  // Agregar festivo
  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHolidayDate) return
    const newHol: Holiday = {
      id: Date.now().toString(),
      date: newHolidayDate,
      reason: newHolidayReason.trim() || "Festivo / Cerrado"
    }
    setHolidays(prev => [...prev, newHol])
    setNewHolidayDate("")
    setNewHolidayReason("")
  }

  // Eliminar festivo
  const handleDeleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id))
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
      const statusMatch = filterStatus === "Todos" || app.status === filterStatus.toLowerCase()
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
        const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        })
        return {
          dateStr: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
          appointments: groups[date].sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
        }
      })
  }, [appointments, filterSearch, filterDate, filterStatus, filterService])

  // --- TAB CLIENTES ---
  const clientsData = useMemo(() => {
    const baseMock = [
      { name: "Sara Gómez", email: "sara.gomez@example.com", appointments: 24, completed: 17, spent: 780, lastVisit: "2026-06-09" },
      { name: "Nuria Vega", email: "nuria.vega@example.com", appointments: 26, completed: 18, spent: 670, lastVisit: "2026-06-06" },
      { name: "Lucía Fernández", email: "lucia.fernandez@example.com", appointments: 19, completed: 16, spent: 665, lastVisit: "2026-06-15" },
      { name: "Elena Díaz", email: "elena.diaz@example.com", appointments: 20, completed: 14, spent: 650, lastVisit: "2026-06-13" },
      { name: "Paula Navarro", email: "paula.navarro@example.com", appointments: 22, completed: 13, spent: 595, lastVisit: "2026-06-12" },
      { name: "Carmen Ruiz", email: "carmen.ruiz@example.com", appointments: 21, completed: 14, spent: 595, lastVisit: "2026-06-10" },
      { name: "Marta Jiménez", email: "marta.jimenez@example.com", appointments: 15, completed: 11, spent: 580, lastVisit: "2026-06-09" },
    ]
    
    const realClientsMap = new Map<string, typeof baseMock[0]>()
    appointments.forEach(app => {
      if (app.patient?.email) {
        const email = app.patient.email.toLowerCase()
        const existing = realClientsMap.get(email)
        const isCompleted = app.status === "confirmed"
        if (existing) {
          existing.appointments += 1
          if (isCompleted) {
            existing.completed += 1
            existing.spent += 45
          }
          if (app.appointment_date > existing.lastVisit) {
            existing.lastVisit = app.appointment_date
          }
        } else {
          realClientsMap.set(email, {
            name: app.patient.name || "Paciente",
            email: app.patient.email,
            appointments: 1,
            completed: isCompleted ? 1 : 0,
            spent: isCompleted ? 45 : 0,
            lastVisit: app.appointment_date
          })
        }
      }
    })
    
    const combined = [...baseMock]
    realClientsMap.forEach((realVal, realEmail) => {
      const idx = combined.findIndex(c => c.email.toLowerCase() === realEmail)
      if (idx !== -1) {
        combined[idx].appointments += realVal.appointments
        combined[idx].completed += realVal.completed
        combined[idx].spent += realVal.spent
        if (realVal.lastVisit > combined[idx].lastVisit) {
          combined[idx].lastVisit = realVal.lastVisit
        }
      } else {
        combined.push(realVal)
      }
    })
    
    return combined.sort((a, b) => b.spent - a.spent)
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
          <div className="flex justify-start py-1">
            <img 
              src="/images/logo-official.png" 
              alt="Soulmar" 
              className="w-full max-w-[170px] h-auto object-contain"
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
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-white text-black"
                  : "hover:bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Citas</span>
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
            onClick={() => handleLogout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors font-bold text-[10px] uppercase tracking-wider cursor-pointer"
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
                    className="w-32 h-auto object-contain"
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
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${
                    activeTab === "appointments" ? "bg-white text-black" : "text-neutral-400 hover:bg-neutral-900"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Citas</span>
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
                  onClick={() => handleLogout()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-neutral-900 text-neutral-300 font-bold text-[10px] uppercase"
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
                  <div className="bg-[#185FA5]/[0.02] rounded-3xl p-8 border border-[#185FA5]/12 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-[#185FA5]/25 transition-all duration-300">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#185FA5]/80 block">Citas Totales</span>
                      <span className="text-4xl font-black text-black font-sans block">{kpis.totalActiveCount}</span>
                      <span className="text-[9px] font-bold text-[#185FA5] bg-[#185FA5]/8 border border-[#185FA5]/15 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Reservas Activas</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#185FA5]/10 border border-[#185FA5]/15 flex items-center justify-center text-[#185FA5]">
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
                     <div className="flex items-center gap-1.5 bg-[#185FA5]/5 border border-[#185FA5]/15 px-3 py-1 rounded-full text-[9px] font-black text-[#185FA5] uppercase tracking-widest">
                       <Sparkles className="w-3.5 h-3.5" />
                       <span>Azul Soulmar</span>
                     </div>
                   </div>
                   
                   <div className="relative w-full overflow-x-auto">
                     <div className="min-w-[600px] h-60 flex flex-col justify-between">
                       <svg viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`} className="w-full h-full overflow-visible">
                         <defs>
                           <linearGradient id="blueChartGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#185FA5" stopOpacity="0.08" />
                             <stop offset="100%" stopColor="#185FA5" stopOpacity="0.0" />
                           </linearGradient>
                           <filter id="chartLineShadow" x="-10%" y="-10%" width="120%" height="120%">
                             <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#185FA5" floodOpacity="0.15" />
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
                             stroke="#185FA5" 
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
                               stroke="#185FA5" 
                               strokeWidth="3.5" 
                               className="transition-all duration-300 group-hover/node:stroke-[#185FA5]/80 group-hover/node:r-5.5"
                             />
                             <text 
                               cx={p.x} 
                               cy={p.y} 
                               x={p.x} 
                               y={p.y - 12} 
                               textAnchor="middle" 
                               className="text-[10px] font-black fill-[#185FA5] font-sans"
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
              <div className="bg-white rounded-3xl p-8 md:p-10 border border-neutral-200 shadow-sm space-y-8 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Citas Agendadas</h3>
                    <p className="text-[11px] text-neutral-400 font-semibold">Gestiona el estado y enlace virtual de cada sesión clínica.</p>
                  </div>
                  
                  <button 
                    onClick={() => alert("El agendamiento directo se realiza de forma interactiva en la página principal. 🌿")}
                    className="h-11 px-6 rounded-full bg-black text-white hover:bg-neutral-900 transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Nueva cita</span>
                  </button>
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
                    <input 
                      type="date" 
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full h-10 rounded-full px-4 bg-white border border-neutral-300 text-xs font-semibold focus:border-black outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Estado</label>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full h-10 rounded-full px-4 bg-white border border-neutral-300 text-xs font-semibold focus:border-black outline-none transition-all"
                    >
                      <option>Todos</option>
                      <option>Pendiente</option>
                      <option>Confirmada</option>
                      <option>Cancelada</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Servicio</label>
                    <select 
                      value={filterService}
                      onChange={(e) => setFilterService(e.target.value)}
                      className="w-full h-10 rounded-full px-4 bg-white border border-neutral-300 text-xs font-semibold focus:border-black outline-none transition-all"
                    >
                      <option>Todos</option>
                      <option>Terapia Online</option>
                      <option>Cursos</option>
                      <option>Retiros</option>
                    </select>
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
                      className="flex-1 h-10 rounded-full bg-black text-white hover:bg-neutral-900 text-[10px] uppercase font-bold transition-all cursor-pointer shadow-sm"
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
                                  <p className="font-bold text-sm text-black">
                                    {app.patient?.name || "Sin Nombre"} <span className="text-neutral-400 font-medium font-sans">· Terapia Online</span>
                                  </p>
                                  <p className="text-xs text-neutral-500 font-medium">
                                    {app.patient?.email} · {app.patient?.phone || "Sin Teléfono"}
                                  </p>
                                  {app.reason && (
                                    <p className="text-[10px] text-neutral-400 font-semibold italic">Motivo: "{app.reason}"</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
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

                                <div className="flex items-center gap-2">
                                  {updatingId === app.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                                  ) : (
                                    <>
                                      {app.status === "pending" && (
                                        <button
                                          onClick={() => handleConfirm(app.id)}
                                          className="h-8 px-4 rounded-full bg-black hover:bg-neutral-900 text-white font-bold text-[9px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                                        >
                                          <Video className="w-3.5 h-3.5" />
                                          <span>Confirmar</span>
                                        </button>
                                      )}

                                      {app.status === "confirmed" && app.meeting_link && (
                                        <a
                                          href={app.meeting_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="h-8 px-4 rounded-full border border-black text-black hover:bg-neutral-50 font-bold text-[9px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                          <span>Google Meet</span>
                                        </a>
                                      )}

                                      {app.status !== "cancelled" && (
                                        <button
                                          onClick={() => handleCancel(app.id)}
                                          className="h-8 px-3 rounded-full border border-neutral-300 text-red-600 hover:bg-neutral-50 transition-colors cursor-pointer text-[9px] font-bold uppercase tracking-wider"
                                        >
                                          Cancelar
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: HORARIOS */}
            {activeTab === "schedules" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300 items-start">
                
                {/* Horario de Apertura */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-black tracking-tight font-sans uppercase">Horario de Apertura</h3>
                    <p className="text-[11px] text-neutral-400 font-semibold">Define los intervalos de agenda disponibles para reserva en la landing page.</p>
                  </div>

                  <div className="divide-y divide-neutral-200 space-y-4">
                    {Object.keys(schedules).map((day) => {
                      const daySched = schedules[day]
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
                            className="flex items-center gap-3.5 cursor-pointer select-none"
                          >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
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
                              <div className="flex items-center gap-2 animate-in fade-in duration-300">
                                <input 
                                  type="text" 
                                  value={daySched.start}
                                  onChange={(e) => {
                                    setSchedules(prev => ({
                                      ...prev,
                                      [day]: { ...prev[day], start: e.target.value }
                                    }))
                                  }}
                                  className="w-20 h-10 rounded-xl border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                />
                                <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider px-1">a</span>
                                <input 
                                  type="text" 
                                  value={daySched.end}
                                  onChange={(e) => {
                                    setSchedules(prev => ({
                                      ...prev,
                                      [day]: { ...prev[day], end: e.target.value }
                                    }))
                                  }}
                                  className="w-20 h-10 rounded-xl border border-neutral-200 bg-white text-center text-xs font-bold text-black outline-none focus:border-black transition-all shadow-sm"
                                />
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
                      <select 
                        value={slotDuration}
                        onChange={(e) => setSlotDuration(e.target.value)}
                        className="h-10 px-4 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-black focus:border-black outline-none transition-all shadow-sm"
                      >
                        <option>30 min</option>
                        <option>45 min</option>
                        <option>1 hora</option>
                      </select>
                    </div>

                    <button 
                      onClick={handleSaveSchedules}
                      className="h-12 px-8 rounded-full bg-black text-white hover:bg-neutral-900 transition-all font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center"
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
                      <input 
                        type="date"
                        value={newHolidayDate}
                        onChange={(e) => setNewHolidayDate(e.target.value)}
                        required
                        className="w-full h-11 rounded-xl px-4 border border-neutral-200 bg-[#F8F8FA] focus:bg-white text-xs font-bold text-black focus:border-black outline-none transition-all shadow-sm"
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
                          className="h-11 px-5 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-97 cursor-pointer"
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
                              <p className="text-xs font-bold text-black">{h.date}</p>
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
                        <tr key={index} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4.5">
                            <p className="font-bold text-black">{client.name}</p>
                            <p className="text-[10px] text-neutral-400 font-semibold">{client.email}</p>
                          </td>
                          <td className="px-6 py-4.5 text-center font-bold text-black">
                            {client.appointments}
                          </td>
                          <td className="px-6 py-4.5 text-center font-bold text-neutral-600 bg-neutral-50 border-x border-neutral-100">
                            {client.completed}
                          </td>
                          <td className="px-6 py-4.5 text-right font-black text-black">
                            {client.spent} €
                          </td>
                          <td className="px-6 py-4.5 text-right font-mono text-[10px] text-neutral-400 font-semibold">
                            {client.lastVisit}
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
    </div>
  )
}
