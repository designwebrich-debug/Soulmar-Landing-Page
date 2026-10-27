import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ServiceDetailPage } from "@/components/services/ServiceDetailPage"
import { SERVICES_DATA } from "@/data/servicesData"

export const metadata: Metadata = {
  title: "Gestión Emocional & Habilidades DBT - Dra. Mariana Caicedo | Soulmar",
  description:
    "Aprende a comprender, autorregular y transformar tus emociones sin reprimirte ni explotar. Entrenamiento clínico basado en Terapia Dialéctico-Conductual con la Dra. Mariana Caicedo.",
  alternates: {
    canonical: "/gestion-emocional",
  },
  openGraph: {
    title: "Gestión Emocional & Habilidades DBT - Dra. Mariana Caicedo | Soulmar",
    description:
      "Herramientas prácticas y clínicamente guiadas para comprender, autorregular y transformar tus emociones.",
    url: "https://www.soulmar.org/gestion-emocional",
    siteName: "Soulmar",
    type: "website",
  },
}

export default function GestionEmocionalPage() {
  const service = SERVICES_DATA["gestion-emocional"]
  if (!service) notFound()

  return <ServiceDetailPage service={service} />
}
