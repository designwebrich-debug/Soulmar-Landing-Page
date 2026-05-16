"use client"

import React, { useState, Suspense, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  ArrowUpRight, 
  MoreHorizontal,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  Type,
  PieChart,
  UserCheck,
  Activity,
  Download,
  ShoppingBag
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import { getAdminStats } from "@/lib/actions/panel-admin"
import { getProducts } from "@/lib/actions/products"
import { getCourses } from "@/lib/actions/courses"
import { useToast } from "@/context/ToastContext"

interface RecentOrder {
  id: string;
  user_email: string;
  total: number;
  status: string;
  created_at: string;
}

interface AdminProduct {
  id: string;
  name: string;
  nameKey?: string;
  stock: number;
  price: number;
  image_url: string;
}

interface AdminCourse {
  id: string;
  title: string;
  nameKey?: string;
  duration: string;
  thumbnail_url: string;
}

const currencyFormatter = new Intl.NumberFormat('es-CO', { 
  style: 'currency', 
  currency: 'COP', 
  maximumFractionDigits: 0 
})

interface AdminStats {
  usersCount: number;
  ordersCount: number;
  productsCount: number;
  coursesCount: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}

function BarChart({ height }: { height: number }) {
  const [bars] = useState<number[]>(() => Array.from({ length: 30 }).map(() => Math.random() * 80 + 20))
  
  return (
    <div style={{ height }} className="relative flex items-end gap-1.5 px-2">
      {bars.map((h, i) => (
        <motion.div 
          key={i} 
          initial={{ height: 0 }} 
          animate={{ height: `${h}%` }} 
          transition={{ delay: i * 0.02, duration: 0.5 }}
          className={cn(
            "flex-1 rounded-t-lg transition-all duration-300", 
            i > 25 ? "bg-primary shadow-[0_0_10px_rgba(141,169,196,0.3)]" : "bg-primary/10"
          )} 
        />
      ))}
    </div>
  )
}

function AdminDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeView = searchParams.get("view") || "dashboard"
  
  const { showToast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [courses, setCourses] = useState<AdminCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [adminStats, allProducts, allCourses] = await Promise.all([
          getAdminStats(),
          getProducts(),
          getCourses()
        ])
        setStats(adminStats as AdminStats)
        setProducts(allProducts as AdminProduct[])
        setCourses(allCourses as AdminCourse[])
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const setActiveView = (view: string) => {
    if (view === "dashboard") {
      router.push("/panel-admin")
    } else {
      router.push(`/panel-admin?view=${view}`)
    }
  }

  const renderView = () => {
    if (isLoading) return <div className="p-12 animate-pulse admin-metadata">Sincronizando con base de datos...</div>

    switch (activeView) {
      case "dashboard": return <DashboardView onNavigate={setActiveView} stats={stats} />
      case "operations": return <OperationsView showToast={showToast} />
      case "content": return <ContentView products={products} courses={courses} showToast={showToast} />
      case "people": return <PeopleView />
      case "cms": return <CMSView showToast={showToast} />
      case "analytics": return <AnalyticsView />
      default: return <DashboardView onNavigate={setActiveView} stats={stats} />
    }
  }

  return (
    <div className="p-6 md:p-12 lg:p-16 space-y-12 min-h-screen text-[var(--admin-text-primary)]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl admin-title uppercase transition-all duration-200">
            {activeView === "dashboard" ? "Consola de Administración" : 
             activeView === "operations" ? "Operaciones ClíniCas" : 
             activeView === "content" ? "Biblioteca de Contenido" :
             activeView === "people" ? "Agenda de Terapeutas" : "Gestor CMS Interno"}
          </h1>
          <p className="admin-subtitle">Panel de control interno • {activeView === "dashboard" ? "Resumen General" : "Gestor de Actividad"}</p>
        </div>
      </div>

      <motion.div
        key={activeView}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {renderView()}
      </motion.div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 animate-pulse">Cargando...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}

function DashboardView({ onNavigate, stats }: { onNavigate: (view: string) => void, stats: AdminStats | null }) {
  const statsArray = [
    { 
      label: "Ventas Totales", 
      value: stats?.totalRevenue ? currencyFormatter.format(stats.totalRevenue as number) : "$0 COP", 
      trend: "+12.5%", 
      isUp: true, 
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />, 
      bg: "bg-emerald-500/10" 
    },
    { 
      label: "Usuarios Totales", 
      value: stats?.usersCount?.toString() || "0", 
      trend: "+8.2%", 
      isUp: true, 
      icon: <Users className="w-5 h-5 text-blue-500" />, 
      bg: "bg-blue-500/10" 
    },
    { 
      label: "Pedidos Reales", 
      value: stats?.ordersCount?.toString() || "0", 
      trend: "+15%", 
      isUp: true, 
      icon: <ShoppingBag className="w-5 h-5 text-amber-500" />, 
      bg: "bg-amber-500/10" 
    },
    { 
      label: "Conversión", 
      value: "4.8%", 
      trend: "+1.1%", 
      isUp: true, 
      icon: <TrendingUp className="w-5 h-5 text-purple-500" />, 
      bg: "bg-purple-500/10" 
    },
  ]

  return (
    <div className="space-y-12 pb-20">
      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsArray.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="p-8 admin-card group cursor-pointer transition-all duration-200">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:rotate-12 bg-primary/10")}>
                  <div className="text-primary">{stat.icon}</div>
                </div>
                <Badge className={cn("border-none rounded-full px-2.5 py-0.5 admin-metadata", stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                  {stat.trend}
                </Badge>
              </div>
              <p className="admin-metadata mb-1">{stat.label}</p>
              <h3 className="text-4xl admin-title tracking-tight">{stat.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* BLOQUE 1: SOULMARCAMP 2027 (PROYECCIÓN) */}
        <Card className="p-10 rounded-[4rem] bg-primary text-white border-none shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => onNavigate("content")}>
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-3xl font-bold tracking-[-0.022em] mb-1 uppercase">Soulmar Camp 2027</h3>
                  <p className="text-white/60 font-bold text-sm tracking-tight">Proyección de crecimiento en tiempo real</p>
               </div>
               <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                  <Activity className="w-6 h-6 text-white" />
               </div>
            </div>

            <div className="flex items-end gap-6">
               <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-end font-bold uppercase tracking-[0.05em] text-[10px]">
                     <span>Inscritos</span>
                     <span className="text-2xl font-bold tracking-[-0.022em]">78 / 150</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1">
                     <motion.div initial={{ width: 0 }} animate={{ width: "52%" }} className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  </div>
               </div>
               <div className="text-center bg-white/10 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Días</p>
                  <p className="text-3xl font-bold">14</p>
               </div>
            </div>

            {/* Linear Projection Graphic Mock */}
            <div className="pt-6 border-t border-white/10 relative h-24">
               <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full opacity-40">
                  <motion.path 
                    d="M0 80 Q 100 70, 200 40 T 400 10" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                  <circle cx="200" cy="40" r="4" fill="white" className="animate-pulse" />
               </svg>
               <div className="absolute right-0 top-0 text-[10px] font-bold uppercase tracking-[0.05em] text-white/40">Tendencia de Alza +14%</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </Card>

        {/* BLOQUE 2: VENTAS DE TIENDA */}
        <Card className="p-10 lg:p-14 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("content")}>
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-2xl admin-title mb-1">Stock & Ventas Unid.</h3>
                <p className="admin-metadata">Inventario Crítico</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-foreground/20 group-hover:text-primary transition-colors">
                <Download className="w-6 h-6" />
             </div>
          </div>
          <div className="space-y-6 flex-1">
             {[
               { label: "Gorras Soulmar", sold: 1240, stock: 120, color: "bg-orange-500" },
               { label: "Busos (Hoodies)", sold: 980, stock: 45, color: "bg-orange-500" },
               { label: "Manillas de Poder", sold: 2500, stock: 300, color: "bg-orange-500" },
               { label: "Termos y Vasos", sold: 450, stock: 80, color: "bg-orange-500" },
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-6 group/row">
                  <div className="w-32 text-xs font-bold opacity-60 truncate">{item.label}</div>
                  <div className="flex-1 h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden relative">
                     <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className={cn("h-full", item.color)} />
                     <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white opacity-0 group-hover/row:opacity-100 transition-opacity">
                        {item.sold} VENDIDOS
                     </div>
                  </div>
                  <div className={cn("w-12 text-center text-[10px] font-bold px-2 py-1 rounded-lg", item.stock < 50 ? "bg-red-500/10 text-red-500" : "bg-black/5")}>
                     {item.stock}
                  </div>
               </div>
             ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* BLOQUE 3: CURSOS TOP 3 */}
        <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("content")}>
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl admin-title">Top 3 Cursos</h4>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none admin-metadata">+22%</Badge>
           </div>
           <div className="space-y-6">
              {[
                { title: "Sanación Ancestral", sales: "1.2k", rank: 1 },
                { title: "Mindfulness Pro", sales: "840", rank: 2 },
                { title: "Respiración Circular", sales: "620", rank: 3 },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                   <span className="text-3xl font-bold opacity-10 group-hover/item:text-primary group-hover/item:opacity-40 transition-all">#{c.rank}</span>
                   <div className="flex-1">
                      <p className="font-bold text-sm">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40 w-full" />
                         </div>
                         <span className="text-[10px] font-bold opacity-30">{c.sales}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* BLOQUE 4: PODCAST TOP 3 */}
        <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("content")}>
           <h4 className="text-xl admin-title mb-8 uppercase">Top 3 Podcasts</h4>
           <div className="space-y-8">
              {[
                { title: "Reconectando con el Ser", plays: "12.4k", icon: <Activity className="w-5 h-5" /> },
                { title: "El Poder del Ahora", plays: "10.2k", icon: <TrendingUp className="w-5 h-5" /> },
                { title: "Silencio Interior", plays: "8.1k", icon: <PieChart className="w-5 h-5" /> },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
                         {p.icon}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{p.title}</p>
                        <p className="text-[10px] font-bold opacity-30">{p.plays} reproducciones</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* BLOQUE 5: PSICÓLOGOS TOP 3 */}
        <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("operations")}>
           <h4 className="text-xl admin-title mb-8">Top 3 Psicólogos</h4>
           <div className="space-y-6">
              {[
                { name: "Dra. Mariana Caicedo", apps: 42, active: true },
                { name: "Dr. Moshé Musini", apps: 38, active: true },
                { name: "Dra. Libertad Mejía", apps: 32, active: false },
              ].map((ps, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-black/5 transition-all">
                   <div className="flex items-center gap-4 text-sm font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ps.name}
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-lg leading-none">{ps.apps}</p>
                      <p className="text-[8px] opacity-30 uppercase font-bold">Citas</p>
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>

      {/* BLOQUE 6: ACTIONABLE INSIGHTS (REEMPLAZO DE HORARIOS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* CARD 1: PRÓXIMA CITA */}
         <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("operations")}>
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
               </div>
               <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[9px] uppercase">En 25 min</Badge>
            </div>
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-[0.05em] mb-1">Próxima Cita</p>
            <h5 className="text-xl font-bold tracking-tight mb-4 uppercase">Carlos Mendoza</h5>
            <div className="space-y-1 border-t border-border/40 pt-4">
               <p className="text-[10px] font-bold opacity-40">Terapeuta: <span className="text-primary">Dra. Elena Martínez</span></p>
               <p className="text-[10px] font-bold opacity-60 uppercase tracking-[-0.022em]">Hoy, 14:30</p>
            </div>
         </Card>

         {/* CARD 2: PRODUCTO DEL MES */}
         <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("content")}>
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 rounded-xl bg-secondary-yellow/10 flex items-center justify-center text-secondary-yellow">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <Badge className="bg-primary/10 text-primary border-none font-bold text-[9px] uppercase">Destacado</Badge>
            </div>
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-[0.05em] mb-1">Producto del Mes</p>
            <h5 className="text-xl font-bold tracking-tight mb-4 uppercase">Sanación Ancestral</h5>
            <div className="space-y-1 border-t border-border/40 pt-4">
               <p className="text-[10px] font-bold opacity-40">Tipo: <span className="text-primary">Curso Digital</span></p>
               <p className="text-[10px] font-bold opacity-60 uppercase tracking-[-0.022em]">Top Ventas Marzo</p>
            </div>
         </Card>

         {/* CARD 3: TERAPEUTAS */}
         <Card className="p-10 admin-card bg-[var(--admin-panel)] group cursor-pointer" onClick={() => onNavigate("people")}>
            <div className="flex justify-between items-start mb-6">
               <div className="w-10 h-10 rounded-xl bg-secondary-olive/10 flex items-center justify-center text-secondary-olive">
                  <Users className="w-5 h-5" />
               </div>
               <Badge className="bg-secondary-olive/10 text-secondary-olive border-none font-bold text-[9px] uppercase">Disponibles</Badge>
            </div>
            <p className="text-[10px] font-bold uppercase opacity-30 tracking-[0.05em] mb-1">Terapeutas</p>
            <h5 className="text-4xl font-bold tracking-tight mb-4">2 <span className="text-base text-foreground/20">/ 3</span></h5>
            <div className="space-y-1 border-t border-border/40 pt-4">
               <p className="text-[10px] font-bold opacity-40">Estado: <span className="text-emerald-500">2 Terapeutas Libres</span></p>
               <p className="text-[10px] font-bold opacity-60 uppercase tracking-[-0.022em]">Gestión de Agendas</p>
            </div>
         </Card>
      </div>

      {/* BLOQUE 7: INGRESOS TOTALES + FILTROS */}
      <Card className="p-10 lg:p-14 admin-card bg-[var(--admin-bg-secondary)] border-none shadow-2xl relative overflow-hidden group cursor-pointer" onClick={() => onNavigate("analytics")}>
         <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 h-full">
            <div className="space-y-6 flex flex-col h-full max-w-sm">
               <div>
                  <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 admin-metadata mb-4">Módulo de Ingresos</Badge>
                  <h3 className="text-6xl admin-title uppercase leading-none">Análisis de<br/>Facturación</h3>
               </div>
               <p className="admin-subtitle">Información consolidada de ventas en tienda, cursos y servicios clíniCos.</p>
               <Button className="bg-primary text-white rounded-full h-14 px-10 font-bold hover:bg-primary/90 transition-all transform group-hover:scale-105 active:scale-95">EXPLORAR DETALLES</Button>
            </div>
            
            <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] backdrop-blur-3xl rounded-[3rem] p-10 flex-1 w-full lg:max-w-xl space-y-10 shadow-2xl">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="admin-metadata mb-1">Ingresos de marzo</p>
                     <p className="text-5xl admin-title text-primary">$42,850.00</p>
                  </div>
                  <div className="flex gap-2">
                     {["D", "M", "A"].map(f => (
                       <div key={f} className={cn(
                         "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all", 
                         f === "M" ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-primary hover:border-primary/40"
                       )}>
                         {f}
                       </div>
                     ))}
                  </div>
               </div>
               <BarChart height={160} />
            </div>
         </div>
         <div className="absolute right-0 bottom-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 translate-x-1/2" />
      </Card>
    </div>
  )
}

function OperationsView({ showToast }: { showToast: any }) {
  const appointments = [
    { user: "Mariano S.", time: "10:00 AM", status: "Confirmada", type: "Video" },
    { user: "Laura V.", time: "11:30 AM", status: "Pendiente", type: "Video" },
    { user: "Roberto K.", time: "02:00 PM", status: "Confirmada", type: "Presencial" },
  ]

  const handleAction = (user: string, action: string) => {
    showToast(`Operación "${action}" ejecutada para ${user}`, "success")
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Card className="lg:col-span-2 p-10 lg:p-14 admin-card bg-[var(--admin-panel)] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10 relative z-10">
             <h3 className="text-3xl admin-title uppercase">Calendario ClíniCo</h3>
             <div className="flex bg-[var(--admin-bg-secondary)] p-1 rounded-full admin-metadata">
               <span className="px-5 py-2">Sem</span>
               <span className="px-5 py-2 bg-[var(--admin-panel)] rounded-full shadow-lg text-primary border border-[var(--admin-border)]">Mes</span>
             </div>
          </div>
          <div className="grid grid-cols-7 gap-4 relative z-10">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} className="text-center admin-metadata opacity-40">{d}</div>)}
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={cn(
                "aspect-square flex items-center justify-center rounded-2xl text-sm font-bold transition-all cursor-pointer relative", 
                i+1 === 21 ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-[var(--admin-card-hover)] text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]"
              )}>
                {i + 1}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-10 lg:p-14 admin-card bg-secondary-olive text-white shadow-2xl relative overflow-hidden group border-none">
          <div className="relative z-10 space-y-10">
             <div className="flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-white/40" />
                <h4 className="text-xl admin-title text-white">En Consulta</h4>
             </div>
             <div className="space-y-2">
                <p className="text-5xl font-bold tracking-[-0.022em] text-white">Mariano S.</p>
                <p className="admin-metadata text-white/50 tracking-wider">Dra. Mariana Caicedo</p>
             </div>
             <div className="flex gap-3">
                <Button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/10 text-white rounded-2xl h-14 font-bold transition-all">Ver Notas</Button>
                <Button className="bg-white text-secondary-olive hover:bg-white/90 rounded-2xl h-14 w-14 flex items-center justify-center shadow-2xl transition-all active:scale-90"><Plus className="w-6 h-6" /></Button>
             </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
        </Card>
      </div>

      <div className="admin-card bg-[var(--admin-panel)] overflow-hidden">
        <table className="w-full text-left">
           <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-bg-secondary)] admin-metadata">
                 <th className="p-8">Paciente</th>
                 <th className="p-8">Horario</th>
                 <th className="p-8">Estado</th>
                 <th className="p-8 text-right">Acciones</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[var(--admin-border)]">
              {appointments.map((apt, i) => (
                <tr key={i} className="hover:bg-[var(--admin-card-hover)] transition-all group">
                   <td className="p-8 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center font-bold text-primary text-sm border border-primary/10">{apt.user[0]}</div>
                      <div>
                        <p className="font-bold text-[var(--admin-text-primary)]">{apt.user}</p>
                        <p className="admin-metadata text-[var(--admin-text-muted)]">{apt.type}</p>
                      </div>
                   </td>
                   <td className="p-8">
                      <div className="flex items-center gap-2 text-[var(--admin-text-secondary)] font-bold">
                         <Clock className="w-4 h-4 opacity-30" />
                         {apt.time}
                      </div>
                   </td>
                   <td className="p-8">
                      <Badge className={cn("border-none px-4 py-1.5 rounded-full admin-metadata ring-1 ring-inset", 
                        apt.status === "Confirmada" ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" : "bg-amber-500/10 text-amber-500 ring-amber-500/20")}>
                        {apt.status}
                      </Badge>
                   </td>
                   <td className="p-8 text-right">
                      <button className="p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-primary transition-all">
                         <MoreHorizontal className="w-5 h-5" />
                      </button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  )
}

function ContentView({ products, courses, showToast }: { products: AdminProduct[], courses: AdminCourse[], showToast: any }) {
  const [isUploading, setIsUploading] = useState(false)
  
  const handleNewContent = () => {
    setIsUploading(true)
    setTimeout(() => {
      showToast("Módulo de carga de contenido activado", "info")
    }, 500)
  }

  const allContent = [
    ...products.map(p => ({ title: p.nameKey || p.name, type: "Producto", date: "Stock: " + p.stock, size: "$" + p.price, image: p.image_url })),
    ...courses.map(c => ({ title: c.nameKey || c.title, type: "Curso", date: c.duration, size: "Video", image: c.thumbnail_url }))
  ]

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
         <div>
            <h3 className="text-3xl admin-title">Librería de Contenido</h3>
            <p className="admin-subtitle">Gestión de activos digitales y productos físicos</p>
         </div>
         <Button onClick={handleNewContent} className="rounded-full bg-primary text-white font-bold h-12 px-8 flex items-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />{isUploading ? "Cerrar" : "Nuevo Contenido"}
         </Button>
      </div>

      {isUploading && (
        <Card className="p-16 border-2 border-dashed border-primary/40 bg-primary/5 rounded-[4rem] text-center space-y-6 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 rounded-full bg-[var(--admin-panel)] mx-auto shadow-2xl flex items-center justify-center border border-[var(--admin-border)]"><Download className="w-8 h-8 text-primary" /></div>
           <div>
              <h4 className="text-xl admin-title">Arrastra archivos aquí</h4>
              <p className="admin-metadata mt-2">Sincronización automática con Supabase Storage</p>
           </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allContent.map((item: any, i: number) => (
          <Card key={i} className="p-8 admin-card bg-[var(--admin-panel)] group cursor-pointer h-full flex flex-col">
            <div className="aspect-video bg-[var(--admin-bg-secondary)] rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden border border-[var(--admin-border)]">
               {item.image ? (
                 <Image src={item.image} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
               ) : (
                 item.type === "Curso" ? <Video className="w-12 h-12 text-[var(--admin-text-muted)] opacity-20" /> : <ShoppingBag className="w-12 h-12 text-[var(--admin-text-muted)] opacity-20" />
               )}
               <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm z-10">
                  <Button size="icon" className="rounded-full bg-white text-primary shadow-2xl hover:scale-110 transition-transform"><ArrowUpRight className="w-4 h-4" /></Button>
                  <Button size="icon" className="rounded-full bg-white text-red-500 shadow-2xl hover:scale-110 transition-transform"><XCircle className="w-4 h-4" /></Button>
               </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="admin-metadata text-primary mb-1 uppercase text-[10px] font-bold">{item.type}</p>
                <h4 className="text-xl admin-title leading-tight">{item.title}</h4>
              </div>
              <div className="flex justify-between items-center admin-metadata pt-4 border-t border-[var(--admin-border)] mt-auto">
                 <span>{item.date}</span>
                 <span className="opacity-60 font-bold">{item.size}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PeopleView() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly")
  const [selectedApt, setSelectedApt] = useState<{ patient: string; time: string; status: string; type: string; therapist: string } | null>(null)
  const [activeModal, setActiveModal] = useState<"details" | "chat" | null>(null)

  const agenda = [
    { day: "LUN 23", hour: "09:00", therapist: "Dra. Elena", type: "Psicoterapia", status: "confirmed" },
    { day: "MAR 24", hour: "10:00", therapist: "Dra. Elena", type: "Seguimiento", status: "confirmed" },
    { day: "MIÉ 25", hour: "09:00", therapist: "Dr. Julián", type: "Ansiedad", status: "confirmed" },
    { day: "JUE 26", hour: "10:00", therapist: "Dr. Julián", type: "Fobia Social", status: "confirmed" },
    { day: "VIE 27", hour: "09:00", therapist: "Dra. Sofía", type: "Pareja", status: "confirmed" },
    { day: "VIE 27", hour: "11:00", therapist: "Dra. Elena", type: "Consulta", status: "confirmed" },
    { day: "LUN 23", hour: "11:00", type: "Nueva Cita", status: "request" },
  ]

  const upcomingAppointments = [
    { id: 1, patient: "Carlos Mendoza", therapist: "Dra. Elena Martínez", time: "Hoy, 14:30", status: "CONFIRMADO", type: "Psicoterapia" },
    { id: 2, patient: "Lucía Fernández", therapist: "Dr. Julián Castro", time: "Hoy, 16:00", status: "PENDIENTE", type: "Ansiedad" },
    { id: 3, patient: "Roberto Gómez", therapist: "Dra. Sofía Ruiz", time: "Mañana, 09:00", status: "CANCELADO", type: "Pareja" },
    { id: 4, patient: "Mariana Costa", therapist: "Dra. Elena Martínez", time: "26 Oct, 11:30", status: "CONFIRMADO", type: "Control" },
  ]

  const days = ["LUN 23", "MAR 24", "MIÉ 25", "JUE 26", "VIE 27"]
  const hours = ["09:00", "10:00", "11:00"]

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-20">
      {/* AGERDA SEMANAL */}
      <Card className="xl:col-span-2 p-10 lg:p-14 admin-card bg-[var(--admin-panel)] relative overflow-hidden group">
         <div className="flex justify-between items-center mb-16 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Calendar className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-2xl admin-title">Agenda de Terapeutas</h3>
                  <p className="admin-subtitle text-xs">Gestión de tiempos y consultas</p>
               </div>
            </div>
            <div className="flex bg-[var(--admin-bg-secondary)] p-1 rounded-2xl admin-metadata">
               <button onClick={() => setActiveTab("weekly")} className={cn("px-6 py-2 rounded-xl transition-all font-bold", activeTab === "weekly" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]")}>Semanal</button>
               <button onClick={() => setActiveTab("monthly")} className={cn("px-6 py-2 rounded-xl transition-all font-bold", activeTab === "monthly" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]")}>Mensual</button>
            </div>
         </div>

         <div className="relative z-10 overflow-x-auto no-scrollbar">
            <table className="w-full border-separate border-spacing-4">
               <thead>
                  <tr>
                     <th className="w-20"></th>
                     {days.map(d => (
                       <th key={d} className="pb-8 admin-metadata opacity-40 text-center">{d}</th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {hours.map(h => (
                    <tr key={h}>
                       <td className="admin-metadata opacity-30 pr-4 text-right">{h}</td>
                       {days.map(d => {
                         const slot = agenda.find(a => a.day === d && a.hour === h)
                         if (!slot) return <td key={d+h} className="h-24 rounded-[2rem] bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] hover:border-primary/20 transition-all" />
                         
                         if (slot.status === "request") {
                           return (
                             <td key={d+h}>
                               <motion.div whileHover={{ scale: 1.02, y: -2 }} className="h-24 p-5 rounded-[2rem] bg-secondary-yellow flex flex-col justify-center gap-1 cursor-pointer shadow-xl shadow-secondary-yellow/20">
                                  <p className="text-[10px] font-bold uppercase tracking-[-0.022em] text-black opacity-50">SOLICITUD</p>
                                  <p className="text-[15px] font-bold text-black">Nueva Cita</p>
                               </motion.div>
                             </td>
                           )
                         }

                         return (
                           <td key={d+h}>
                              <motion.div whileHover={{ scale: 1.02, y: -2 }} className="h-24 p-5 rounded-[2rem] border border-[var(--admin-border)] bg-[var(--admin-panel)] flex flex-col justify-center gap-1 cursor-pointer hover:border-primary/40 transition-all shadow-sm hover:shadow-xl">
                                 <p className="admin-metadata text-primary opacity-60 uppercase">{slot.type}</p>
                                 <p className="font-bold text-[var(--admin-text-primary)]">{slot.therapist}</p>
                              </motion.div>
                           </td>
                         )
                       })}
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* PRÓXIMAS CITAS */}
      <div className="space-y-8">
         <div className="flex justify-between items-center px-4">
            <h4 className="text-xl admin-title">Próximas Citas</h4>
            <button className="admin-metadata text-primary opacity-60 hover:opacity-100 transition-all">Ver todas</button>
         </div>

         <div className="space-y-6">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="p-8 admin-card bg-[var(--admin-panel)] group relative overflow-hidden">
                 <div className="flex justify-between items-start mb-6">
                    <Badge className={cn("border-none rounded-full px-4 py-1.5 admin-metadata ring-1 ring-inset", 
                      apt.status === "CONFIRMADO" ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" : 
                      apt.status === "PENDIENTE" ? "bg-amber-500/10 text-amber-500 ring-amber-500/20" : "bg-red-500/10 text-red-500 ring-red-500/20"
                    )}>
                      {apt.status}
                    </Badge>
                    <span className="admin-metadata opacity-40 uppercase tracking-[-0.022em]">{apt.time}</span>
                 </div>

                 <div className="space-y-1 mb-10">
                    <h5 className="text-2xl admin-title">{apt.patient}</h5>
                    <p className="admin-metadata">Terapeuta: <span className="text-primary">{apt.therapist}</span></p>
                 </div>

                 <div className="flex gap-2">
                    {apt.status === "PENDIENTE" ? (
                      <>
                        <Button className="flex-1 bg-primary text-white rounded-2xl h-14 font-bold text-[11px] uppercase transform active:scale-95 transition-all shadow-lg shadow-primary/20">APROBAR</Button>
                        <Button className="flex-1 bg-[var(--admin-card-hover)] hover:bg-black/10 text-[var(--admin-text-muted)] rounded-2xl h-14 font-bold text-[11px] uppercase transform active:scale-95 transition-all">RECHAZAR</Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => { setSelectedApt(apt); setActiveModal("chat"); }}
                          className="flex-1 bg-[var(--admin-bg-secondary)] hover:bg-[var(--admin-card-hover)] text-[var(--admin-text-primary)] font-bold text-[11px] uppercase rounded-2xl h-14 border border-[var(--admin-border)] transform active:scale-95 transition-all"
                        >CHAT</Button>
                        <Button 
                          onClick={() => { setSelectedApt(apt); setActiveModal("details"); }}
                          className="flex-1 bg-[var(--admin-bg-secondary)] hover:bg-[var(--admin-card-hover)] text-[var(--admin-text-primary)] font-bold text-[11px] uppercase rounded-2xl h-14 border border-[var(--admin-border)] transform active:scale-95 transition-all"
                        >DETALLES</Button>
                      </>
                    )}
                 </div>
                 
                 <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Card>
            ))}
         </div>
         
         <div className="px-4">
            <Button variant="outline" className="w-full rounded-[2.5rem] h-16 border-[var(--admin-border)] bg-[var(--admin-panel)] text-[var(--admin-text-muted)] hover:text-primary hover:border-primary/40 transition-all admin-metadata group">
               <Clock className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" /> REPROGRAMAR CITA
            </Button>
         </div>
      </div>

       {/* MODAL OVERLAY */}
       {selectedApt && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl bg-[var(--admin-panel)] rounded-[3rem] shadow-2xl overflow-hidden relative border border-[var(--admin-border)]"
            >
               <button 
                 onClick={() => { setSelectedApt(null); setActiveModal(null); }}
                 className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[var(--admin-bg-secondary)] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-10 border border-[var(--admin-border)] shadow-md group"
               >
                 <XCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
               </button>

               <div className="p-12 space-y-10">
                  {activeModal === "details" ? (
                    <>
                       <div className="space-y-3">
                          <Badge className="bg-primary/20 text-primary border-none rounded-full px-5 py-1 admin-metadata">{selectedApt.status}</Badge>
                          <h3 className="text-5xl admin-title">{selectedApt.patient}</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-10">
                          <div>
                             <p className="admin-metadata opacity-40 mb-1s">Terapeuta</p>
                             <p className="font-bold text-[var(--admin-text-primary)] text-lg">{selectedApt.therapist}</p>
                          </div>
                          <div>
                             <p className="admin-metadata opacity-40 mb-1">Especialidad</p>
                             <p className="font-bold text-[var(--admin-text-primary)] text-lg">{selectedApt.type}</p>
                          </div>
                          <div>
                             <p className="admin-metadata opacity-40 mb-1">Horario</p>
                             <p className="font-bold text-primary text-lg">{selectedApt.time}</p>
                          </div>
                          <div>
                             <p className="admin-metadata opacity-40 mb-1">ID Cita</p>
                             <p className="font-mono text-xs text-[var(--admin-text-muted)] bg-[var(--admin-bg-secondary)] px-3 py-1 rounded-lg w-fit">#APT-29384</p>
                          </div>
                       </div>
                       <div className="space-y-4 pt-8 border-t border-[var(--admin-border)]">
                          <p className="admin-metadata opacity-40">Notas ClíniCas</p>
                          <p className="text-[var(--admin-text-secondary)] leading-relaxed font-medium">Paciente presenta cuadros de ansiedad generalizada y dificultad para conciliar el sueño. Se recomienda seguimiento semanal y ejercicios de respiración.</p>
                       </div>
                    </>
                  ) : (
                    <>
                       <div className="space-y-3 text-center">
                          <p className="admin-metadata text-primary uppercase tracking-[0.05em] font-bold">Canal de comunicación seguro</p>
                          <h3 className="text-4xl admin-title">{selectedApt.patient}</h3>
                       </div>
                       <div className="bg-[var(--admin-bg-secondary)] rounded-3xl p-10 h-48 border border-[var(--admin-border)] shadow-inner text-[var(--admin-text-muted)] text-sm">
                          Escribe tu mensaje privado aquí...
                       </div>
                       <Button className="w-full bg-primary text-white rounded-2xl h-16 font-bold uppercase tracking-[0.05em] shadow-xl shadow-primary/30 transform hover:scale-[1.02] active:scale-95 transition-all">ENVIAR MENSAJE</Button>
                    </>
                  )}
               </div>
            </motion.div>
         </div>
       )}
    </div>
  )
}

function CMSView({ showToast }: { showToast: any }) {
  const [feedback, setFeedback] = useState("")

  const handleSave = () => {
    setFeedback("Guardando...")
    setTimeout(() => {
      setFeedback("Guardado")
      showToast("Cambios del CMS guardados con éxito", "success")
      setTimeout(() => setFeedback(""), 2000)
    }, 1000)
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-center px-4">
         <div>
            <h3 className="text-3xl admin-title">CMS de Identidad</h3>
            <p className="admin-subtitle text-xs">Ajustes visuales y de contenido global</p>
         </div>
         <div className="flex items-center gap-4">
            {feedback && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-500 font-bold text-xs uppercase tracking-[0.05em] flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {feedback}</motion.div>}
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-5 py-1 admin-metadata">Sincronización Activa</Badge>
         </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="p-10 lg:p-14 admin-card bg-[var(--admin-panel)] space-y-10">
           <h4 className="admin-metadata opacity-40 uppercase mb-8">Textos Dinámicos</h4>
           <div className="space-y-8">
             {[ "Título Hero", "Subtítulo Hero", "Texto Botón" ].map((label, i) => (
               <div key={i} className="space-y-3 group">
                  <p className="admin-metadata text-primary opacity-60">{label}</p>
                  <div className="relative">
                     <input onChange={handleSave} className="w-full h-16 px-6 rounded-2xl bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] font-bold text-lg text-[var(--admin-text-primary)] outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner" defaultValue={i === 0 ? "Eleva tu bienestar" : i === 1 ? "Descubre el camino" : "Comenzar"} />
                     <Type className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-10 group-focus-within:opacity-100 transition-opacity text-primary" />
                  </div>
               </div>
             ))}
           </div>
        </Card>
        <Card className="p-10 lg:p-14 admin-card bg-[var(--admin-panel)] space-y-10">
           <h4 className="admin-metadata opacity-40 uppercase mb-8">Media Assets</h4>
           <div className="grid grid-cols-2 gap-6">
              {[ "Banner Hero", "Avatar Admin", "Icono Meditación", "Background" ].map((label, i) => (
                <div key={i} className="space-y-3 group cursor-pointer" onClick={handleSave}>
                   <p className="admin-metadata text-primary opacity-60">{label}</p>
                   <div className="aspect-video bg-[var(--admin-bg-secondary)] rounded-3xl border border-[var(--admin-border)] flex items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-all shadow-inner">
                      <Plus className="w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all text-primary" />
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  )
}

function AnalyticsView() {
  const [revenueFilter, setRevenueFilter] = useState<"day" | "month" | "year">("day")
  const [hoveredData, setHoveredData] = useState<{ label: string, val: string } | null>(null)

  // Curated, realistic data sets (Growth Trends)
  const dailyData = [
    { label: "Mar 01", val: 850 }, { label: "Mar 02", val: 1200 }, { label: "Mar 03", val: 950 },
    { label: "Mar 04", val: 1800 }, { label: "Mar 05", val: 2100 }, { label: "Mar 06", val: 1400 },
    { label: "Mar 07", val: 1100 }, { label: "Mar 08", val: 900 }, { label: "Mar 09", val: 1300 },
    { label: "Mar 10", val: 1750 }, { label: "Mar 11", val: 2400 }, { label: "Mar 12", val: 1900 },
    { label: "Mar 13", val: 1600 }, { label: "Mar 14", val: 1200 }, { label: "Mar 15", val: 1420 },
    { label: "Mar 16", val: 1950 }, { label: "Mar 17", val: 2600 }, { label: "Mar 18", val: 2100 },
    { label: "Mar 19", val: 1800 }, { label: "Mar 20", val: 1550 }, { label: "Mar 21", val: 1820 },
    { label: "Mar 22", val: 2300 }, { label: "Mar 23", val: 2900 }, { label: "Mar 24", val: 2100 },
    { label: "Mar 25", val: 1900 }, { label: "Mar 26", val: 1700 }, { label: "Mar 27", val: 2100 },
    { label: "Mar 28", val: 2500 }, { label: "Mar 29", val: 3100 }, { label: "Mar 30", val: 2800 },
  ]

  const monthlyData = [
    { label: "Oct 25", val: 28500 },
    { label: "Nov 25", val: 32400 },
    { label: "Dic 25", val: 42800 },
    { label: "Ene 26", val: 35600 },
    { label: "Feb 26", val: 38900 },
    { label: "Mar 26", val: 42850 }
  ]

  const yearlyData = [
    { label: "2024", val: 385000 },
    { label: "2025", val: 492000 },
    { label: "2026", val: 512300 }
  ]

  const activeData = revenueFilter === "day" ? dailyData : revenueFilter === "month" ? monthlyData : yearlyData
  const maxVal = Math.max(...activeData.map(d => d.val))

  const topPsychologists = [
    { name: "Dra. Mariana Caicedo", sessions: 42, rating: 5.0 },
    { name: "Dr. Moshé Musini", sessions: 38, rating: 4.9 },
    { name: "Dra. Libertad Mejía", sessions: 35, rating: 4.9 },
  ]

  const topCourses = [
    { title: "Sanación Ancestral", sales: 124, growth: "+12%" },
    { title: "Mindfulness para Líderes", sales: 98, growth: "+8%" },
    { title: "El Arte de Respirar", sales: 86, growth: "+15%" },
  ]

  const topPodcasts = [
    { title: "Reconectando con el Ser", plays: "12.4k", duration: "45min" },
    { title: "El Poder del Ahora", plays: "10.2k", duration: "38min" },
    { title: "Silencio Interior", plays: "8.1k", duration: "52min" },
  ]

  return (
    <div className="space-y-12 pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
         <div>
            <h3 className="text-3xl admin-title uppercase">Centro de Inteligencia</h3>
            <p className="admin-subtitle">Productividad y métricas de rendimiento</p>
         </div>
         <div className="flex bg-[var(--admin-bg-secondary)] p-1 rounded-full admin-metadata">
            {(["day", "month", "year"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setRevenueFilter(f)}
                className={cn(
                  "px-6 py-2 rounded-full transition-all font-bold",
                  revenueFilter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-secondary)]"
                )}
              >
                {f === "day" ? "Diario" : f === "month" ? "Últimos 6 Meses" : "Últimos 3 Años"}
              </button>
            ))}
         </div>
       </div>

       {/* REVENUE & ANALYSIS */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-12 lg:p-14 admin-card bg-[var(--admin-bg-secondary)] shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="admin-metadata text-primary mb-2">
                        {revenueFilter === "day" ? "Ventas del Mes" : revenueFilter === "month" ? "Tendencia Semestral" : "Crecimiento Anual"}
                      </p>
                      <h4 className="text-6xl admin-title">
                        {revenueFilter === "day" ? "$1,420.50" : revenueFilter === "month" ? "$42,850.00" : "$512,300.00"}
                      </h4>
                      {hoveredData && (
                        <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-primary font-bold mt-3 uppercase tracking-[0.05em] text-sm">
                           {hoveredData.label}: <span className="text-[var(--admin-text-primary)]">${parseInt(hoveredData.val).toLocaleString()}</span>
                        </motion.p>
                      )}
                   </div>
                   <div className="bg-primary/10 p-5 rounded-3xl border border-primary/20">
                      <TrendingUp className="w-8 h-8 text-primary" />
                   </div>
                </div>
                
                <div className="h-56 flex items-end gap-1.5 md:gap-2 px-2">
                   {activeData.map((d, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(d.val / maxVal) * 100}%` }}
                          transition={{ type: "spring", stiffness: 100, damping: 20, delay: i * 0.01 }}
                          onMouseEnter={() => setHoveredData({ label: d.label, val: d.val.toString() })}
                          onMouseLeave={() => setHoveredData(null)}
                          className={cn(
                            "w-full rounded-t-xl transition-all cursor-pointer relative group",
                            hoveredData?.label === d.label ? "bg-primary shadow-[0_0_30px_rgba(141,169,196,0.5)]" : "bg-[var(--admin-panel)] hover:bg-[var(--admin-card-hover)]"
                          )}
                        />
                        {activeData.length < 10 && (
                          <span className="admin-metadata opacity-40">{d.label}</span>
                        )}
                     </div>
                   ))}
                </div>
             </div>
             <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
          </Card>

          <Card className="p-10 lg:p-12 admin-card bg-[var(--admin-panel)] flex flex-col justify-between">
             <div className="space-y-1">
                <h4 className="text-xl admin-title">Horas Pico</h4>
                <p className="admin-metadata">Afluencia de consultas</p>
             </div>
             <div className="space-y-10 py-10">
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-[2rem] bg-secondary-yellow text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-secondary-yellow/20 uppercase transform group-hover:rotate-6 transition-transform">AM</div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between admin-metadata"><span className="text-[var(--admin-text-primary)]">Mañana</span><span className="text-secondary-yellow">65%</span></div>
                      <div className="h-3 bg-[var(--admin-bg-secondary)] rounded-full overflow-hidden border border-[var(--admin-border)] shadow-inner">
                         <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-secondary-yellow shadow-[0_0_10px_rgba(255,209,102,0.4)]" />
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-[2rem] bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-xl shadow-primary/20 uppercase transform group-hover:-rotate-6 transition-transform">PM</div>
                   <div className="flex-1 space-y-3">
                      <div className="flex justify-between admin-metadata"><span className="text-[var(--admin-text-primary)]">Tarde/Noche</span><span className="text-primary">35%</span></div>
                      <div className="h-3 bg-[var(--admin-bg-secondary)] rounded-full overflow-hidden border border-[var(--admin-border)] shadow-inner">
                         <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} className="h-full bg-primary shadow-[0_0_10px_rgba(141,169,196,0.4)]" />
                      </div>
                   </div>
                </div>
             </div>
             <div className="pt-6 border-t border-[var(--admin-border)]">
                <p className="admin-metadata opacity-40 uppercase tracking-[0.05em] text-[9px] text-center">Datos actualizados en tiempo real</p>
             </div>
          </Card>
       </div>

       {/* LEADERS SECTIONS */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* TOP PSICOLOGOS */}
          <Card className="p-10 lg:p-12 admin-card bg-[var(--admin-panel)]">
             <h4 className="text-xl admin-title mb-10">Top 3 Psicólogos</h4>
             <div className="space-y-8">
                {topPsychologists.map((ps, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center admin-title text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">#{i+1}</div>
                        <div>
                           <p className="font-bold text-[var(--admin-text-primary)] text-lg group-hover:text-primary transition-colors leading-[1.1]">{ps.name}</p>
                           <p className="admin-metadata opacity-40">{ps.sessions} citas este mes</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1.5 admin-metadata text-amber-500 font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        {ps.rating}
                     </div>
                  </div>
                ))}
             </div>
          </Card>

          {/* TOP CURSOS */}
          <Card className="p-10 lg:p-12 admin-card bg-[var(--admin-panel)]">
             <h4 className="text-xl admin-title mb-10">Top 3 Cursos</h4>
             <div className="space-y-8">
                {topCourses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-secondary-olive/20 flex items-center justify-center admin-title text-secondary-olive border border-secondary-olive/20 shadow-inner group-hover:scale-110 transition-transform">#{i+1}</div>
                        <div>
                           <p className="font-bold text-[var(--admin-text-primary)] text-lg group-hover:text-secondary-olive transition-colors leading-[1.1]">{c.title}</p>
                           <p className="admin-metadata opacity-40">{c.sales} inscritos</p>
                        </div>
                     </div>
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-full px-3 py-1 admin-metadata ring-1 ring-inset ring-emerald-500/20">{c.growth}</Badge>
                  </div>
                ))}
             </div>
          </Card>

          {/* TOP PODCASTS */}
          <Card className="p-10 lg:p-12 admin-card bg-[var(--admin-panel)]">
             <h4 className="text-xl admin-title mb-10">Top 3 Podcasts</h4>
             <div className="space-y-8">
                {topPodcasts.map((p, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center admin-title text-blue-500 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">#{i+1}</div>
                        <div>
                           <p className="font-bold text-[var(--admin-text-primary)] text-lg group-hover:text-blue-500 transition-colors leading-[1.1]">{p.title}</p>
                           <p className="admin-metadata opacity-40">{p.plays} reproducciones</p>
                        </div>
                     </div>
                     <span className="admin-metadata opacity-40">{p.duration}</span>
                  </div>
                ))}
             </div>
          </Card>
       </div>
    </div>
  )
}
