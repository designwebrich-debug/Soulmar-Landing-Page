import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COP_TO_USD_RATE = 4000;

export function formatPrice(amount: number, currency: "COP" | "USD" = "COP") {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `${formatted} ${currency}`;
}

export function formatCOPtoUSD(copAmount: number) {
  const usdAmount = copAmount / COP_TO_USD_RATE;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
  
  return `${formatted} USD`;
}

/**
 * Normaliza cualquier formato de hora (12h con AM/PM o 24h con o sin segundos)
 * a una cadena canónica "HH:MM" de 24 horas.
 * Ejemplos:
 *  "08:00 AM" -> "08:00"
 *  "8:00 AM"  -> "08:00"
 *  "02:00 PM" -> "14:00"
 *  "2:00 PM"  -> "14:00"
 *  "14:00:00" -> "14:00"
 *  "14:00"    -> "14:00"
 */
export function normalizeTime(t?: string | null): string {
  if (!t) return ""
  const clean = String(t).trim().toUpperCase()

  // Match 12h: "08:00 AM", "8:00 PM", "08:00:00 AM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/)
  if (match12) {
    let h = parseInt(match12[1], 10)
    const m = match12[2]
    const ampm = match12[3]
    if (ampm === "PM" && h < 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    return `${String(h).padStart(2, "0")}:${m}`
  }

  // Match 24h: "14:00", "14:00:00", "8:00"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})/)
  if (match24) {
    const h = parseInt(match24[1], 10)
    return `${String(h).padStart(2, "0")}:${match24[2]}`
  }

  return clean
}
