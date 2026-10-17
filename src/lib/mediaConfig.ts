export interface MediaSlot {
  key: string
  title: string
  section: string
  dimensions: string
  aspectRatio: string
  description: string
  defaultUrl: string
}

export const MEDIA_SECTIONS: { id: string; title: string; description: string }[] = [
  {
    id: "hero",
    title: "Banners Principales (Hero)",
    description: "Los 3 banners cinematográficos que dan la bienvenida al visitante en la parte superior."
  },
  {
    id: "highlights",
    title: "Carrusel de Destacados",
    description: "Imágenes panorámicas de cursos, retiros y novedades de Soulmar."
  },
  {
    id: "mobile_cards",
    title: "Tarjetas Móviles de Terapias",
    description: "Tarjetas verticales de servicios que rotan en la sección interactiva móvil."
  },
  {
    id: "social",
    title: "Comunidad & Redes Sociales",
    description: "Portadas de los reels y publicaciones de Instagram y TikTok."
  },
  {
    id: "team",
    title: "Terapeutas y Equipo Clínico",
    description: "Fotografías de perfil de los profesionales clínicos en la sección de agendamiento."
  }
]

export const MEDIA_SLOTS: MediaSlot[] = [
  // Hero Banners
  {
    key: "hero_slide_1",
    title: "Banner Principal 01",
    section: "hero",
    dimensions: "1440 x 760 px",
    aspectRatio: "16:9 o 1.89:1",
    description: "Primer slide del banner hero (Enfoque Terapia Online y Bienestar)",
    defaultUrl: "/images/BannerHero01.jpg"
  },
  {
    key: "hero_slide_2",
    title: "Banner Principal 02",
    section: "hero",
    dimensions: "1440 x 760 px",
    aspectRatio: "16:9 o 1.89:1",
    description: "Segundo slide del banner hero (Enfoque Retiros y Comunidad)",
    defaultUrl: "/images/BannerHero03.jpg"
  },
  {
    key: "hero_slide_3",
    title: "Banner Principal 03",
    section: "hero",
    dimensions: "1440 x 760 px",
    aspectRatio: "16:9 o 1.89:1",
    description: "Tercer slide del banner hero (Enfoque Sanación y Crecimiento)",
    defaultUrl: "/images/BannerHero02.jpg"
  },

  // Highlight Carousel
  {
    key: "highlight_slide_1",
    title: "Carrusel Destacado 01",
    section: "highlights",
    dimensions: "1920 x 625 px",
    aspectRatio: "Panorámico (~3:1)",
    description: "Primera imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER01.png"
  },
  {
    key: "highlight_slide_2",
    title: "Carrusel Destacado 02",
    section: "highlights",
    dimensions: "1920 x 625 px",
    aspectRatio: "Panorámico (~3:1)",
    description: "Segunda imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER02.png"
  },
  {
    key: "highlight_slide_3",
    title: "Carrusel Destacado 03",
    section: "highlights",
    dimensions: "1920 x 625 px",
    aspectRatio: "Panorámico (~3:1)",
    description: "Tercera imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER03.png"
  },

  // Phone Cards
  {
    key: "phone_card_1",
    title: "Tarjeta 1: Relaciones Sanas",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta de terapia de parejas y relaciones sanas",
    defaultUrl: "/images/slider/phone-card-1.png"
  },
  {
    key: "phone_card_2",
    title: "Tarjeta 2: Tu Profesión Ideal",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta de orientación vocacional y talento humano",
    defaultUrl: "/images/slider/phone-card-2.png"
  },
  {
    key: "phone_card_3",
    title: "Tarjeta 3: Encuentra tu Propósito",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta de introspección y sentido de vida",
    defaultUrl: "/images/slider/phone-card-3.png"
  },
  {
    key: "phone_card_4",
    title: "Tarjeta 4: Transita la Depresión",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta para superar episodios depresivos y duelo",
    defaultUrl: "/images/slider/phone-card-4.png"
  },
  {
    key: "phone_card_5",
    title: "Tarjeta 5: Gobierna la Ansiedad",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta de regulación emocional y manejo de ansiedad",
    defaultUrl: "/images/slider/phone-card-5.png"
  },
  {
    key: "phone_card_6",
    title: "Tarjeta 6: Un Espacio Seguro",
    section: "mobile_cards",
    dimensions: "576 x 1024 px",
    aspectRatio: "Vertical 9:16",
    description: "Tarjeta de terapia individual confidencial",
    defaultUrl: "/images/slider/phone-card-6.png"
  },

  // Social Reels
  {
    key: "social_post_1",
    title: "Reel 1: Mi Herida, Mi Reacción",
    section: "social",
    dimensions: "1080 x 1920 px",
    aspectRatio: "Vertical 9:16",
    description: "Portada del primer reel de la sección comunidad",
    defaultUrl: "/images/mobile-hero/slide-1.jpg"
  },
  {
    key: "social_post_2",
    title: "Post 2: ¿Por Qué Sobrepienso Todo?",
    section: "social",
    dimensions: "1080 x 1920 px",
    aspectRatio: "Vertical 9:16",
    description: "Portada de la segunda publicación de la comunidad",
    defaultUrl: "/images/mobile-hero/slide-2.png"
  },
  {
    key: "social_post_3",
    title: "Reel 3: Tu Sesión Psicológica a un Clic",
    section: "social",
    dimensions: "1080 x 1920 px",
    aspectRatio: "Vertical 9:16",
    description: "Portada del tercer reel de la sección comunidad",
    defaultUrl: "/images/mobile-hero/slide-3.png"
  },

  // Team
  {
    key: "therapist_mariana",
    title: "Dra. Mariana Caicedo (Psicóloga)",
    section: "team",
    dimensions: "640 x 640 px",
    aspectRatio: "Cuadrado 1:1",
    description: "Foto de perfil de la psicóloga en la caja de agendamiento",
    defaultUrl: "/images/therapists/mariana.png"
  }
]
