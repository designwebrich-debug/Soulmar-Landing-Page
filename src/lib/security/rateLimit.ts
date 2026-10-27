/**
 * Rate limiter en memoria (ventana deslizante simple) para rutas del servidor.
 *
 * Nota: en Vercel cada instancia serverless tiene su propia memoria, así que el
 * límite es "por instancia". No reemplaza un WAF, pero frena de forma efectiva
 * bots y fuerza bruta básicos sin dependencias ni costos adicionales.
 */
type Bucket = { count: number; resetAt: number }

const stores = new Map<string, Map<string, Bucket>>()

export function rateLimit(
  scope: string,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  let store = stores.get(scope)
  if (!store) {
    store = new Map()
    stores.set(scope, store)
  }

  const now = Date.now()

  // Limpieza oportunista para evitar crecimiento indefinido de memoria
  if (store.size > 5000) {
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k)
  }

  const bucket = store.get(key)
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSec: 0 }
  }

  bucket.count += 1
  if (bucket.count > limit) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { allowed: true, retryAfterSec: 0 }
}

/** Reinicia el contador de una clave (p. ej. tras un login exitoso). */
export function resetRateLimit(scope: string, key: string) {
  stores.get(scope)?.delete(key)
}

/** IP del cliente detrás del proxy de Vercel. */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}
