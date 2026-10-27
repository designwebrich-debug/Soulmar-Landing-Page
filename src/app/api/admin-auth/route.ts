import { NextRequest, NextResponse } from "next/server"
import { createHash, createHmac, timingSafeEqual } from "crypto"
import { rateLimit, resetRateLimit, getClientIp } from "@/lib/security/rateLimit"

const DEFAULT_ADMINS = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]
const envAdmins = process.env.ADMIN_WHITELIST 
  ? process.env.ADMIN_WHITELIST.split(",").map(e => e.trim().toLowerCase()) 
  : []
const ADMIN_WHITELIST = Array.from(new Set([...DEFAULT_ADMINS, ...envAdmins]))
const COOKIE_NAME = "soulmar_admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 horas

/**
 * 🔒 HARDENING 2026-10-27
 * Las credenciales viven EXCLUSIVAMENTE en variables de entorno de Vercel.
 * No existe ningún valor por defecto en el código (el repositorio es público).
 * Si faltan o son valores comprometidos, el acceso admin se DESACTIVA (fail-closed).
 */
const COMPROMISED_VALUES = new Set([
  "soulmar123",
  "ryhkiX-tokro4-tugtef",
  "soulmar-sec-token-2026-ryhkiX-tokro4-tugtef",
])

// Subir esta versión invalida al instante TODAS las sesiones admin emitidas.
const SESSION_VERSION = "v2-2026-10-27"

function getMasterPassword(): string | null {
  let p = process.env.ADMIN_MASTER_PASSWORD
  if (!p) return null
  p = p.trim().replace(/[•\s]+$/, "")
  if (p.length < 12 || COMPROMISED_VALUES.has(p)) return null
  return p
}

function getSigningKey(): string | null {
  let s = process.env.NEXTAUTH_SECRET
  if (!s) return null
  s = s.trim().replace(/[•\s]+$/, "")
  if (COMPROMISED_VALUES.has(s)) return null
  return `${s}:${SESSION_VERSION}`
}

/** Comparación en tiempo constante (evita ataques de temporización). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest()
  const hb = createHash("sha256").update(b).digest()
  return timingSafeEqual(ha, hb)
}

function signToken(email: string, key: string): string {
  const payload = `${email}:${Date.now()}`
  const sig = createHmac("sha256", key).update(payload).digest("hex")
  return Buffer.from(`${payload}:${sig}`).toString("base64url")
}

export function verifyToken(token: string): string | null {
  const key = getSigningKey()
  if (!key) return null
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    const parts = decoded.split(":")
    if (parts.length < 3) return null
    const sig = parts.pop()!
    const payload = parts.join(":")
    const expected = createHmac("sha256", key).update(payload).digest("hex")
    if (!safeEqual(sig, expected)) return null
    // Check expiry (8 hours)
    const ts = parseInt(parts[1], 10)
    if (!Number.isFinite(ts) || Date.now() - ts > COOKIE_MAX_AGE * 1000) return null
    return parts[0] // email
  } catch {
    return null
  }
}

// POST /api/admin-auth → login
export async function POST(req: NextRequest) {
  const ip = getClientIp(req)

  // Anti fuerza bruta: máx. 5 intentos fallidos por IP cada 15 minutos
  const rl = rateLimit("admin-login", ip, 5, 15 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    )
  }

  const masterPassword = getMasterPassword()
  const signingKey = getSigningKey()
  if (!masterPassword || !signingKey) {
    console.error("[ADMIN_AUTH] Acceso deshabilitado: ADMIN_MASTER_PASSWORD (min. 12 caracteres) y NEXTAUTH_SECRET deben configurarse en Vercel.")
    return NextResponse.json(
      { error: "Acceso administrativo temporalmente deshabilitado por configuración de seguridad." },
      { status: 503 }
    )
  }

  try {
    const { email, password } = await req.json()
    const emailNorm = String(email || "").trim().toLowerCase()
    const passwordClean = String(password || "").trim().replace(/[•\s]+$/, "")
    const passwordOk = safeEqual(passwordClean, masterPassword)

    // Mensaje genérico: no revela si el correo existe en la lista blanca
    if (!ADMIN_WHITELIST.includes(emailNorm) || !passwordOk) {
      return NextResponse.json({ error: "Credenciales incorrectas." }, { status: 401 })
    }

    resetRateLimit("admin-login", ip)
    const token = signToken(emailNorm, signingKey)
    const res = NextResponse.json({ ok: true, email: emailNorm })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })
    return res
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}

// GET /api/admin-auth → check session
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })
  const email = verifyToken(token)
  if (!email || !ADMIN_WHITELIST.includes(email)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, email })
}

// DELETE /api/admin-auth → logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" })
  return res
}
