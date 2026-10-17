import type { Metadata } from "next"
import { Inter, Geist_Mono, Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppLayoutWrapper } from "@/components/layout/AppLayoutWrapper"
import { LanguageProvider } from "@/context/LanguageContext"
import { ToastProvider } from "@/context/ToastContext"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soulmar.org"),
  title: {
    default: "Soulmar | Psicología y Bienestar",
    template: "%s | Soulmar"
  },
  description: "Plataforma de bienestar mental inspirada en la calma y el equilibrio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Soulmar | Psicología y Bienestar",
    description: "Plataforma de bienestar mental inspirada en la calma y el equilibrio.",
    url: "https://www.soulmar.org",
    siteName: "Soulmar",
    locale: "es_CO",
    type: "website",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

import { MediaProvider } from "@/context/MediaContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${playfair.variable} ${dmSans.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300 font-dm-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <LanguageProvider>
              <MediaProvider>
                <AppLayoutWrapper>{children}</AppLayoutWrapper>
              </MediaProvider>
            </LanguageProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
