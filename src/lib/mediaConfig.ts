export type DeviceType = "desktop" | "mobile" | "tablet"

export interface DeviceSpec {
  label: string
  dimensions: string
  aspectRatio: string
  aspectClass: string
  recommendedNotice: string
  defaultUrl: string
}

export interface MediaSlot {
  key: string
  title: string
  section: string
  description: string
  defaultUrl: string
  // Compatibilidad legacy
  dimensions?: string
  aspectRatio?: string
  devices: {
    desktop: DeviceSpec
    mobile: DeviceSpec
    tablet: DeviceSpec
  }
}

export const MEDIA_DEVICES: {
  id: DeviceType
  title: string
  shortLabel: string
  subtitle: string
  iconName: "Monitor" | "Smartphone" | "Tablet"
  viewportNotice: string
}[] = [
  {
    id: "desktop",
    title: "Computador (PC)",
    shortLabel: "PC",
    subtitle: "Panorámico 16:9 / 21:9",
    iconName: "Monitor",
    viewportNotice: "Edición para pantallas grandes, monitores de escritorio y portátiles."
  },
  {
    id: "mobile",
    title: "Celular (Móvil)",
    shortLabel: "Celular",
    subtitle: "Vertical 9:16 / Táctil",
    iconName: "Smartphone",
    viewportNotice: "Edición vertical para smartphones (iPhone y Android) optimizada para scroll táctil."
  },
  {
    id: "tablet",
    title: "iPad (Tablet)",
    shortLabel: "iPad",
    subtitle: "Proporción 4:3 / Intermedia",
    iconName: "Tablet",
    viewportNotice: "Edición equilibrada para iPads, tabletas y pantallas táctiles medianas."
  }
]

