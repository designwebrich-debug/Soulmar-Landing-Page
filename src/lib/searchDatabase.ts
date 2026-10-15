export interface SearchItem {
  id: string
  title: string
  subtitle?: string
  description: string
  category: "servicio" | "agendamiento" | "ebook" | "recurso" | "redes" | "podcast"
  targetId?: string
  href?: string
  keywords: string[]
  badge?: string
}

export const SOULMAR_SEARCH_DATABASE: SearchItem[] = [
  // SERVICIOS CLÍNICOS
  {
    id: "serv-ansiedad",
    title: "Terapia para Ansiedad y Estrés",
    subtitle: "Dra. Mariana Caicedo • Psicología Clínica",
    description: "Herramientas clínicas personalizadas para regular el sistema nervioso, calmar ataques de pánico y superar la ansiedad.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "ansiedad", "ansioso", "ansiosa", "nervios", "panico", "ataques de panico", "miedo", "estres", 
      "burnout", "taquicardia", "tension", "preocupacion", "insomnio", "calma", "tranquilidad", "respiracion",
      "angustia", "sobrepensar", "sobrepensando", "anxiety"
    ],
    badge: "Especialidad Clínica"
  },
  {
    id: "serv-depresion",
    title: "Terapia para la Depresión y Desánimo",
    subtitle: "Acompañamiento Clínico Especializado",
    description: "Espacio seguro para transitar el vacío, la tristeza profunda, la falta de sentido y reconstruir tu energía vital.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "depresion", "deprimido", "deprimida", "tristeza", "triste", "llorar", "vacio", "desanimo", 
      "duelo", "soledad", "apatia", "sin ganas", "desesperanza", "sentido de vida", "melancolia", "depression"
    ],
    badge: "Acompañamiento"
  },
  {
    id: "serv-individual",
    title: "Terapia Psicológica Individual Online",
    subtitle: "Sesión 1 a 1 de 60 minutos",
    description: "Espacio confidencial para escucharte, ordenar tus emociones y avanzar a tu propio ritmo sin juicios.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "terapia", "psicoterapia", "individual", "psicologa", "consulta", "sesion", "sesiones", 
      "psicologo", "terapeuta", "acompañamiento", "hablar", "desahogo", "ayuda", "apoyo"
    ],
    badge: "1 a 1"
  },
  {
    id: "serv-pareja",
    title: "Terapia de Pareja y Vínculos",
    subtitle: "Reconectar, Dialogar y Sanar Juntos",
    description: "Acompañamiento para superar conflictos, mejorar la comunicación afectiva, celos, infidelidad y acuerdos de pareja.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "pareja", "parejas", "matrimonio", "esposo", "esposa", "novio", "novia", "amor", "ruptura", 
      "separacion", "divorcio", "celos", "comunicacion", "pelea", "discusion", "infidelidad", "vinculo"
    ],
    badge: "Vínculos"
  },
  {
    id: "serv-emocional",
    title: "Gestión e Inteligencia Emocional",
    subtitle: "Autorregulación y Claridad Mental",
    description: "Aprende a comprender lo que sientes, gestionar la ira, la culpa, la frustración y la hipersensibilidad.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "emocion", "emociones", "ira", "rabia", "culpa", "frustracion", "inteligencia emocional", 
      "autorregulacion", "sensibilidad", "llanto", "tolerancia", "impulsividad"
    ],
    badge: "Habilidades"
  },
  {
    id: "serv-valoracion",
    title: "Valoración Psicológica Integral",
    subtitle: "Diagnóstico Clínico y Patrones",
    description: "Evaluaciones clínicas orientadas a entender a fondo tus patrones conductuales, emocionales y de personalidad.",
    category: "servicio",
    targetId: "servicios",
    keywords: [
      "valoracion", "evaluacion", "diagnostico", "patrones", "personalidad", "test", "perfil", 
      "conocerse", "autoconocimiento"
    ],
    badge: "Evaluación"
  },

  // AGENDAMIENTO Y RESERVAS
  {
    id: "agenda-cita",
    title: "Agendar Cita / Reservar Sesión",
    subtitle: "Disponibilidad Inmediata en Calendario",
    description: "Reserva tu sesión online directamente en nuestro sistema interactivo de citas.",
    category: "agendamiento",
    targetId: "agendamiento",
    keywords: [
      "cita", "citas", "agendar", "agenda", "reserva", "reservar", "horario", "horarios", 
      "calendario", "disponible", "disponibilidad", "precio", "costo", "valor", "cuanto vale", 
      "cuanto cuesta", "pagar", "pago", "sesion hoy", "tarifa"
    ],
    badge: "Reservas"
  },
  {
    id: "agenda-mariana",
    title: "Perfil Clínico: Dra. Mariana Caicedo",
    subtitle: "Psicóloga Clínica Fundadora",
    description: "Conoce la trayectoria profesional, enfoque terapéutico y método de la Dra. Mariana Caicedo.",
    category: "agendamiento",
    targetId: "agendamiento",
    keywords: [
      "dra mariana", "mariana caicedo", "quien es", "doctora", "psicologa mariana", "experiencia", 
      "credenciales", "formacion", "quien atiende"
    ],
    badge: "Especialista"
  },

  // EBOOKS Y RECURSOS
  {
    id: "ebook-ansiedad",
    title: "Ebook: Calma tu Ansiedad",
    subtitle: "Guía clínica práctica en PDF",
    description: "Herramientas descargables para gestionar momentos de angustia y volver a tu centro.",
    category: "ebook",
    targetId: "ebooks",
    keywords: [
      "ebook", "libro", "guia", "pdf", "descarga", "descargar", "ansiedad libro", "lectura", "material", "gratis"
    ],
    badge: "Ebook"
  },
  {
    id: "ebook-depresion",
    title: "Ebook: Superando la Depresión",
    subtitle: "Paso a paso para reencontrar tu luz",
    description: "Recurso estructurado con ejercicios clínicos para salir del letargo y la desmotivación.",
    category: "ebook",
    targetId: "ebooks",
    keywords: [
      "ebook depresion", "libro tristeza", "guia depresion", "pdf depresion", "manual"
    ],
    badge: "Ebook"
  },
  {
    id: "ebook-mindset",
    title: "Ebook: Mindset y Claridad Mental",
    subtitle: "Herramientas para pensar con menos ruido",
    description: "Guía para erradicar el autosabotaje y construir una mentalidad resiliente.",
    category: "ebook",
    targetId: "ebooks",
    keywords: [
      "mindset", "mentalidad", "pensamientos", "autosabotaje", "creencias", "habitos", "foco"
    ],
    badge: "Ebook"
  },

  // COMUNIDAD Y REDES
  {
    id: "social-comunidad",
    title: "Comunidad Soulmar en Redes Sociales",
    subtitle: "Instagram & TikTok oficiales",
    description: "Reels diarios, reflexiones psicológicas y cápsulas de salud mental en 60 segundos.",
    category: "redes",
    targetId: "comunidad",
    keywords: [
      "instagram", "tiktok", "redes", "social", "videos", "reels", "publicaciones", "siguiendo", 
      "comunidad", "seguir", "feed", "posts"
    ],
    badge: "Comunidad"
  },

  // YOUTUBE & PODCAST
  {
    id: "youtube-podcast",
    title: "Soulmar Podcast & Canal de YouTube",
    subtitle: "@Soulmar.Psicologia",
    description: "Episodios completos, conferencias y contenido audiovisual profundo sobre salud mental.",
    category: "podcast",
    href: "https://www.youtube.com/@Soulmar.Psicologia",
    keywords: [
      "youtube", "podcast", "canal", "video", "escuchar", "episodio", "entrevista", "audio", 
      "conferencia", "charla", "musica", "reproducir"
    ],
    badge: "Multimedia"
  }
]

