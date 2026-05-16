import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tienda Soulmar | Objetos para la Calma y el Bienestar",
  description: "Explora nuestra colección curada de accesorios, ropa y herramientas digitales diseñadas para elevar tu bienestar mental y espiritual.",
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
