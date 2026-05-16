"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark"

interface AdminThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("soulmar_admin_theme") as Theme
      return saved || "dark"
    }
    return "dark"
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem("soulmar_admin_theme", next)
      return next
    })
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={cn(
        !mounted ? "invisible" : (theme === "dark" ? "admin-dark dark" : "admin-light")
      )}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider")
  }
  return context
}
