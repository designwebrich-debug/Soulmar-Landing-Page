import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// ─────────────────────────────────────────────────────────────
// LISTA BLANCA DE ADMINISTRADORES (hardcoded + env override)
// ─────────────────────────────────────────────────────────────
const HARDCODED_WHITELIST = ["designwebrich@gmail.com", "soulmar.org@gmail.com"]

function getWhitelist(): string[] {
  const envList = process.env.ADMIN_WHITELIST
  if (envList && envList.trim().length > 0) {
    return envList.split(",").map(e => e.trim().toLowerCase())
  }
  return HARDCODED_WHITELIST.map(e => e.toLowerCase())
}

// ─────────────────────────────────────────────────────────────
// CONTRASEÑA MAESTRA DE BYPASS (independiente de Supabase)
// ─────────────────────────────────────────────────────────────
const MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD || "soulmar123"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        // Validar que vengan credenciales
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const emailNormalized = credentials.email.trim().toLowerCase()
        const whitelist = getWhitelist()

        // 1. Verificar lista blanca
        if (!whitelist.includes(emailNormalized)) {
          console.warn("[AUTH] Correo no autorizado:", emailNormalized)
          return null
        }

        // 2. Bypass con contraseña maestra — NO depende de Supabase
        //    Funciona en desarrollo Y producción sin ninguna DB externa
        if (credentials.password === MASTER_PASSWORD) {
          console.log("[AUTH] ✅ Bypass activado para:", emailNormalized)
          return {
            id: "soulmar-admin-bypass",
            name: "Cuenta Administrador",
            email: emailNormalized,
          }
        }

        // 3. Si la contraseña no es la maestra, denegar acceso
        console.warn("[AUTH] Contraseña incorrecta para:", emailNormalized)
        return null
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false
      const whitelist = getWhitelist()
      const allowed = whitelist.includes(user.email.trim().toLowerCase())
      if (!allowed) {
        console.warn("[AUTH] signIn bloqueado para:", user.email)
      }
      return allowed
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      if (user) {
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },

  secret: process.env.NEXTAUTH_SECRET || "soulmar-fallback-secret-2026",

  pages: {
    signIn: "/portal-secreto-soulmar-77312",
    error: "/portal-secreto-soulmar-77312",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
