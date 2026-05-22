"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function BookRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir a la landing page con el ancla de agendamiento
    const timer = setTimeout(() => {
      router.replace("/#agendamiento")
    }, 800)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0b0c] flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="glass-panel p-8 md:p-12 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Logo de Soulmar */}
        <div className="relative w-48 h-16 mb-4">
          <Image 
            src="/logo-soulmar-official.png" 
            alt="Soulmar Logo" 
            fill
            className="object-contain dark:invert"
            priority
          />
        </div>
        
        {/* Cargador e Indicador Visual */}
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Redirigiendo...
          </h1>
          
          <p className="text-xs text-foreground/50 leading-relaxed max-w-xs uppercase tracking-wider font-semibold">
            Te estamos llevando a nuestra nueva plataforma de agendamiento in-situ.
          </p>
        </div>
      </div>
    </div>
  )
}
