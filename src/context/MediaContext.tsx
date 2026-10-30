"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { MEDIA_SLOTS, type DeviceType, type MediaSlot } from "@/lib/mediaConfig"

export interface ResponsiveMedia {
  desktop: string
  mobile: string
  tablet: string
}

interface MediaContextType {
  media: Record<string, string>
  getMediaUrl: (slotKey: string, fallbackDefault?: string, device?: DeviceType) => string
  getResponsiveMedia: (slotKey: string, fallbackDefault?: string) => ResponsiveMedia
  updateMediaUrl: (slotKey: string, newUrl: string) => void
  deleteMediaSlot: (slotKey: string) => void
  refreshMedia: () => Promise<void>
}

const MediaContext = createContext<MediaContextType>({
  media: {},
  getMediaUrl: (slotKey: string, fallbackDefault?: string) => fallbackDefault || "",
  getResponsiveMedia: (slotKey: string, fallbackDefault?: string) => ({
    desktop: fallbackDefault || "",
    mobile: fallbackDefault || "",
    tablet: fallbackDefault || "",
  }),
  updateMediaUrl: () => {},
  deleteMediaSlot: () => {},
  refreshMedia: async () => {}
})

// Mapeo inicial de fábrica con soporte multidispositivo
const factoryDefaultMedia: Record<string, string> = {}
MEDIA_SLOTS.forEach(slot => {
  factoryDefaultMedia[slot.key] = slot.defaultUrl
  if (slot.devices) {
    factoryDefaultMedia[`${slot.key}_desktop`] = slot.devices.desktop.defaultUrl
    factoryDefaultMedia[`${slot.key}_mobile`] = slot.devices.mobile.defaultUrl
    factoryDefaultMedia[`${slot.key}_tablet`] = slot.devices.tablet.defaultUrl
  }
})
factoryDefaultMedia["audio_atmosphere"] = "https://druynmdkgdwuohojmptc.supabase.co/storage/v1/object/public/media/slots/audio_atmosphere-default.mp3"

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

  // Sincronizar si cambia initialMedia tras revalidación en el servidor
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

  // Escuchar cambios de localStorage (entre pestañas) y evento de ventana (misma pestaña)
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

    const handleRefreshEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail && typeof detail === "object") {
        setMedia(prev => ({ ...prev, ...detail }))
      } else {
        refreshMedia()
      }
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("soulmar_media_updated", handleCustomUpdate)
    window.addEventListener("soulmar_media_refreshed", handleRefreshEvent)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("soulmar_media_updated", handleCustomUpdate)
      window.removeEventListener("soulmar_media_refreshed", handleRefreshEvent)
    }
  }, [refreshMedia])

  /**
   * getMediaUrl: Retorna la URL de la foto para el slot y dispositivo especificado.
   * Prioridad inteligente:
   * 1. ${slotKey}_${device} (si fue personalizada específicamente para ese dispositivo)
   * 2. ${slotKey} (asignación global o legacy)
   * 3. defaultUrl específico del dispositivo
   * 4. defaultUrl global del slot o fallbackDefault
   * Si está marcada como "__EMPTY__", retorna cadena vacía "".
   */
  const getMediaUrl = useCallback((slotKey: string, fallbackDefault?: string, device?: DeviceType) => {
    const slot = MEDIA_SLOTS.find(s => s.key === slotKey)

    if (device) {
      const deviceKey = `${slotKey}_${device}`
      const deviceVal = media[deviceKey]
      if (deviceVal === "__EMPTY__") return ""
      if (deviceVal) return deviceVal

      // Si no hay específica para este dispositivo, revisar si hay versión global cargada
      const globalVal = media[slotKey]
      if (globalVal === "__EMPTY__") return ""
      if (globalVal) return globalVal

      // Fallback por defecto según dispositivo
      return slot?.devices?.[device]?.defaultUrl || slot?.defaultUrl || fallbackDefault || ""
    }

    // Sin dispositivo especificado: revisar slot directo o desktop
    const directVal = media[slotKey]
    if (directVal === "__EMPTY__") return ""
    if (directVal) return directVal

    const desktopVal = media[`${slotKey}_desktop`]
    if (desktopVal === "__EMPTY__") return ""
    if (desktopVal) return desktopVal

    return slot?.devices?.desktop?.defaultUrl || slot?.defaultUrl || fallbackDefault || ""
  }, [media])

  /**
   * getResponsiveMedia: Retorna simultáneamente las 3 URLs listas para desktop, mobile y tablet
   */
  const getResponsiveMedia = useCallback((slotKey: string, fallbackDefault?: string): ResponsiveMedia => {
    return {
      desktop: getMediaUrl(slotKey, fallbackDefault, "desktop"),
      mobile: getMediaUrl(slotKey, fallbackDefault, "mobile"),
      tablet: getMediaUrl(slotKey, fallbackDefault, "tablet"),
    }
  }, [getMediaUrl])

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
    <MediaContext.Provider value={{ media, getMediaUrl, getResponsiveMedia, updateMediaUrl, deleteMediaSlot, refreshMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  return useContext(MediaContext)
}
