"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  CreditCard,
  Type,
  LogOut,
  ChevronRight,
  Bell,
  Sun,
  Moon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useSearchParams } from "next/navigation"
import { AdminThemeProvider, useAdminTheme } from "@/context/AdminThemeContext"
import { useTranslation } from "@/context/LanguageContext"
import "./panel-admin-theme.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    meta.content = 'noindex, nofollow'
  }, [])

  return (
    <AdminThemeProvider>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black">Cargando...</div>}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </AdminThemeProvider>
  )
}

function AdminThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2.5 rounded-2xl transition-all duration-300 relative overflow-hidden group",
        "bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-primary/30",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="relative z-10 w-5 h-5 flex items-center justify-center">
        <Sun className={cn(
          "w-5 h-5 text-amber-500 absolute transition-all duration-500",
          theme === 'dark' ? "translate-y-10 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0"
        )} />
        <Moon className={cn(
          "w-5 h-5 text-indigo-400 absolute transition-all duration-500",
          theme === 'light' ? "-translate-y-10 opacity-0 -rotate-90" : "translate-y-0 opacity-100 rotate-0"
        )} />
      </div>
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
    </button>
  )
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme } = useAdminTheme()
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeView = searchParams.get("view") || "dashboard"
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Skip protection check for login page itself
  const isLoginPage = pathname === "/panel-admin/login"

  // ROLE-BASED PROTECTION
  useEffect(() => {
    if (isLoginPage) return;

    if (isAuthenticated && user && user.role !== "admin") {
      router.push("/")
    } else if (!isAuthenticated && !localStorage.getItem("soulmar_auth")) {
      router.push("/panel-admin/login")
    }
  }, [isAuthenticated, user, router, isLoginPage])

  const handleLogout = async () => {
    await logout()
    setShowLogoutModal(false)
    router.push("/")
  }

  if (isLoginPage) return <>{children}</>;

  const menuItems = [
    { id: "dashboard", label: t('dashboard.admin.menu.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, href: "/panel-admin" },
    { id: "operations", label: t('dashboard.admin.menu.operations'), icon: <Briefcase className="w-5 h-5" />, href: "/panel-admin?view=operations" },
    { id: "content", label: t('dashboard.admin.menu.content'), icon: <FileText className="w-5 h-5" />, href: "/panel-admin?view=content" },
    { id: "people", label: t('dashboard.admin.menu.people'), icon: <Users className="w-5 h-5" />, href: "/panel-admin?view=people" },
    { id: "analytics", label: t('dashboard.admin.menu.analytics'), icon: <BarChart3 className="w-5 h-5" />, href: "/panel-admin?view=analytics" },
    { id: "monetization", label: t('dashboard.admin.menu.monetization'), icon: <CreditCard className="w-5 h-5" />, href: "/panel-admin?view=monetization" },
    { id: "cms", label: t('dashboard.admin.menu.cms'), icon: <Type className="w-5 h-5" />, href: "/panel-admin?view=cms" },
    { id: "settings", label: t('dashboard.admin.menu.settings'), icon: <Settings className="w-5 h-5" />, href: "/panel-admin?view=settings" },
  ]

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans transition-all duration-200",
      theme === "dark" ? "admin-dark dark" : "admin-light"
    )}>
      {/* APPLE SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-[var(--admin-panel)] border-r border-[var(--admin-border)] flex flex-col z-50">
        <div className="p-8 pb-12 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transform rotate-3">
             <div className="w-5 h-5 rounded-full border-2 border-white/40" />
          </div>
          <span className="font-bold text-2xl tracking-[-0.022em] hidden lg:block text-primary">SOULMAR</span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-200",
                "hover:bg-[var(--admin-card-hover)]",
                activeView === item.id ? "bg-primary text-white shadow-xl shadow-primary/20 active:scale-[0.98]" : "text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]"
              )}
            >
              <div className="flex-shrink-0 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <span className="hidden lg:block flex-1">{item.label}</span>
              {activeView === item.id && <ChevronRight className="w-4 h-4 opacity-50 hidden lg:block" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-[var(--admin-border)] space-y-4">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[14px] font-bold text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-110">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="hidden lg:block">{t('dashboard.admin.logout')}</span>
          </button>

          <div className="flex items-center gap-3 p-2 rounded-2xl bg-[var(--admin-bg)] border border-[var(--admin-border)] transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/20 overflow-hidden relative shadow-inner">
               <Image src="/avatar-placeholder.png" alt="Admin" fill className="object-cover" />
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="font-bold text-sm truncate uppercase tracking-tight text-[var(--admin-text-primary)]">Admin Soulmar</p>
              <p className="text-[10px] text-[var(--admin-text-muted)] font-bold uppercase tracking-[0.05em] leading-none">{t('dashboard.admin.role_admin')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[var(--admin-panel)] rounded-[2.5rem] p-10 shadow-2xl text-center border border-[var(--admin-border)]"
            >
               <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <LogOut className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-bold tracking-tight mb-4 text-[var(--admin-text-primary)]">{t('dashboard.admin.logout_confirm.title')}</h3>
               <p className="text-[var(--admin-text-secondary)] font-medium mb-10 leading-relaxed px-4">
                 {t('dashboard.admin.logout_confirm.desc')}
               </p>
              <div className="flex flex-col gap-3">
                 <Button 
                   onClick={handleLogout}
                   className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg transition-all active:scale-[0.98]"
                 >
                   {t('dashboard.admin.logout_confirm.confirm')}
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={() => setShowLogoutModal(false)}
                   className="h-14 rounded-2xl font-bold text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)] transition-all"
                 >
                   {t('dashboard.admin.logout_confirm.cancel')}
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN MAIN VIEW */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[var(--admin-bg)]">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 w-full bg-[var(--admin-panel)] border-b border-[var(--admin-border)] py-4 px-12 flex justify-end items-center gap-6">
           {/* Theme Toggle */}
           <AdminThemeToggle />

           {/* Notifications */}
           <div className="relative group">
              <button className="relative p-2 rounded-full hover:bg-[var(--admin-card-hover)] transition-all duration-200">
                 <Bell className="w-5 h-5 text-[var(--admin-text-secondary)] group-hover:text-primary transition-colors" />
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary-yellow rounded-full border-2 border-[var(--admin-panel)]" />
              </button>
              
              {/* Mock Notification Popover */}
               <div className="absolute top-full right-0 mt-2 w-80 bg-[var(--admin-panel)] rounded-3xl shadow-2xl border border-[var(--admin-border)] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
                  <div className="p-6 border-b border-[var(--admin-border)] bg-[var(--admin-bg-secondary)]">
                     <h4 className="font-bold text-sm uppercase tracking-[0.05em] text-primary">{t('dashboard.admin.notifications.title')}</h4>
                  </div>
                 <div className="max-h-96 overflow-y-auto">
                    {[
                      { icon: <CreditCard className="w-4 h-4" />, text: "Nueva suscripción: Plan Premium", time: "Hace 2 min", color: "text-emerald-500" },
                      { icon: <Users className="w-4 h-4" />, text: "Cita agendada: Juan Pérez", time: "Hace 15 min", color: "text-primary" },
                      { icon: <Briefcase className="w-4 h-4" />, text: "Consulta completada: Dra. Elena", time: "Hace 1 hora", color: "text-secondary-olive" },
                    ].map((n, i) => (
                      <div key={i} className="p-4 hover:bg-[var(--admin-card-hover)] transition-colors flex gap-4 items-start border-b border-[var(--admin-border)] last:border-none">
                         <div className={cn("mt-1 p-1.5 rounded-lg bg-current opacity-10", n.color)} />
                         <div className={cn("mt-1 absolute p-1.5", n.color)}>{n.icon}</div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold leading-[1.1] text-[var(--admin-text-primary)]">{n.text}</p>
                            <p className="text-[10px] text-[var(--admin-text-muted)] font-bold uppercase tracking-tight">{n.time}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-[var(--admin-bg-secondary)] text-center">
                    <button className="text-[10px] font-bold uppercase tracking-[0.05em] text-primary hover:tracking-[0.15em] transition-all">Ver todas</button>
                 </div>
              </div>
           </div>

           {/* Divider */}
           <div className="h-8 w-px bg-[var(--admin-border)]" />

           {/* Profile */}
           <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="font-bold text-sm tracking-tight leading-none mb-1 uppercase text-[var(--admin-text-primary)]">Admin Soulmar</p>
                  <p className="text-[10px] font-bold text-[var(--admin-text-muted)] uppercase tracking-[0.05em]">{t('dashboard.admin.role_admin')}</p>
               </div>
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 overflow-hidden relative shadow-lg group">
                 <Image src="/avatar-placeholder.png" alt="Admin" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-primary/10" />
              </div>
           </div>
        </header>

        {/* Subtle Background Elements with Brand Colors */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none animate-pulse" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary-olive/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
