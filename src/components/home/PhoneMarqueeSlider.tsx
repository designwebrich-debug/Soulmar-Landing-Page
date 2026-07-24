"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Currently 3 initial items uploaded by user. Can easily expand up to 6 items when user uploads the rest.
const initialCards = [
  {
    id: "card-1",
    src: "/images/slider/phone-card-1.png",
    title: "Relaciones sanas",
    alt: "Terapia de pareja y relaciones sanas en Soulmar",
  },
  {
    id: "card-2",
    src: "/images/slider/phone-card-2.png",
    title: "Tu profesión Ideal",
    alt: "Orientación vocacional y talento humano en Soulmar",
  },
  {
    id: "card-3",
    src: "/images/slider/phone-card-3.png",
    title: "Encuentra tu propósito",
    alt: "Terapia individual e introspección en Soulmar",
  },
]

export function PhoneMarqueeSlider() {
  const [activeIndex, setActiveIndex] = useState(1) // Start with center card active
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate list if fewer than 5 items to create rich 3D Coverflow depth
  const cards = initialCards.length < 5 ? [...initialCards, ...initialCards] : initialCards
  const totalCards = cards.length

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards)
  }, [totalCards])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards)
  }, [totalCards])

  // Auto-play timer (3.5 seconds)
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(handleNext, 3500)
    return () => clearInterval(interval)
  }, [isPaused, handleNext])

  const handleScrollToBooking = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault()
      document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      id="soulmar-brand"
      className="w-full relative py-12 overflow-hidden scroll-mt-32 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Coverflow Stage Container */}
      <div className="max-w-6xl mx-auto px-4 relative flex items-center justify-center min-h-[460px] sm:min-h-[580px] lg:min-h-[640px]">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Anterior"
          className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg text-[#1d1d1f] dark:text-white hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Siguiente"
          className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg text-[#1d1d1f] dark:text-white hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Track Container */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          {cards.map((card, index) => {
            // Calculate shortest distance in circular array
            let offset = index - activeIndex
            if (offset > totalCards / 2) offset -= totalCards
            if (offset < -totalCards / 2) offset += totalCards

            const isCenter = offset === 0
            const isLeft = offset === -1
            const isRight = offset === 1
            const isFarLeft = offset === -2
            const isFarRight = offset === 2

            // Hide items further away than 2 positions
            const isVisible = Math.abs(offset) <= 2

            if (!isVisible) return null

            // 3D Transform styles
            let transformStyle = ""
            let zIndex = 10
            let opacity = 0

            if (isCenter) {
              transformStyle = "translateX(0%) scale(1.05) rotateY(0deg)"
              zIndex = 30
              opacity = 1
            } else if (isLeft) {
              transformStyle = "translateX(-65%) scale(0.85) rotateY(22deg)"
              zIndex = 20
              opacity = 0.8
            } else if (isRight) {
              transformStyle = "translateX(65%) scale(0.85) rotateY(-22deg)"
              zIndex = 20
              opacity = 0.8
            } else if (isFarLeft) {
              transformStyle = "translateX(-115%) scale(0.7) rotateY(32deg)"
              zIndex = 10
              opacity = 0.4
            } else if (isFarRight) {
              transformStyle = "translateX(115%) scale(0.7) rotateY(-32deg)"
              zIndex = 10
              opacity = 0.4
            }

            return (
              <div
                key={`${card.id}-${index}`}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index)
                  }
                }}
                className={`absolute transition-all duration-700 ease-out cursor-pointer transform-gpu ${
                  isCenter ? "pointer-events-auto" : "hover:opacity-90"
                }`}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  transformStyle: "preserve-3d",
                }}
              >
                <Link
                  href="/#agendamiento"
                  onClick={handleScrollToBooking}
                  className="block relative group/card"
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={576}
                    height={1024}
                    quality={100}
                    unoptimized={true}
                    className={`w-[240px] sm:w-[320px] lg:w-[380px] h-auto object-contain transition-all duration-500 ${
                      isCenter
                        ? "drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                        : "drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                    }`}
                    priority={isCenter}
                  />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-8 z-30 relative">
        {initialCards.map((_, idx) => {
          const isActive = activeIndex % initialCards.length === idx
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isActive
                  ? "w-8 bg-[#1d1d1f] dark:bg-white"
                  : "w-2.5 bg-[#1d1d1f]/20 dark:bg-white/20 hover:bg-[#1d1d1f]/40"
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
