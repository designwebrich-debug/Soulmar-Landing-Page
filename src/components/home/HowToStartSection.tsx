"use client"

import React from "react"

export function HowToStartSection() {
  return (
    <section id="como-empezar" className="w-full relative overflow-hidden bg-[#f5f4f0] dark:bg-[#0b0b0c]">
      <div className="w-full relative">
        <video 
          src="/videos/video-mockup.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-auto block"
        />
      </div>
    </section>
  )
}
