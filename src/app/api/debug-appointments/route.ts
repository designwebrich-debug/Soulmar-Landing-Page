import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"

function isAuthorized(email?: string | null): boolean {
  if (!email) return false
  const defaultWhitelist = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]
  const envWhitelist = process.env.ADMIN_WHITELIST 
    ? process.env.ADMIN_WHITELIST.split(",").map(e => e.trim().toLowerCase()) 
    : []
  const whitelist = Array.from(new Set([...defaultWhitelist, ...envWhitelist]))
  return whitelist.includes(email.trim().toLowerCase())
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized Access Blocked", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const action = searchParams.get("action") // "list" | "confirm"

    const supabase = await createAdminClient()

    if (action === "list") {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patient:patient_id (
            name,
            email
          )
        `)
        .order("appointment_date", { ascending: false })
      return NextResponse.json({ appointments: data, error })
    }

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" })
    }

    // Obtener detalles de la cita
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
      return NextResponse.json({ step: "fetch", error: fetchError || "Appointment not found" })
    }

    const updateData: any = {
      status: "confirmed",
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time
    }

    // Intentar Google Calendar
    let calResult: any = null
    let calError: any = null
    try {
      const { createCalendarEvent } = require("@/lib/googleCalendar")
      calResult = await createCalendarEvent({
        patientName: appointment.patient?.name || "Paciente",
        patientEmail: appointment.patient?.email || "",
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        consultationReason: appointment.reason || ""
      })
      updateData.meeting_link = calResult.meetingLink || calResult.htmlLink || ""
    } catch (e: any) {
      calError = { message: e.message, stack: e.stack }
    }

    // Actualizar base de datos
    const { data: updated, error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    return NextResponse.json({
      action: "confirm",
      appointment,
      google_calendar: { result: calResult, error: calError },
      update_data: updateData,
      supabase_update: { result: updated, error: updateError }
    })

  } catch (err: any) {
    return NextResponse.json({ exception: err.message, stack: err.stack }, { status: 500 })
  }
}
