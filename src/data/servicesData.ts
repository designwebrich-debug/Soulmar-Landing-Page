export interface ServicePhase {
  number: string
  title: string
  subtitle: string
  description: string
  keyOutcomes: string[]
}

export interface ServiceFAQ {
  question: string
  answer: string
}

export interface ServicePillar {
  title: string
  description: string
}

export interface ServiceData {
  id: string
  slug: string
  title: string
  shortTitle: string
  categoryBadge: string
  tagline: string
  heroDescription: string
  themeColor: string
  secondaryColor: string
  iconName: "Heart" | "Users" | "Sparkles" | "ClipboardList" | "Brain" | "CloudRain"
  heroImage: string
  quickSpecs: {
    duration: string
    modality: string
    approach: string
    professional: string
    frequency: string
    confidentiality: string
  }
  resonanceQuestions: string[]
  reassuranceNote: string
  methodologyOverview: string
  methodologyPhases: ServicePhase[]
  clinicalApproach: {
    badge: string
    title: string
    lead: string
    quote: string
    pillars: ServicePillar[]
    evidenceNote: string
  }
  transformationBenefits: {
    title: string
    description: string
  }[]
  sessionExperience: {
    title: string
    description: string
    steps: {
      step: string
      title: string
      detail: string
    }[]
  }
  faqs: ServiceFAQ[]
  whatsappMessage: string
}

