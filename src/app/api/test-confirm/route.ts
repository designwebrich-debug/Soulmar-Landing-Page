import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"
import { createCalendarEvent } from "@/lib/googleCalendar"

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

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized Access Blocked", { status: 401 })
    }

    const supabase = await createAdminClient()
    
    // 1. Obtener la primera cita pendiente
    const { data: app, error: fetchErr } = await supabase
      .from("appointments")
      .select(`
        *,
        patient:patient_id (
          name,
          email
        )
      `)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle()

    if (fetchErr) {
      return NextResponse.json({ step: "fetch_pending", error: fetchErr })
    }

    if (!app) {
      return NextResponse.json({ message: "No pending appointments found to test." })
    }

    // 2. Intentar crear el evento en Google Calendar
    let calendarResult: any = null
    let calendarError: any = null
    try {
      const patientName = app.patient?.name || "Paciente Soulmar"
      const patientEmail = app.patient?.email || ""
      const reason = app.reason || "Consulta de Bienestar Radical"

      calendarResult = await createCalendarEvent({
        patientName,
        patientEmail,
        appointmentDate: app.appointment_date,
        appointmentTime: app.appointment_time,
        consultationReason: reason,
      })
    } catch (err: any) {
      calendarError = { message: err.message, stack: err.stack }
    }

    // 3. Intentar actualizar en Supabase
    const updateData: any = {
      status: "confirmed",
      appointment_date: app.appointment_date,
      appointment_time: app.appointment_time
    }
    if (calendarResult) {
      updateData.meeting_link = calendarResult.meetingLink || calendarResult.htmlLink || ""
    }

    const { data: updated, error: updateErr } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", app.id)
      .select()
      .single()

    return NextResponse.json({
      appointment_to_update: app,
      calendar_result: calendarResult,
      calendar_error: calendarError,
      update_data: updateData,
      database_update_result: updated || null,
      database_update_error: updateErr || null
    })

  } catch (err: any) {
    return NextResponse.json({ exception: err.message, stack: err.stack }, { status: 500 })
  }
}
