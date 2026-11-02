"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { useMedia } from "@/context/MediaContext"

interface AtmosphereContextType {
  isPlaying: boolean
  isFading: boolean
  isEnabled: boolean
  songTitle: string
  togglePlay: () => void
  fadeIn: (targetVolume?: number, durationMs?: number) => void
  fadeOut: (durationMs?: number) => void
}

const AtmosphereContext = createContext<AtmosphereContextType | undefined>(undefined)

export function AtmosphereProvider({ children }: { children: React.ReactNode }) {
  const { media } = useMedia()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeAnimRef = useRef<number | null>(null)
  const isPlayingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFading, setIsFading] = useState(false)

  const DEFAULT_AUDIO_URL = "https://druynmdkgdwuohojmptc.supabase.co/storage/v1/object/public/media/slots/audio_atmosphere-default.mp3"

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
    // Keep safe fallbacks
  }

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const cancelFade = useCallback(() => {
    if (fadeAnimRef.current !== null) {
      cancelAnimationFrame(fadeAnimRef.current)
      fadeAnimRef.current = null
    }
  }, [])

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

  useEffect(() => {
    if (!isEnabled && audioRef.current && isPlayingRef.current) {
      cancelFade()
      audioRef.current.pause()
      audioRef.current.volume = 0
      setIsPlaying(false)
      setIsFading(false)
    }
  }, [isEnabled, cancelFade])

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

  return (
    <AtmosphereContext.Provider
      value={{
        isPlaying,
        isFading,
        isEnabled,
        songTitle,
        togglePlay,
        fadeIn,
        fadeOut,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  )
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext)
  if (!context) {
    throw new Error("useAtmosphere must be used within an AtmosphereProvider")
  }
  return context
}
