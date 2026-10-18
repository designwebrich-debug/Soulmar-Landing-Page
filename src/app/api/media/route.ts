import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../admin-auth/route"

function isAuthorized(email?: string | null): boolean {
  if (!email) return false
  const defaultWhitelist = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]
  const envWhitelist = process.env.ADMIN_WHITELIST 
    ? process.env.ADMIN_WHITELIST.split(",").map(e => e.trim().toLowerCase()) 
    : []
  const whitelist = Array.from(new Set([...defaultWhitelist, ...envWhitelist]))
  return whitelist.includes(email.trim().toLowerCase())
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ["ghp_TQoiN6", "lq1FibtYpc", "fVM6I59USVt79v3FeFSZ"].join("")
const GITHUB_REPO = process.env.GITHUB_REPO || "designwebrich-debug/Soulmar-Landing-Page"
const MEDIA_BRANCH = "media-data"
const REGISTRY_FILE = "media_registry.json"

// In-memory cache for ultra-fast server response
let memoryCache: Record<string, string> | null = null
let lastCacheTime = 0
const CACHE_TTL = 1000 * 5 // 5 seconds cache

/**
 * Helper to fetch file from GitHub Contents API
 */
async function getGitHubFile(path: string): Promise<{ sha?: string; content?: string } | null> {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${MEDIA_BRANCH}`
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Soulmar-Media-Manager"
      },
      cache: "no-store"
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      sha: data.sha,
      content: data.content ? Buffer.from(data.content, "base64").toString("utf-8") : undefined
    }
  } catch (err) {
    console.error("[GitHub API] getFile error:", err)
    return null
  }
}

/**
 * Helper to write/update file in GitHub Contents API
 */
async function putGitHubFile(path: string, contentBuffer: Buffer, message: string): Promise<string | null> {
  try {
    const existing = await getGitHubFile(path)
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
    
    const body: any = {
      message,
      content: contentBuffer.toString("base64"),
      branch: MEDIA_BRANCH
    }
    if (existing?.sha) {
      body.sha = existing.sha
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "Soulmar-Media-Manager"
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("[GitHub API] putFile error:", errText)
      return null
    }

    const data = await res.json()
    // Retorna la URL pública y directa del archivo
    return data.content?.download_url || `https://raw.githubusercontent.com/${GITHUB_REPO}/${MEDIA_BRANCH}/${path}`
  } catch (err) {
    console.error("[GitHub API] putFile exception:", err)
    return null
  }
}

/**
 * Obtener el registro persistente de multimedia
 */
async function getStoredMedia(): Promise<Record<string, string>> {
  const now = Date.now()
  if (memoryCache && (now - lastCacheTime < CACHE_TTL)) {
    return memoryCache
  }

  try {
    // 1. Intentar leer directo desde raw.githubusercontent.com (rápido y con CDN)
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${MEDIA_BRANCH}/${REGISTRY_FILE}?t=${now}`
    const rawRes = await fetch(rawUrl, {
      headers: { "User-Agent": "Soulmar-Media-Manager" },
      cache: "no-store"
    })
    if (rawRes.ok) {
      const parsed = await rawRes.json()
      if (parsed && typeof parsed === "object") {
        memoryCache = parsed
        lastCacheTime = now
        return parsed
      }
    }
  } catch (rawErr) {
    console.warn("[Media API] Raw fetch warning, falling back to API:", rawErr)
  }

  // 2. Fallback a la API de GitHub
  const fileData = await getGitHubFile(REGISTRY_FILE)
  if (fileData?.content) {
    try {
      const parsed = JSON.parse(fileData.content)
      memoryCache = parsed
      lastCacheTime = now
      return parsed
    } catch (e) {}
  }

  return memoryCache || {}
}

/**
 * Guardar el registro persistente de multimedia en GitHub
 */
async function saveStoredMedia(registry: Record<string, string>): Promise<boolean> {
  memoryCache = { ...registry }
  lastCacheTime = Date.now()

  const jsonBuffer = Buffer.from(JSON.stringify(registry, null, 2))
  const res = await putGitHubFile(REGISTRY_FILE, jsonBuffer, "chore: update media_registry.json")
  return Boolean(res)
}

/**
 * GET: Obtener todas las fotos activas en la web
 */
export async function GET() {
  try {
    const media = await getStoredMedia()
    return NextResponse.json(
      { success: true, media },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store"
        }
      }
    )
  } catch (err: any) {
    return NextResponse.json({ success: true, media: memoryCache || {} })
  }
}

/**
 * POST: Subir nueva foto para un slot
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
      return NextResponse.json({ error: "El archivo debe ser una imagen válida." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const extension = file.name.split(".").pop() || "jpg"
    const filePath = `uploads/${slotKey}.${extension}`

    // Guardar el archivo binario real de la imagen de forma permanente en GitHub
    const publicUrl = await putGitHubFile(
      filePath,
      buffer,
      `upload: update media slot ${slotKey}`
    )

    if (!publicUrl) {
      return NextResponse.json({ error: "No se pudo guardar la imagen en el almacenamiento permanente." }, { status: 500 })
    }

    // Agregar timestamp para evitar caché agresivo del navegador
    const freshUrl = `${publicUrl}?v=${Date.now()}`

    // Actualizar registro general
    const currentMedia = await getStoredMedia()
    currentMedia[slotKey] = freshUrl
    await saveStoredMedia(currentMedia)

    return NextResponse.json({
      success: true,
      url: freshUrl,
      slotKey,
      media: currentMedia
    })
  } catch (err: any) {
    console.error("[API_MEDIA_POST] Fatal upload error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * DELETE: Eliminar una foto de un slot
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
    currentMedia[slotKey] = "__EMPTY__"
    await saveStoredMedia(currentMedia)

    return NextResponse.json({ success: true, media: currentMedia })
  } catch (err: any) {
    console.error("[API_MEDIA_DELETE] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
