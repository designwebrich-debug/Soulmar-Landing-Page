import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"

const ADMIN_WHITELIST = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]
const MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD || "soulmar123"
const SECRET = process.env.NEXTAUTH_SECRET || "soulmar-secreto-super-secreto-2026-xyz-admin-jwt"
const COOKIE_NAME = "soulmar_admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 horas

function signToken(email: string): string {
  const payload = `${email}:${Date.now()}`
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex")
  return Buffer.from(`${payload}:${sig}`).toString("base64url")
}

function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8")
    const parts = decoded.split(":")
    if (parts.length < 3) return null
    const sig = parts.pop()!
    const payload = parts.join(":")
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex")
    if (sig !== expected) return null
    // Check expiry (8 hours)
    const ts = parseInt(parts[1], 10)
    if (Date.now() - ts > COOKIE_MAX_AGE * 1000) return null
    return parts[0] // email
  } catch {
    return null
  }
}

// POST /api/admin-auth → login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const emailNorm = (email || "").trim().toLowerCase()

    if (!ADMIN_WHITELIST.includes(emailNorm)) {
      return NextResponse.json({ error: "Correo no autorizado." }, { status: 401 })
    }
    if (password !== MASTER_PASSWORD) {
      return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 })
    }

    const token = signToken(emailNorm)
    const res = NextResponse.json({ ok: true, email: emailNorm })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
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
  if (!email) return NextResponse.json({ authenticated: false }, { status: 401 })
  return NextResponse.json({ authenticated: true, email })
}

// DELETE /api/admin-auth → logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" })
  return res
}
