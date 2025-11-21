"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = false,
  objectFit = "cover",
  quality = 90,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              quality={quality}
              priority={priority}
              className={`object-${objectFit} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setIsLoaded(true)}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              quality={quality}
              priority={priority}
              className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setIsLoaded(true)}
              loading={priority ? "eager" : "lazy"}
            />
          )}
        </motion.div>
      )}
    </div>
  )
}

// Componente para fondos con blur placeholder
interface BlurImageProps extends OptimizedImageProps {
  blurDataURL?: string
}

export function BlurImage(props: BlurImageProps) {
  return (
    <OptimizedImage
      {...props}
    />
  )
}
