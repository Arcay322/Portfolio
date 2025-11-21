"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MediaItem {
  type: "image" | "video" | "gif"
  src: string
  alt: string
  thumbnail?: string
}

interface ImageCarouselProps {
  media: MediaItem[]
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function ImageCarousel({ 
  media, 
  className = "",
  autoPlay = false,
  autoPlayInterval = 5000
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  // Navegación
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    )
  }, [media.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    )
  }, [media.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // AutoPlay
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext, autoPlayInterval])

  // Pausar autoplay al interactuar
  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
        handleUserInteraction()
      } else if (e.key === "ArrowRight") {
        goToNext()
        handleUserInteraction()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext])

  const currentMedia = media[currentIndex]

  if (!media || media.length === 0) return null

  return (
    <div className={cn("group", className)}>
      {/* Main Carousel Display */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {/* Current Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-muted">
          <img
            src={currentMedia.src}
            alt={currentMedia.alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => {
                goToPrevious()
                handleUserInteraction()
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => {
                goToNext()
                handleUserInteraction()
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Fullscreen Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full p-0">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={currentMedia.src}
                alt={currentMedia.alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Slide Counter */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
          {currentIndex + 1} / {media.length}
        </div>

        {/* Dot Indicators */}
        {media.length > 1 && media.length <= 8 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  goToSlide(idx)
                  handleUserInteraction()
                }}
                className={cn(
                  "h-2 rounded-full transition-all",
                  currentIndex === idx 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className="mt-4 relative">
          {/* Thumbnails Scrollable Container */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="flex gap-2 pb-2">
              {media.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    goToSlide(idx)
                    handleUserInteraction()
                  }}
                  className={cn(
                    "relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-all",
                    currentIndex === idx
                      ? "border-primary ring-2 ring-primary/20 scale-105"
                      : "border-transparent hover:border-muted-foreground/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={item.thumbnail || item.src}
                    alt={`${item.alt} thumbnail`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay on non-selected */}
                  {currentIndex !== idx && (
                    <div className="absolute inset-0 bg-black/30" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
