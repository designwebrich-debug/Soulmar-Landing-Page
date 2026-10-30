"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { useMedia } from "@/context/MediaContext"

/**
 * Soulmar Atmosphere Player
 * 
 * Experiencia sonora ambiental: "Un momento para volver a ti."
 * Botón flotante Liquid Glass Apple en la esquina inferior izquierda.
 * - 100% Voluntario (Cero autoplay).
 * - Fade-in gradual y perceptible desde 0.08 hasta 0.50.
 * - Fade-out suave antes de pausar.
 * - Single-instance persistente a través de la navegación.
 * - Desactivación dinámica desde panel de control.
 */
export function SoulmarAtmospherePlayer() {
  const { media } = useMedia()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeAnimRef = useRef<number | null>(null)
  const isPlayingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const DEFAULT_AUDIO_URL = "https://druynmdkgdwuohojmptc.supabase.co/storage/v1/object/public/media/slots/audio_atmosphere-default.mp3"

  // Sincronizar URL de audio y configuración
  const rawAudio = media["audio_atmosphere"]
  const audioUrl = (rawAudio && rawAudio !== "__EMPTY__") ? rawAudio : DEFAULT_AUDIO_URL
  let isEnabled = true
  let songTitle = "Soulmar Atmosphere — Un momento para volver a ti"

  try {
    const rawMeta = media["audio_atmosphere_meta"]
    if (rawMeta) {
      const parsed = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta
      if (parsed && typeof parsed.isEnabled === "boolean") {
        isEnabled = parsed.isEnabled
      }
      if (parsed?.title) {
        songTitle = parsed.title
      }
    }
  } catch (e) {
    // Mantener valores seguros si hay error al parsear
  }

  // Mantener isPlayingRef sincronizado
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // Limpiar animaciones de fade activas
  const cancelFade = useCallback(() => {
    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current)
      fadeAnimRef.current = null
    }
  }, [])

  // Inicializar o actualizar la pista de audio cuando cambie audioUrl
  useEffect(() => {
    if (!audioUrl || audioUrl === "__EMPTY__") {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsPlaying(false)
        setIsFading(false)
      }
      return
    }

    if (!audioRef.current) {
      const audio = new Audio(audioUrl)
      audio.preload = "none"
      audio.loop = true
      audio.volume = 0
      audio.crossOrigin = "anonymous"

      audio.onended = () => {
        setIsPlaying(false)
        setIsFading(false)
      }

      audio.onerror = (e) => {
        console.warn("[SoulmarAtmosphere] Audio error:", e)
        setIsPlaying(false)
        setIsFading(false)
      }

      audioRef.current = audio
    } else if (audioRef.current.src !== audioUrl) {
      const wasPlaying = isPlayingRef.current
      audioRef.current.src = audioUrl
      audioRef.current.preload = "none"
      audioRef.current.loop = true
      if (wasPlaying) {
        audioRef.current.volume = 0.5
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }

    return () => {
      cancelFade()
    }
  }, [audioUrl, cancelFade])

  // Si el administrador desactiva el audio en vivo, detener inmediatamente
  useEffect(() => {
    if (!isEnabled && audioRef.current && isPlayingRef.current) {
      cancelFade()
      audioRef.current.pause()
      audioRef.current.volume = 0
      setIsPlaying(false)
      setIsFading(false)
    }
  }, [isEnabled, cancelFade])

  // Fade In: Inicia perceptiblemente en 0.08 y sube suavemente hasta 0.50
  const fadeIn = useCallback((targetVolume = 0.5, durationMs = 2500) => {
    if (!audioRef.current) return
    cancelFade()
    setIsFading(true)

    const audio = audioRef.current
    audio.preload = "auto"
    const startVolume = 0.08
    audio.volume = startVolume

    audio.play().then(() => {
      setIsPlaying(true)
      const startTime = performance.now()

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / durationMs)
        // Curva suave cuadrática
        const currentVol = startVolume + (targetVolume - startVolume) * Math.sin((progress * Math.PI) / 2)
        audio.volume = Math.min(targetVolume, Math.max(0, currentVol))

        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(step)
        } else {
          audio.volume = targetVolume
          setIsFading(false)
          fadeAnimRef.current = null
        }
      }

      fadeAnimRef.current = requestAnimationFrame(step)
    }).catch((err) => {
      console.warn("[SoulmarAtmosphere] Error al iniciar reproducción:", err)
      setIsPlaying(false)
      setIsFading(false)
      cancelFade()
    })
  }, [cancelFade])

  // Fade Out: Baja el volumen de forma armónica antes de pausar
  const fadeOut = useCallback((durationMs = 1500) => {
    if (!audioRef.current) return
    cancelFade()
    setIsFading(true)

    const audio = audioRef.current
    const initialVol = audio.volume
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      const currentVol = Math.max(0, initialVol * (1 - progress))
      audio.volume = currentVol

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(step)
      } else {
        audio.volume = 0
        audio.pause()
        setIsPlaying(false)
        setIsFading(false)
        fadeAnimRef.current = null
      }
    }

    fadeAnimRef.current = requestAnimationFrame(step)
  }, [cancelFade])

  const togglePlay = () => {
    if (!audioRef.current && audioUrl) {
      const audio = new Audio(audioUrl)
      audio.preload = "none"
      audio.loop = true
      audio.volume = 0
      audio.crossOrigin = "anonymous"
      audioRef.current = audio
    }

    if (isPlaying) {
      fadeOut(1500)
    } else {
      fadeIn(0.5, 2500)
    }
  }

  // Ocultar si está desactivado por el administrador
  if (!isEnabled) {
    return null
  }

  return (
    <div
      className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[9995] flex items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ondas sonoras acústicas sutiles cuando está reproduciendo (Apple Zen Pulse) */}
      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0.4 }}
            animate={{ scale: [1, 1.45, 1.8], opacity: [0.35, 0.15, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute w-16 h-16 rounded-full bg-[#8da9c4]/30 dark:bg-[#8da9c4]/20 border border-[#8da9c4]/40"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0.3 }}
            animate={{ scale: [1, 1.3, 1.55], opacity: [0.3, 0.1, 0] }}
            transition={{
              duration: 3,
              delay: 1.2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute w-16 h-16 rounded-full bg-[#ffc971]/20 dark:bg-[#ffc971]/15"
          />
        </div>
      )}

      {/* Botón Circular Liquid Glass Apple */}
      <motion.button
        type="button"
        onClick={togglePlay}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isPlaying ? "Pausar ambiente Soulmar" : "Reproducir ambiente Soulmar"}
        title={isPlaying ? "Pausar ambiente Soulmar" : "Reproducir ambiente Soulmar"}
        className={`liquid-glass relative flex items-center justify-center w-16 h-16 rounded-full cursor-pointer overflow-hidden transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#8da9c4] ${
          isPlaying
            ? "ring-2 ring-[#8da9c4]/80 ring-offset-2 ring-offset-background shadow-[0_10px_35px_rgba(141,169,196,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.95)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.15),inset_0_1.5px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.2)]"
        } bg-white/90 text-neutral-900 border border-white/80 dark:bg-black/85 dark:text-white dark:border-white/20`}
      >
        {/* Apple liquid glass convex specular highlight */}
        <div className="absolute top-0 left-2 right-2 h-7 rounded-full bg-gradient-to-b from-white/70 dark:from-white/25 via-white/10 dark:via-white/5 to-transparent pointer-events-none" />

        {/* Aura interna tenue cuando reproduce */}
        {isPlaying && (
          <div className="absolute inset-0 bg-radial from-[#8da9c4]/20 via-transparent to-transparent pointer-events-none animate-pulse" />
        )}

        {/* Icono Play / Pause con micro-transición */}
        <div className="relative z-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center gap-1 text-[#4a6b82] dark:text-[#a8c5db]"
              >
                <Pause className="w-5 h-5 fill-current stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center text-neutral-800 dark:text-neutral-100 pl-0.5"
              >
                <Play className="w-5 h-5 fill-current stroke-[2.5]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Cápsula de Información Zen en Hover / Play (Tooltip dinámico en escritorio) */}
      <AnimatePresence>
        {(isHovered || isPlaying) && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden md:flex ml-3 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-white/60 dark:border-neutral-800 shadow-[0_8px_20px_rgba(0,0,0,0.08)] pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-[#8da9c4] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                Soulmar Atmosphere
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium leading-tight">
                {isPlaying ? (isFading ? "Ajustando volumen..." : "Un momento para volver a ti") : "Música de calma"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
