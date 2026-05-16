"use client"

import { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { cn } from "@/lib/utils"

function LoginContent() {
  const { t } = useTranslation()
  const { login, loginSocial, forgotPassword } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/panel-usuario"
  const isVerified = searchParams.get("verified") === "true"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isForgotMode, setIsForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [isResetSent, setIsResetSent] = useState(false)

  useEffect(() => {
    if (isVerified) {
      showToast("¡Cuenta verificada! Ahora puedes iniciar sesión.", "success")
      // Remove verified from URL to avoid re-triggering
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [isVerified, showToast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error: loginError } = await login(email, password)
      
      if (loginError) {
        let errorMessage = loginError.message
        if (errorMessage === "Invalid login credentials") {
          errorMessage = "Contraseña incorrecta o cuenta no registrada."
        } else if (errorMessage === "Email not confirmed") {
          errorMessage = "Por favor confirma tu correo electrónico antes de iniciar sesión."
        }
        setError(errorMessage)
        showToast(errorMessage, "error")
      } else {
        showToast("¡Bienvenido de nuevo a Soulmar!", "success")
        router.push(redirectPath)
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al iniciar sesión")
      showToast("Error al iniciar sesión", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "apple" | "facebook") => {
    setError(null)
    try {
      await loginSocial(provider)
    } catch (err) {
      setError(`Error con ${provider}. Inténtalo de nuevo.`)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error: resetError } = await forgotPassword(forgotEmail)
      if (resetError) {
        setError(resetError.message)
      } else {
        setIsResetSent(true)
      }
    } catch (err) {
      setError("Error al enviar el correo de recuperación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6 bg-surface/30">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-14">
              <Image 
                src="/logo-soulmar-official.png" 
                alt="Soulmar" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('login.title')}</h1>
          <p className="text-foreground/60">{t('login.subtitle')}</p>
        </div>

        <Card className="border-none shadow-2xl bg-background overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
          <CardContent className="p-8 space-y-8">
            {isForgotMode ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold">{t('auth.forgot_password_title')}</h2>
                  <p className="text-sm text-foreground/60">{t('auth.forgot_password_desc')}</p>
                </div>
                
                {isResetSent ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-center font-medium animate-in zoom-in-95 duration-300">
                    {t('auth.reset_link_sent')}
                    <Button variant="link" className="block mx-auto mt-2 text-primary" onClick={() => { setIsForgotMode(false); setIsResetSent(false); }}>
                      {t('auth.login')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">{t('checkout.form.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                        <Input 
                          id="forgot-email" 
                          type="email" 
                          placeholder="tu@email.com" 
                          className="pl-10 h-12 rounded-2xl"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl text-center font-medium">
                        {error}
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full h-12 rounded-full shadow-lg" disabled={isLoading}>
                        {isLoading ? t('login.processing') : t('auth.send_reset_link')}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <Button variant="ghost" className="w-full h-12 rounded-full" onClick={() => setIsForgotMode(false)}>
                        {t('checkout.back')}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* TRADITIONAL LOGIN */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('checkout.form.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="pl-10 h-12 rounded-2xl"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('auth.password')}</Label>
                      <button 
                        type="button"
                        onClick={() => setIsForgotMode(true)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        {t('login.forgot_password')}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 pr-10 h-12 rounded-2xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-foreground/30 hover:text-foreground/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl text-center font-medium animate-in fade-in zoom-in-95 duration-300">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full h-12 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 text-white font-bold transition-all active:scale-95" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> {t('login.processing')}</> : <>{t('login.login_btn')} <ArrowRight className="ml-2 w-5 h-5" /></>}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-foreground/40 font-bold tracking-[0.05em]">{t('login.continue_with')}</span>
                  </div>
                </div>

                {/* SOCIAL LOGIN */}
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-full border-2 hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-all font-bold group"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                  >
                    <div className="flex items-center w-[200px] mx-auto gap-4">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 1.45 1.18 4.93l3.66-2.84z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <span className="truncate text-sm">{t('login.google')}</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-full border-2 hover:bg-black hover:text-white hover:border-black transition-all font-bold group"
                    onClick={() => handleSocialLogin('apple')}
                    disabled={isLoading}
                  >
                    <div className="flex items-center w-[200px] mx-auto gap-4">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05 1.72-3.15 1.72-1.05 0-1.4-.65-2.65-.65-1.25 0-1.65.65-2.65.65-1.1 0-2.1-.75-3.15-1.72-2.15-2-3.3-5.2-3.3-8 0-4.3 2.7-6.55 5.3-6.55 1.35 0 2.45.85 3.35.85.85 0 2.15-.9 3.6-.9 1.15 0 3.3.45 4.5 2.1-3.2 1.85-2.65 6.15.55 7.45-1 2.35-2.4 4.15-3.5 5.35M12.05 5.53c.05-1.25.65-2.45 1.4-3.3.8-.95 2-1.65 3.05-1.85.15 1.25-.35 2.45-1.15 3.3-.85.95-2 1.75-3.3 1.85" />
                        </svg>
                      </div>
                      <span className="truncate text-sm">{t('login.apple')}</span>
                    </div>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-foreground/60">
          {t('login.no_account')}{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            {t('login.create_here')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
