"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, startOfToday, isSameDay, isWeekend } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock, X, Check, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { bookAppointment, getBusySlots } from "@/lib/actions/appointments"
import { cn } from "@/lib/utils"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  therapist: {
    id: string
    name: string
    role: string
    img: string
  } | null
  language: string
  t: any
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
]

export function BookingModal({ isOpen, onClose, therapist, language, t }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(startOfToday(), 1))
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locale = language === 'es' ? es : enUS

  // Load busy slots when date or therapist changes
  useEffect(() => {
    if (therapist && selectedDate) {
      const loadSlots = async () => {
        setIsLoading(true)
        try {
          const slots = await getBusySlots(therapist.id, format(selectedDate, 'yyyy-MM-dd'))
          setBusySlots(slots)
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
      loadSlots()
    }
  }, [therapist, selectedDate])

  const handleBook = async () => {
    if (!therapist || !selectedTime) return

    setIsBooking(true)
    setError(null)
    try {
      await bookAppointment({
        therapist_id: therapist.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime
      })
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsBooking(false)
    }
  }

  // Generate next 14 days
  const nextDays = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i + 1))

  return (
    <AnimatePresence>
      {isOpen && therapist && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-[#111111] w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-[#222222]"
          >
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-[#1a1a1a] flex justify-between items-center bg-slate-50/50 dark:bg-[#0A0A0A]/50">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-[#222222]">
                  <img src={therapist.img} alt={therapist.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-playfair text-slate-900 dark:text-white">{therapist.name}</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{therapist.role}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-white dark:bg-[#151515] shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 sm:p-10 space-y-10">
              {/* Date Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{t('dashboard.user.select_date', { defaultValue: "Selecciona una fecha" })}</h3>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest opacity-50 border-slate-200 dark:border-[#222222]">{t('dashboard.user.next_14_days', { defaultValue: "Próximos 14 días" })}</Badge>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                  {nextDays.map((date, i) => {
                    const active = isSameDay(date, selectedDate)
                    const weekend = isWeekend(date)
                    return (
                      <button
                        key={i}
                        disabled={weekend}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex-shrink-0 w-20 h-24 rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all duration-300 border shadow-sm",
                          active ? "bg-[#8da9c4] border-[#8da9c4] text-white shadow-[#8da9c4]/20" : "bg-white dark:bg-[#151515] border-slate-100 dark:border-[#222222] text-slate-400",
                          weekend && "opacity-20 grayscale pointer-events-none"
                        )}
                      >
                        <span className="text-[10px] font-black uppercase tracking-tighter">{format(date, 'EEE', { locale })}</span>
                        <span className="text-2xl font-bold">{format(date, 'd')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{t('dashboard.user.available_slots', { defaultValue: "Horarios disponibles" })}</h3>
                <div className="grid grid-cols-4 gap-4">
                  {TIME_SLOTS.map((time) => {
                    const isBusy = busySlots.includes(time)
                    const active = selectedTime === time
                    return (
                      <button
                        key={time}
                        disabled={isBusy || isLoading}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "h-14 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 border",
                          active ? "bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-xl" : "bg-white dark:bg-[#151515] border-slate-100 dark:border-[#222222] text-slate-400 hover:border-slate-300 dark:hover:border-slate-700",
                          isBusy && "opacity-20 grayscale pointer-events-none"
                        )}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-6">
                {error && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-red-500 text-sm font-bold">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}
                
                <Button
                  disabled={!selectedTime || isBooking || isSuccess}
                  onClick={handleBook}
                  className={cn(
                    "w-full h-18 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 py-6",
                    isSuccess ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-[1.02]"
                  )}
                >
                  {isBooking ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t('dashboard.user.processing', { defaultValue: "Procesando..." })}</span>
                    </div>
                  ) : isSuccess ? (
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5" />
                      <span>{t('dashboard.user.booking_success', { defaultValue: "¡Cita Agendada!" })}</span>
                    </div>
                  ) : (
                    t('dashboard.user.confirm_booking', { defaultValue: "Confirmar Agendamiento" })
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
