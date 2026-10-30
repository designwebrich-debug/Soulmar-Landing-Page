import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SobreMiPage } from "@/components/about/SobreMiPage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function Page() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("192.168.")

  // Oculto en producción para usuarios reales mientras se termina de corregir información
  if (!isLocalhost && process.env.NODE_ENV === "production") {
    redirect("/#caja-agendamiento")
  }

  return <SobreMiPage />
}
