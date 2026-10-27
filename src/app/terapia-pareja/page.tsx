import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Terapia de Pareja Online - Dra. Mariana Caicedo | Soulmar",
  description:
    "Terapia de pareja online con la Dra. Mariana Caicedo. Desarma los ciclos destructivos de discusión, sana heridas de apego y reconstruye la intimidad y comunicación consciente.",
  alternates: {
    canonical: "/terapia-pareja",
  },
  openGraph: {
    title: "Terapia de Pareja Online - Dra. Mariana Caicedo | Soulmar",
    description:
      "Un espacio compartido para reconectar, sanar y construir desde el diálogo seguro. Sesiones conjuntas online.",
    url: "https://www.soulmar.org/terapia-pareja",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function TerapiaParejaPage() {
  const service = SERVICES_DATA["terapia-pareja"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
