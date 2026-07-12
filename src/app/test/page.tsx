"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/context/LanguageContext"
import { FooterSection } from "@/components/home/FooterSection"
import Link from "next/link"
import { 
  Brain, 
  ChevronRight, 
  ArrowRight, 
  Smile, 
  Activity, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react"

const LOCALIZED_DATA = {
  es: {
    title: "Test de Bienestar Emocional",
    subtitle: "Descubre tu estado mental actual y obtén recomendaciones personalizadas en menos de 2 minutos.",
    startBtn: "Comenzar Test",
    questionProgress: "Pregunta {current} de {total}",
    nextBtn: "Siguiente",
    seeResultsBtn: "Ver Resultados",
    restartBtn: "Realizar de nuevo",
    bookBtn: "Agendar Sesión de Terapia",
    ebooksBtn: "Ver Ebooks Gratuitos",
    resultsTitle: "Tu Diagnóstico de Bienestar",
    resultsDescription: "Basado en tus respuestas, este es tu nivel actual de bienestar emocional y mental:",
    levels: {
      high: {
        name: "Bienestar Emocional Óptimo",
        description: "¡Felicidades! Tienes un excelente manejo del estrés y una sólida base de herramientas emocionales. Sigues conectado/a con tu propósito y en equilibrio. Te recomendamos mantener esta constancia leyendo nuestras guías de mindset.",
        action: "Ver Ebooks"
      },
      moderate: {
        name: "Bienestar Emocional Moderado",
        description: "Estás haciendo un buen trabajo, pero experimentas picos de estrés o cansancio que podrían desgastarte a largo plazo. Aprender técnicas de regulación emocional te vendría muy bien. Te recomendamos descargar nuestros Ebooks gratuitos o agendar una sesión inicial.",
        action: "Ver Recursos"
      },
      low: {
        name: "Atención Emocional Recomendada",
        description: "Tu mente y cuerpo te están enviando señales claras de alerta (estrés constante, fatiga o desconexión). No tienes por qué pasar por esto a solas. Te recomendamos agendar una sesión de terapia online con nuestros profesionales para recibir un acompañamiento personalizado.",
        action: "Agendar Terapia"
      }
    },
    questions: [
      {
        text: "¿Con qué frecuencia experimentas tensión física o mental en tu día a día?",
        options: [
          { text: "Nunca o rara vez", score: 3 },
          { text: "A veces", score: 2 },
          { text: "Frecuentemente", score: 1 },
          { text: "Constantemente", score: 0 }
        ]
      },
      {
        text: "¿Qué tan fácil te resulta concentrarte o mantener la mente en calma?",
        options: [
          { text: "Muy fácil", score: 3 },
          { text: "Moderadamente fácil", score: 2 },
          { text: "Difícil", score: 1 },
          { text: "Muy difícil", score: 0 }
        ]
      },
      {
        text: "¿Cómo calificarías la calidad de tu sueño en las últimas semanas?",
        options: [
          { text: "Excelente o muy buena", score: 3 },
          { text: "Buena", score: 2 },
          { text: "Regular", score: 1 },
          { text: "Mala o insatisfactoria", score: 0 }
        ]
      },
      {
        text: "¿Sientes que cuentas con herramientas emocionales para afrontar los retos diarios?",
        options: [
          { text: "Sí, completamente", score: 3 },
          { text: "En su mayoría", score: 2 },
          { text: "Tengo pocas herramientas", score: 1 },
          { text: "No cuento con ninguna", score: 0 }
        ]
      },
      {
        text: "¿Qué tan conectado/a te sientes con tus propósitos y tus actividades cotidianas?",
        options: [
          { text: "Totalmente conectado/a", score: 3 },
          { text: "Parcialmente conectado/a", score: 2 },
          { text: "Desconectado/a", score: 1 },
          { text: "Totalmente desconectado/a", score: 0 }
        ]
      }
    ]
  },
  en: {
    title: "Emotional Well-being Assessment",
    subtitle: "Discover your current mental state and get personalized recommendations in less than 2 minutes.",
    startBtn: "Start Assessment",
    questionProgress: "Question {current} of {total}",
    nextBtn: "Next",
    seeResultsBtn: "View Results",
    restartBtn: "Take it again",
    bookBtn: "Book a Therapy Session",
    ebooksBtn: "View Free Ebooks",
    resultsTitle: "Your Well-being Assessment",
    resultsDescription: "Based on your answers, here is your current level of emotional and mental well-being:",
    levels: {
      high: {
        name: "Optimal Emotional Well-being",
        description: "Congratulations! You manage stress effectively and have a solid foundation of emotional tools. You remain connected to your purpose and in balance. We recommend maintaining this path by reading our mindset guides.",
        action: "View Ebooks"
      },
      moderate: {
        name: "Moderate Emotional Well-being",
        description: "You're doing well, but you experience stress or fatigue peaks that could wear you down long term. Learning emotional regulation techniques would benefit you. We recommend downloading our free Ebooks or booking an initial session.",
        action: "View Resources"
      },
      low: {
        name: "Emotional Support Recommended",
        description: "Your mind and body are sending clear alert signals (constant stress, fatigue, or disconnection). You don't have to go through this alone. We highly recommend booking an online therapy session with our professionals for personalized support.",
        action: "Book Therapy"
      }
    },
    questions: [
      {
        text: "How often do you experience physical or mental tension in your daily life?",
        options: [
          { text: "Never or rarely", score: 3 },
          { text: "Sometimes", score: 2 },
          { text: "Frequently", score: 1 },
          { text: "Constantly", score: 0 }
        ]
      },
      {
        text: "How easy is it for you to focus or keep your mind calm?",
        options: [
          { text: "Very easy", score: 3 },
          { text: "Moderately easy", score: 2 },
          { text: "Difficult", score: 1 },
          { text: "Very difficult", score: 0 }
        ]
      },
      {
        text: "How would you rate the quality of your sleep in recent weeks?",
        options: [
          { text: "Excellent or very good", score: 3 },
          { text: "Good", score: 2 },
          { text: "Fair", score: 1 },
          { text: "Poor or unsatisfactory", score: 0 }
        ]
      },
      {
        text: "Do you feel you have emotional tools to cope with daily challenges?",
        options: [
          { text: "Yes, completely", score: 3 },
          { text: "For the most part", score: 2 },
          { text: "I have few tools", score: 1 },
          { text: "I have none at all", score: 0 }
        ]
      },
      {
        text: "How connected do you feel to your purpose and daily activities?",
        options: [
          { text: "Fully connected", score: 3 },
          { text: "Partially connected", score: 2 },
          { text: "Disconnected", score: 1 },
          { text: "Totally disconnected", score: 0 }
        ]
      }
    ]
  }
}

export default function TestPage() {
  const { language } = useTranslation()
  const activeLang = language === "en" ? "en" : "es"
  const content = LOCALIZED_DATA[activeLang]

  const [step, setStep] = useState<"welcome" | "quiz" | "results">("welcome")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null)

  const handleStart = () => {
    setStep("quiz")
    setCurrentIdx(0)
    setAnswers([])
    setSelectedOpt(null)
  }

  const handleOptionSelect = (score: number) => {
    setSelectedOpt(score)
  }

  const handleNext = () => {
    if (selectedOpt === null) return
    const newAnswers = [...answers, selectedOpt]
    setAnswers(newAnswers)
    setSelectedOpt(null)

    if (currentIdx + 1 < content.questions.length) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setStep("results")
    }
  }

  const calculateTotal = () => {
    return answers.reduce((acc, val) => acc + val, 0)
  }

  const getResultLevel = () => {
    const total = calculateTotal()
    const maxScore = content.questions.length * 3
    const ratio = total / maxScore

    if (ratio >= 0.75) return "high"
    if (ratio >= 0.4) return "moderate"
    return "low"
  }

  const resultType = getResultLevel()
  const resultInfo = content.levels[resultType]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between pt-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[40%] h-[30%] bg-[#8da9c4]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[40%] bg-[#c9cba3]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-12 flex-grow flex items-center justify-center relative z-10">
        <div className="w-full max-w-2xl bg-white/40 dark:bg-white/[0.02] backdrop-blur-2xl rounded-[32px] p-8 md:p-12 border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col">
          
          <AnimatePresence mode="wait">
            {step === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8 py-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-[#8da9c4] flex items-center justify-center mx-auto shadow-xl shadow-[#8da9c4]/20">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] dark:text-white leading-tight font-playfair">
                    {content.title}
                  </h1>
                  <p className="text-lg text-foreground/60 max-w-md mx-auto leading-relaxed">
                    {content.subtitle}
                  </p>
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStart}
                    className="bg-[#8da9c4] text-white hover:bg-[#8da9c4]/90 rounded-full px-10 py-4 font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-[#8da9c4]/10 inline-flex items-center gap-2"
                  >
                    {content.startBtn}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "quiz" && (
              <motion.div
                key={`quiz-${currentIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-foreground/40">
                    <span>{content.title}</span>
                    <span>
                      {content.questionProgress
                        .replace("{current}", String(currentIdx + 1))
                        .replace("{total}", String(content.questions.length))}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#8da9c4]" 
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIdx + 1) / content.questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight leading-snug">
                  {content.questions[currentIdx].text}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {content.questions[currentIdx].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(opt.score)}
                      className={`w-full p-6 rounded-2xl border text-left font-bold text-sm transition-all duration-300 flex items-center justify-between outline-none ${
                        selectedOpt === opt.score
                          ? "border-[#8da9c4] bg-[#8da9c4]/5 dark:bg-[#8da9c4]/10 text-primary"
                          : "border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 bg-transparent text-foreground/80 hover:text-foreground"
                      }`}
                    >
                      <span>{opt.text}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        selectedOpt === opt.score
                          ? "border-[#8da9c4] bg-[#8da9c4] text-white"
                          : "border-black/20 dark:border-white/20"
                      }`}>
                        {selectedOpt === opt.score && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: selectedOpt !== null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedOpt !== null ? 0.98 : 1 }}
                    onClick={handleNext}
                    disabled={selectedOpt === null}
                    className={`rounded-full px-8 py-3.5 font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-2 ${
                      selectedOpt !== null
                        ? "bg-[#8da9c4] text-white hover:bg-[#8da9c4]/90 hover:-translate-y-0.5"
                        : "bg-black/5 dark:bg-white/5 text-foreground/30 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <span>{currentIdx + 1 === content.questions.length ? content.seeResultsBtn : content.nextBtn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8"
              >
                {/* Result Icon */}
                <div className="flex justify-center">
                  {resultType === "high" && (
                    <div className="w-20 h-20 rounded-3xl bg-[#c9cba3] flex items-center justify-center shadow-xl shadow-[#c9cba3]/20">
                      <Smile className="w-10 h-10 text-white" />
                    </div>
                  )}
                  {resultType === "moderate" && (
                    <div className="w-20 h-20 rounded-3xl bg-[#ffc971] flex items-center justify-center shadow-xl shadow-[#ffc971]/20">
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                  )}
                  {resultType === "low" && (
                    <div className="w-20 h-20 rounded-3xl bg-[#ea8c55] flex items-center justify-center shadow-xl shadow-[#ea8c55]/20">
                      <AlertCircle className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>

                {/* Score */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8da9c4]">
                    {content.resultsTitle}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-white font-playfair">
                    {resultInfo.name}
                  </h2>
                  <p className="text-sm text-foreground/50 max-w-md mx-auto pt-2">
                    {content.resultsDescription}
                  </p>
                </div>

                {/* Description Card */}
                <div className="p-6 md:p-8 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-sm md:text-base leading-relaxed text-foreground/75 font-medium max-w-xl mx-auto">
                  {resultInfo.description}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto pt-4">
                  {resultType === "low" || resultType === "moderate" ? (
                    <Link href="/#agendamiento" className="w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full bg-[#8da9c4] text-white hover:bg-[#8da9c4]/90 rounded-full px-8 py-3.5 font-bold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-[#8da9c4]/15"
                      >
                        {content.bookBtn}
                      </motion.button>
                    </Link>
                  ) : null}

                  <Link href="/#ebooks" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-8 py-3.5 font-bold text-xs tracking-wider uppercase transition-all"
                    >
                      {content.ebooksBtn}
                    </motion.button>
                  </Link>
                </div>

                {/* Restart */}
                <div className="pt-6">
                  <button 
                    onClick={handleStart}
                    className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/40 hover:text-foreground flex items-center gap-1.5 mx-auto transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{content.restartBtn}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FooterSection />
    </div>
  )
}
