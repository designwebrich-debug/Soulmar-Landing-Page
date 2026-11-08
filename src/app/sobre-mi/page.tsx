import type { Metadata } from "next"
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
    index: true,
    follow: true,
  },
}

export default async function Page() {
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
