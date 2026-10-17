"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { MEDIA_SLOTS } from "@/lib/mediaConfig"

interface MediaContextType {
  media: Record<string, string>
  getMediaUrl: (slotKey: string, fallbackDefault?: string) => string
  updateMediaUrl: (slotKey: string, newUrl: string) => void
  resetMediaUrl: (slotKey: string) => void
  refreshMedia: () => Promise<void>
}

const MediaContext = createContext<MediaContextType>({
  media: {},
  getMediaUrl: (slotKey: string, fallbackDefault?: string) => fallbackDefault || "",
  updateMediaUrl: () => {},
  resetMediaUrl: () => {},
  refreshMedia: async () => {}
})

// Mapeo inicial por defecto
const initialDefaultMedia: Record<string, string> = {}
MEDIA_SLOTS.forEach(slot => {
  initialDefaultMedia[slot.key] = slot.defaultUrl
})

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [media, setMedia] = useState<Record<string, string>>(initialDefaultMedia)

  const refreshMedia = async () => {
    try {
      // 1. Respaldo local inmediato
      let local: Record<string, string> = {}
      try {
        const stored = localStorage.getItem("soulmar_media_registry")
        if (stored) {
          local = JSON.parse(stored)
        }
      } catch (e) {}

      const res = await fetch("/api/media", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.media) {
          const merged = { ...initialDefaultMedia, ...local, ...data.media }
          setMedia(merged)
          try {
            localStorage.setItem("soulmar_media_registry", JSON.stringify(merged))
          } catch (e) {}
          return
        }
      }

      if (Object.keys(local).length > 0) {
        setMedia({ ...initialDefaultMedia, ...local })
      }
    } catch (err) {
      console.warn("[MediaProvider] Error loading media:", err)
      try {
        const stored = localStorage.getItem("soulmar_media_registry")
        if (stored) {
          setMedia({ ...initialDefaultMedia, ...JSON.parse(stored) })
        }
      } catch (e) {}
    }
  }

  useEffect(() => {
    refreshMedia()
  }, [])

  const getMediaUrl = (slotKey: string, fallbackDefault?: string) => {
    if (media[slotKey]) return media[slotKey]
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

  const resetMediaUrl = (slotKey: string) => {
    const slot = MEDIA_SLOTS.find(s => s.key === slotKey)
    const defaultUrl = slot?.defaultUrl || ""
    setMedia(prev => {
      const next = { ...prev, [slotKey]: defaultUrl }
      try {
        localStorage.setItem("soulmar_media_registry", JSON.stringify(next))
      } catch (e) {}
      return next
    })
  }

  return (
    <MediaContext.Provider value={{ media, getMediaUrl, updateMediaUrl, resetMediaUrl, refreshMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  return useContext(MediaContext)
}
