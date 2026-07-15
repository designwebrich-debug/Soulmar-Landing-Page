import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"

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
 * GET: Obtener horarios y festivos
 * (Público, para la landing page)
 */
export async function GET() {
  try {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .eq("id", "default")
      .single()

    if (error) {
      console.error("[API_SETTINGS_GET] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ settings: data })
  } catch (err: any) {
    console.error("[API_SETTINGS_GET] Exception:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * PATCH: Actualizar horarios y festivos
 * (Protegido, solo para admin)
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
    const { schedules, holidays, slot_duration } = body

    const supabase = await createAdminClient()

    const { data, error } = await supabase
      .from("business_settings")
      .update({
        schedules: schedules,
        holidays: holidays,
        slot_duration: slot_duration || "30 min"
      })
      .eq("id", "default")
      .select()
      .single()

    if (error) {
      console.error("[API_SETTINGS_PATCH] Update Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, settings: data })
  } catch (err: any) {
    console.error("[API_SETTINGS_PATCH] Exception:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
