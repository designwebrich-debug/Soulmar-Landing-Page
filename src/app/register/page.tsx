"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ArrowRight, CheckCircle2, User, Mail, Lock, Phone, Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { cn } from "@/lib/utils"
import { sendRegistrationSuccessNotification } from "@/lib/notifications"
import { WHATSAPP_PHONE } from "@/lib/constants"

export default function RegisterPage() {
  const { t, language } = useTranslation()
  const { register, loginSocial } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    interests: [] as string[]
  })
  const [showPassword, setShowPassword] = useState(false)

  const interestOptions = [
    { id: "meditation", label: t('auth.interest_labels.meditation'), icon: "🧘" },
    { id: "therapy", label: t('auth.interest_labels.therapy'), icon: "🧠" },
    { id: "retreats", label: t('auth.interest_labels.retreats'), icon: "🏔️" },
    { id: "courses", label: t('auth.interest_labels.courses'), icon: "📚" },
    { id: "community", label: t('auth.interest_labels.community'), icon: "🤝" }
  ]

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [notifStatus, setNotifStatus] = useState({ email: false, whatsapp: false })

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#fbbf24', '#10b981', '#ffffff']
      })
    }
  }, [isSuccess])

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error: registerError } = await register(
        formData.email, 
        formData.password, 
        { 
          name: formData.name, 
          role: "user",
          interests: formData.interests,
          phone: formData.phone
        }
      )

      if (registerError) {
        setError(registerError.message)
      } else {
        showToast("¡Cuenta creada con éxito! Por favor inicia sesión.", "success")
        setIsSuccess(true)
        // Trigger notifications
        if (data?.user) {
          const { emailSent, whatsappSent } = await sendRegistrationSuccessNotification({
            userId: data.user.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          })
          setNotifStatus({ email: emailSent, whatsapp: whatsappSent })
        }
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al crear tu cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = async (provider: "google" | "apple" | "facebook") => {
    setError(null)
    try {
      await loginSocial(provider)
    } catch (err) {
      setError(`Error con ${provider}. Inténtalo de nuevo.`)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6 bg-surface/30">
        <Card className="max-w-md w-full border-none shadow-2xl bg-background overflow-hidden animate-in zoom-in duration-500">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{t('auth.success_title')}</h2>
              <p className="text-foreground/60 text-lg">
                {t('auth.success_message', { name: formData.name.split(" ")[0] })}
              </p>
              <div className="flex justify-center gap-6 py-2 border-y border-border/50">
                <div className={cn("flex flex-col items-center gap-1", notifStatus.email ? "text-emerald-500" : "text-amber-500")}>
                  <Mail className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase text-center max-w-[120px]">
                    {notifStatus.email 
                      ? "Se ha enviado un correo de bienvenida." 
                      : "Hubo un problema al enviar el correo. Lo recibirás pronto."}
                  </span>
                </div>
              </div>
            </div>
            <Button asChild className="w-full h-12 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 text-white">
              <Link href="/login">Ir a iniciar sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.register_title')}</h1>
          <p className="text-foreground/60">{t('auth.register_subtitle')}</p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                step === i ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                step > i ? "bg-primary/20 text-primary" : "bg-surface text-foreground/40"
              )}
            >
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-2xl bg-background overflow-hidden">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.full_name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                      <Input 
                        id="name" 
                        placeholder="Tu nombre completo" 
                        className="pl-10 h-12 rounded-2xl"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="pl-10 h-12 rounded-2xl"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 rounded-full text-lg shadow-lg group"
                  onClick={nextStep}
                  disabled={!formData.name || !formData.email}
                >
                  {t('common.continue') || 'Continuar'} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-background px-4 text-foreground/40 font-bold tracking-[0.05em]">{t('auth.or_register_with')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-full border-2 hover:bg-[#4285F4] hover:text-white hover:border-[#4285F4] transition-all font-bold group"
                    onClick={() => handleSocialRegister('google')}
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
                      <span className="truncate text-sm">{t('auth.google')}</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 rounded-full border-2 hover:bg-black hover:text-white hover:border-black transition-all font-bold group"
                    onClick={() => handleSocialRegister('apple')}
                    disabled={isLoading}
                  >
                    <div className="flex items-center w-[200px] mx-auto gap-4">
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05 1.72-3.15 1.72-1.05 0-1.4-.65-2.65-.65-1.25 0-1.65.65-2.65.65-1.1 0-2.1-.75-3.15-1.72-2.15-2-3.3-5.2-3.3-8 0-4.3 2.7-6.55 5.3-6.55 1.35 0 2.45.85 3.35.85.85 0 2.15-.9 3.6-.9 1.15 0 3.3.45 4.5 2.1-3.2 1.85-2.65 6.15.55 7.45-1 2.35-2.4 4.15-3.5 5.35M12.05 5.53c.05-1.25.65-2.45 1.4-3.3.8-.95 2-1.65 3.05-1.85.15 1.25-.35 2.45-1.15 3.3-.85.95-2 1.75-3.3 1.85" />
                        </svg>
                      </div>
                      <span className="truncate text-sm">{t('auth.apple')}</span>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2 text-center pb-2">
                  <Label className="text-lg font-semibold">{t('auth.interests_title')}</Label>
                  <p className="text-sm text-foreground/60">{t('auth.interests_subtitle')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group",
                        formData.interests.includes(opt.id)
                          ? "border-primary bg-primary/5 shadow-inner"
                          : "border-surface hover:border-primary/30"
                      )}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1 h-12 rounded-full" onClick={prevStep}>{t('checkout.back')}</Button>
                  <Button className="flex-[2] h-12 rounded-full shadow-lg" onClick={nextStep}>
                    {t('booking.next')} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-10 pr-10 h-12 rounded-2xl"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-foreground/30 hover:text-foreground/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="flex flex-col gap-1 mt-2 text-[10px] uppercase font-bold tracking-wider">
                      <div className={cn("flex items-center gap-2 transition-colors", formData.password.length >= 8 ? "text-emerald-500" : "text-foreground/40")}>
                        <CheckCircle2 className="w-3 h-3" /> 8+ caracteres
                      </div>
                      <div className={cn("flex items-center gap-2 transition-colors", /[A-Z]/.test(formData.password) ? "text-emerald-500" : "text-foreground/40")}>
                        <CheckCircle2 className="w-3 h-3" /> 1 Mayúscula
                      </div>
                      <div className={cn("flex items-center gap-2 transition-colors", /[0-9]/.test(formData.password) ? "text-emerald-500" : "text-foreground/40")}>
                        <CheckCircle2 className="w-3 h-3" /> 1 Número
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                    <Input 
                      id="phone" 
                      placeholder={WHATSAPP_PHONE} 
                      className="pl-10 h-12 rounded-2xl"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl text-center font-medium animate-in fade-in zoom-in-95 duration-300">
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1 h-12 rounded-full" onClick={prevStep}>{t('checkout.back')}</Button>
                  <Button 
                    className="flex-[2] h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> {t('auth.processing')}</> : t('auth.complete')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-foreground/60">
          {t('auth.has_account')}{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
