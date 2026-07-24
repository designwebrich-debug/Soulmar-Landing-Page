"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: "phone-1",
    src: "/images/slider/slide-phones-1.png",
    alt: "Terapia para Vence la depresión, Gobierna la ansiedad, Un espacio seguro",
  },
  {
    id: "phone-2",
    src: "/images/slider/slide-phones-2.png",
    alt: "Relaciones sanas, Tu profesión Ideal, Encuentra tu propósito",
  },
]

export function PhoneMarqueeSlider() {
  const handleScrollToBooking = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault()
      document.getElementById("agendamiento")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Duplicate 4 sets so it loops seamlessly from left to right endlessly without empty space
  const marqueeItems = [...slides, ...slides, ...slides, ...slides]

  return (
    <div id="soulmar-brand" className="w-full overflow-hidden py-8 mb-28 relative group scroll-mt-32">
      {/* Inline styles for infinite left-to-right marquee animation with pause on hover */}
      <style jsx>{`
        @keyframes marqueeRightPhones {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee-phones {
          animation: marqueeRightPhones 32s linear infinite;
          will-change: transform;
        }
        .animate-marquee-phones:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Premium subtle gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 z-10 bg-gradient-to-r from-surface dark:from-[#0b0b0c] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 z-10 bg-gradient-to-l from-surface dark:from-[#0b0b0c] to-transparent pointer-events-none" />

      {/* Sliding track */}
      <div className="flex gap-6 sm:gap-10 w-max animate-marquee-phones">
        {marqueeItems.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href="/#agendamiento"
            onClick={handleScrollToBooking}
            aria-label="Agendar cita en Soulmar"
            className="block relative flex-shrink-0 cursor-pointer transition-transform duration-300 hover:scale-[1.015] shadow-xl rounded-3xl overflow-hidden group/item"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={1024}
              height={576}
              quality={100}
              unoptimized={true}
              className="w-[500px] sm:w-[750px] lg:w-[960px] xl:w-[1024px] h-auto object-contain rounded-3xl"
              priority={idx < 2}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
