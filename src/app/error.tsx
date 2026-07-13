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
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl mx-auto flex items-center justify-center mb-8">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Ocurrió un error inesperado</h2>
        <p className="text-foreground/60 font-medium mb-8">
          Estamos trabajando en solucionarlo. El error ha sido registrado internamente.
        </p>

        <div className="bg-red-500/10 text-red-700 p-4 rounded text-xs text-left mb-6 font-mono overflow-auto max-h-40">
          <p className="font-bold">Error Details (Debug):</p>
          {error.message || "No error message provided"}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.href = "/"}>Volver al inicio</Button>
          <Button variant="outline" onClick={() => reset()}>Intentar de nuevo</Button>
        </div>
      </div>
    </div>
  )
}
