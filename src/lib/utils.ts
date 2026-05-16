import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COP_TO_USD_RATE = 4000;

export function formatPrice(amount: number, currency: "COP" | "USD" = "COP") {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
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
