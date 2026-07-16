import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
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
