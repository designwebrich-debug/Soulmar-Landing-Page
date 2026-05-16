import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Retiros de Inmersión | Soulmar Experience",
  description: "Desconéctate para reconectar. Vive experiencias presenciales de meditación, respiración y autoconocimiento en locaciones únicas.",
}

export default function RetreatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
