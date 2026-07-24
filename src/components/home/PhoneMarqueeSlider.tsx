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

  // Duplicate 4 sets so it loops seamlessly 100% edge-to-edge from left to right endlessly without any gap
  const marqueeItems = [...slides, ...slides, ...slides, ...slides]

  return (
    <div
      id="soulmar-brand"
      className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-0 my-0 group scroll-mt-32"
    >
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
          animation: marqueeRightPhones 35s linear infinite;
          will-change: transform;
        }
        .animate-marquee-phones:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Edge-to-Edge Sliding track with 0px gap between images */}
      <div className="flex gap-0 w-max animate-marquee-phones">
        {marqueeItems.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href="/#agendamiento"
            onClick={handleScrollToBooking}
            aria-label="Agendar cita en Soulmar"
            className="block relative flex-shrink-0 cursor-pointer p-0 m-0 border-0 outline-none"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={1024}
              height={576}
              quality={100}
              unoptimized={true}
              className="w-[100vw] sm:w-[50vw] h-auto block object-cover p-0 m-0 border-0"
              priority={idx < 2}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
