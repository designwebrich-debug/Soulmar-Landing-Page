"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/portal-secreto-soulmar-77312")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <WhatsAppButton />
    </>
  )
}
