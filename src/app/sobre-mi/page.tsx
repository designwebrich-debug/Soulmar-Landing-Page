import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SobreMiPage } from "@/components/about/SobreMiPage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Mariana Caicedo | Psicóloga en Soulmar",
  description:
    "Conoce a Mariana Caicedo Quintero, psicóloga graduada de la Universidad El Bosque y fundadora de Soulmar. Psicoterapia individual basada en evidencia científica y calidez humana.",
  alternates: {
    canonical: "https://www.soulmar.org/sobre-mi",
  },
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

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mariana Caicedo Quintero",
    jobTitle: "Psicóloga",
    worksFor: {
      "@type": "Organization",
      name: "Soulmar",
      url: "https://www.soulmar.org",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad El Bosque",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogotá",
      addressCountry: "CO",
    },
    url: "https://www.soulmar.org/sobre-mi",
    description:
      "Psicóloga clínica graduada de la Universidad El Bosque y fundadora de Soulmar. Acompañamiento psicoterapéutico individual online basado en evidencia y calidez humana.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SobreMiPage />
    </>
  )
}
