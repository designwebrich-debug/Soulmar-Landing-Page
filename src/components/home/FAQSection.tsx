"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "@/context/LanguageContext"

interface FAQItem {
  question: string
  answer: string
}

export function FAQSection() {
  const { language } = useTranslation()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const faqs: FAQItem[] = language === "es" ? [
    {
      question: "¿Qué pasa si nunca antes he ido al psicólogo?",
      answer:
        "La gran mayoría de nuestros consultantes acuden por primera vez. La Dra. Mariana Caicedo te guiará con total naturalidad desde el primer minuto. No necesitas preparar un discurso ni saber exactamente qué decir; empezaremos desde donde tú estés y con lo que sientas."
    },
    {
      question: "¿Con qué frecuencia debo agendar mis sesiones?",
      answer:
        "Se recomienda iniciar con una frecuencia semanal durante las primeras semanas para establecer una base sólida y ver resultados más rápidos. Posteriormente, la frecuencia puede ajustarse a quincenal según tus avances y disponibilidad."
    },
    {
      question: "¿Qué necesito para conectarme a mi sesión online?",
      answer:
        "Solo necesitas un computador, tablet o celular con cámara y micrófono, audífonos para mayor privacidad, una conexión a internet estable y un lugar privado donde puedas hablar con tranquilidad."
    },
    {
      question: "¿Puedo pagar en mi moneda local?",
      answer:
        "Sí. En Colombia recibimos pagos vía Bancolombia, Nequi y tarjetas mediante pasarelas seguras. Para pacientes internacionales en Estados Unidos, Europa o Latinoamérica, habilitamos pagos seguros con tarjeta de crédito o débito internacional con conversión automática."
    },
    {
      question: "¿Cómo sé cuál es el tipo de terapia adecuado para mí?",
      answer:
        "No te preocupes por elegir la especialidad exacta al agendar. En tu primera sesión, la Dra. Mariana Caicedo explorará contigo tus motivos de consulta y personalizará el plan terapéutico que mejor se adapte a tus necesidades específicas."
    },
    {
      question: "¿Las sesiones son totalmente confidenciales y privadas?",
      answer:
        "Absolutamente. Todo lo conversado en consulta está 100% protegido por el secreto profesional y el código deontológico de psicología clínica, bajo plataformas cifradas de punto a punto (Google Meet protegido)."
    }
  ] : [
    {
      question: "What if I have never been to a psychologist before?",
      answer:
        "The vast majority of our clients are attending therapy for the first time. Dr. Mariana Caicedo will guide you naturally from minute one. You don't need to prepare a speech or know what to say; we will start from where you are and what you feel."
    },
    {
      question: "How often should I schedule my sessions?",
      answer:
        "It is recommended to start weekly during the first month to build a solid foundation and experience faster progress. Afterwards, frequency can be adjusted to bi-weekly based on your evolution."
    },
    {
      question: "What do I need to connect to my online session?",
      answer:
        "You only need a computer, tablet, or phone with a camera and microphone, headphones for privacy, a stable internet connection, and a quiet, comfortable space."
    },
    {
      question: "Can I pay in my local currency?",
      answer:
        "Yes. In Colombia we accept local bank transfers, Nequi, and cards. For international patients in the US, Europe, or Latin America, secure international card payments with automatic currency conversion are supported."
    },
    {
      question: "How do I know which therapy type is right for me?",
      answer:
        "Don't worry about choosing an exact label when booking. During your first session, Dr. Mariana Caicedo will explore your goals and tailor the treatment plan to your unique needs."
    },
    {
      question: "Are sessions completely private and confidential?",
      answer:
        "Absolutely. Everything discussed is 100% protected by medical and psychological professional privilege under end-to-end encrypted secure platforms (Google Meet)."
    }
  ]

  return (
    <section 
      id="preguntas-frecuentes"
      className="pt-6 sm:pt-8 md:pt-10 pb-16 md:pb-24 px-4 sm:px-6 md:px-10 max-w-4xl mx-auto transition-colors duration-500"
    >
      {/* SECTION HEADER */}
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8da9c4]">
          {language === "es" ? "Resolvemos tus dudas" : "We answer your questions"}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
          {language === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
        </h2>
        <p className="text-base sm:text-lg text-[#1d1d1f]/60 dark:text-white/50 max-w-xl mx-auto">
          {language === "es"
            ? "Todo lo que necesitas saber antes de iniciar tu proceso en Soulmar"
            : "Everything you need to know before starting your process at Soulmar"}
        </p>
      </div>

      {/* FAQ ACCORDION LIST */}
      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openFaqIndex === idx
          return (
            <div
              key={idx}
              className="bg-white/90 dark:bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                className={`w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg transition-colors cursor-pointer select-none group ${
                  isOpen ? "text-[#1d1d1f] dark:text-white" : "text-[#1d1d1f] dark:text-white hover:text-[#8da9c4] dark:hover:text-[#8da9c4]"
                }`}
                aria-expanded={isOpen}
              >
                <span className={isOpen ? "text-[#1d1d1f] dark:text-white" : "group-hover:text-[#8da9c4] transition-colors"}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-[#8da9c4]" : "text-[#1d1d1f]/40 dark:text-white/40 group-hover:text-[#8da9c4]"
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#1d1d1f]/75 dark:text-white/70 leading-relaxed font-normal border-t border-black/5 dark:border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
