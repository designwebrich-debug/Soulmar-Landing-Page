"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, CreditCard, Landmark, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MockPaymentPage({
    searchParams
}: {
    searchParams: { amount: string, email: string, therapist: string }
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "processing" | "success">("idle")
    
    const amount = Number(searchParams.amount || 0)

    const handleMockPayment = async (method: string) => {
        setIsLoading(true)
        setStatus("processing")
        
        // Simular tiempo de procesamiento bancario (PSE o TC)
        await new Promise(r => setTimeout(r, 2500))

        // Simular el llamado del Webhook que haría Mercado Pago internamente
        try {
            await fetch('/api/webhooks/mercadopago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'payment',
                    data: { id: "mock-tx-777" },
                    _mock_override: true,
                    status: 'approved',
                    amount: amount
                })
            })
        } catch (e) {
            console.error("Mock webhook failed", e)
        }

        setStatus("success")
        setIsLoading(false)
    }

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface/30 px-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-600">¡Pago Exitoso!</h2>
                        <p className="text-sm text-foreground/60 mt-2">Tu sesión ha sido confirmada en el sistema. Hemos enviado el link de Google Meet a {searchParams.email}.</p>
                    </div>
                    <Button onClick={() => router.push('/')} className="w-full rounded-full h-12 shadow-lg">Volver al Inicio</Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface/30 px-6 py-12">
            <div className="max-w-md w-full bg-background rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20">
                {/* Header Mercado Pago Mock */}
                <div className="bg-[#009ee3] p-6 text-white text-center">
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Entorno de Simulación</p>
                    <h1 className="text-2xl font-bold">Mercado Pago (Mock)</h1>
                    <div className="mt-4 p-4 bg-white/10 rounded-2xl">
                        <p className="text-sm opacity-80">Total a pagar</p>
                        <p className="text-3xl font-bold">{formatPrice(amount)}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-2 text-xs text-foreground/60 justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Checkout seguro y encriptado</span>
                    </div>

                    <div className="space-y-4">
                        <p className="font-bold text-sm">Selecciona el método de prueba:</p>
                        
                        <button 
                            onClick={() => handleMockPayment('pse')}
                            disabled={isLoading}
                            className="w-full p-4 rounded-2xl border-2 border-surface hover:border-[#009ee3] transition-all flex items-center gap-4 group disabled:opacity-50"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Landmark className="w-5 h-5 text-[#009ee3]" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-sm">PSE (Transferencia)</p>
                                <p className="text-[10px] text-foreground/60">Bancolombia, Nequi, Daviplata...</p>
                            </div>
                        </button>

                        <button 
                            onClick={() => handleMockPayment('tc')}
                            disabled={isLoading}
                            className="w-full p-4 rounded-2xl border-2 border-surface hover:border-[#009ee3] transition-all flex items-center gap-4 group disabled:opacity-50"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-[#009ee3]" />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-bold text-sm">Tarjeta de Crédito / Débito</p>
                                <p className="text-[10px] text-foreground/60">Visa, Mastercard, Amex</p>
                            </div>
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-4 space-y-2">
                            <Loader2 className="w-8 h-8 text-[#009ee3] animate-spin" />
                            <p className="text-xs text-foreground/50 font-bold animate-pulse">Procesando pago con el banco...</p>
                        </div>
                    )}
                    
                    <Button variant="ghost" onClick={() => router.back()} disabled={isLoading} className="w-full rounded-full">
                        Cancelar y volver
                    </Button>
                </div>
            </div>
        </div>
    )
}
