import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Resend } from "resend"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"
import { createCalendarEvent } from "@/lib/googleCalendar"
import { normalizeTime } from "@/lib/utils"
import { rateLimit, getClientIp } from "@/lib/security/rateLimit"

/** Escapa HTML para insertar datos del usuario de forma segura en correos. */
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Fecha de hoy (YYYY-MM-DD) en la zona horaria del consultorio. */
function todayInBogota(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date())
}

const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']{2,}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_ACTIVE_BOOKINGS_PER_EMAIL = 3

// Helper para validar si el correo pertenece a la lista blanca
function isAuthorized(email?: string | null): boolean {
  if (!email) return false
  const defaultWhitelist = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]
  const envWhitelist = process.env.ADMIN_WHITELIST 
    ? process.env.ADMIN_WHITELIST.split(",").map(e => e.trim().toLowerCase()) 
    : []
  const whitelist = Array.from(new Set([...defaultWhitelist, ...envWhitelist]))
  return whitelist.includes(email.trim().toLowerCase())
}

/**
 * Extraer datos del paciente embebidos en el motivo si existen (citas históricas)
 */
function parseAppointmentPatient(app: any) {
  let patientName = app.patient?.name || ""
  let patientEmail = app.patient?.email || ""
  let patientPhone = app.patient?.phone || ""
  let cleanReason = app.reason || ""

  if (typeof cleanReason === "string" && cleanReason.startsWith("[PACIENTE:")) {
    const match = cleanReason.match(/^\[PACIENTE:\s*(.*?)\s*\|\s*TEL:\s*(.*?)\s*\|\s*EMAIL:\s*(.*?)\]\s*(.*)$/s)
    if (match) {
      patientName = match[1] || patientName
      patientPhone = match[2] || patientPhone
      patientEmail = match[3] || patientEmail
      cleanReason = match[4] || ""
    }
  }

  return {
    ...app,
    appointment_date: app.appointment_date || "",
    appointment_time: app.appointment_time || "",
    status: app.status || "pending",
    reason: cleanReason,
    patient: {
      name: patientName || "Paciente Soulmar",
      email: patientEmail || "sin-correo@soulmar.org",
      phone: patientPhone || ""
    }
  }
}

/**
 * Enviar alerta inmediata por correo a la administración de Soulmar
 */
async function notifyAdminByEmail(data: {
  fullName: string
  phone: string
  email: string
  date: string
  time: string
  reason?: string
  dbSaved: boolean
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[SOULMAR_NOTIF] RESEND_API_KEY is not defined. Email alert omitted.")
    return
  }

  try {
    const resend = new Resend(apiKey)
    const recipients = ["soulmar.org@gmail.com", "designwebrich@gmail.com"]
    const cleanPhone = (data.phone || "").replace(/[^0-9]/g, "")

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Citas SoulMar <citas@soulmar.org>",
      to: recipients,
      subject: `🚨 NUEVA CITA AGENDADA: ${data.fullName.replace(/[\r\n]+/g, " ").slice(0, 80)} (${data.date} - ${data.time})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #111827;">
          <div style="border-bottom: 2px solid #8da9c4; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #0d1b2a; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🌊 SOULMAR • NUEVA RESERVA DE CITA</h1>
            <p style="color: #6b7280; margin: 4px 0 0; font-size: 13px;">Se ha registrado una nueva sesión clínica a través del sitio web oficial.</p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; margin-top: 0; margin-bottom: 14px;">📋 Datos del Paciente</h2>
            <p style="margin: 6px 0; font-size: 14px;"><strong>👤 Nombre:</strong> ${escapeHtml(data.fullName)}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${cleanPhone}" style="color: #059669; font-weight: bold; text-decoration: underline;">${escapeHtml(data.phone)}</a></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>✉️ Correo:</strong> <a href="mailto:${encodeURIComponent(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a></p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; margin-top: 0; margin-bottom: 14px;">🗓️ Detalles de la Consulta</h2>
            <p style="margin: 6px 0; font-size: 14px;"><strong>📅 Fecha:</strong> ${escapeHtml(data.date)}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>⏰ Hora:</strong> ${escapeHtml(data.time)}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>💬 Motivo:</strong> ${escapeHtml(data.reason || "Consulta General")}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>💻 Modalidad:</strong> Sesión Online (Google Meet)</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>💾 Persistencia:</strong> ${data.dbSaved ? "✅ Guardado en Supabase" : "⚠️ Error en BD"}</p>
          </div>

          <div style="text-align: center; margin: 26px 0 14px;">
            <a href="https://www.soulmar.org/admin" style="background-color: #0d1b2a; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Abrir Panel Administrativo
            </a>
          </div>

          <div style="text-align: center; margin-top: 8px;">
            <a href="https://wa.me/${cleanPhone}" style="background-color: #25d366; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
              Contactar al Paciente por WhatsApp
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
            Soulmar Mental Health Platform • www.soulmar.org
          </p>
        </div>
      `
    })
    console.log("[SOULMAR_NOTIF] Email alert successfully dispatched to admins.")
  } catch (err) {
    console.error("[SOULMAR_NOTIF_ERROR] Failed to send email alert:", err)
  }
}

