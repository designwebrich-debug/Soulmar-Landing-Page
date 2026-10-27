import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Terapia Individual Online - Dra. Mariana Caicedo | Soulmar",
  description:
    "Terapia individual online con la Dra. Mariana Caicedo. Un espacio de 60 minutos solo para ti para explorar tu mundo interno, sanar heridas del pasado y florecer con autenticidad.",
  alternates: {
    canonical: "/terapia-individual",
  },
  openGraph: {
    title: "Terapia Individual Online - Dra. Mariana Caicedo | Soulmar",
    description:
      "Un espacio de una hora, solo para ti, para hablar de lo que estás viviendo con una profesional de excelencia.",
    url: "https://www.soulmar.org/terapia-individual",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function TerapiaIndividualPage() {
  const service = SERVICES_DATA["terapia-individual"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
