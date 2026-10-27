import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Terapia en Ansiedad - Dra. Mariana Caicedo | Soulmar",
  description:
    "Terapia online especializada en ansiedad y sobrepensamiento con la Dra. Mariana Caicedo. Metodología basada en evidencia (TCC y ACT) para calmar tu sistema nervioso y recuperar el control.",
  alternates: {
    canonical: "/terapia-ansiedad",
  },
  openGraph: {
    title: "Terapia en Ansiedad - Dra. Mariana Caicedo | Soulmar",
    description:
      "Herramientas clínicas para comprender y gestionar la ansiedad desde adentro. Sesiones privadas 100% online.",
    url: "https://www.soulmar.org/terapia-ansiedad",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function TerapiaAnsiedadPage() {
  const service = SERVICES_DATA["terapia-ansiedad"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
