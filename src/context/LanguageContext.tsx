"use client"

import React, { createContext, useContext, useState } from "react"
import es from "../i18n/locales/es.json"
import en from "../i18n/locales/en.json"

type Language = "es" | "en"
type Translations = typeof es

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: <T = React.ReactNode>(key: string, options?: Record<string, unknown>) => T
  metadata?: Record<string, unknown>
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  metadata?: Record<string, unknown>
}

const translations: Record<Language, Translations> = { es, en }

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  // Load priority: localStorage > browser > default
  React.useLayoutEffect(() => {
    const saved = localStorage.getItem("soulmar-lang") as Language
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved)
    } else {
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "en") setLanguage("en")
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("soulmar-lang", lang)
  }

  const t = <T = string | React.ReactNode | React.ReactNode[]>(
    key: string, 
    options?: Record<string, unknown>
  ): T => {
    const keys = key.split(".")
    let value: unknown = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k]
      } else {
        value = options?.defaultValue || key
        break
      }
    }

    // Handle interpolation if string and options provided
    if (typeof value === 'string' && options) {
      const hasReactElements = Object.values(options).some(val => React.isValidElement(val))

      if (hasReactElements) {
        const parts = value.split(/({[a-zA-Z0-9_]+})/g)
        const result = parts.map((part) => {
          const match = part.match(/{([a-zA-Z0-9_]+)}/)
          if (match) {
            const paramKey = match[1]
            return (options[paramKey] !== undefined ? options[paramKey] : part) as React.ReactNode
          }
          return part as React.ReactNode
        }) as React.ReactNode[]
        return result as unknown as T
      }

      let interpolated = value
      Object.keys(options).forEach(optKey => {
        if (optKey === 'defaultValue') return // Don't try to interpolate the defaultValue property itself
        const replaceVal = options[optKey]
        interpolated = interpolated.replace(new RegExp(`{${optKey}}`, 'g'), String(replaceVal))
      })
      return interpolated as unknown as T
    }

    return value as T
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
