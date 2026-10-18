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

// Respaldo en memoria por instancia
let inMemoryMedia: Record<string, string> = {}

async function getStoredMedia(): Promise<Record<string, string>> {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("business_settings")
      .select("media_registry")
      .eq("id", "default")
      .maybeSingle()
    if (data && data.media_registry && typeof data.media_registry === "object") {
      return { ...inMemoryMedia, ...data.media_registry }
    }
  } catch (err) {
    console.warn("[API_MEDIA_GET] Supabase lookup warning:", err)
  }
  return inMemoryMedia
}

async function saveStoredMedia(media: Record<string, string>) {
  inMemoryMedia = { ...media }

  try {
    const supabase = await createAdminClient()
    await supabase
      .from("business_settings")
      .update({ media_registry: media })
      .eq("id", "default")
  } catch (err) {
    console.warn("[API_MEDIA] Supabase update warning:", err)
  }
}

/**
 * GET: Obtener todas las URLs de multimedia activas
 */
export async function GET() {
  try {
    const media = await getStoredMedia()
    return NextResponse.json({ success: true, media })
  } catch (err: any) {
    return NextResponse.json({ success: true, media: inMemoryMedia })
  }
}

/**
 * POST: Subir o guardar una nueva imagen para un slot específico
 * Soporta:
 * 1) Supabase Storage Bucket ('media' o 'public') si está disponible.
 * 2) Data URL Base64 de alta resolución persistida directamente en Supabase business_settings.
 * ¡Funciona al 100% en entornos Serverless / Vercel sin depender del disco de solo lectura!
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

    // Validar tipo de imagen
    const mimeType = file.type || "image/jpeg"
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen válida (JPG, PNG, WebP)." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let finalImageUrl = ""

    // Estrategia A: Intentar subir a Supabase Storage Bucket
    try {
      const supabase = await createAdminClient()
      const extension = file.name.split('.').pop() || 'jpg'
      const storagePath = `uploads/${slotKey}-${Date.now()}.${extension}`

      // Intentar subir al bucket 'media'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true
        })

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(storagePath)
        
        if (publicUrlData?.publicUrl) {
          finalImageUrl = publicUrlData.publicUrl
        }
      }
    } catch (storageErr) {
      console.warn("[API_MEDIA_POST] Supabase Storage bucket attempt notice:", storageErr)
    }

    // Estrategia B: Si el storage bucket no está creado o configurado, generar Data URL Base64 de máxima fidelidad
    if (!finalImageUrl) {
      const base64 = buffer.toString("base64")
      finalImageUrl = `data:${mimeType};base64,${base64}`
    }

    // Actualizar registro en business_settings
    const currentMedia = await getStoredMedia()
    currentMedia[slotKey] = finalImageUrl
    await saveStoredMedia(currentMedia)

    return NextResponse.json({
      success: true,
      url: finalImageUrl,
      slotKey,
      media: currentMedia
    })
  } catch (err: any) {
    console.error("[API_MEDIA_POST] Fatal upload error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE: Eliminar una foto de un slot, dejando la caja vacía en la web
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

    const currentMedia = await getStoredMedia()
    // Se guarda explícitamente como __EMPTY__ para que la web NO vuelva a mostrar la foto anterior
    currentMedia[slotKey] = "__EMPTY__"
    await saveStoredMedia(currentMedia)

    return NextResponse.json({ success: true, media: currentMedia })
  } catch (err: any) {
    console.error("[API_MEDIA_DELETE] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
