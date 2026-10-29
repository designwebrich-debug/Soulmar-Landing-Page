import type { Metadata } from "next"
import { CinemaHero } from "@/components/home/CinemaHero"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Terapia Online - Dra. Mariana Caicedo | Psicóloga Clínica",
  description: "Terapia online con la Dra. Mariana Caicedo, psicóloga clínica. Un espacio cálido y confidencial para acompañarte en tu proceso de bienestar emocional. Agenda tu sesión.",
}

import { ServicesSection } from "@/components/home/ServicesSection"
import { HowToStartSection } from "@/components/home/HowToStartSection"
import { AgendamientoSection } from "@/components/home/AgendamientoSection"
import { FAQSection } from "@/components/home/FAQSection"
import { SocialCommunitySection } from "@/components/home/SocialCommunitySection"
import { EbookSection } from "@/components/home/EbookSection"
import { CTASection } from "@/components/home/CTASection"
import { FooterSection } from "@/components/home/FooterSection"

export default function Home() {
  return (
    <div className="flex flex-col gap-0 pt-0">
      {/* SECTION 0: CINEMATIC HERO (Director's Cut) */}
      <CinemaHero />

      {/* SECTION 1: SERVICES (Includes Highlight Carousel nested inside) */}
      <ServicesSection />
  
      {/* SECTION 2: HOW TO START (Laptop Video + 7 Steps) */}
      <HowToStartSection />

      {/* SECTION 3: INTEGRATED PREMIUM BOOKING SECTION (In-Situ) */}
      <AgendamientoSection />

      {/* SECTION 4: PREGUNTAS FRECUENTES (FAQ Apple Interactive Accordion) */}
      <FAQSection />

      {/* SECTION 5: SOULMAR COMMUNITY (Apple iOS Widgets + Cinematic Reels Feed) */}
      <SocialCommunitySection />

      {/* SECTION 5.5: EBOOKS (Soulmar Free Resources) */}
      <EbookSection />

      {/* SECTION 6: CTA FINAL (Tu Bienestar Empieza con una Decisión) */}
      <CTASection />

      {/* FOOTER */}
      <FooterSection />
    </div>
  );
}
