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

/**
 * GET: Obtener todas las imágenes registradas directamente de la tabla `media_slots`
 */
export async function GET() {
  try {
    const supabase = await createAdminClient()
    const { data, error } = await supabase
      .from("media_slots")
      .select("slot_key, url, is_empty")

    if (error) {
      console.error("[API_MEDIA_GET] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const media: Record<string, string> = {}
    if (Array.isArray(data)) {
      for (const row of data) {
        if (row.is_empty) {
          media[row.slot_key] = "__EMPTY__"
        } else if (row.url) {
          media[row.slot_key] = row.url
        }
      }
    }

    return NextResponse.json({ success: true, media })
  } catch (err: any) {
    console.error("[API_MEDIA_GET] Fatal error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * POST: Subir foto en máxima calidad directamente al bucket 'media' de Supabase
 * y registrar la URL pública en `media_slots`. Cero límites de 4.5MB en Vercel, cero Base64 en BD.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const slotKey = formData.get("slotKey") as string | null

    if (!file || !slotKey) {
      return NextResponse.json({ error: "Archivo o slot no especificado." }, { status: 400 })
    }

    const mimeType = file.type || "image/jpeg"
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen válida (JPG, PNG, WebP)." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = await createAdminClient()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const storagePath = `slots/${slotKey}-${Date.now()}.${extension}`

    // 1. Subir al bucket 'media' en Storage con upsert
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: true
      })

    if (uploadError) {
      console.error("[API_MEDIA_POST] Storage upload error:", uploadError)
      return NextResponse.json({ error: "Error al guardar archivo en Storage: " + uploadError.message }, { status: 500 })
    }

    // 2. Obtener URL pública directa
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(storagePath)

    const finalUrl = publicUrlData.publicUrl

    // 3. Registrar en tabla media_slots
    const { error: dbError } = await supabase
      .from("media_slots")
      .upsert({
        slot_key: slotKey,
        url: finalUrl,
        storage_path: storagePath,
        is_empty: false,
        updated_at: new Date().toISOString()
      })

    if (dbError) {
      console.error("[API_MEDIA_POST] DB upsert error:", dbError)
      return NextResponse.json({ error: "Error guardando slot en BD: " + dbError.message }, { status: 500 })
    }

    // Obtener mapa completo actualizado
    const { data: allSlots } = await supabase.from("media_slots").select("slot_key, url, is_empty")
    const media: Record<string, string> = {}
    if (Array.isArray(allSlots)) {
      for (const row of allSlots) {
        media[row.slot_key] = row.is_empty ? "__EMPTY__" : row.url
      }
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      slotKey,
      media
    })
  } catch (err: any) {
    console.error("[API_MEDIA_POST] Fatal error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE: Eliminar una foto de un slot marcando `is_empty = true` en `media_slots`.
 * Garantiza que la web la deje vacía sin fallback a fotos viejas.
 */
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slotKey = searchParams.get("slotKey")

    if (!slotKey) {
      return NextResponse.json({ error: "slotKey requerido." }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 1. Marcar como vacío en BD
    const { error: dbError } = await supabase
      .from("media_slots")
      .upsert({
        slot_key: slotKey,
        url: null,
        is_empty: true,
        updated_at: new Date().toISOString()
      })

    if (dbError) {
      console.error("[API_MEDIA_DELETE] DB error:", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 2. Obtener mapa actualizado
    const { data: allSlots } = await supabase.from("media_slots").select("slot_key, url, is_empty")
    const media: Record<string, string> = {}
    if (Array.isArray(allSlots)) {
      for (const row of allSlots) {
        media[row.slot_key] = row.is_empty ? "__EMPTY__" : row.url
      }
    }

    return NextResponse.json({ success: true, media })
  } catch (err: any) {
    console.error("[API_MEDIA_DELETE] Fatal error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
