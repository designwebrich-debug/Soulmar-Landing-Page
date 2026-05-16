"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"

function ResetPasswordContent() {
  const { t } = useTranslation()
  const { updatePassword } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError((t('checkout.form.error_password_match') as string) || "Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError((t('checkout.form.error_password_length') as string) || "La contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const { error: resetError } = await updatePassword(password)
      if (resetError) {
        setError(resetError.message)
        showToast(resetError.message, "error")
      } else {
        setIsSuccess(true)
        showToast("Contraseña actualizada con éxito", "success")
      }
    } catch (err) {
      setError("Error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-6 bg-surface/30">
        <Card className="max-w-md w-full border-none shadow-2xl bg-background overflow-hidden animate-in zoom-in duration-500">
          <CardContent className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{t('auth.password_updated_success')}</h2>
            </div>
            <Button asChild className="w-full h-12 rounded-full text-lg shadow-lg">
              <Link href="/login">{t('auth.login')}</Link>
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
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.reset_password_title')}</h1>
          <p className="text-foreground/60">{t('auth.reset_password_desc')}</p>
        </div>

        <Card className="border-none shadow-2xl bg-background overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.new_password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-2xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{t('auth.confirm_new_password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/30" />
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-12 rounded-2xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl text-center font-medium animate-in fade-in zoom-in-95 duration-300">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-12 rounded-full text-lg shadow-lg bg-primary hover:bg-primary/90 text-white font-bold" disabled={isLoading}>
                {isLoading ? t('login.processing') : t('auth.update_password_btn')} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