/** "14:00:00" | "2:00 PM" → "02:00 PM" (formato consistente para front y admin) */
function toDisplayTime(t?: string | null): string {
  const norm = normalizeTime(t)
  const m = norm.match(/^(\d{2}):(\d{2})$/)
  if (!m) return t || ""
  let h = parseInt(m[1], 10)
  const ampm = h >= 12 ? "PM" : "AM"
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${String(h).padStart(2, "0")}:${m[2]} ${ampm}`
}

/** Mapea fila de Supabase a la forma que espera el panel admin */
function toClientAppointment(row: any) {
  const legacy = parseAppointmentPatient(row)
  return {
    ...legacy,
    id: row.id,
    appointment_date: row.appointment_date,
    appointment_time: toDisplayTime(row.appointment_time),
    status: row.status,
    reason: row.reason || legacy.reason,
    meeting_link: row.meeting_link,
    created_at: row.created_at,
    patient: {
      name: row.patient_name || row.patient?.name || legacy.patient.name,
      email: row.patient_email || row.patient?.email || legacy.patient.email,
      phone: row.patient_phone || row.patient?.phone || legacy.patient.phone,
    },
  }
}

function dbUnavailable(context: string, err: unknown) {
  console.error(`[${context}] DATABASE ERROR:`, err)
  return NextResponse.json(
    {
      error: "La base de datos no está disponible temporalmente. Inténtalo de nuevo.",
      code: "DB_UNAVAILABLE",
    },
    { status: 503 }
  )
}

async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get("soulmar_admin_session")?.value
  const email = token ? verifyToken(token) : null
  return Boolean(email && isAuthorized(email))
}

/**
 * GET: Obtener citas directamente de Supabase.
 * - Admin: todas las citas ordenadas cronológicamente con datos completos.
 * - Público: solo fechas y horas de turnos ocupados para inhabilitar en el calendario.
 */
export async function GET() {
  const isAdmin = await requireAdmin()

  try {
    const supabase = await createAdminClient()

    if (!isAdmin) {
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time, status")
        .neq("status", "cancelled")

      if (error) return dbUnavailable("API_APPOINTMENTS_GET_PUBLIC", error)

      return NextResponse.json({
        appointments: (data || []).map((a) => ({
          ...a,
          appointment_time: toDisplayTime(a.appointment_time),
        })),
        isCalendarConfigured: false,
      })
    }

    // Modo Admin: Cargar citas con paciente
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id (
          name,
          email,
          phone
        )
      `)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: true })

    if (error) {
      // Fallback sin join
      const { data: rawApps, error: rawErr } = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: true })

      if (rawErr) return dbUnavailable("API_APPOINTMENTS_GET_ADMIN", rawErr)
      return NextResponse.json({
        appointments: (rawApps || []).map(toClientAppointment),
        isCalendarConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN)
      })
    }

    const isCalendarConfigured = !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    )

    return NextResponse.json({
      appointments: (data || []).map(toClientAppointment),
      isCalendarConfigured,
    })
  } catch (err) {
    return dbUnavailable("API_APPOINTMENTS_GET", err)
  }
}

