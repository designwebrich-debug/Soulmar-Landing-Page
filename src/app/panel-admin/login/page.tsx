"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card } from "@/components/ui/Card"
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"

function AdminLoginContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const { login, loginSocial, isLoading, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Redirect if already an admin
  React.useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/panel-admin')
    }
  }, [user, router])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      const { error: loginError } = await login(email, password)
      
      if (loginError) {
        setError(loginError.message)
      } else {
        // Redirection happens in useEffect based on user.role
        router.push('/panel-admin')
      }
    } catch (_err) {
      setError(t('dashboard.admin.login.errors.failed') as string)
    }
  }

  const handleAdminSocialLogin = async (provider: 'google' | 'apple') => {
    setError(null)
    try {
      // The current AuthContext mock makes 'apple' an admin
      await loginSocial(provider)
      // Check will happen in the useEffect
    } catch (_err) {
      setError(t('dashboard.admin.login.errors.social_failed') as string)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary-olive/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[450px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-white dark:bg-white/5 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-black/5 dark:border-white/5"
          >
             <span className="text-2xl font-bold text-primary">Soul</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold tracking-[-0.022em] text-center mb-3">
            {t('dashboard.admin.login.title')}
          </h1>
          <p className="text-foreground/40 text-center font-medium max-w-[280px]">
             {t('dashboard.admin.login.subtitle')}
          </p>
        </div>

        <Card className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-white/5 backdrop-blur-3xl border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden relative">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-[0.05em] ml-4 opacity-40">{t('dashboard.admin.login.email_label')}</Label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  placeholder="admin@soulmar.com"
                  className="h-14 pl-14 rounded-2xl bg-[#F5F5F7] dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.05em] opacity-40">{t('dashboard.admin.login.password_label')}</Label>
                <button type="button" className="text-[10px] font-bold text-primary uppercase tracking-[0.05em] hover:underline">{t('dashboard.admin.login.forgot_password')}</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  className="h-14 pl-14 rounded-2xl bg-[#F5F5F7] dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4" 
              disabled={isLoading}
            >
              {isLoading ? t('dashboard.admin.login.processing') : t('dashboard.admin.login.login_btn')} <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/5 dark:border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#1A1A1A] px-4 text-foreground/30 font-bold tracking-[0.05em]">{t('dashboard.admin.login.or_continue')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-none bg-[#F5F5F7] dark:bg-white/5 hover:bg-white/10 transition-all font-bold"
              onClick={() => handleAdminSocialLogin('google')}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 1.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t('dashboard.admin.login.google')}
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-none bg-[#F5F5F7] dark:bg-white/5 hover:bg-white/10 transition-all font-bold"
              onClick={() => handleAdminSocialLogin('apple')}
              disabled={isLoading}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05 1.72-3.15 1.72-1.05 0-1.4-.65-2.65-.65-1.25 0-1.65.65-2.65.65-1.1 0-2.1-.75-3.15-1.72-2.15-2-3.3-5.2-3.3-8 0-4.3 2.7-6.55 5.3-6.55 1.35 0 2.45.85 3.35.85.85 0 2.15-.9 3.6-.9 1.15 0 3.3.45 4.5 2.1-3.2 1.85-2.65 6.15.55 7.45-1 2.35-2.4 4.15-3.5 5.35M12.05 5.53c.05-1.25.65-2.45 1.4-3.3.8-.95 2-1.65 3.05-1.85.15 1.25-.35 2.45-1.15 3.3-.85.95-2 1.75-3.3 1.85" />
                </svg>
                {t('dashboard.admin.login.apple')}
              </div>
            </Button>
          </div>
        </Card>

        <div className="mt-12 flex items-center justify-center gap-2">
           <ShieldCheck className="w-4 h-4 text-foreground/20" />
           <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-foreground/20">
              {t('dashboard.admin.login.secure_system')}
           </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <AdminLoginContent />
    </React.Suspense>
  )
}
