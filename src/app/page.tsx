import dynamic from "next/dynamic"
import type { Metadata } from "next"
import { CinemaHero } from "@/components/home/CinemaHero"

export const metadata: Metadata = {
  title: "Soulmar | Psicología, Meditación y Bienestar Radical",
  description: "Descubre una plataforma diseñada para tu salud mental. Cursos de psicología, objetos de diseño minimalista y una comunidad enfocada en la calma.",
}

// Dynamic imports for below-the-fold or heavy components
const ServicesSection = dynamic(() => import("@/components/home/ServicesSection").then(mod => mod.ServicesSection))
const AgendamientoSection = dynamic(() => import("@/components/home/AgendamientoSection").then(mod => mod.AgendamientoSection))
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection").then(mod => mod.TestimonialsSection))
const NewsletterSection = dynamic(() => import("@/components/home/NewsletterSection").then(mod => mod.NewsletterSection))
const FooterSection = dynamic(() => import("@/components/home/FooterSection").then(mod => mod.FooterSection))

export default function Home() {
  return (
    <div className="flex flex-col gap-0 pt-0">
      {/* SECTION 0: CINEMATIC HERO (Director's Cut) */}
      <CinemaHero />

      {/* SECTION 1: SERVICES (Includes Highlight Carousel nested inside) */}
      <ServicesSection />
  
      {/* SECTION 3: INTEGRATED PREMIUM BOOKING SECTION (In-Situ) */}
      <AgendamientoSection />

      {/* SECTION 5: TESTIMONIALS (Apple Music Style Highlights) */}
      <TestimonialsSection />

      {/* SECTION 6: NEWSLETTER (Cinematic Brand Dynamic) */}
      <NewsletterSection />

      {/* FOOTER */}
      <FooterSection />
    </div>
  );
}
