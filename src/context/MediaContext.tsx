"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
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

export function MediaProvider({
  children,
  initialMedia = {}
}: {
  children: React.ReactNode
  initialMedia?: Record<string, string>
}) {
  const [media, setMedia] = useState<Record<string, string>>(() => {
    let clientStored: Record<string, string> = {}
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("soulmar_media_registry")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === "object") {
            clientStored = parsed
          }
        }
      } catch (e) {}
    }
    return {
      ...factoryDefaultMedia,
      ...initialMedia,
      ...clientStored
    }
  })

  // Sincronizar si cambia initialMedia (por ejemplo, tras revalidación en el servidor)
  useEffect(() => {
    if (initialMedia && Object.keys(initialMedia).length > 0) {
      setMedia(prev => ({
        ...prev,
        ...initialMedia
      }))
    }
  }, [initialMedia])

  const refreshMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/media", {
        cache: "no-store",
        headers: { "pragma": "no-cache" }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.media) {
          setMedia(prev => {
            const merged = { ...factoryDefaultMedia, ...prev, ...data.media }
            try {
              localStorage.setItem("soulmar_media_registry", JSON.stringify(data.media))
            } catch (e) {}
            return merged
          })
        }
      }
    } catch (err) {
      console.warn("[MediaProvider] Error loading media:", err)
    }
  }, [])

  // Escuchar cambios de localStorage (entre pestañas) y evento personalizado (misma pestaña)
  useEffect(() => {
    refreshMedia()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "soulmar_media_registry" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed && typeof parsed === "object") {
            setMedia(prev => ({ ...prev, ...parsed }))
          }
        } catch (err) {}
      }
    }

    const handleCustomUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail && detail.slotKey) {
        setMedia(prev => ({ ...prev, [detail.slotKey]: detail.url }))
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("soulmar_media_updated", handleCustomUpdate)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("soulmar_media_updated", handleCustomUpdate)
    }
  }, [refreshMedia])

  /**
   * getMediaUrl: Retorna la URL de la foto.
   * Si el usuario la eliminó explícitamente ("__EMPTY__"), retorna cadena vacía ""
   * para que la caja quede completamente limpia y vacía sin mostrar fotos viejas.
   */
  const getMediaUrl = useCallback((slotKey: string, fallbackDefault?: string) => {
    const val = media[slotKey]
    if (val === "__EMPTY__") return ""
    if (val) return val
    const slot = MEDIA_SLOTS.find(s => s.key === slotKey)
    return slot?.defaultUrl || fallbackDefault || ""
  }, [media])

  const updateMediaUrl = useCallback((slotKey: string, newUrl: string) => {
    setMedia(prev => {
      const next = { ...prev, [slotKey]: newUrl }
      try {
        localStorage.setItem("soulmar_media_registry", JSON.stringify(next))
      } catch (e) {}
      return next
    })
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("soulmar_media_updated", {
          detail: { slotKey, url: newUrl }
        })
      )
    }
  }, [])

  const deleteMediaSlot = useCallback((slotKey: string) => {
    setMedia(prev => {
      const next = { ...prev, [slotKey]: "__EMPTY__" }
      try {
        localStorage.setItem("soulmar_media_registry", JSON.stringify(next))
      } catch (e) {}
      return next
    })
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("soulmar_media_updated", {
          detail: { slotKey, url: "__EMPTY__" }
        })
      )
    }
  }, [])

  return (
    <MediaContext.Provider value={{ media, getMediaUrl, updateMediaUrl, deleteMediaSlot, refreshMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  return useContext(MediaContext)
}
