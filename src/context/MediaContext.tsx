"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { MEDIA_SLOTS } from "@/lib/mediaConfig"

interface MediaContextType {
  media: Record<string, string>
  getMediaUrl: (slotKey: string, fallbackDefault?: string) => string
  updateMediaUrl: (slotKey: string, newUrl: string) => void
  deleteMediaSlot: (slotKey: string) => void
  refreshMedia: () => Promise<void>
}

const MediaContext = createContext<MediaContextType>({
  media: {},
  getMediaUrl: (slotKey: string, fallbackDefault?: string) => fallbackDefault || "",
  updateMediaUrl: () => {},
  deleteMediaSlot: () => {},
  refreshMedia: async () => {}
})

// Mapeo inicial de fábrica
const factoryDefaultMedia: Record<string, string> = {}
MEDIA_SLOTS.forEach(slot => {
  factoryDefaultMedia[slot.key] = slot.defaultUrl
})

export function MediaProvider({ children }: { children: React.ReactNode }) {
  // Inicializar estado usando localStorage si está en cliente para renderizado instantáneo
  const [media, setMedia] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("soulmar_media_registry")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === "object") {
            return { ...factoryDefaultMedia, ...parsed }
          }
        }
      } catch (e) {}
    }
    return factoryDefaultMedia
  })

  const refreshMedia = async () => {
    try {
      const res = await fetch("/api/media", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.media) {
          // data.media contiene las asignaciones actuales o "__EMPTY__" para eliminadas
          const merged = { ...factoryDefaultMedia, ...data.media }
          setMedia(merged)
          try {
            localStorage.setItem("soulmar_media_registry", JSON.stringify(data.media))
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn("[MediaProvider] Error loading media:", err)
    }
  }

  useEffect(() => {
    refreshMedia()
  }, [])

  /**
   * getMediaUrl: Retorna la URL de la foto.
   * Si el usuario la eliminó explícitamente ("__EMPTY__"), retorna cadena vacía ""
   * para que la caja quede completamente limpia y vacía sin mostrar fotos viejas.
   */
  const getMediaUrl = (slotKey: string, fallbackDefault?: string) => {
    const val = media[slotKey]
    if (val === "__EMPTY__") return ""
    if (val) return val
    const slot = MEDIA_SLOTS.find(s => s.key === slotKey)
    return slot?.defaultUrl || fallbackDefault || ""
  }

  const updateMediaUrl = (slotKey: string, newUrl: string) => {
    setMedia(prev => {
      const next = { ...prev, [slotKey]: newUrl }
      try {
        localStorage.setItem("soulmar_media_registry", JSON.stringify(next))
      } catch (e) {}
      return next
    })
  }

  const deleteMediaSlot = (slotKey: string) => {
    setMedia(prev => {
      const next = { ...prev, [slotKey]: "__EMPTY__" }
      try {
        localStorage.setItem("soulmar_media_registry", JSON.stringify(next))
      } catch (e) {}
      return next
    })
  }

  return (
    <MediaContext.Provider value={{ media, getMediaUrl, updateMediaUrl, deleteMediaSlot, refreshMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  return useContext(MediaContext)
}
