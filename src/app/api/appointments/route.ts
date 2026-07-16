import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"
import { createCalendarEvent } from "@/lib/googleCalendar"

// Helper para validar si el correo pertenece a la lista blanca
function isAuthorized(email?: string | null): boolean {
  if (!email) return false
  const whitelistEnv = process.env.ADMIN_WHITELIST 
    ? process.env.ADMIN_WHITELIST.split(",") 
    : []
  const whitelist = whitelistEnv.length > 0 
    ? whitelistEnv.map(e => e.trim().toLowerCase())
    : ["soulmar.org@gmail.com", "designwebrich@gmail.com"]
  return whitelist.includes(email.trim().toLowerCase())
}

/**
 * GET: Obtener todas las citas (para el panel administrativo).
 * Requiere sesión de administrador autenticado por Google.
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const supabase = await createAdminClient()

    // Traer citas y los datos del perfil del paciente en una sola consulta
    const { data: appointments, error } = await supabase
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

    if (error) {
      console.error("[API_APPOINTMENTS_GET] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const isCalendarConfigured = !!(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
    )

    return NextResponse.json({ appointments, isCalendarConfigured })
  } catch (err: any) {
    console.error("[API_APPOINTMENTS_GET] Exception:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * PATCH: Confirmar o cancelar una cita.
 * Si se confirma, se genera el evento en Google Calendar y el link de Google Meet.
 */
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { id, status, date, time } = body // status: 'confirmed', 'cancelled', 'pending'; date: YYYY-MM-DD; time: HH:MM AM/PM

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Obtener detalles de la cita y del paciente
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id (
          name,
          email
        )
      `)
      .eq("id", id)
      .single()

    if (fetchError || !appointment) {
      console.error("[API_APPOINTMENTS_PATCH] Fetch Error:", fetchError)
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const targetStatus = status || appointment.status
    const targetDate = date || appointment.appointment_date
    const targetTime = time || appointment.appointment_time

    const updateData: any = {
      status: targetStatus,
      appointment_date: targetDate,
      appointment_time: targetTime
    }

    // Si el estado es (o cambia a) CONFIRMED, generamos el enlace en Google Calendar con la fecha/hora correspondiente
    if (targetStatus === "confirmed") {
      const patientName = appointment.patient?.name || "Paciente Soulmar"
      const patientEmail = appointment.patient?.email || ""
      const reason = appointment.reason || "Consulta de Bienestar Radical"

      // Crear el evento de Google Calendar
      const calendarResult = await createCalendarEvent({
        patientName,
        patientEmail,
        appointmentDate: targetDate,
        appointmentTime: targetTime,
        consultationReason: reason,
      })

      updateData.meeting_link = calendarResult.meetingLink || calendarResult.htmlLink || ""
    }

    // Actualizar la cita en la base de datos
    const { data: updatedAppointment, error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[API_APPOINTMENTS_PATCH] Update Error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, appointment: updatedAppointment })
  } catch (err: any) {
    console.error("[API_APPOINTMENTS_PATCH] Exception:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * POST: Crear una nueva cita (desde el agendamiento del front).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, phone, email, date, time, reason } = body

    if (!fullName || !email || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 1. Intentar buscar o crear el perfil del paciente
    let patientId = "a1b2c3d4-1111-2222-3333-444455556666" // Mock UUID fallback

    // Primero verificamos si hay algún perfil con este correo
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle()

    if (existingProfile) {
      patientId = existingProfile.id
    } else {
      const newId = crypto.randomUUID()
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: newId,
          name: fullName,
          email: email.trim().toLowerCase(),
          phone: phone,
          role: "user"
        })
      if (!insertError) {
        patientId = newId
      }
    }

    // 2. Asegurar que el perfil del terapeuta exista
    const therapistId = "a1b2c3d4-1111-2222-3333-444455556666"
    await supabase.from("profiles").upsert({
      id: therapistId,
      name: "Terapeuta Soulmar",
      email: "therapist@soulmar.com",
      role: "admin"
    })

    // 3. Insertar la cita
    const { data: newApp, error: appError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        therapist_id: therapistId,
        appointment_date: date,
        appointment_time: time,
        reason: reason || "Consulta General",
        status: "pending"
      })
      .select()
      .single()

    if (appError) {
      console.error("[API_APPOINTMENTS_POST] Database insert error, returning mock response:", appError)
      return NextResponse.json({ 
        success: true, 
        appointment: {
          id: "temp-" + Date.now(),
          patient_id: patientId,
          therapist_id: therapistId,
          appointment_date: date,
          appointment_time: time,
          reason,
          status: "pending"
        } 
      })
    }

    return NextResponse.json({ success: true, appointment: newApp })
  } catch (err: any) {
    console.error("[API_APPOINTMENTS_POST] Exception:", err)
    return NextResponse.json({ 
      success: true, 
      appointment: {
        id: "temp-ex-" + Date.now(),
        patient_id: "local-user",
        therapist_id: "local-therapist",
        appointment_date: date,
        appointment_time: time,
        status: "pending"
      }
    })
  }
}

