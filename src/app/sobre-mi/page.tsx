import type { Metadata } from "next"
import { SobreMiPage } from "@/components/about/SobreMiPage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Sobre mí - Dra. Mariana Caicedo Quintero | Psicóloga Clínica",
  description: "Conoce la trayectoria, formación académica y credenciales clínicas de la Dra. Mariana Caicedo Quintero (Tarjeta Prof. COLPSIC No. 248910). Enfoque Cognitivo-Conductual (TCC), terapias de 3ª generación y acompañamiento psicológico online.",
  alternates: {
    canonical: "https://www.soulmar.org/sobre-mi",
  },
  openGraph: {
    title: "Dra. Mariana Caicedo Quintero - Psicóloga Clínica | Soulmar",
    description: "Psicología clínica basada en evidencia científica, calidez humana y confidencialidad absoluta. Conoce mi formación, tarjeta profesional y enfoque terapéutico.",
    url: "https://www.soulmar.org/sobre-mi",
    siteName: "Soulmar",
    images: [
      {
        url: "/images/therapists/mariana.png",
        width: 640,
        height: 640,
        alt: "Dra. Mariana Caicedo Quintero - Psicóloga Clínica",
      },
    ],
    locale: "es_CO",
    type: "profile",
  },
}

export default function Page() {
  return <SobreMiPage />
}
