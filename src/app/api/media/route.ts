import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { promises as fs } from "fs"
import path from "path"
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

const MEDIA_FILE_PATH = path.join(process.cwd(), "src/data/media_registry.json")

// In-memory fallback
let inMemoryMedia: Record<string, string> = {}

async function getStoredMedia(): Promise<Record<string, string>> {
  // 1. Intentar desde Supabase
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from("business_settings")
      .select("media_registry")
      .eq("id", "default")
      .maybeSingle()
    if (data && data.media_registry && typeof data.media_registry === "object") {
      return data.media_registry
    }
  } catch (err) {}

  // 2. Intentar desde archivo local en disco
  try {
    const content = await fs.readFile(MEDIA_FILE_PATH, "utf-8")
    return JSON.parse(content)
  } catch (err) {}

  // 3. In-memory
  return inMemoryMedia
}

async function saveStoredMedia(media: Record<string, string>) {
  inMemoryMedia = { ...media }

  // 1. Guardar en disco
  try {
    await fs.mkdir(path.dirname(MEDIA_FILE_PATH), { recursive: true })
    await fs.writeFile(MEDIA_FILE_PATH, JSON.stringify(media, null, 2), "utf-8")
  } catch (err) {
    console.warn("[API_MEDIA] Warning saving to local disk:", err)
  }

  // 2. Guardar en Supabase business_settings
  try {
    const supabase = await createAdminClient()
    await supabase
      .from("business_settings")
      .update({ media_registry: media })
      .eq("id", "default")
  } catch (err) {
    console.warn("[API_MEDIA] Warning saving to Supabase business_settings:", err)
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
 * POST: Subir una nueva imagen para un slot específico
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

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen válida (JPG, PNG, WebP)." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Extensión segura
    const originalExt = path.extname(file.name) || ".jpg"
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(originalExt.toLowerCase()) ? originalExt.toLowerCase() : ".jpg"
    const filename = `${slotKey}-${Date.now()}${safeExt}`
    
    // Guardar en public/uploads/media/
    const uploadDir = path.join(process.cwd(), "public/uploads/media")
    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    const publicUrl = `/uploads/media/${filename}`

    // Actualizar registro
    const currentMedia = await getStoredMedia()
    currentMedia[slotKey] = publicUrl
    await saveStoredMedia(currentMedia)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      slotKey,
      media: currentMedia
    })
  } catch (err: any) {
    console.error("[API_MEDIA_POST] Error uploading file:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE: Restablecer una imagen a su valor original por defecto
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
    delete currentMedia[slotKey]
    await saveStoredMedia(currentMedia)

    return NextResponse.json({ success: true, media: currentMedia })
  } catch (err: any) {
    console.error("[API_MEDIA_DELETE] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
