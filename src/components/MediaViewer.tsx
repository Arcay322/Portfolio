"use client"

import { useState } from "react"
import { Play, Pause, Maximize2, Volume2, VolumeX } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "./OptimizedImage"

export type MediaType = "image" | "video" | "gif"

interface MediaItem {
  type: MediaType
  src: string
  alt: string
  thumbnail?: string
  poster?: string // Para videos
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

interface MediaViewerProps {
  media: MediaItem[]
  className?: string
}

export function MediaViewer({ media, className = "" }: MediaViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({})
  const [isMuted, setIsMuted] = useState<Record<number, boolean>>({})

  const currentMedia = media[selectedIndex]

  const togglePlay = (index: number, videoElement: HTMLVideoElement) => {
    if (isPlaying[index]) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
    setIsPlaying({ ...isPlaying, [index]: !isPlaying[index] })
  }

  const toggleMute = (index: number, videoElement: HTMLVideoElement) => {
    videoElement.muted = !videoElement.muted
    setIsMuted({ ...isMuted, [index]: !isMuted[index] })
  }

  return (
    <div className={className}>
      {/* Main Media Display */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {currentMedia.type === "image" && (
          <OptimizedImage
            src={currentMedia.src}
            alt={currentMedia.alt}
            fill
            priority
            className="w-full h-full"
            objectFit="cover"
          />
        )}

        {currentMedia.type === "gif" && (
          <OptimizedImage
            src={currentMedia.src}
            alt={currentMedia.alt}
            fill
            priority
            className="w-full h-full"
            objectFit="cover"
          />
        )}

        {currentMedia.type === "video" && (
          <VideoPlayer
            media={currentMedia}
            isPlaying={isPlaying[selectedIndex] || false}
            isMuted={isMuted[selectedIndex] ?? currentMedia.muted ?? false}
            onTogglePlay={(video) => togglePlay(selectedIndex, video)}
            onToggleMute={(video) => toggleMute(selectedIndex, video)}
          />
        )}

        {/* Fullscreen Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl w-full p-0">
            <div className="relative aspect-video bg-black">
              {currentMedia.type === "image" && (
                <OptimizedImage
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  fill
                  priority
                  objectFit="contain"
                />
              )}
              {currentMedia.type === "gif" && (
                <OptimizedImage
                  src={currentMedia.src}
                  alt={currentMedia.alt}
                  fill
                  priority
                  objectFit="contain"
                />
              )}
              {currentMedia.type === "video" && (
                <video
                  src={currentMedia.src}
                  poster={currentMedia.poster}
                  controls
                  autoPlay
                  loop={currentMedia.loop}
                  className="w-full h-full"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`
                relative aspect-video rounded-md overflow-hidden border-2 transition-all
                ${
                  selectedIndex === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/50"
                }
              `}
            >
              {item.type === "video" ? (
                <div className="relative w-full h-full bg-muted">
                  {item.poster ? (
                    <OptimizedImage
                      src={item.poster}
                      alt={`${item.alt} thumbnail`}
                      fill
                      objectFit="cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Play className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <OptimizedImage
                  src={item.thumbnail || item.src}
                  alt={`${item.alt} thumbnail`}
                  fill
                  objectFit="cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente separado para el reproductor de video
interface VideoPlayerProps {
  media: MediaItem
  isPlaying: boolean
  isMuted: boolean
  onTogglePlay: (video: HTMLVideoElement) => void
  onToggleMute: (video: HTMLVideoElement) => void
}

function VideoPlayer({
  media,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}: VideoPlayerProps) {
  const videoRef = (el: HTMLVideoElement | null) => {
    if (!el) return
    
    // Auto play si está configurado
    if (media.autoPlay && !isPlaying) {
      el.play()
    }
  }

  return (
    <div className="relative w-full h-full group">
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        loop={media.loop ?? true}
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => {}}
        onPause={() => {}}
      />

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              const video = e.currentTarget.parentElement?.parentElement?.querySelector("video")
              if (video) onTogglePlay(video)
            }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              const video = e.currentTarget.parentElement?.parentElement?.querySelector("video")
              if (video) onToggleMute(video)
            }}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook helper para gestionar media items
export function useMediaGallery(initialMedia: MediaItem[]) {
  const [media] = useState<MediaItem[]>(initialMedia)
  
  return {
    media,
    hasVideos: media.some(item => item.type === "video"),
    hasGifs: media.some(item => item.type === "gif"),
    totalItems: media.length
  }
}
