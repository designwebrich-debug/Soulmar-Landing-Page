import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Valoración Psicológica Integral - Dra. Mariana Caicedo | Soulmar",
  description:
    "Evaluación psicológica científica con pruebas psicométricas estandarizadas internacionales y entrega de informe formal. Conoce con precisión tu diagnóstico y hoja de ruta clínica.",
  alternates: {
    canonical: "/valoracion-psicologica",
  },
  openGraph: {
    title: "Valoración Psicológica Integral - Dra. Mariana Caicedo | Soulmar",
    description:
      "Evaluaciones clínicas que te ayudan a conocerte mejor, entender tus patrones y obtener un informe clínico profesional.",
    url: "https://www.soulmar.org/valoracion-psicologica",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function ValoracionPsicologicaPage() {
  const service = SERVICES_DATA["valoracion-psicologica"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
