import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cursos de Bienestar | Soulmar Academy",
  description: "Aprende herramientas de psicología, mindfulness y crecimiento personal con nuestros expertos. Cursos diseñados para transformar tu mente y alma.",
}

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
