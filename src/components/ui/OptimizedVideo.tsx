"use client"

import React, { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OptimizedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  className?: string
  priority?: boolean
  isPlaying?: boolean
}

/**
 * OptimizedVideo - Silicon Valley High-Performance Video Player
 * 
 * - Only decodes video frames when visible in the viewport.
 * - Pauses automatically when scrolled offscreen, liberating 100% of GPU hardware
 *   decoding channels and eliminating thermal throttling on MacBooks.
 * - Uses rootMargin to seamlessly resume playback before the user scrolls into view.
 */
export function OptimizedVideo({
  src,
  className,
  priority = false,
  ...props
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (typeof IntersectionObserver === "undefined") {
      video.play().catch(() => {})
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (props.isPlaying !== false && video.paused) {
              video.play().catch(() => {})
            }
          } else {
            if (!video.paused) {
              video.pause()
            }
          }
        }
      },
      {
        rootMargin: "200px 0px 200px 0px",
        threshold: 0.05,
      }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [src, props.isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof props.isPlaying === "undefined") return

    if (props.isPlaying) {
      if (video.paused) {
        video.play().catch(() => {})
      }
    } else {
      if (!video.paused) {
        video.pause()
      }
    }
  }, [props.isPlaying])

  useEffect(() => {
    if (videoRef.current && typeof props.muted !== "undefined") {
      videoRef.current.muted = props.muted
      if (!props.muted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {})
      }
    }
  }, [props.muted])

  return (
    <video
      ref={videoRef}
      src={src}
      muted={props.muted ?? true}
      playsInline
      loop
      autoPlay
      preload={priority ? "auto" : "metadata"}
      disablePictureInPicture
      disableRemotePlayback
      className={cn("object-cover select-none pointer-events-none", className)}
      {...props}
    />
  )
}
