import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Terapia en Depresión - Dra. Mariana Caicedo | Soulmar",
  description:
    "Acompañamiento clínico especializado en depresión y pérdida de sentido con la Dra. Mariana Caicedo. Activación conductual basada en evidencia y calidez humana paso a paso.",
  alternates: {
    canonical: "/terapia-depresion",
  },
  openGraph: {
    title: "Terapia en Depresión - Dra. Mariana Caicedo | Soulmar",
    description:
      "Acompañamiento clínico especializado para transitar la depresión con apoyo profesional y sin juicios.",
    url: "https://www.soulmar.org/terapia-depresion",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function TerapiaDepresionPage() {
  const service = SERVICES_DATA["terapia-depresion"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
