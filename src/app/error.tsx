"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Ocurrió un error inesperado</h2>
      <p className="text-foreground/60 mb-8 max-w-md">
        Estamos trabajando en solucionarlo. El error ha sido registrado internamente.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = "/"}>Volver al inicio</Button>
        <Button variant="outline" onClick={() => reset()}>Intentar de nuevo</Button>
      </div>
    </div>
  )
}
