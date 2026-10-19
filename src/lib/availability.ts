import { normalizeTime } from "./utils"

export interface SlotAvailability {
  date: Date
  dateStr: string // "YYYY-MM-DD"
  slot: string // "11:00 AM"
  displayLabel: {
    es: string
    en: string
  }
}

export interface DaySlots {
  am: string[]
  pm: string[]
  all: string[]
}

export const WEEKDAYS_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
export const SHORT_DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
export const SHORT_MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
export const SHORT_DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export const SHORT_MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDateIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function addDaysDate(d: Date, days: number): Date {
  const next = new Date(d.getTime())
  next.setDate(next.getDate() + days)
  return next
}

/**
 * Genera la lista de slots para una fecha y configuración dada.
 */
export function generateSlotsForDate(
  date: Date | null,
  schedules: Record<string, any>,
  slotDuration: string = "1 hora 20 min"
): DaySlots {
  if (!date) return { am: [], pm: [], all: [] }

  const dayName = WEEKDAYS_ES[date.getDay()]
  const config = schedules[dayName]

  if (!config || !config.enabled) return { am: [], pm: [], all: [] }

  let durationMins = 30
  if (slotDuration === "45 min") durationMins = 45
  if (slotDuration === "1 hora") durationMins = 60
  if (slotDuration === "1 hora 20 min") durationMins = 80

  const am: string[] = []
  const pm: string[] = []
  const all: string[] = []

  const generateBlock = (startH: number, startM: number, endH: number, endM: number) => {
    let currentHour = startH
    let currentMin = startM

    while (currentHour < endH || (currentHour === endH && currentMin < endM)) {
      let displayHour = currentHour
      let ampm = "AM"

      if (currentHour >= 12) {
        ampm = "PM"
        if (currentHour > 12) displayHour = currentHour - 12
      } else if (currentHour === 0) {
        displayHour = 12
      }

      const hourStr = displayHour.toString().padStart(2, "0")
      const minStr = currentMin.toString().padStart(2, "0")
      const slotStr = `${hourStr}:${minStr} ${ampm}`

      all.push(slotStr)
      if (ampm === "AM") {
        am.push(slotStr)
      } else {
        pm.push(slotStr)
      }

      currentMin += durationMins
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60)
        currentMin = currentMin % 60
      }
    }
  }

  // Bloque principal (mañana o continuo)
  if (config.start && config.end) {
    const s = config.start.split(":")
    const e = config.end.split(":")
    generateBlock(
      parseInt(s[0], 10) || 7,
      parseInt(s[1], 10) || 0,
      parseInt(e[0], 10) || 18,
      parseInt(e[1], 10) || 0
    )
  }

  // Bloque PM secundario (si aplica)
  if (config.startPM && config.endPM) {
    const s = config.startPM.split(":")
    const e = config.endPM.split(":")
    generateBlock(
      parseInt(s[0], 10) || 14,
      parseInt(s[1], 10) || 0,
      parseInt(e[0], 10) || 19,
      parseInt(e[1], 10) || 0
    )
  }

  return { am, pm, all }
}

/**
 * Valida si un slot ya pasó en el tiempo (para la fecha de hoy).
 */
export function isPastSlot(slotStr: string, targetDate: Date, now: Date = new Date()): boolean {
  const isToday = targetDate.toDateString() === now.toDateString()
  if (!isToday) {
    return targetDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const parts = slotStr.split(" ")
  if (parts.length < 2) return false
  const timeParts = parts[0].split(":")
  let hour = parseInt(timeParts[0], 10)
  const minute = parseInt(timeParts[1], 10)
  const ampm = parts[1]

  if (ampm === "PM" && hour !== 12) hour += 12
  else if (ampm === "AM" && hour === 12) hour = 0

  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  if (currentHour > hour) return true
  if (currentHour === hour && currentMinute >= minute) return true

  return false
}

/**
 * Valida si un slot ya está reservado en una fecha dada.
 */
export function isSlotBooked(
  slotStr: string,
  dateStr: string,
  appointments: any[] = []
): boolean {
  const targetNorm = normalizeTime(slotStr)
  return appointments.some((app: any) => {
    return (
      app.appointment_date === dateStr &&
      app.status !== "cancelled" &&
      normalizeTime(app.appointment_time) === targetNorm
    )
  })
}

/**
 * Encuentra el primer slot disponible a partir de una fecha base (hasta 30 días en el futuro).
 * Garantiza total coherencia entre el Hero superior y el calendario inferior.
 */
export function getFirstAvailableSlot(
  schedules: Record<string, any>,
  slotDuration: string = "1 hora 20 min",
  holidays: any[] = [],
  appointments: any[] = [],
  startDate: Date = new Date()
): SlotAvailability | null {
  let dateToCheck = new Date(startDate.getTime())
  const now = new Date()

  for (let i = 0; i < 30; i++) {
    const formattedDate = formatDateIso(dateToCheck)

    // Verificar si es festivo
    const isHoliday = holidays.some((h: any) => {
      const hDate = typeof h === "string" ? h : h.date
      return hDate === formattedDate
    })

    if (isHoliday) {
      dateToCheck = addDaysDate(dateToCheck, 1)
      continue
    }

    // Verificar si el día está habilitado en el horario
    const dayName = WEEKDAYS_ES[dateToCheck.getDay()]
    const config = schedules[dayName]

    if (!config || !config.enabled) {
      dateToCheck = addDaysDate(dateToCheck, 1)
      continue
    }

    const { all } = generateSlotsForDate(dateToCheck, schedules, slotDuration)

    for (const slot of all) {
      // 1. Validar si ya pasó (si es hoy)
      if (isPastSlot(slot, dateToCheck, now)) {
        continue
      }

      // 2. Validar si está reservado
      if (isSlotBooked(slot, formattedDate, appointments)) {
        continue
      }

      // ¡Slot encontrado!
      const isToday = dateToCheck.toDateString() === now.toDateString()
      const tomorrow = addDaysDate(now, 1)
      const isTomorrow = dateToCheck.toDateString() === tomorrow.toDateString()

      let labelEs = ""
      let labelEn = ""

      if (isToday) {
        labelEs = `Hoy, ${slot}`
        labelEn = `Today, ${slot}`
      } else if (isTomorrow) {
        labelEs = `Mañana, ${slot}`
        labelEn = `Tomorrow, ${slot}`
      } else {
        const dayIdx = dateToCheck.getDay()
        const dayNum = dateToCheck.getDate()
        const monthIdx = dateToCheck.getMonth()
        labelEs = `${SHORT_DAYS_ES[dayIdx]} ${dayNum} ${SHORT_MONTHS_ES[monthIdx]}, ${slot}`
        labelEn = `${SHORT_DAYS_EN[dayIdx]}, ${SHORT_MONTHS_EN[monthIdx]} ${dayNum}, ${slot}`
      }

      return {
        date: new Date(dateToCheck.getTime()),
        dateStr: formattedDate,
        slot,
        displayLabel: {
          es: labelEs,
          en: labelEn
        }
      }
    }

    dateToCheck = addDaysDate(dateToCheck, 1)
  }

  return null
}
