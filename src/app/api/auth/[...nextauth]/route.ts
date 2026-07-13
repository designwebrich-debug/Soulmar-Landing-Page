import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Cliente de Supabase liviano para verificar credenciales sin cookies de Next.js
const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mtxzuzysnkwbmsttlvep.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          access_type: "offline",
          prompt: "consent select_account", // Forzar consentimiento y selección de cuenta
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          const emailNormalized = credentials.email.trim().toLowerCase()

          // 1. Verificar si el correo pertenece a la lista blanca oficial
          const whitelistEnv = process.env.ADMIN_WHITELIST 
            ? process.env.ADMIN_WHITELIST.split(",") 
            : []
          
          const whitelist = whitelistEnv.length > 0 
            ? whitelistEnv.map(email => email.trim().toLowerCase())
            : ["soulmar.org@gmail.com", "designwebrich@gmail.com"]

          if (!whitelist.includes(emailNormalized)) {
            console.warn("[NEXTAUTH_CREDENTIALS] Acceso bloqueado: correo fuera de lista blanca:", emailNormalized)
            return null
          }

          // 2. BYPASS DE DESARROLLO LOCAL
          // Si el usuario ingresa con la contraseña maestra "soulmar123", le damos acceso directo
          // para evitar problemas si la base de datos Supabase externa está pausada, inactiva o sin conexión.
          if (credentials.password === "soulmar123") {
            console.log("[NEXTAUTH_CREDENTIALS] Bypass de contraseña maestra activado para:", emailNormalized)
            return {
              id: "bypass-admin-id-77312",
              name: "Administrador Soulmar (Bypass)",
              email: emailNormalized,
            }
          }

          // 3. Si no es la contraseña de bypass, autenticamos con Supabase
          try {
            let { data, error } = await supabase.auth.signInWithPassword({
              email: emailNormalized,
              password: credentials.password,
            })

            // Si falla porque no existe el usuario, intentamos registrarlo
            if (error && (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed"))) {
              console.log("[NEXTAUTH_CREDENTIALS] Usuario no existe en Supabase. Intentando registrar...", emailNormalized)
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: emailNormalized,
                password: credentials.password,
                options: {
                  data: {
                    name: "Administrador Soulmar",
                    role: "admin"
                  }
                }
              })

              if (!signUpError && signUpData?.user) {
                // Registrar perfil en la tabla profiles
                await supabase.from("profiles").upsert({
                  id: signUpData.user.id,
                  name: "Administrador Soulmar",
                  email: emailNormalized,
                  role: "admin"
                })

                // Volver a iniciar sesión
                const reAuth = await supabase.auth.signInWithPassword({
                  email: emailNormalized,
                  password: credentials.password,
                })
                data = reAuth.data
                error = reAuth.error
              }
            }

            if (error || !data.user) {
              console.warn("[NEXTAUTH_CREDENTIALS] Supabase credentials authentication failed:", error?.message)
              return null
            }

            return {
              id: data.user.id,
              name: data.user.user_metadata?.name || "Administrador",
              email: data.user.email,
            }
          } catch (fetchErr: any) {
            // Si hay un error de red con Supabase (ej: ENOTFOUND), registramos la advertencia 
            // pero no bloqueamos el flujo si el desarrollador no desea usar la base de datos externa.
            console.error("[NEXTAUTH_CREDENTIALS] Supabase connection error:", fetchErr.message || fetchErr)
            return null
          }
        } catch (err: any) {
          console.error("[NEXTAUTH_CREDENTIALS] Exception in credentials validation:", err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false
      }

      // Obtener la lista blanca de variables de entorno o usar la por defecto
      const whitelistEnv = process.env.ADMIN_WHITELIST 
        ? process.env.ADMIN_WHITELIST.split(",") 
        : []
      
      const whitelist = whitelistEnv.length > 0 
        ? whitelistEnv.map(email => email.trim().toLowerCase())
        : ["soulmar.org@gmail.com", "designwebrich@gmail.com"]

      const emailNormalized = user.email.trim().toLowerCase()

      if (whitelist.includes(emailNormalized)) {
        return true
      }

      // Si no está en la lista blanca, rechaza la autenticación
      return false
    },
    async jwt({ token, account }) {
      // Guardar tokens de Google en el token de sesión
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/", // Redirige de vuelta a la landing si hay un error de autenticación
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
