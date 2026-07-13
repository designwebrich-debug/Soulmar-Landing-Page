import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Soulmar | Portal Administrativo",
  description: "Panel de control interno de Soulmar.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      {children}
    </div>
  )
}
