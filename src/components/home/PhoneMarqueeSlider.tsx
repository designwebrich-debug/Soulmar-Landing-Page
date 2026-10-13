"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const cards = [
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
  {
    id: "card-4",
    src: "/images/slider/phone-card-4.png",
    title: "Transita la depresión",
    alt: "Terapia para transitar la depresión en Soulmar",
  },
  {
    id: "card-5",
    src: "/images/slider/phone-card-5.png",
    title: "Gobierna la ansiedad",
    alt: "Terapia para gobernar la ansiedad en Soulmar",
  },
  {
    id: "card-6",
    src: "/images/slider/phone-card-6.png",
    title: "Un espacio seguro",
    alt: "Terapia individual un espacio seguro en Soulmar",
  },
]

export function PhoneMarqueeSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = React.useRef(0)
  const touchEndX = React.useRef(0)

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = e.targetTouches[0].clientX
    setIsPaused(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    setIsPaused(false)
    const deltaX = touchStartX.current - touchEndX.current
    if (deltaX > 45) {
      handleNext()
    } else if (deltaX < -45) {
      handlePrev()
    }
  }

  const handleScrollToBooking = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault()
      document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      id="soulmar-brand"
      className="w-full relative pt-20 sm:pt-40 lg:pt-48 pb-12 overflow-hidden scroll-mt-32 select-none bg-white dark:bg-[#0b0b0c]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Coverflow Stage Container */}
      <div className="max-w-6xl mx-auto px-4 relative flex items-center justify-center min-h-[460px] sm:min-h-[680px] lg:min-h-[750px]">
        
        {/* Previous Button (Desktop only on side to avoid obstructing phone in mobile) */}
        <button
          onClick={handlePrev}
          aria-label="Anterior"
          className="hidden sm:flex absolute left-4 sm:left-6 z-40 p-3 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-md text-[#1d1d1f] dark:text-white hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Button (Desktop only on side) */}
        <button
          onClick={handleNext}
          aria-label="Siguiente"
          className="hidden sm:flex absolute right-4 sm:right-6 z-40 p-3 rounded-full bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-md text-[#1d1d1f] dark:text-white hover:scale-110 active:scale-95 transition-all duration-300 group"
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
              opacity = 0.85
            } else if (isRight) {
              transformStyle = "translateX(65%) scale(0.85) rotateY(-22deg)"
              zIndex = 20
              opacity = 0.85
            } else if (isFarLeft) {
              transformStyle = "translateX(-115%) scale(0.7) rotateY(32deg)"
              zIndex = 10
              opacity = 0.45
            } else if (isFarRight) {
              transformStyle = "translateX(115%) scale(0.7) rotateY(-32deg)"
              zIndex = 10
              opacity = 0.45
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
                  isCenter ? "pointer-events-auto" : "hover:opacity-95"
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
                  className="block relative group/card p-0 m-0"
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={576}
                    height={1024}
                    quality={100}
                    unoptimized={true}
                    className="w-[240px] sm:w-[320px] lg:w-[380px] h-auto object-contain transition-all duration-500 p-0 m-0 border-0 shadow-none"
                    priority={isCenter}
                  />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls: Pagination Dots + Mobile Quick Arrows */}
      <div className="flex items-center justify-center gap-3 mt-8 sm:mt-16 z-30 relative px-4">
        {/* Mobile Left Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Anterior"
          className="sm:hidden w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#1d1d1f] dark:text-white active:scale-90 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {cards.map((_, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  isActive
                    ? "w-7 bg-[#1d1d1f] dark:bg-white"
                    : "w-2 bg-[#1d1d1f]/20 dark:bg-white/20 hover:bg-[#1d1d1f]/40"
                }`}
              />
            )
          })}
        </div>

        {/* Mobile Right Arrow */}
        <button
          onClick={handleNext}
          aria-label="Siguiente"
          className="sm:hidden w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#1d1d1f] dark:text-white active:scale-90 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