export const MEDIA_SECTIONS: { id: string; title: string; description: string }[] = [
  {
    id: "hero",
    title: "Banners Principales (Hero)",
    description: "Los 3 banners cinematográficos destacados que dan la bienvenida al visitante en la parte superior."
  },
  {
    id: "moments",
    title: "Módulos 'Tu Momento' (YouTube / Series)",
    description: "Portadas de las 4 series temáticas (Ansiedad, Tristeza, Emunah, Mindset) con botón de reproducción de YouTube."
  },
  {
    id: "highlights",
    title: "Carrusel de Destacados",
    description: "Imágenes panorámicas de cursos, retiros y novedades de Soulmar."
  },
  {
    id: "mobile_cards",
    title: "Tarjetas de Terapias",
    description: "Tarjetas interactivas de servicios que rotan en la vitrina 3D."
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
  // ─── HERO BANNERS ──────────────────────────────────────────
  {
    key: "hero_slide_1",
    title: "Banner Principal 01",
    section: "hero",
    description: "Primer slide del hero (Enfoque Dra. Mariana Caicedo - Mi Herida, Mi Reacción)",
    defaultUrl: "/images/desktop-hero/slide-1.png",
    dimensions: "1920 × 760 px (PC) / 1080 × 1920 px (Móvil)",
    aspectRatio: "Panorámico (PC) / Vertical (Móvil)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 760 px",
        aspectRatio: "Panorámico 21:9 / 16:9",
        aspectClass: "aspect-[21/9]",
        recommendedNotice: "Banner horizontal ultra nítido optimizado para computadores y laptops.",
        defaultUrl: "/images/desktop-hero/slide-1.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Portada vertical de pantalla completa optimizada para smartphones.",
        defaultUrl: "/images/desktop-hero/slide-1.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 900 px",
        aspectRatio: "Proporción 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Encuadre balanceado para iPads y tabletas en orientación vertical u horizontal.",
        defaultUrl: "/images/desktop-hero/slide-1.png"
      }
    }
  },
  {
    key: "hero_slide_2",
    title: "Banner Principal 02",
    section: "hero",
    description: "Segundo slide del hero (Enfoque ¿Por qué sobrepienso todo?)",
    defaultUrl: "/images/desktop-hero/slide-2.jpg",
    dimensions: "1920 × 760 px (PC) / 1080 × 1920 px (Móvil)",
    aspectRatio: "Panorámico (PC) / Vertical (Móvil)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 760 px",
        aspectRatio: "Panorámico 21:9 / 16:9",
        aspectClass: "aspect-[21/9]",
        recommendedNotice: "Banner horizontal ultra nítido optimizado para computadores y laptops.",
        defaultUrl: "/images/desktop-hero/slide-2.jpg"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Portada vertical de pantalla completa optimizada para smartphones.",
        defaultUrl: "/images/desktop-hero/slide-2.jpg"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 900 px",
        aspectRatio: "Proporción 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Encuadre balanceado para iPads y tabletas en orientación vertical u horizontal.",
        defaultUrl: "/images/desktop-hero/slide-2.jpg"
      }
    }
  },
  {
    key: "hero_slide_3",
    title: "Banner Principal 03",
    section: "hero",
    description: "Tercer slide del hero (Enfoque Soulmar Podcast)",
    defaultUrl: "/images/desktop-hero/podcast.png",
    dimensions: "1920 × 760 px (PC) / 1080 × 1920 px (Móvil)",
    aspectRatio: "Panorámico (PC) / Vertical (Móvil)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 760 px",
        aspectRatio: "Panorámico 21:9 / 16:9",
        aspectClass: "aspect-[21/9]",
        recommendedNotice: "Banner horizontal ultra nítido optimizado para computadores y laptops.",
        defaultUrl: "/images/desktop-hero/podcast.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Portada vertical de pantalla completa optimizada para smartphones.",
        defaultUrl: "/images/desktop-hero/podcast.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 900 px",
        aspectRatio: "Proporción 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Encuadre balanceado para iPads y tabletas en orientación vertical u horizontal.",
        defaultUrl: "/images/desktop-hero/podcast.png"
      }
    }
  },

  // ─── MÓDULOS "TU MOMENTO" (SERIES YOUTUBE) ───────────────────
  {
    key: "moment_card_ansiedad",
    title: "Portada 'ANSIEDAD' (Tu Momento)",
    section: "moments",
    description: "Portada de la serie Ansiedad con la Dra. Mariana Caicedo en la sección 'Tu Momento'.",
    defaultUrl: "/images/desktop-modules/ansiedad.jpg",
    dimensions: "600 × 800 px (PC/iPad) / 450 × 600 px (Móvil)",
    aspectRatio: "Vertical 3:4",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en alta definición para la cuadrícula en monitores y laptops.",
        defaultUrl: "/images/desktop-modules/ansiedad.jpg"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "450 × 600 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada vertical optimizada para tarjetas táctiles en 2 columnas en teléfonos.",
        defaultUrl: "/images/mobile-modules/ansiedad.jpg"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en resolución intermedia para iPad y tabletas.",
        defaultUrl: "/images/desktop-modules/ansiedad.jpg"
      }
    }
  },
  {
    key: "moment_card_tristeza",
    title: "Portada 'TRISTEZA' (Tu Momento)",
    section: "moments",
    description: "Portada de la serie Tristeza / Depresión con la Dra. Mariana Caicedo en la sección 'Tu Momento'.",
    defaultUrl: "/images/desktop-modules/tristeza.png",
    dimensions: "600 × 800 px (PC/iPad) / 450 × 600 px (Móvil)",
    aspectRatio: "Vertical 3:4",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en alta definición para la cuadrícula en monitores y laptops.",
        defaultUrl: "/images/desktop-modules/tristeza.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "450 × 600 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada vertical optimizada para tarjetas táctiles en 2 columnas en teléfonos.",
        defaultUrl: "/images/mobile-modules/depresion.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en resolución intermedia para iPad y tabletas.",
        defaultUrl: "/images/desktop-modules/tristeza.png"
      }
    }
  },
  {
    key: "moment_card_emunah",
    title: "Portada 'EMUNAH' (Tu Momento)",
    section: "moments",
    description: "Portada de la serie Emunah con la Dra. Mariana Caicedo en la sección 'Tu Momento'.",
    defaultUrl: "/images/desktop-modules/emuna.png",
    dimensions: "600 × 800 px (PC/iPad) / 450 × 600 px (Móvil)",
    aspectRatio: "Vertical 3:4",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en alta definición para la cuadrícula en monitores y laptops.",
        defaultUrl: "/images/desktop-modules/emuna.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "450 × 600 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada vertical optimizada para tarjetas táctiles en 2 columnas en teléfonos.",
        defaultUrl: "/images/mobile-modules/emuna.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en resolución intermedia para iPad y tabletas.",
        defaultUrl: "/images/desktop-modules/emuna.png"
      }
    }
  },
  {
    key: "moment_card_mindset",
    title: "Portada 'MINDSET' (Tu Momento)",
    section: "moments",
    description: "Portada de la serie Mindset con la Dra. Mariana Caicedo en la sección 'Tu Momento'.",
    defaultUrl: "/images/desktop-modules/mindset.png",
    dimensions: "600 × 800 px (PC/iPad) / 450 × 600 px (Móvil)",
    aspectRatio: "Vertical 3:4",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en alta definición para la cuadrícula en monitores y laptops.",
        defaultUrl: "/images/desktop-modules/mindset.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "450 × 600 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada vertical optimizada para tarjetas táctiles en 2 columnas en teléfonos.",
        defaultUrl: "/images/mobile-modules/mindset.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "600 × 800 px",
        aspectRatio: "Vertical 3:4",
        aspectClass: "aspect-[3/4]",
        recommendedNotice: "Portada en resolución intermedia para iPad y tabletas.",
        defaultUrl: "/images/desktop-modules/mindset.png"
      }
    }
  },

  // ─── HIGHLIGHT CAROUSEL ───────────────────────────────────
  {
    key: "highlight_slide_1",
    title: "Carrusel Destacado 01",
    section: "highlights",
    description: "Primera imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER01.png",
    dimensions: "1920 × 625 px (PC)",
    aspectRatio: "Panorámico (~3:1)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 625 px",
        aspectRatio: "Panorámico ~3:1",
        aspectClass: "aspect-[1920/625]",
        recommendedNotice: "Banner panorámico horizontal de máxima anchura para PC.",
        defaultUrl: "/images/highlights/SLIDER01.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "800 × 600 px",
        aspectRatio: "Adaptable 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Imagen adaptada a pantalla táctil móvil sin cortes de texto.",
        defaultUrl: "/images/highlights/SLIDER01.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 600 px",
        aspectRatio: "Panorámico 2:1",
        aspectClass: "aspect-[2/1]",
        recommendedNotice: "Imagen adaptable para pantalla intermedia de tabletas.",
        defaultUrl: "/images/highlights/SLIDER01.png"
      }
    }
  },
  {
    key: "highlight_slide_2",
    title: "Carrusel Destacado 02",
    section: "highlights",
    description: "Segunda imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER02.png",
    dimensions: "1920 × 625 px (PC)",
    aspectRatio: "Panorámico (~3:1)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 625 px",
        aspectRatio: "Panorámico ~3:1",
        aspectClass: "aspect-[1920/625]",
        recommendedNotice: "Banner panorámico horizontal de máxima anchura para PC.",
        defaultUrl: "/images/highlights/SLIDER02.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "800 × 600 px",
        aspectRatio: "Adaptable 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Imagen adaptada a pantalla táctil móvil sin cortes de texto.",
        defaultUrl: "/images/highlights/SLIDER02.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 600 px",
        aspectRatio: "Panorámico 2:1",
        aspectClass: "aspect-[2/1]",
        recommendedNotice: "Imagen adaptable para pantalla intermedia de tabletas.",
        defaultUrl: "/images/highlights/SLIDER02.png"
      }
    }
  },
  {
    key: "highlight_slide_3",
    title: "Carrusel Destacado 03",
    section: "highlights",
    description: "Tercera imagen del carrusel interactivo ancho",
    defaultUrl: "/images/highlights/SLIDER03.png",
    dimensions: "1920 × 625 px (PC)",
    aspectRatio: "Panorámico (~3:1)",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1920 × 625 px",
        aspectRatio: "Panorámico ~3:1",
        aspectClass: "aspect-[1920/625]",
        recommendedNotice: "Banner panorámico horizontal de máxima anchura para PC.",
        defaultUrl: "/images/highlights/SLIDER03.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "800 × 600 px",
        aspectRatio: "Adaptable 4:3",
        aspectClass: "aspect-[4/3]",
        recommendedNotice: "Imagen adaptada a pantalla táctil móvil sin cortes de texto.",
        defaultUrl: "/images/highlights/SLIDER03.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1200 × 600 px",
        aspectRatio: "Panorámico 2:1",
        aspectClass: "aspect-[2/1]",
        recommendedNotice: "Imagen adaptable para pantalla intermedia de tabletas.",
        defaultUrl: "/images/highlights/SLIDER03.png"
      }
    }
  },

  // ─── TARJETAS DE TERAPIAS (PHONE MARQUEE) ─────────────────
  {
    key: "phone_card_1",
    title: "Tarjeta 1: Relaciones Sanas",
    section: "mobile_cards",
    description: "Tarjeta de terapia de parejas y relaciones sanas",
    defaultUrl: "/images/slider/phone-card-1.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-1.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-1.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-1.png"
      }
    }
  },
  {
    key: "phone_card_2",
    title: "Tarjeta 2: Tu Profesión Ideal",
    section: "mobile_cards",
    description: "Tarjeta de orientación vocacional y talento humano",
    defaultUrl: "/images/slider/phone-card-2.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-2.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-2.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-2.png"
      }
    }
  },
  {
    key: "phone_card_3",
    title: "Tarjeta 3: Encuentra tu Propósito",
    section: "mobile_cards",
    description: "Tarjeta de introspección y sentido de vida",
    defaultUrl: "/images/slider/phone-card-3.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-3.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-3.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-3.png"
      }
    }
  },
  {
    key: "phone_card_4",
    title: "Tarjeta 4: Transita la Depresión",
    section: "mobile_cards",
    description: "Tarjeta para superar episodios depresivos y duelo",
    defaultUrl: "/images/slider/phone-card-4.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-4.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-4.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-4.png"
      }
    }
  },
  {
    key: "phone_card_5",
    title: "Tarjeta 5: Gobierna la Ansiedad",
    section: "mobile_cards",
    description: "Tarjeta de regulación emocional y manejo de ansiedad",
    defaultUrl: "/images/slider/phone-card-5.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-5.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-5.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-5.png"
      }
    }
  },
  {
    key: "phone_card_6",
    title: "Tarjeta 6: Un Espacio Seguro",
    section: "mobile_cards",
    description: "Tarjeta de terapia individual confidencial",
    defaultUrl: "/images/slider/phone-card-6.png",
    dimensions: "576 × 1024 px",
    aspectRatio: "Vertical 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16 HD",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta vertical con mockup telefónico para monitores.",
        defaultUrl: "/images/slider/phone-card-6.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta táctil de alta definición para teléfonos.",
        defaultUrl: "/images/slider/phone-card-6.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "576 × 1024 px",
        aspectRatio: "Vertical 9:16",
        aspectClass: "aspect-[9/16]",
        recommendedNotice: "Tarjeta interactiva para tabletas.",
        defaultUrl: "/images/slider/phone-card-6.png"
      }
    }
  },

  // ─── REDES SOCIALES & REELS ───────────────────────────────
  {
    key: "social_post_1",
    title: "Reel 1: Mi Herida, Mi Reacción",
    section: "social",
    description: "Portada del primer reel de la comunidad Soulmar",
    defaultUrl: "/images/mobile-hero/slide-1.jpg",
    dimensions: "1080 × 1920 px",
    aspectRatio: "Vertical 9:14 / 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14 (HD)",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada de Reel de alta calidad para feed de escritorio.",
        defaultUrl: "/images/mobile-hero/slide-1.jpg"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical optimizada para pantalla de celular.",
        defaultUrl: "/images/mobile-hero/slide-1.jpg"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical para visualización en tablet.",
        defaultUrl: "/images/mobile-hero/slide-1.jpg"
      }
    }
  },
  {
    key: "social_post_2",
    title: "Post 2: ¿Por Qué Sobrepienso Todo?",
    section: "social",
    description: "Portada de la segunda publicación de la comunidad",
    defaultUrl: "/images/mobile-hero/slide-2.png",
    dimensions: "1080 × 1920 px",
    aspectRatio: "Vertical 9:14 / 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14 (HD)",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada de Post de alta calidad para feed de escritorio.",
        defaultUrl: "/images/mobile-hero/slide-2.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical optimizada para pantalla de celular.",
        defaultUrl: "/images/mobile-hero/slide-2.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical para visualización en tablet.",
        defaultUrl: "/images/mobile-hero/slide-2.png"
      }
    }
  },
  {
    key: "social_post_3",
    title: "Reel 3: Tu Sesión Psicológica a un Clic",
    section: "social",
    description: "Portada del tercer reel de la comunidad",
    defaultUrl: "/images/mobile-hero/slide-3.png",
    dimensions: "1080 × 1920 px",
    aspectRatio: "Vertical 9:14 / 9:16",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14 (HD)",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada de Reel de alta calidad para feed de escritorio.",
        defaultUrl: "/images/mobile-hero/slide-3.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical optimizada para pantalla de celular.",
        defaultUrl: "/images/mobile-hero/slide-3.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "1080 × 1920 px",
        aspectRatio: "Vertical 9:14",
        aspectClass: "aspect-[9/14]",
        recommendedNotice: "Portada vertical para visualización en tablet.",
        defaultUrl: "/images/mobile-hero/slide-3.png"
      }
    }
  },

  // ─── EQUIPO CLÍNICO & TERAPEUTAS ──────────────────────────
  {
    key: "therapist_mariana",
    title: "Dra. Mariana Caicedo (Psicóloga)",
    section: "team",
    description: "Foto de perfil de la psicóloga en la caja de agendamiento y confirmación",
    defaultUrl: "/images/therapists/mariana.png",
    dimensions: "640 × 640 px",
    aspectRatio: "Cuadrado 1:1",
    devices: {
      desktop: {
        label: "Versión Computador (PC)",
        dimensions: "640 × 640 px",
        aspectRatio: "Cuadrado 1:1 HD",
        aspectClass: "aspect-square",
        recommendedNotice: "Foto de perfil de alta definición para vista en monitor.",
        defaultUrl: "/images/therapists/mariana.png"
      },
      mobile: {
        label: "Versión Celular (Móvil)",
        dimensions: "480 × 480 px",
        aspectRatio: "Cuadrado 1:1",
        aspectClass: "aspect-square",
        recommendedNotice: "Foto de perfil optimizada para pantalla de teléfono móvil.",
        defaultUrl: "/images/therapists/mariana.png"
      },
      tablet: {
        label: "Versión iPad (Tablet)",
        dimensions: "640 × 640 px",
        aspectRatio: "Cuadrado 1:1",
        aspectClass: "aspect-square",
        recommendedNotice: "Foto de perfil en resolución intermedia para iPad.",
        defaultUrl: "/images/therapists/mariana.png"
      }
    }
  }
]

/**
 * Obtiene la clave de almacenamiento específica para un dispositivo.
 * Ejemplo: "hero_slide_1" + "mobile" => "hero_slide_1_mobile"
 */
export function getSlotDeviceKey(baseKey: string, device: DeviceType): string {
  return `${baseKey}_${device}`
}
