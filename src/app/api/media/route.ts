import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyToken } from "../admin-auth/route"
import { createAdminClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

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
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          }
        }
      )
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

    return NextResponse.json(
      { success: true, media },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        }
      }
    )
  } catch (err: any) {
    console.error("[API_MEDIA_GET] Fatal error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * POST: Subir foto o video MP4 en máxima calidad directamente al bucket 'media' de Supabase
 * y registrar la URL pública en `media_slots`. Cero límites de 4.5MB en Vercel, cero Base64 en BD.
 * Soporta tanto subida directa mediante URL firmada (para videos y archivos pesados) como multipart/form-data.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("soulmar_admin_session")?.value
    const email = token ? verifyToken(token) : null

    if (!email || !isAuthorized(email)) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const contentType = request.headers.get("content-type") || ""

    // ─────────────────────────────────────────────────────────────
    // MODO 1: JSON (Generación de URL firmada y confirmación de subida directa)
    // Permite subir videos MP4 de máxima calidad (hasta 50MB) saltándose el límite de Vercel (4.5MB).
    // ─────────────────────────────────────────────────────────────
    if (contentType.includes("application/json")) {
      const body = await request.json()
      const action = body.action

      if (action === "get-upload-url") {
        const { slotKey, fileName, fileType } = body
        if (!slotKey || !fileName) {
          return NextResponse.json({ error: "slotKey y fileName requeridos." }, { status: 400 })
        }

        const mime = (fileType || "video/mp4").toLowerCase()
        const isAllowed = mime.startsWith("image/") || mime.startsWith("video/") || mime.startsWith("audio/")
        if (!isAllowed) {
          return NextResponse.json(
            { error: "Formato no permitido. Solo imágenes (JPG, PNG, WebP), videos (MP4, QuickTime, WebM) o audios (MP3, WAV, M4A)." },
            { status: 400 }
          )
        }

        const extension = fileName.split(".").pop()?.toLowerCase() || (mime.startsWith("video/") ? "mp4" : mime.startsWith("audio/") ? "mp3" : "jpg")
        const storagePath = `slots/${slotKey}-${Date.now()}.${extension}`

        const supabase = await createAdminClient()
        const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(storagePath)

        if (error || !data?.signedUrl) {
          console.error("[API_MEDIA_POST] Error creando signedUploadUrl:", error)
          return NextResponse.json(
            { error: "Error al generar enlace de subida segura: " + (error?.message || "Desconocido") },
            { status: 500 }
          )
        }

        const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(storagePath)

        return NextResponse.json({
          success: true,
          signedUrl: data.signedUrl,
          storagePath,
          publicUrl: publicUrlData.publicUrl
        })
      }

      if (action === "confirm-upload") {
        const { slotKey, storagePath, publicUrl } = body
        if (!slotKey || !publicUrl) {
          return NextResponse.json({ error: "slotKey y publicUrl son requeridos para confirmar." }, { status: 400 })
        }

        const supabase = await createAdminClient()
        const { error: dbError } = await supabase
          .from("media_slots")
          .upsert({
            slot_key: slotKey,
            url: publicUrl,
            storage_path: storagePath || null,
            is_empty: false,
            updated_at: new Date().toISOString()
          })

        if (dbError) {
          console.error("[API_MEDIA_POST] Error confirmando slot en BD:", dbError)
          return NextResponse.json({ error: "Error guardando en BD: " + dbError.message }, { status: 500 })
        }

        // Obtener mapa completo actualizado
        const { data: allSlots } = await supabase.from("media_slots").select("slot_key, url, is_empty")
        const media: Record<string, string> = {}
        if (Array.isArray(allSlots)) {
          for (const row of allSlots) {
            media[row.slot_key] = row.is_empty ? "__EMPTY__" : row.url
          }
        }

        try {
          revalidatePath("/", "layout")
          revalidatePath("/", "page")
          revalidatePath("/admin")
        } catch (e) {
          console.warn("[API_MEDIA_POST] revalidatePath error:", e)
        }

        return NextResponse.json({
          success: true,
          url: publicUrl,
          slotKey,
          media
        })
      }

      if (action === "update-audio-settings") {
        const { isEnabled, status, title, fileName, size, duration, audioUrl, storagePath } = body
        const supabase = await createAdminClient()

        const metaPayload = {
          isEnabled: Boolean(isEnabled),
          status: status || (audioUrl ? "published" : "empty"),
          title: title || "Soulmar Atmosphere — Un momento para volver a ti",
          fileName: fileName || "",
          size: size || "",
          duration: duration || "",
          audioUrl: audioUrl || null,
          storagePath: storagePath || null,
          updatedAt: new Date().toISOString()
        }

        // 1. Guardar metadatos en slot 'audio_atmosphere_meta'
        const { error: metaError } = await supabase
          .from("media_slots")
          .upsert({
            slot_key: "audio_atmosphere_meta",
            url: JSON.stringify(metaPayload),
            storage_path: null,
            is_empty: false,
            updated_at: new Date().toISOString()
          })

        if (metaError) {
          console.error("[API_MEDIA_POST] Error guardando audio_atmosphere_meta:", metaError)
          return NextResponse.json({ error: "Error guardando configuración de audio: " + metaError.message }, { status: 500 })
        }

        // 2. Si status es 'published', guardar o actualizar slot 'audio_atmosphere' con audioUrl
        // Si status es 'empty', marcar slot 'audio_atmosphere' como vacío
        if (status === "published" && audioUrl) {
          await supabase
            .from("media_slots")
            .upsert({
              slot_key: "audio_atmosphere",
              url: audioUrl,
              storage_path: storagePath || null,
              is_empty: false,
              updated_at: new Date().toISOString()
            })
        } else if (status === "empty") {
          await supabase
            .from("media_slots")
            .upsert({
              slot_key: "audio_atmosphere",
              url: null,
              storage_path: null,
              is_empty: true,
              updated_at: new Date().toISOString()
            })
        }

        // Obtener mapa actualizado
        const { data: allSlots } = await supabase.from("media_slots").select("slot_key, url, is_empty")
        const media: Record<string, string> = {}
        if (Array.isArray(allSlots)) {
          for (const row of allSlots) {
            media[row.slot_key] = row.is_empty ? "__EMPTY__" : (row.url || "")
          }
        }

        try {
          revalidatePath("/", "layout")
          revalidatePath("/", "page")
          revalidatePath("/admin")
        } catch (e) {
          console.warn("[API_MEDIA_POST] revalidatePath error:", e)
        }

        return NextResponse.json({
          success: true,
          media,
          settings: metaPayload
        })
      }

      return NextResponse.json({ error: "Acción no reconocida." }, { status: 400 })
    }

    // ─────────────────────────────────────────────────────────────
    // MODO 2: Multipart Form-Data (Subida estándar directa)
    // ─────────────────────────────────────────────────────────────
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const slotKey = formData.get("slotKey") as string | null

    if (!file || !slotKey) {
      return NextResponse.json({ error: "Archivo o slot no especificado." }, { status: 400 })
    }

    const mimeType = file.type || "image/jpeg"
    const isAllowed = mimeType.startsWith("image/") || mimeType.startsWith("video/") || mimeType.startsWith("audio/")
    if (!isAllowed) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen válida (JPG, PNG, WebP), video (MP4, WebM) o audio (MP3, WAV, M4A)." },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const supabase = await createAdminClient()
    const extension = file.name.split('.').pop()?.toLowerCase() || (mimeType.startsWith("video/") ? 'mp4' : mimeType.startsWith("audio/") ? 'mp3' : 'jpg')
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

    // 4. Revalidar rutas para invalidar la caché de CDN y servidor inmediatamente
    try {
      revalidatePath("/", "layout")
      revalidatePath("/", "page")
      revalidatePath("/admin")
    } catch (e) {
      console.warn("[API_MEDIA_POST] revalidatePath error:", e)
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

    // 3. Revalidar rutas inmediatamente
    try {
      revalidatePath("/", "layout")
      revalidatePath("/", "page")
      revalidatePath("/admin")
    } catch (e) {
      console.warn("[API_MEDIA_DELETE] revalidatePath error:", e)
    }

    return NextResponse.json({ success: true, media })
  } catch (err: any) {
    console.error("[API_MEDIA_DELETE] Fatal error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
