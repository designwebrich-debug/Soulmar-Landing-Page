
import { type Message } from './actions/messages'

export const CHAT_CACHE: Record<string, Message[]> = {}

export function getCachedMessages(therapistId: string): Message[] {
  return CHAT_CACHE[therapistId] || []
}

export function setCachedMessages(therapistId: string, messages: Message[]) {
  // SEGURIDAD ELITE: No sobreescribir con vacío si ya tenemos datos y la respuesta parece errónea
  if (messages.length === 0 && (CHAT_CACHE[therapistId]?.length || 0) > 0) {
    console.warn(`[CACHE] Intento de sobreescritura vacía para ${therapistId} ignorado para prevenir pérdida de datos.`);
    return;
  }

  CHAT_CACHE[therapistId] = messages
  
  if (typeof window !== 'undefined') {
    try {
      const cacheToSave: Record<string, Message[]> = {}
      Object.keys(CHAT_CACHE).forEach(key => {
        cacheToSave[key] = CHAT_CACHE[key].slice(-100)
      })
      localStorage.setItem('soulmar_chat_cache', JSON.stringify(cacheToSave))
    } catch (e) {
      console.error("Error saving cache to localStorage", e)
    }
  }
}

export function initCache() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('soulmar_chat_cache')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge con cuidado
        Object.assign(CHAT_CACHE, parsed)
        console.log("[CACHE] Initialized from localStorage:", Object.keys(CHAT_CACHE))
      } catch (e) {
        console.error("Error initializing chat cache", e)
      }
    }
  }
}

// Inicializar inmediatamente al cargar el archivo en el cliente
if (typeof window !== 'undefined') {
  initCache()
}
