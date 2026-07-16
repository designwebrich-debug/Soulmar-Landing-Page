import { google } from "googleapis"

// Inicializar el cliente OAuth2 con las credenciales de Google Cloud
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL 
    ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    : "https://soulmar-landing-page.vercel.app/api/auth/callback/google"
)

// Configurar el refresh token para permitir la renovación automática del access token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

const calendar = google.calendar({ version: "v3", auth: oauth2Client })

interface AppointmentData {
  patientName: string
  patientEmail: string
  appointmentDate: string // Formato: YYYY-MM-DD
  appointmentTime: string // Formato: HH:MM
  consultationReason?: string
}

/**
 * Función auxiliar con patrón de reintentos con retraso exponencial (backoff).
 */
async function retryGoogleApiCall<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (err: any) {
    if (retries <= 1) throw err
    console.warn(`[GOOGLE_API] Fallo temporal. Reintentando en ${delay}ms... (Intentos restantes: ${retries - 1}). Error:`, err.message || err)
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryGoogleApiCall(fn, retries - 1, delay * 2)
  }
}

function convertTo24Hour(timeStr: string): string {
  const clean = timeStr.trim().toUpperCase()
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/)
  if (!match) return timeStr
  
  let hours = parseInt(match[1])
  const minutes = match[2]
  const ampm = match[3]
  
  if (ampm === "PM" && hours < 12) {
    hours += 12
  } else if (ampm === "AM" && hours === 12) {
    hours = 0
  }
  
  return `${String(hours).padStart(2, "0")}:${minutes}:00`
}

/**
 * Crea un evento en el Google Calendar principal y genera un enlace de Google Meet.
 */
export async function createCalendarEvent(appointment: AppointmentData) {
  try {
    const { appointmentDate, appointmentTime, patientName, patientEmail, consultationReason } = appointment

    // Validaciones básicas de credenciales antes del intento de red
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
      throw new Error("Missing Google OAuth credentials in environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)")
    }

    // Convertir hora a formato 24h seguro (HH:MM:00)
    const startTimeStr = convertTo24Hour(appointmentTime)
    const startDateTime = `${appointmentDate}T${startTimeStr}`

    // Calcular la hora de finalización (duración estándar de 50 minutos)
    const startDate = new Date(startDateTime)
    if (isNaN(startDate.getTime())) {
      throw new Error(`Invalid start date time format: ${startDateTime}`)
    }
    const endDate = new Date(startDate.getTime() + 50 * 60 * 1000)

    const endYear = endDate.getFullYear()
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0")
    const endDay = String(endDate.getDate()).padStart(2, "0")
    const endHours = String(endDate.getHours()).padStart(2, "0")
    const endMinutes = String(endDate.getMinutes()).padStart(2, "0")
    const endDateTime = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}:00`

    // Ejecutar llamada con lógica de reintentos
    const response = await retryGoogleApiCall(() => calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1, // Requerido para habilitar la generación de Google Meet
      sendUpdates: "all", // Obliga a Google a enviar el correo de invitación (Gmail) al paciente
      requestBody: {
        summary: `Consulta Psicológica: ${patientName}`,
        description: `Sesión de psicoterapia agendada en Soulmar.\n\n` +
                     `Paciente: ${patientName} (${patientEmail})\n` +
                     `Motivo de consulta: ${consultationReason || "No especificado"}`,
        start: {
          dateTime: startDateTime,
          timeZone: "America/Bogota",
        },
        end: {
          dateTime: endDateTime,
          timeZone: "America/Bogota",
        },
        attendees: [
          { email: patientEmail, displayName: patientName }
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 30 },
          ],
        },
      },
    }))

    const event = response.data

    return {
      eventId: event.id || null,
      htmlLink: event.htmlLink || null,
      meetingLink: event.hangoutLink || null, // Enlace de Google Meet generado
    }
  } catch (error: any) {
    console.error("[GOOGLE_CALENDAR] Error en la creación de evento:", error)
    throw new Error(`Google Calendar Service Error: ${error.message || error}`)
  }
}
