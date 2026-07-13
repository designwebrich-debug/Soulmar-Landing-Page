import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
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
      // Si hay cuenta, guardamos el token de acceso por si se requiere en el futuro
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
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
