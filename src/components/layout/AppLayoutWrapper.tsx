"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { MobileTabBar } from "./MobileTabBar"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24 md:pb-0">
        {children}
      </main>
      <WhatsAppButton />
      <MobileTabBar />
    </>
  )
}