export const SERVICES_DATA: Record<string, ServiceData> = {
  "terapia-ansiedad": {
    id: "anxiety",
    slug: "terapia-ansiedad",
    title: "Terapia en Ansiedad",
    shortTitle: "Ansiedad",
    categoryBadge: "Especialidad Clínica • Dra. Mariana Caicedo",
    tagline: "Desactiva el sobrepensamiento y recupera la calma desde adentro.",
    heroDescription:
      "Un espacio clínico de alta precisión para entender el origen de tu ansiedad, apagar la respuesta de alarma de tu sistema nervioso y construir herramientas duraderas que te devuelvan la tranquilidad en tu vida cotidiana.",
    themeColor: "#a78bfa",
    secondaryColor: "#8da9c4",
    iconName: "Brain",
    heroImage: "/images/desktop-modules/ansiedad.jpg",
    quickSpecs: {
      duration: "50 - 60 minutos por sesión",
      modality: "100% Online (Videollamada privada en alta definición)",
      approach: "Enfoque Cognitivo-Conductual (TCC) Basado en Evidencia",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Semanal en fase inicial; quincenal en consolidación",
      confidentiality: "100% Confidencial bajo estricto secreto profesional",
    },
    resonanceQuestions: [
      "Tu mente salta constantemente de un pensamiento al peor escenario posible, sin poder 'apagarla'.",
      "Sientes tensión muscular en el cuello, nudo en el estómago, taquicardia o dificultad para respirar hondo.",
      "Postergas decisiones o evitas situaciones porque el miedo al error o al juicio te paraliza.",
      "El perfeccionismo y la autoexigencia te desgastan y sientes que nunca es suficiente.",
      "Te cuesta estar presente en el 'aquí y ahora' porque vives anticipando lo que aún no ha ocurrido.",
    ],
    reassuranceNote:
      "La ansiedad no es una debilidad de tu personalidad; es un mecanismo neurobiológico de protección que aprendió a sobreactivarse. Juntos podemos recalibrarlo.",
    methodologyOverview:
      "Nuestro método clínico integra la rigurosidad científica de la Terapia Cognitivo-Conductual y la Terapia de Aceptación y Compromiso (ACT), complementadas con técnicas de regulación neurovegetativa. Un proceso estructurado, medible y compasivo.",
    methodologyPhases: [
      {
        number: "01",
        title: "Evaluación Funcional & Alianza Terapéutica",
        subtitle: "Comprender la arquitectura de tu ansiedad",
        description:
          "En las primeras sesiones mapeamos con exactitud tus disparadores específicos, la historia de tu síntoma y los bucles de retroalimentación (pensamiento-cuerpo-conducta) que mantienen el ciclo activo.",
        keyOutcomes: [
          "Identificación precisa de detonantes y esquemas de alerta",
          "Psicoeducación neurobiológica clara sobre qué le ocurre a tu cuerpo",
          "Definición de objetivos terapéuticos medibles y personalizados",
        ],
      },
      {
        number: "02",
        title: "Regulación Neurofisiológica & Alivio Inmediato",
        subtitle: "Herramientas de intervención somática",
        description:
          "Implementamos técnicas de desactivación del sistema nervioso simpático: modulación vagal, respiración fisiológica guiada y prácticas somáticas para detener crisis de pánico y calmar la hipervigilancia.",
        keyOutcomes: [
          "Protocolo de emergencia ante picos de angustia o desbordamiento",
          "Herramientas de anclaje sensorial y calma corporal en tiempo real",
          "Reducción notable de la tensión física y el insomnio",
        ],
      },
      {
        number: "03",
        title: "Reestructuración Cognitiva & Desfusión (ACT)",
        subtitle: "Aprender a relacionarte diferente con tu mente",
        description:
          "Trabajamos en desmontar los sesgos de catastrofización, adivinación del futuro y necesidad de control. A través de la desfusión cognitiva, aprendes a observar tus pensamientos sin obedecerlos ciegamente.",
        keyOutcomes: [
          "Desarticulación de pensamientos automáticos intrusivos",
          "Mayor flexibilidad psicológica y tolerancia a la incertidumbre",
          "Diferenciación entre preocupaciones reales y alarmas falsas",
        ],
      },
      {
        number: "04",
        title: "Exposición Gradual & Autonomía Sostenible",
        subtitle: "Recuperar tu libertad y consolidar avances",
        description:
          "Diseñamos un plan de aproximación gradual a las situaciones que evitabas, construyendo una autoeficacia sólida. Cerramos con un plan de prevención de recaídas para que seas tu propio/a terapeuta en el futuro.",
        keyOutcomes: [
          "Regreso seguro a actividades y decisiones antes postergadas",
          "Confianza profunda en tu capacidad de sostener la incomodidad",
          "Manual personal de mantenimiento y prevención a largo plazo",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Enfoque Cognitivo-Conductual",
      title: "El Enfoque Cognitivo-Conductual de la Dra. Mariana Caicedo",
      lead: "La Dra. Mariana Caicedo fundamenta su práctica clínica en el Enfoque Cognitivo-Conductual (TCC), el estándar de oro con mayor respaldo científico internacional para desactivar la ansiedad, reestructurar pensamientos automáticos y calmar el sistema nervioso.",
      quote:
        "Mi objetivo en cada sesión no es simplemente darte consejos; es entregarte la comprensión biológica y psicológica de lo que experimentas, dotándote de herramientas prácticas que cambien de verdad tu manera de habitar tu mente.",
      pillars: [
        {
          title: "Enfoque Cognitivo-Conductual (TCC)",
          description:
            "Utilizamos exclusivamente intervenciones con respaldo empírico en la literatura científica internacional, analizando la interacción entre pensamientos, emociones y conductas.",
        },
        {
          title: "Espacio Cálido y 100% Libre de Juicio",
          description:
            "Un refugio seguro donde puedes hablar de tus miedos más profundos sin ser minimizado/a ni juzgado/a jamás.",
        },
        {
          title: "Herramientas Prácticas para el Día a Día",
          description:
            "Cada sesión concluye con micro-acciones y ejercicios concretos aplicables entre sesiones para consolidar el cambio neuroplástico.",
        },
        {
          title: "Medición Continua de Progresos",
          description:
            "Evaluamos periódicamente la disminución de tus síntomas de ansiedad para calibrar el ritmo del tratamiento con rigor.",
        },
      ],
      evidenceNote:
        "El Enfoque Cognitivo-Conductual (TCC) es reconocido por la American Psychological Association (APA) y la OMS como el tratamiento de primera línea y estándar de oro para el tratamiento de trastornos de ansiedad y pánico.",
    },
    transformationBenefits: [
      {
        title: "Claridad y sosiego mental",
        description: "Aprende a pausar el ruido del sobrepensamiento y recuperar la capacidad de concentrarte y descansar.",
      },
      {
        title: "Dominio de tu sistema nervioso",
        description: "Capacidad de autorregularte cuando el cuerpo envía señales de alerta sin necesidad de entrar en pánico.",
      },
      {
        title: "Decisiones con serenidad",
        description: "Dejar de actuar motivado/a por el miedo y comenzar a elegir desde tus valores y convicciones genuinas.",
      },
      {
        title: "Sueño reparador y descanso real",
        description: "Herramientas de desactivación cognitiva antes de dormir para conciliar el sueño sin batallas internas.",
      },
      {
        title: "Relaciones más plenas y auténticas",
        description: "Menor reactividad e inseguridad en tus vínculos con amigos, pareja, familia o trabajo.",
      },
      {
        title: "Autocompasión y paz contigo",
        description: "Despedir la autoexigencia cruel y reemplazarla por una voz interna aliada, protectora y realista.",
      },
    ],
    sessionExperience: {
      title: "¿Cómo se vive una sesión de Terapia en Ansiedad?",
      description: "Diseñada para ser fluida, privada y libre de estrés desde la comodidad de tu hogar.",
      steps: [
        {
          step: "1",
          title: "Conexión privada y revisión del estado actual",
          detail: "Nos conectamos puntualmente vía enlace cifrado de Google Meet. Hacemos un check-in de cómo ha estado tu semana y qué desafíos somáticos o mentales experimentaste.",
        },
        {
          step: "2",
          title: "Trabajo clínico y conceptualización",
          detail: "Abordamos el foco de la sesión: desarmar una creencia ansiosa, procesar una situación detonante o entrenar una técnica de regulación.",
        },
        {
          step: "3",
          title: "Entrenamiento práctico y herramientas",
          detail: "Practicamos en vivo la herramienta cognitiva o corporal para asegurarnos de que la domines con soltura.",
        },
        {
          step: "4",
          title: "Plan de acción y micro-práctica semanal",
          detail: "Definimos un plan sencillo y aplicable para los próximos días, con recursos descargables si es necesario.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Cuántas sesiones necesitaré para sentir mejoría?",
        answer:
          "La mayoría de los pacientes reportan un alivio significativo en los síntomas agudos de hiperventilación y sobrepensamiento entre la sesión 4 y 6, gracias a las herramientas somáticas. La reestructuración de patrones profundos suele consolidarse entre 10 y 16 sesiones, adaptándose siempre a tu ritmo individual.",
      },
      {
        question: "¿Es realmente efectiva la terapia en ansiedad online?",
        answer:
          "Múltiples estudios clínicos internacionales han demostrado que la TCC y ACT en modalidad online tienen exactamente la misma eficacia clínica que la modalidad presencial. Además, conectarte desde tu propio entorno seguro suele facilitar una mayor apertura emocional y elimina el estrés del tráfico o desplazamientos.",
      },
      {
        question: "¿Qué pasa si experimento un ataque de pánico?",
        answer:
          "Durante las primeras sesiones construimos juntos un 'Protocolo de Seguridad Somática', un paso a paso claro que aprenderás a ejecutar para desarmar la respuesta de pánico en menos de 5 a 10 minutos, comprendiendo que aunque la sensación es desagradable, no es mortal ni peligrosa.",
      },
      {
        question: "¿Cómo se coordina el horario si estoy en otro país?",
        answer:
          "La plataforma de agendamiento de Soulmar detecta automáticamente tu zona horaria y te muestra los espacios disponibles en tu hora local (Colombia, Estados Unidos, España, México, Chile, Argentina, etc.).",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Quisiera consultar disponibilidad para iniciar mi proceso de Terapia en Ansiedad con Soulmar 💙",
  },

  "terapia-pareja": {
    id: "couple",
    slug: "terapia-pareja",
    title: "Terapia de Pareja",
    shortTitle: "Pareja",
    categoryBadge: "Especialidad Clínica • Dra. Mariana Caicedo",
    tagline: "Desarma el ciclo de conflicto y reconstruye la intimidad desde el diálogo consciente.",
    heroDescription:
      "Un espacio neutro, seguro y guiado profesionalmente para parejas que desean comprender los patrones invisibles que las distancian, sanar heridas del vínculo y aprender a comunicarse sin reproches ni silencios destructivos.",
    themeColor: "#ffc971",
    secondaryColor: "#8da9c4",
    iconName: "Users",
    heroImage: "/images/BannerHero02.jpg",
    quickSpecs: {
      duration: "60 - 75 minutos por sesión conjunta",
      modality: "100% Online (Sesión conjunta desde la misma o distintas ubicaciones)",
      approach: "Enfoque Cognitivo-Conductual (TCC) Aplicado a Parejas",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Quincenal o semanal según el nivel de urgencia del vínculo",
      confidentiality: "Espacio confidencial, neutral y sin tomas de partido",
    },
    resonanceQuestions: [
      "Las mismas discusiones se repiten una y otra vez con los mismos reclamos, sin llegar a una solución real.",
      "Uno de los dos suele insistir y exigir, mientras el otro se cierra, guarda silencio o huye de la conversación.",
      "Sienten que conviven más como 'compañeros de logística y finanzas' que como una pareja apasionada y cómplice.",
      "Hubo una traición, infidelidad o herida de confianza que no han podido superar por su cuenta.",
      "Quieren fortalecer los cimientos de su relación antes de tomar un paso mayor (convivencia, matrimonio, hijos).",
    ],
    reassuranceNote:
      "En terapia de pareja el enemigo nunca es el otro; el verdadero problema es el ciclo reactivo de desconexión que ambos han alimentado sin querer. Desmontarlo es posible.",
    methodologyOverview:
      "Basado en la Terapia Focalizada en las Emociones (EFT / Sue Johnson) y la Teoría del Apego Adulto. No buscamos determinar quién es el culpable, sino decodificar los gritos de auxilio y el miedo a la desconexión que subyacen a cada reclamo o distancia.",
    methodologyPhases: [
      {
        number: "01",
        title: "Desescalada del Ciclo Reactivo",
        subtitle: "Detener la dinámica destructiva en seco",
        description:
          "Mapeamos el patrón circular que activa sus peleas: qué dispara la herida, cómo reacciona cada uno y cómo esa reacción confirma los peores temores del otro. Aprenden a pausar el ciclo antes de herirse.",
        keyOutcomes: [
          "Identificación del patrón 'persecución-retirada' o 'ataque-defensa'",
          "Tregua emocional y reglas de comunicación segura en casa",
          "Claridad sobre las necesidades no satisfechas de cada integrante",
        ],
      },
      {
        number: "02",
        title: "Acceso a Emociones de Apego Primarias",
        subtitle: "Ir más allá del enojo superficial",
        description:
          "Debajo de la ira o el desinterés casi siempre hay vulnerabilidad oculta: miedo a no ser suficiente, sensación de soledad o pánico al abandono. Guiamos conversaciones seguras donde estas emociones se pueden nombrar.",
        keyOutcomes: [
          "Expresión de vulnerabilidad sin máscaras defensivas",
          "Aparición de empatía genuina al comprender el dolor del otro",
          "Desactivación del resentimiento acumulado por años",
        ],
      },
      {
        number: "03",
        title: "Reestructuración del Apego Seguro & Intimidad",
        subtitle: "Aprender a pedirse amor y validación directamente",
        description:
          "Enseñamos a pedir afecto, apoyo y límites de manera asertiva y directa. La pareja aprende a ser el refugio seguro del otro frente a las tormentas externas de la vida.",
        keyOutcomes: [
          "Capacidad de sintonizar emocionalmente y reparar rápido tras un roce",
          "Reconexión con la intimidad física, afectiva y sexual",
          "Mayor complicidad y disfrute de los momentos compartidos",
        ],
      },
      {
        number: "04",
        title: "Consolidación de Acuerdos y Proyecto Común",
        subtitle: "Blindar el futuro de la relación",
        description:
          "Establecemos pactos claros y equitativos en áreas complejas: finanzas, familia extendida, roles de convivencia, crianza y proyectos compartidos, con herramientas para gestionar crisis futuras con madurez.",
        keyOutcomes: [
          "Acuerdos concretos escritos y asumidos por ambas partes",
          "Independencia saludable dentro del compromiso mutuo",
          "Cierre del proceso con una relación resiliente y renovada",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Enfoque Cognitivo-Conductual en Pareja",
      title: "El Enfoque Cognitivo-Conductual de la Dra. Mariana Caicedo",
      lead: "A través del Enfoque Cognitivo-Conductual, la Dra. Mariana Caicedo ayuda a la pareja a identificar y modificar las interpretaciones automáticas, distorsiones cognitivas y conductas reactivas que activan el conflicto, reemplazándolas por habilidades de comunicación asertiva y resolución de problemas.",
      quote:
        "Las parejas no se distancian porque se les acabe el amor; se distancian porque dejan de sentirse seguras para ser vulnerables con el otro. Mi labor es devolverles ese espacio de seguridad.",
      pillars: [
        {
          title: "Neutralidad Clínica Inquebrantable",
          description:
            "No tomamos bandos ni decidimos quién tiene la razón. Ambos son escuchados con el mismo respeto, equidad y profundidad.",
        },
        {
          title: "Intervención Cognitivo-Conductual Vincular",
          description:
            "Reestructuración de creencias disfuncionales sobre la relación y entrenamiento conductual en resolución de conflictos cotidianos.",
        },
        {
          title: "Práctica en Vivo durante la Sesión",
          description:
            "No solo hablamos sobre lo que pasa en casa; practicamos conversaciones difíciles en la misma sesión con intervención guiada.",
        },
        {
          title: "Claridad para Tomar Decisiones",
          description:
            "Tanto si el objetivo es renovar el compromiso como si deciden cerrar el ciclo, lo harán desde la paz, la gratitud y la madurez.",
        },
      ],
      evidenceNote:
        "La Terapia Cognitivo-Conductual aplicada a parejas cuenta con amplia evidencia empírica en la modificación de pautas de interacción disfuncionales y fortalecimiento del vínculo afectivo.",
    },
    transformationBenefits: [
      {
        title: "Comunicación sin ataques ni reproches",
        description: "Aprender a manifestar disgustos y desacuerdos sin humillar, levantar muros ni herir el autoestima del otro.",
      },
      {
        title: "Resolución de conflictos en minutos",
        description: "Contar con un protocolo compartido para frenar escaladas de ira y reparar heridas casi de inmediato.",
      },
      {
        title: "Reactivación de la complicidad y el afecto",
        description: "Volver a reírse juntos, disfrutar el tiempo a solas y reavivar la chispa del interés mutuo.",
      },
      {
        title: "Sanación de heridas del pasado",
        description: "Superar rencores acumulados, desilusiones y traiciones con un proceso guiado de perdón genuino.",
      },
      {
        title: "Alineación de metas de vida",
        description: "Tener conversaciones transparentes sobre dinero, planes a futuro y prioridades sin temor a que terminen en pelea.",
      },
      {
        title: "Un hogar en paz",
        description: "Transformar el hogar de un campo de batalla en un verdadero refugio donde ambos quieren llegar a descansar.",
      },
    ],
    sessionExperience: {
      title: "¿Cómo funciona una sesión de Terapia de Pareja online?",
      description: "Cómoda, estructurada y diseñada para que ambos miembros tengan voz equilibrada.",
      steps: [
        {
          step: "1",
          title: "Conexión conjunta",
          detail: "Pueden conectarse juntos desde la misma sala o desde computadores/ciudades diferentes si están en trabajo o a distancia.",
        },
        {
          step: "2",
          title: "Foco de la sesión y mediación",
          detail: "Revisamos los eventos recientes y elegimos un tema clave a desanudar en la sesión, evitando que la conversación se desvíe en quejas improductivas.",
        },
        {
          step: "3",
          title: "Encuadre emocional guiado",
          detail: "La Dra. Mariana Caicedo interviene en tiempo real para ayudar a reformular lo que uno dice y ayudar al otro a escucharlo sin defensividad.",
        },
        {
          step: "4",
          title: "Acuerdo puente para la semana",
          detail: "Se van con un compromiso mutuo concreto y simple para practicar en su vida cotidiana hasta la siguiente sesión.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Qué pasa si mi pareja no está muy convencida de asistir?",
        answer:
          "Es muy común que uno de los dos llegue con dudas o temor a ser juzgado. La primera sesión está pensada justamente para desmitificar la terapia, escuchar las reservas de ambos y crear un ambiente donde nadie se sienta atacado. Frecuentemente, el miembro más reacio se convierte en el más comprometido una vez comprueba la neutralidad de la Dra. Mariana Caicedo.",
      },
      {
        question: "¿Podemos conectarnos si estamos en lugares o países distintos?",
        answer:
          "Sí, perfectamente. La videollamada admite múltiples conexiones simultáneas, por lo que es ideal para parejas en relaciones a distancia o con horarios de oficina demandantes.",
      },
      {
        question: "¿La terapia de pareja garantiza que nos quedemos juntos?",
        answer:
          "El objetivo de la terapia es traer claridad y salud vincular. En la gran mayoría de casos ayuda a recuperar la intimidad y el amor. Si tras un proceso reflexivo la pareja descubre que lo más sano es separarse, el acompañamiento permite hacerlo de forma civilizada, pacífica y cuidando el bienestar de todos (especialmente si hay hijos).",
      },
      {
        question: "¿Se realizan también sesiones individuales durante el proceso?",
        answer:
          "Sí. Dependiendo del caso, la Dra. Mariana Caicedo puede pautar una sesión individual con cada uno para conocer su historia de apego personal y profundizar en sus vivencias íntimas, siempre manteniendo la transparencia de cara al objetivo común de la pareja.",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Nos gustaría consultar información para iniciar Terapia de Pareja con Soulmar 💛",
  },

  "terapia-depresion": {
    id: "depression",
    slug: "terapia-depresion",
    title: "Terapia en Depresión",
    shortTitle: "Depresión",
    categoryBadge: "Especialidad Clínica • Dra. Mariana Caicedo",
    tagline: "Disipa la niebla emocional y reconecta con tu energía vital paso a paso.",
    heroDescription:
      "Acompañamiento clínico empático y basado en evidencia para personas que experimentan vacío, agotamiento crónico, tristeza profunda o pérdida de sentido. Un camino respetuoso hacia la recuperación de tu luz.",
    themeColor: "#8da9c4",
    secondaryColor: "#ffc971",
    iconName: "CloudRain",
    heroImage: "/images/desktop-modules/tristeza.png",
    quickSpecs: {
      duration: "50 - 60 minutos por sesión",
      modality: "100% Online (Videollamada privada y segura)",
      approach: "Enfoque Cognitivo-Conductual (TCC) & Activación Conductual",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Semanal en etapas tempranas para garantizar contención",
      confidentiality: "100% Confidencial y respetuoso con tu ritmo",
    },
    resonanceQuestions: [
      "Te despiertas con una sensación de pesadez o apatía y levantarte requiere un esfuerzo descomunal.",
      "Cosas que antes te apasionaban o disfrutabas ahora no te producen ninguna emoción (anhedonia).",
      "Sientes que eres una carga para tus seres queridos o experimentas una culpa profunda e irracional.",
      "Te aíslas socialmente porque tener conversaciones o salir se siente agotador y abrumador.",
      "Tu mente insiste en que las cosas no van a mejorar y sientes que perdiste el rumbo o el propósito.",
    ],
    reassuranceNote:
      "La depresión no es debilidad, pereza ni falta de gratitud; es un estado de agotamiento neuroquímico y emocional. No tienes que salir de esto a solas.",
    methodologyOverview:
      "Implementamos la Activación Conductual (con el mayor índice de evidencia para revertir la inercia depresiva) combinada con reestructuración cognitiva y cultivo de autocompasión. Avanzamos a tu ritmo, sin exigencias imposibles ni juicios.",
    methodologyPhases: [
      {
        number: "01",
        title: "Contención Emocional & Mapeo de la Depresión",
        subtitle: "Un refugio seguro para validar tu dolor",
        description:
          "Antes de pedirte cualquier acción, creamos un espacio donde tu sufrimiento sea plenamente validado. Comprendemos qué factores biológicos, situacionales y biográficos desencadenaron el episodio actual.",
        keyOutcomes: [
          "Alivio inmediato de la culpa y desculpabilización del síntoma",
          "Mapeo de niveles basales de energía y rutinas críticas",
          "Establecimiento de una red de seguridad emocional",
        ],
      },
      {
        number: "02",
        title: "Activación Conductual Micro-Gradual",
        subtitle: "Romper la inercia del apagado neurológico",
        description:
          "Diseñamos micro-acciones realistas que reactivan los circuitos de dopamina y recompensa en tu cerebro. Nada de 'sal y corre un maratón'; trabajamos con pasos medidos y alcanzables según tu energía disponible.",
        keyOutcomes: [
          "Reconexión con micro-fuentes de placer y sensación de logro",
          "Reestructuración suave de rutinas de sueño, nutrición y luz solar",
          "Retorno gradual del interés por actividades básicas",
        ],
      },
      {
        number: "03",
        title: "Desactivación de la Tríada Cognitiva & Autocrítica",
        subtitle: "Sanar la voz interna despiadada",
        description:
          "La depresión distorsiona la visión sobre ti mismo/a, el mundo y el futuro. Detectamos y desafiamos esos pensamientos automáticos negativos, reemplazándolos con una mirada objetiva y compasiva.",
        keyOutcomes: [
          "Neutralización del monólogo interno de autoreproche y desesperanza",
          "Desarrollo de una voz interna protectora y paciente",
          "Procesamiento de duelos o heridas afectivas no resueltas",
        ],
      },
      {
        number: "04",
        title: "Reconstrucción de Sentido & Prevención de Recaídas",
        subtitle: "Reconectar con tus valores nucleares",
        description:
          "Ayudamos a reconstruir un proyecto de vida significativo y alineado con lo que de verdad te importa. Elaboramos tu semáforo de señales tempranas para que identifiques y frenes cualquier recaída a tiempo.",
        keyOutcomes: [
          "Reencuentro con un propósito personal vital y motivante",
          "Construcción de vínculos más profundos y honestos",
          "Plan integral de prevención y monitoreo a largo plazo",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Enfoque Cognitivo-Conductual",
      title: "El Enfoque Cognitivo-Conductual de la Dra. Mariana Caicedo",
      lead: "El Enfoque Cognitivo-Conductual (TCC) desarrollado por el Dr. Aaron Beck y la Activación Conductual constituyen el abordaje clínico de la Dra. Mariana Caicedo para desarmar la inercia depresiva, reestructurar la autocrítica y recuperar la energía vital paso a paso.",
      quote:
        "Cuando estás en depresión, hasta respirar pesa. Mi rol no es empujarte a la fuerza hacia la luz, sino sentarme a tu lado en la sombra, tomarte de la mano y mostrarte el primer paso que sí puedes dar hoy.",
      pillars: [
        {
          title: "Cero Positivismo Tóxico",
          description:
            "Rechazamos las frases cliché y la exigencia de estar feliz. Validamos tu dolor con la seriedad clínica y el respeto humano que merece.",
        },
        {
          title: "Enfoque Cognitivo-Conductual & Activación",
          description:
            "El tratamiento psicológico con mayores tasas de remisión en depresión moderada y severa, modificando esquemas pesimistas y patrones de aislamiento.",
        },
        {
          title: "Micro-Pasos Adaptados a tu Energía",
          description:
            "Avanzamos con metas proporcionales a lo que hoy puedes sostener, celebrando cada pequeño triunfo como la victoria monumental que realmente es.",
        },
        {
          title: "Coordinación Interdisciplinaria si es Necesario",
          description:
            "Si tu caso requiere apoyo farmacológico complementario, coordinamos con psiquiatras de confianza manteniendo un enfoque integral.",
        },
      ],
      evidenceNote:
        "El Enfoque Cognitivo-Conductual (TCC) y la Activación Conductual cuentan con el más alto nivel de evidencia (Nivel 1A) en guías clínicas mundiales como NICE y APA para el tratamiento de la depresión.",
    },
    transformationBenefits: [
      {
        title: "Regreso paulatino de la energía vital",
        description: "Sentir que el cuerpo y la mente vuelven a responder sin el agotamiento paralizante de antes.",
      },
      {
        title: "Volver a experimentar disfrute genuino",
        description: "Redescubrir la capacidad de sonreír, emocionarte y conectar con las cosas simples de la vida.",
      },
      {
        title: "Liberación de la culpa y el autoreproche",
        description: "Dejar de culparte por estar mal y aprender a tratarte como tratarías a la persona que más amas.",
      },
      {
        title: "Claridad y propósito de vida",
        description: "Reconstruir una dirección clara para tus días, con proyectos que despierten ilusión genuina.",
      },
      {
        title: "Reconexión con tu red de apoyo",
        description: "Volver a compartir con tus amigos y familia sin sentirte incomprendido/a ni obligado/a a fingir.",
      },
      {
        title: "Resiliencia ante futuras tormentas",
        description: "Saber exactamente qué hacer si vuelven a aparecer días grises, con herramientas probadas por ti mismo/a.",
      },
    ],
    sessionExperience: {
      title: "¿Qué esperar de una sesión de Terapia en Depresión?",
      description: "Un espacio donde no tienes que pretender que estás bien. Puedes ser 100% tú.",
      steps: [
        {
          step: "1",
          title: "Bienvenida cálida y calibración de energía",
          detail: "Evaluamos con honestidad cómo te encuentras hoy sin presionarte. Si hoy tienes poca energía, la sesión se adapta a ti.",
        },
        {
          step: "2",
          title: "Desahogo seguro y análisis de barreras",
          detail: "Hablamos de los pensamientos pesados o situaciones que te han dolido durante la semana sin que nadie te juzgue.",
        },
        {
          step: "3",
          title: "Reencuadre compasivo y psicoeducación",
          detail: "La Dra. Mariana Caicedo te ayuda a ver los sesgos depresivos de tu mente y a reconectar con hechos objetivos de tu realidad.",
        },
        {
          step: "4",
          title: "Un micro-compromiso amable",
          detail: "Elegimos una sola acción pequeña y significativa para los próximos días que devuelva luz a tu cotidianidad.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Tengo que tomar medicamentos si asisto a terapia psicológica?",
        answer:
          "No necesariamente. En depresiones leves y moderadas, la psicoterapia basada en evidencia suele ser suficiente como tratamiento único. En casos severos donde la química cerebral impide concentrarse o levantarse, la combinación de psicoterapia con medicación pautada por un médico psiquiatra ofrece la más rápida recuperación. La Dra. Mariana Caicedo evaluará contigo tu situación con total transparencia.",
      },
      {
        question: "¿Qué pasa si hay días en los que no tengo fuerzas para hablar?",
        answer:
          "Es completamente normal y bienvenido en este espacio. La sesión no requiere que estés elocuente ni enérgico/a. La Dra. Mariana Caicedo guiará la conversación con suavidad, e incluso podemos hacer ejercicios de presencia o respiración. Tu presencia ya es una victoria enorme.",
      },
      {
        question: "¿Cuánto tiempo toma superar un episodio depresivo?",
        answer:
          "La recuperación no es una línea recta, pero con el protocolo de Activación Conductual la mayoría de las personas comienzan a experimentar cambios perceptibles en su estado de ánimo y energía entre la 4ª y la 8ª semana de tratamiento consistente.",
      },
      {
        question: "¿Puedo agendar si vivo fuera de Colombia?",
        answer:
          "Sí, atendemos pacientes hispanohablantes en más de 15 países a través de videollamada privada, adaptando los pagos y horarios a tu país de residencia.",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Quisiera orientación para iniciar Terapia en Depresión en Soulmar 💙",
  },

  "terapia-individual": {
    id: "individual",
    slug: "terapia-individual",
    title: "Terapia Individual",
    shortTitle: "Individual",
    categoryBadge: "Especialidad Clínica • Dra. Mariana Caicedo",
    tagline: "Un espacio exclusivo para ti: comprende tu historia y florece en tu versión más auténtica.",
    heroDescription:
      "Una hora de atención clínica exclusiva y personalizada para explorar tu mundo interno, sanar heridas del pasado, redefinir tus límites y tomar decisiones de vida alineadas con tus verdaderos valores.",
    themeColor: "#8da9c4",
    secondaryColor: "#c9cba3",
    iconName: "Heart",
    heroImage: "/images/desktop-hero/slide-1.png",
    quickSpecs: {
      duration: "50 - 60 minutos por sesión",
      modality: "100% Online (Videollamada privada en HD)",
      approach: "Enfoque Cognitivo-Conductual (TCC) Basado en Evidencia",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Semanal o quincenal según tus metas individuales",
      confidentiality: "100% Confidencial, seguro y sin juicios",
    },
    resonanceQuestions: [
      "Sientes que estás viviendo en 'piloto automático' cumpliendo expectativas ajenas pero vacío/a por dentro.",
      "Te cuesta decir 'no', poner límites sanos o priorizarte sin sentir una culpa abrumadora.",
      "Estás atravesando una transición de vida exigente (duelo, ruptura, cambio de país, nuevo reto profesional).",
      "Identificas patrones repetitivos en tus relaciones o trabajo que terminan haciéndote daño.",
      "Deseas un espacio neutral, profesional y confidencial para hablar con total libertad y sin filtros.",
    ],
    reassuranceNote:
      "Ir a terapia no significa que estés 'roto' ni 'enfermo'; significa que eres lo suficientemente valiente e inteligente como para invertir en tu paz mental y crecimiento personal.",
    methodologyOverview:
      "Combinamos la profundidad del autoconocimiento reflexivo con la efectividad práctica de la psicología basada en evidencia. Una experiencia transformadora diseñada exclusivamente alrededor de tus necesidades y ritmo.",
    methodologyPhases: [
      {
        number: "01",
        title: "Exploración Inicial & Definición del Rumbo",
        subtitle: "Conocer quién eres y hacia dónde quieres ir",
        description:
          "Construimos el mapa de tu historia personal: los mandatos familiares, las vivencias que te forjaron y los obstáculos que hoy te impiden vivir con mayor plenitud y ligereza.",
        keyOutcomes: [
          "Claridad sobre tus valores nucleares y prioridades vitales",
          "Alivio de expresar lo que no le cuentas a nadie más",
          "Objetivos terapéuticos concretos a corto y mediano plazo",
        ],
      },
      {
        number: "02",
        title: "Identificación de Patrones & Creencias Limitantes",
        subtitle: "Desactivar los esquemas que ya no te sirven",
        description:
          "Analizamos los 'disfraces' que usas para sentirte seguro/a: el complacer a todos, el perfeccionismo, el autosabotaje o la hiperindependencia, para sanar la herida raíz que los originó.",
        keyOutcomes: [
          "Comprensión profunda de por qué reaccionas como reaccionas",
          "Sanación de heridas emocionales del pasado y el apego",
          "Desprendimiento de culpas ajenas y expectativas heredadas",
        ],
      },
      {
        number: "03",
        title: "Desarrollo de Habilidades & Asertividad",
        subtitle: "Herramientas para tu vida cotidiana",
        description:
          "Entrenamos habilidades prácticas de comunicación asertiva, establecimiento de límites firmes pero amorosos, gestión de emociones complejas y toma de decisiones difíciles.",
        keyOutcomes: [
          "Capacidad de decir 'no' con serenidad y sin culpa",
          "Mayor autoconfianza y presencia en tus relaciones y trabajo",
          "Tolerancia a la incomodidad de ponerte en primer lugar",
        ],
      },
      {
        number: "04",
        title: "Consolidación de Identidad & Autonomía",
        subtitle: "Vivir desde tu versión más libre y genuina",
        description:
          "Integramos todos los aprendizajes en una identidad sólida. Espaciamos las sesiones conforme conquistas mayor autonomía, celebrando tu evolución con un cierre significativo.",
        keyOutcomes: [
          "Paz interna sostenida y autoestima fundamentada en hechos",
          "Proyecto de vida coherente con lo que verdaderamente amas",
          "Caja de herramientas personal para afrontar el futuro con serenidad",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Enfoque Cognitivo-Conductual",
      title: "El Enfoque Cognitivo-Conductual de la Dra. Mariana Caicedo",
      lead: "La Dra. Mariana Caicedo guía cada proceso individual bajo el Enfoque Cognitivo-Conductual (TCC), trabajando sobre la relación directa entre pensamientos, emociones y conductas para transformar creencias limitantes en autonomía real.",
      quote:
        "La verdadera terapia no intenta cambiar quién eres; te ayuda a despojarte de todo aquello que aprendiste a ser para sobrevivir, permitiéndote al fin ser tú mismo/a en libertad.",
      pillars: [
        {
          title: "Modelo Cognitivo-Conductual Científico",
          description:
            "Trabajamos sobre la modificación de creencias intermedias y nucleares, desarrollando flexibilidad cognitiva y nuevas conductas adaptativas.",
        },
        {
          title: "Mirada Holística y Compasiva",
          description:
            "Consideramos tu mente, tu cuerpo, tus relaciones y tu contexto social como un todo interconectado.",
        },
        {
          title: "Foco en la Autonomía del Paciente",
          description:
            "No creamos dependencia terapéutica; nuestro éxito es que desarrolles la sabiduría y fuerza para volar por tu cuenta.",
        },
        {
          title: "Confidencialidad Rigurosa",
          description:
            "Un espacio de absoluta intimidad donde puedes ser vulnerable con total garantía de discreción y amparo legal.",
        },
      ],
      evidenceNote:
        "El Enfoque Cognitivo-Conductual (TCC) es el modelo psicoterapéutico con mayor respaldo de investigación empírica a nivel global para el desarrollo personal y la salud mental.",
    },
    transformationBenefits: [
      {
        title: "Autoestima sólida y realista",
        description: "Dejar de depender de la aprobación de los demás para sentirte valioso/a y digno/a de respeto y amor.",
      },
      {
        title: "Límites claros y relaciones sanas",
        description: "Aprender a proteger tu tiempo, energía y espacio sin sentir que estás traicionando a nadie.",
      },
      {
        title: "Paz interna y menos sobrepensamiento",
        description: "Aprender a acallar el diálogo interno crítico y sustituirlo por comprensión y firmeza.",
      },
      {
        title: "Toma de decisiones con seguridad",
        description: "Claridad para elegir en momentos de encrucijada personal, laboral o sentimental sin dudas paralizantes.",
      },
      {
        title: "Reconciliación con tu pasado",
        description: "Mirar tu historia no con vergüenza ni dolor, sino con gratitud por los aprendizajes y la fuerza desarrollada.",
      },
      {
        title: "Vivir con autenticidad y alegría",
        description: "Despertarte sintiendo que tu vida te pertenece a ti y no a las expectativas de nadie más.",
      },
    ],
    sessionExperience: {
      title: "¿Cómo se vive una sesión de Terapia Individual?",
      description: "Tu momento sagrado de la semana, 100% dedicado a tu bienestar.",
      steps: [
        {
          step: "1",
          title: "Check-in inicial y descompresión",
          detail: "Nos conectamos, respiramos y dejamos atrás el ajetreo del día para entrar en un espacio de presencia y calma.",
        },
        {
          step: "2",
          title: "Exploración del foco del día",
          detail: "Traes una vivencia, inquietud o meta de la semana y la desarmamos juntos con preguntas estratégicas.",
        },
        {
          step: "3",
          title: "Insight clínico y reestructuración",
          detail: "Conectamos los puntos entre lo que te pasa hoy y tus patrones de fondo, logrando esos momentos 'ajá' de profunda revelación.",
        },
        {
          step: "4",
          title: "Integración para tu cotidianidad",
          detail: "Cerramos con una reflexión o ejercicio para llevar a la práctica en tu día a día.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Qué pasa si nunca antes he ido al psicólogo?",
        answer:
          "La gran mayoría de nuestros consultantes acuden por primera vez. La Dra. Mariana Caicedo te guiará con total naturalidad desde el primer minuto. No necesitas preparar un discurso ni saber exactamente qué decir; empezaremos desde donde tú estés y con lo que sientas.",
      },
      {
        question: "¿Con qué frecuencia debo agendar mis sesiones?",
        answer:
          "Se recomienda iniciar con una frecuencia semanal durante el primer mes para establecer una base sólida y ver resultados más rápidos. Posteriormente, la frecuencia puede ajustarse a quincenal según tus avances y disponibilidad.",
      },
      {
        question: "¿Qué necesito para conectarme a mi sesión online?",
        answer:
          "Solo necesitas un computador, tablet o celular con cámara y micrófono, audífonos para mayor privacidad, una conexión a internet estable y un lugar privado donde puedas hablar con tranquilidad.",
      },
      {
        question: "¿Puedo pagar en mi moneda local?",
        answer:
          "Sí. En Colombia recibimos pagos vía Bancolombia, Nequi y tarjetas mediante pasarelas seguras. Para pacientes internacionales en Estados Unidos, Europa o Latinoamérica, habilitamos pagos seguros con tarjeta de crédito o débito internacional con conversión automática.",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Quisiera iniciar mi proceso de Terapia Individual con Soulmar 💙",
  },

  "gestion-emocional": {
    id: "emotional",
    slug: "gestion-emocional",
    title: "Gestión Emocional",
    shortTitle: "Gestión Emocional",
    categoryBadge: "Entrenamiento Clínico • Dra. Mariana Caicedo",
    tagline: "Aprende a comprender, autorregular y transformar tus emociones en tus mayores aliadas.",
    heroDescription:
      "Herramientas clínicas prácticas y clínicamente guiadas para dejar de reprimirte o explotar ante el malestar. Un entrenamiento en inteligencia emocional profunda, tolerancia a la frustración y calma interior.",
    themeColor: "#c9cba3",
    secondaryColor: "#8da9c4",
    iconName: "Sparkles",
    heroImage: "/images/desktop-modules/mindset.png",
    quickSpecs: {
      duration: "50 - 60 minutos por sesión",
      modality: "100% Online (Sesiones interactivas con material de trabajo)",
      approach: "Enfoque Cognitivo-Conductual (TCC) & Regulación Emocional",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Semanal en módulo de entrenamiento intensivo",
      confidentiality: "100% Confidencial y práctico",
    },
    resonanceQuestions: [
      "Sientes que tus emociones son tan intensas que a menudo 'toman el volante' y dices o haces cosas de las que luego te arrepientes.",
      "Te tragas la rabia, la tristeza o la molestia para evitar el conflicto, hasta que terminas explotando o enfermándote.",
      "Experimentas una enorme dificultad para calmarte cuando algo no sale como esperabas o cuando te sientes rechazado/a.",
      "Sueles juzgarte por sentirte mal ('no debería sentirme así', 'tengo que ser fuerte'), añadiendo culpa a tu dolor.",
      "Quieres aprender a comunicarte con firmeza y calma, sin ponerte a la defensiva ni perder el control.",
    ],
    reassuranceNote:
      "Las emociones no son errores de diseño; son señales fisiológicas diseñadas para protegerte y orientarte. Aprender su lenguaje cambia por completo tu experiencia de vida.",
    methodologyOverview:
      "Basado en las habilidades de Regulación Emocional y Tolerancia al Malestar de la Terapia Dialéctico-Conductual (DBT) de Marsha Linehan, complementadas con neurociencia afectiva. Menos teoría abstracta y mucho más entrenamiento práctico de habilidades aplicables en minutos.",
    methodologyPhases: [
      {
        number: "01",
        title: "Alfabetización Emocional & Mapeo Corporal",
        subtitle: "Aprender a nombrar y ubicar la emoción antes de que escale",
        description:
          "Enseñamos a distinguir entre la emoción primaria (el mensaje original) y la emoción secundaria (la reacción defensiva). Mapeamos dónde se siente cada emoción en tu cuerpo antes de que se desborde.",
        keyOutcomes: [
          "Identificación temprana de los primeros signos de activación física",
          "Diferenciación clara entre enojo, tristeza, miedo, frustración y vergüenza",
          "Desactivación del juicio moral sobre lo que sientes",
        ],
      },
      {
        number: "02",
        title: "Protocolos TIPP & Tolerancia al Malestar",
        subtitle: "Herramientas de rescate para momentos de crisis",
        description:
          "Entrenamos protocolos basados en fisiología: modulación térmica, respiración paced, relajación muscular diferencial y distracción consciente para sobrevivir a momentos difíciles sin empeorarlos.",
        keyOutcomes: [
          "Capacidad de frenar impulsos destructivos en los primeros 60 segundos",
          "Técnicas corporales para bajar la frecuencia cardíaca y la adrenalina",
          "Reducción sustancial de episodios de reactividad o gritos",
        ],
      },
      {
        number: "03",
        title: "Reestructuración de Creencias & Acción Opuesta",
        subtitle: "Transformar la energía de la emoción en conducta sabia",
        description:
          "Aprendes la técnica de 'Acción Opuesta': cuando la emoción te impulsa a una conducta perjudicial (ej. la culpa te impulsa a aislarte o la rabia a agredir), aprendes a ejecutar la acción constructiva opuesta.",
        keyOutcomes: [
          "Desconexión entre el impulso emocional y la conducta externa",
          "Uso del enojo como energía para poner límites saludables",
          "Uso de la tristeza como espacio de cuidado y reflexión",
        ],
      },
      {
        number: "04",
        title: "Maestría Relacional & Asertividad DEAR MAN",
        subtitle: "Expresar lo que sientes con elegancia y firmeza",
        description:
          "Entrenamos la fórmula DEAR MAN de DBT para pedir lo que necesitas, decir que no y mantener tu autorrespeto y la calidad de tus vínculos intactos en cualquier conversación difícil.",
        keyOutcomes: [
          "Conversaciones difíciles sostenidas con serenidad y aplomo",
          "Protección de tu autoestima en situaciones de alta presión",
          "Estabilidad emocional cotidiana duradera y medible",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Enfoque Cognitivo-Conductual",
      title: "El Enfoque Cognitivo-Conductual de la Dra. Mariana Caicedo",
      lead: "El Enfoque Cognitivo-Conductual enseña que las emociones no ocurren en el vacío: son el resultado de cómo interpretamos la realidad. La Dra. Mariana Caicedo te entrena para intervenir en ese diálogo interno y regular tu respuesta conductual con serenidad.",
      quote:
        "Entre el estímulo y la respuesta hay un espacio. En ese espacio reside nuestro poder de elegir nuestra respuesta. En nuestra respuesta yacen nuestro crecimiento y nuestra libertad.",
      pillars: [
        {
          title: "Regulación Cognitivo-Conductual",
          description:
            "Entrenamiento estructurado en reestructuración cognitiva y modificación de conducta para responder con sabiduría en lugar de reaccionar impulsivamente.",
        },
        {
          title: "Enfoque Somático y Neurobiológico",
          description:
            "Comprendemos que las emociones son primero corporales y luego mentales. Trabajamos con ambos niveles en armonía.",
        },
        {
          title: "Guías y Hojas de Trabajo Prácticas",
          description:
            "Te llevas plantillas y ejercicios de registro claros para registrar tu progreso y afianzar las habilidades en tu día a día.",
        },
        {
          title: "Validación Radical",
          description:
            "Tus emociones tienen sentido dentro de tu historia. Te ayudamos a comprenderlas para que dejen de ser una tormenta.",
        },
      ],
      evidenceNote:
        "Las técnicas cognitivo-conductuales de regulación emocional constituyen el estándar de oro respaldado por la APA para el manejo de la impulsividad y la reactividad afectiva.",
    },
    transformationBenefits: [
      {
        title: "Serenidad ante situaciones estresantes",
        description: "Mantener el control de tus palabras y acciones cuando las cosas se complican en el trabajo o en casa.",
      },
      {
        title: "Cero culpa por sentir lo que sientes",
        description: "Reconciliarte con todas tus emociones, aprendiendo a escucharlas como sabias consejeras.",
      },
      {
        title: "Fin de los arranques impulsivos",
        description: "Aprender a hacer una pausa estratégica antes de reaccionar, evitando daños innecesarios a tus relaciones.",
      },
      {
        title: "Comunicación asertiva y persuasiva",
        description: "Decir exactamente lo que piensas y necesitas de manera que la otra persona pueda escucharte y respetarte.",
      },
      {
        title: "Mejor salud física y menos somatización",
        description: "Menor tensión muscular, dolores de cabeza o molestias gastrointestinales causadas por reprimir el estrés.",
      },
      {
        title: "Mayor disfrute de tus vínculos",
        description: "Conectar con tu pareja, familia y colegas desde la empatía, la autenticidad y el respeto mutuo.",
      },
    ],
    sessionExperience: {
      title: "¿Cómo es una sesión de Gestión Emocional?",
      description: "Dinámica, participativa y orientada a la acción desde el primer encuentro.",
      steps: [
        {
          step: "1",
          title: "Revisión de registros y situaciones clave",
          detail: "Analizamos una situación real de la semana donde tus emociones hayan sido intensas para decodificar qué ocurrió paso a paso.",
        },
        {
          step: "2",
          title: "Enseñanza de una nueva habilidad DBT",
          detail: "La Dra. Mariana Caicedo te enseña una técnica concreta con ejemplos visuales claros y aplicaciones prácticas.",
        },
        {
          step: "3",
          title: "Role-play y ensayo guiado",
          detail: "Ensayamos juntos la técnica simulando una conversación o situación real hasta que te sientas cómodo/a aplicándola.",
        },
        {
          step: "4",
          title: "Misión semanal",
          detail: "Definimos un plan claro de aplicación cotidiana con recordatorios sencillos para afianzar el hábito.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Es esto lo mismo que terapia psicológica tradicional?",
        answer:
          "Comparte los fundamentos de la psicoterapia clínica, pero tiene un componente pedagógico y de entrenamiento de habilidades mucho más marcado. Se enfoca intensamente en el 'cómo actuar aquí y ahora' con herramientas concretas, además de explorar las raíces históricas de tus patrones.",
      },
      {
        question: "¿Esto me servirá si suelo explotar de rabia rápidamente?",
        answer:
          "Absolutamente. La rabia explosiva casi siempre responde a una falta de registro de las señales tempranas de molestia y a la carencia de técnicas de enfriamiento neurofisiológico. Entrenarás justamente cómo desactivar la mecha antes de que ocurra la explosión.",
      },
      {
        question: "¿Qué pasa si por el contrario tiendo a callarme todo y no siento nada?",
        answer:
          "Esa desconexión es un mecanismo de defensa llamado 'embotamiento afectivo'. El proceso te enseñará a reconectar con tus emociones de forma segura, gradual y sin miedo a quedar desbordado/a.",
      },
      {
        question: "¿Cuántas sesiones suele requerir este entrenamiento?",
        answer:
          "Un módulo básico de entrenamiento en habilidades emocionales suele abarcar entre 6 y 10 sesiones, pudiendo continuarse con profundización individual según tus metas personales.",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Quisiera información sobre el servicio de Gestión Emocional con Soulmar 💛",
  },

  "valoracion-psicologica": {
    id: "assessment",
    slug: "valoracion-psicologica",
    title: "Valoración Psicológica",
    shortTitle: "Valoración",
    categoryBadge: "Evaluación Diagnóstica • Dra. Mariana Caicedo",
    tagline: "Una radiografía clínica científica para entender tus patrones y trazar un mapa claro.",
    heroDescription:
      "Una evaluación psicológica integral, estructurada y basada en instrumentos psicométricos validados internacionalmente. Conoce con precisión la arquitectura de tu mente y obtén una hoja de ruta terapéutica personalizada.",
    themeColor: "#1d1d1f",
    secondaryColor: "#8da9c4",
    iconName: "ClipboardList",
    heroImage: "/images/desktop-modules/emuna.png",
    quickSpecs: {
      duration: "Proceso estructurado de 2 a 3 sesiones de 60 min",
      modality: "100% Online (Entrevistas clínicas + Batería psicométrica digital)",
      approach: "Evaluación Clínica Cognitivo-Conductual & DSM-5-TR",
      professional: "Dra. Mariana Caicedo • Psicóloga Clínica",
      frequency: "Sesiones programadas consecutivas para entrega ágil",
      confidentiality: "Informe clínico formal con firma profesional y código deontológico",
    },
    resonanceQuestions: [
      "Llevas tiempo sintiéndote diferente o con malestar, pero no sabes con exactitud qué diagnóstico o condición tienes.",
      "Has pasado por terapias previas sin una claridad diagnóstica estructurada ni objetivos medibles.",
      "Te preguntas si lo que experimentas es ansiedad generalizada, depresión, TDAH del adulto, estrés postraumático o burnout.",
      "Necesitas un informe psicológico profesional formal para un trámite académico, laboral o derivación médica/psiquiátrica.",
      "Deseas un diagnóstico certero y científico antes de iniciar un proceso de psicoterapia prolongado.",
    ],
    reassuranceNote:
      "Una valoración psicológica no busca etiquetarte ni encasillarte en una casilla rígida. Su propósito es darte un mapa claro, compasivo y científico para que entiendas tu historia y sepas exactamente por dónde empezar a sanar.",
    methodologyOverview:
      "El proceso sigue los más estrictos estándares del Colegio Colombiano de Psicólogos y la APA. Combina la entrevista clínica semiestructurada en profundidad con cuestionarios psicométricos baremados internacionalmente, culminando en un informe escrito y una sesión de devolución.",
    methodologyPhases: [
      {
        number: "01",
        title: "Anamnesis Clínica & Entrevista en Profundidad",
        subtitle: "Comprender tu biografía y sintomatología",
        description:
          "Sesión inicial de 60 minutos donde exploramos en detalle tu motivo de consulta, antecedentes familiares, historia médica, factores biográficos, patrones de apego y manifestaciones actuales del malestar.",
        keyOutcomes: [
          "Delimitación clara de las áreas a evaluar psicométricamente",
          "Mapeo de factores de riesgo, mantenedores y recursos protectores",
          "Encuadre transparente de los instrumentos a utilizar",
        ],
      },
      {
        number: "02",
        title: "Batería Psicométrica Estandarizada",
        subtitle: "Aplicación de instrumentos científicos validados",
        description:
          "Administración de pruebas psicométricas digitales estandarizadas (inventarios de personalidad, escalas de ansiedad, depresión, regulación emocional, atención y funcionamiento cognitivo) con rigurosidad técnica.",
        keyOutcomes: [
          "Medición cuantitativa y cualitativa comparada con baremos poblacionales",
          "Análisis de consistencia interna y validez de respuestas",
          "Integración de datos en una hipótesis diagnóstica funcional",
        ],
      },
      {
        number: "03",
        title: "Sesión de Devolución & Entrega de Informe",
        subtitle: "Tu mapa claro explicado en lenguaje humano",
        description:
          "Sesión final donde la Dra. Mariana Caicedo te entrega y explica personalmente tu informe clínico completo, respondiendo todas tus dudas y proponiéndote un plan terapéutico específico para tus necesidades.",
        keyOutcomes: [
          "Informe clínico formal en formato digital seguro con firma profesional",
          "Comprensión clara y sin tabúes de tu diagnóstico o estado psicológico",
          "Recomendaciones terapéuticas paso a paso para tu recuperación",
        ],
      },
    ],
    clinicalApproach: {
      badge: "Evaluación Cognitivo-Conductual",
      title: "El Enfoque Diagnóstico de la Dra. Mariana Caicedo",
      lead: "La Dra. Mariana Caicedo fundamenta su proceso de valoración en el Enfoque Cognitivo-Conductual y el Análisis Funcional de la Conducta, evaluando con rigurosidad técnica los factores desencadenantes, variables mediadoras y consecuencias del comportamiento.",
      quote:
        "Nombrar con precisión lo que nos pasa no es una condena; es el primer acto de libertad. Cuando por fin entiendes el nombre de tu tormenta, puedes comenzar a construir el refugio adecuado.",
      pillars: [
        {
          title: "Análisis Funcional Cognitivo-Conductual",
          description:
            "Mapeo científico y objetivo de la interacción entre estímulos, pensamientos automáticos, respuestas corporales y conductas.",
        },
        {
          title: "Informe Clínico Formal con Validez",
          description:
            "Documento profesional completo con antecedentes, resultados, conclusiones diagnósticas y plan de intervención recomendado.",
        },
        {
          title: "Explicación Humana y Cercana",
          description:
            "No te entregamos un papel frío lleno de números incomprensibles; te explicamos qué significa cada dato para tu vida diaria.",
        },
        {
          title: "Hoja de Ruta Personalizada",
          description:
            "Finalizas la valoración sabiendo exactamente qué tipo de terapia necesitas, qué áreas trabajar y con qué prioridad.",
        },
      ],
      evidenceNote:
        "La evaluación cognitivo-conductual garantiza un diagnóstico operativo conforme al DSM-5-TR y un plan de tratamiento directo, medible y eficaz.",
    },
    transformationBenefits: [
      {
        title: "Certeza y fin de la incertidumbre",
        description: "Dejar de especular en internet y conocer con respaldo profesional qué es lo que realmente te ocurre.",
      },
      {
        title: "Ahorro de tiempo y dinero en terapias",
        description: "Tener un diagnóstico exacto permite focalizar la intervención desde el primer día sin dar rodeos inútiles.",
      },
      {
        title: "Informe válido para terceros",
        description: "Documento oficial listo para presentar ante psiquiatras, instituciones educativas o empleadores si lo requieres.",
      },
      {
        title: "Autoconocimiento profundo",
        description: "Comprender tus fortalezas psicológicas, rasgos de personalidad y áreas de vulnerabilidad con objetividad.",
      },
      {
        title: "Plan de acción estructurado",
        description: "Una hoja de ruta clara de los pasos clínicos necesarios para recuperar tu estabilidad y bienestar.",
      },
      {
        title: "Alivio y validación emocional",
        description: "Comprender que lo que sientes tiene una explicación biológica y psicológica real, y que tiene solución.",
      },
    ],
    sessionExperience: {
      title: "¿Cómo se desarrolla el proceso de Valoración Psicológica?",
      description: "Un proceso ágil, transparente y con entrega de resultados garantizada.",
      steps: [
        {
          step: "1",
          title: "Entrevista clínica en profundidad (60 min)",
          detail: "Videollamada privada donde la Dra. Mariana Caicedo recopila toda tu historia y define las pruebas específicas a aplicar.",
        },
        {
          step: "2",
          title: "Aplicación de pruebas psicométricas",
          detail: "Completas cuestionarios digitales especializados desde tu computador con instrucciones claras y acompañamiento.",
        },
        {
          step: "3",
          title: "Calificación y redacción del informe",
          detail: "La Dra. Mariana Caicedo analiza los resultados, contrasta baremos y redacta el informe clínico detallado.",
        },
        {
          step: "4",
          title: "Sesión de devolución y entrega de informe (60 min)",
          detail: "Nos reunimos para explicarte cada apartado del documento, resolver tus dudas y entregarte tu hoja de ruta.",
        },
      ],
    },
    faqs: [
      {
        question: "¿Qué incluye el informe clínico final?",
        answer:
          "El informe incluye: Datos sociodemográficos, Motivo de consulta, Antecedentes relevantes, Instrumentos psicométricos aplicados y sus puntuaciones baremadas, Análisis cualitativo y cuantitativo, Conclusiones diagnósticas (DSM-5-TR) y Recomendaciones de intervención específicas. Se entrega en PDF protegido con firma profesional de la Dra. Mariana Caicedo.",
      },
      {
        question: "¿Esta valoración es válida para psiquiatría o universidades?",
        answer:
          "Sí. Los informes emitidos por la Dra. Mariana Caicedo cumplen con todos los requerimientos éticos, técnicos y legales del Colegio Colombiano de Psicólogos y son ampliamente aceptados por médicos psiquiatras, neurólogos, universidades y empresas.",
      },
      {
        question: "¿Cuánto tiempo toma todo el proceso de valoración?",
        answer:
          "El proceso completo suele tomar entre 7 y 14 días desde la primera sesión hasta la sesión de devolución con entrega del informe, dependiendo de la agilidad en la aplicación de las pruebas.",
      },
      {
        question: "¿Qué pasa después de la valoración?",
        answer:
          "Una vez finalizada la sesión de devolución, tienes total libertad para iniciar tu proceso terapéutico con la Dra. Mariana Caicedo en Soulmar bajo el plan trazado, o llevar tu informe al profesional o institución que tú decidas.",
      },
    ],
    whatsappMessage: "Hola Dra. Mariana Caicedo 🌿✨ Quisiera agendar un proceso de Valoración Psicológica con Soulmar 💙",
  },
}