/**
 * PATCH: Confirmar, cancelar, marcar no-show o reprogramar una cita en Supabase.
 */
export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const { id, status, date, time } = await request.json()
    if (!id) return NextResponse.json({ error: "Falta el ID de la cita." }, { status: 400 })

    const supabase = await createAdminClient()

    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (fetchError) return dbUnavailable("API_APPOINTMENTS_PATCH_FETCH", fetchError)
    if (!appointment) return NextResponse.json({ error: "La cita no existe." }, { status: 404 })

    const current = toClientAppointment(appointment)
    const targetStatus = status || appointment.status
    const targetDate = date || appointment.appointment_date
    const targetTime = time ? toDisplayTime(time) : appointment.appointment_time

    const updateData: Record<string, any> = {
      status: targetStatus,
      appointment_date: targetDate,
      appointment_time: targetTime,
      updated_at: new Date().toISOString(),
    }

    // Al confirmar, generar Google Calendar event + Meet link
    if (targetStatus === "confirmed" && (appointment.status !== "confirmed" || date || time)) {
      try {
        const calendarResult = await createCalendarEvent({
          patientName: current.patient.name,
          patientEmail: current.patient.email,
          appointmentDate: targetDate,
          appointmentTime: targetTime,
          consultationReason: current.reason || "Consulta de bienestar",
        })
        updateData.meeting_link = calendarResult.meetingLink || calendarResult.htmlLink || appointment.meeting_link || ""
      } catch (calErr) {
        console.error("[API_APPOINTMENTS_PATCH] Google Calendar sync warning:", calErr)
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      if ((updateError as any).code === "23505") {
        return NextResponse.json(
          { error: "Ya existe otra cita activa en esa fecha y hora.", code: "SLOT_ALREADY_BOOKED" },
          { status: 409 }
        )
      }
      return dbUnavailable("API_APPOINTMENTS_PATCH_UPDATE", updateError)
    }

    return NextResponse.json({ success: true, appointment: toClientAppointment(updated) })
  } catch (err) {
    return dbUnavailable("API_APPOINTMENTS_PATCH", err)
  }
}

/**
 * POST: Crear una nueva cita desde el agendamiento del front.
 * Persistencia real en Supabase con blindaje contra sobreposiciones.
 */
