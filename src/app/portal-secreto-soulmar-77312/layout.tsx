import React from "react"
import { Metadata } from "next"
import AdminSessionProvider from "./AdminSessionProvider"

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
    <AdminSessionProvider>
      <div className="min-h-screen bg-[#F4EFEB] text-[#0B2545] font-sans antialiased">
        {children}
      </div>
    </AdminSessionProvider>
  )
}