// Normalización fonética y de acentos para emparejamiento ultra-robusto
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9\s]/g, " ")     // quita signos
    .trim()
}

// Algoritmo de distancia Levenshtein para tolerancia a errores ortográficos
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

// Búsqueda inteligente multidimensional con puntuación de relevancia
export function searchSoulmar(query: string): SearchItem[] {
  const cleanQ = normalizeText(query)
  if (!cleanQ || cleanQ.length < 2) return []

  const queryTokens = cleanQ.split(/\s+/).filter(Boolean)

  const scoredResults: { item: SearchItem; score: number }[] = []

  for (const item of SOULMAR_SEARCH_DATABASE) {
    let score = 0
    const normTitle = normalizeText(item.title)
    const normDesc = normalizeText(item.description)
    const normSub = item.subtitle ? normalizeText(item.subtitle) : ""

    // 1. Coincidencia exacta de frase completa
    if (normTitle.includes(cleanQ)) score += 80
    if (normDesc.includes(cleanQ)) score += 40
    if (normSub.includes(cleanQ)) score += 50

    // 2. Coincidencia por palabra clave y sinonimia
    for (const kw of item.keywords) {
      const normKw = normalizeText(kw)
      if (cleanQ === normKw) {
        score += 100
      } else if (normKw.includes(cleanQ) || cleanQ.includes(normKw)) {
        score += 60
      }
      // Chequeo por token
      for (const token of queryTokens) {
        if (normKw.includes(token)) score += 30
        
        // Similitud aproximada si el token tiene 4+ letras
        if (token.length >= 4 && normKw.length >= 4) {
          const dist = levenshteinDistance(token, normKw)
          if (dist <= 1) score += 40
          else if (dist === 2 && token.length >= 6) score += 20
        }
      }
    }

    // 3. Chequeo por tokens individuales en título y descripción
    for (const token of queryTokens) {
      if (normTitle.includes(token)) score += 35
      if (normDesc.includes(token)) score += 15
      if (normSub.includes(token)) score += 20
    }

    if (score > 15) {
      scoredResults.push({ item, score })
    }
  }

  // Ordenar de mayor a menor relevancia
  scoredResults.sort((a, b) => b.score - a.score)

  return scoredResults.map((r) => r.item).slice(0, 5)
}