export async function POST(request: Request) {
  // 🔒 Anti-spam: máx. 5 solicitudes de reserva por IP cada 10 minutos
  const rl = rateLimit("booking", getClientIp(request), 5, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Has realizado demasiadas solicitudes. Por favor intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    )
  }

  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 })
  }

  const fullName = String(payload.fullName || "").trim()
  const email = String(payload.email || "").trim().toLowerCase()
  const phone = String(payload.phone || "").trim()
  const date = String(payload.date || "").trim()
  const time = String(payload.time || "").trim()
  const reason = String(payload.reason || "").trim()

  if (!fullName || !email || !date || !time) {
    return NextResponse.json({ error: "Faltan campos obligatorios para agendar la cita." }, { status: 400 })
  }

  // 🔒 Validación estricta del lado del servidor (el front puede ser evadido)
  const invalid = (msg: string) => NextResponse.json({ error: msg }, { status: 400 })
  if (fullName.length < 2 || fullName.length > 120) return invalid("Por favor escribe un nombre válido.")
  if (email.length > 254 || !EMAIL_RE.test(email)) return invalid("Por favor escribe un correo electrónico válido.")
  const phoneDigits = phone.replace(/\D/g, "")
  if (phone.length > 30 || phoneDigits.length < 7 || phoneDigits.length > 15 || /[^\d\s+()\-.]/.test(phone)) {
    return invalid("Por favor escribe un número de WhatsApp válido.")
  }
  if (reason.length > 1000) return invalid("El motivo de consulta es demasiado largo (máx. 1000 caracteres).")

  const parsedDate = new Date(`${date}T12:00:00Z`)
  if (!DATE_RE.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return invalid("La fecha seleccionada no es válida.")
  }
  const today = todayInBogota()
  if (date < today) return invalid("No es posible agendar en una fecha pasada.")
  const maxDate = new Date(`${today}T12:00:00Z`)
  maxDate.setUTCDate(maxDate.getUTCDate() + 365)
  if (parsedDate > maxDate) return invalid("Solo es posible agendar con hasta un año de anticipación.")

  if (!/^\d{2}:\d{2}$/.test(normalizeTime(time))) return invalid("La hora seleccionada no es válida.")

  const displayTime = toDisplayTime(time)

  try {
    const supabase = await createAdminClient()

    // 0. Anti-abuso: límite de citas activas futuras por correo
    const { count: activeForEmail } = await supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("patient_email", email)
      .in("status", ["pending", "confirmed"])
      .gte("appointment_date", today)

    if ((activeForEmail ?? 0) >= MAX_ACTIVE_BOOKINGS_PER_EMAIL) {
      return NextResponse.json(
        {
          error: "Ya tienes varias citas activas registradas con este correo. Escríbenos por WhatsApp para gestionarlas.",
          code: "TOO_MANY_ACTIVE_BOOKINGS",
        },
        { status: 429 }
      )
    }

    // 1. Verificar si ya existe un turno activo en esa fecha y hora
    const { data: existingSlots } = await supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status")
      .eq("appointment_date", date)
      .neq("status", "cancelled")

    const conflict = Array.isArray(existingSlots) && existingSlots.some(
      (s) => toDisplayTime(s.appointment_time) === displayTime
    )

    if (conflict) {
      return NextResponse.json(
        {
          error: "Este turno ya ha sido reservado por otro paciente. Por favor selecciona otro horario.",
          code: "SLOT_ALREADY_BOOKED",
        },
        { status: 409 }
      )
    }

    // 2. Insertar cita en appointments
    const { data: newApp, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: fullName,
        patient_email: email,
        patient_phone: phone,
        appointment_date: date,
        appointment_time: displayTime,
        reason: reason || "Consulta General",
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      if ((error as any).code === "23505") {
        return NextResponse.json(
          {
            error: "Este turno ya ha sido reservado por otro paciente. Por favor selecciona otro horario.",
            code: "SLOT_ALREADY_BOOKED",
          },
          { status: 409 }
        )
      }
      throw error
    }

    // 3. Notificar inmediatamente por correo a la administración
    await notifyAdminByEmail({
      fullName,
      phone,
      email,
      date,
      time: displayTime,
      reason,
      dbSaved: true,
    }).catch((e) => console.error("[SOULMAR_BOOKING] Email notification error:", e))

    return NextResponse.json({
      success: true,
      appointment: toClientAppointment(newApp),
      dbSaved: true,
    })
  } catch (err) {
    await notifyAdminByEmail({
      fullName,
      phone,
      email,
      date,
      time: displayTime,
      reason,
      dbSaved: false,
    }).catch((e) => console.error("[SOULMAR_BOOKING] Email notification error:", e))

    return dbUnavailable("SOULMAR_BOOKING_POST", err)
  }
}

/**
 * DELETE: Purgar historial (citas canceladas o no-show) dentro de un periodo.
 */
export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 })

  const timeframe = new URL(request.url).searchParams.get("timeframe")
  if (!timeframe) return NextResponse.json({ error: "Parámetro 'timeframe' requerido." }, { status: 400 })

  const cutoff = new Date()
  if (timeframe === "day") cutoff.setDate(cutoff.getDate() - 1)
  else if (timeframe === "week") cutoff.setDate(cutoff.getDate() - 7)
  else if (timeframe === "month") cutoff.setMonth(cutoff.getMonth() - 1)
  else if (timeframe === "year") cutoff.setFullYear(cutoff.getFullYear() - 1)
  const cutoffIso = cutoff.toISOString().split("T")[0]

  try {
    const supabase = await createAdminClient()
    const { error, count } = await supabase
      .from("appointments")
      .delete({ count: "exact" })
      .in("status", ["cancelled", "no_show"])
      .lte("appointment_date", cutoffIso)

    if (error) return dbUnavailable("API_APPOINTMENTS_DELETE", error)

    return NextResponse.json({
      success: true,
      deleted: count ?? 0,
      message: `Historial de citas purgado exitosamente (${timeframe}).`,
    })
  } catch (err) {
    return dbUnavailable("API_APPOINTMENTS_DELETE", err)
  }
}
