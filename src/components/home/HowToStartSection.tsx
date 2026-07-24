"use client"

import React from "react"

export function HowToStartSection() {
  return (
    <section id="como-empezar" className="w-full relative overflow-hidden bg-[#f5f4f0] dark:bg-[#0b0b0c]">
      <div className="w-full max-w-[1920px] mx-auto aspect-[1920/900] relative overflow-hidden shadow-sm">
        <video 
          src="/videos/video-mockup.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover block"
        />
      </div>
    </section>
  )
}
