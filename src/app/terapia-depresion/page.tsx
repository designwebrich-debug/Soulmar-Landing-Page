import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function TerapiaDepresionPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const isLocalhost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("192.168.")

  // Oculto en producción para usuarios reales (trabajo en borrador en localhost)
  if (!isLocalhost && process.env.NODE_ENV === "production") {
    redirect("/#servicios")
  }

  const service = SERVICES_DATA["terapia-depresion"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
