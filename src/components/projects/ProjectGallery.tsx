"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Maximize2, PlayCircle } from "lucide-react"

interface MediaItem {
    type: "image" | "video" | "gif"
    src: string
    alt: string
    thumbnail?: string
}

interface ProjectGalleryProps {
    media: MediaItem[]
}

export function ProjectGallery({ media }: ProjectGalleryProps) {

    if (!media || media.length === 0) return null

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[250px]">
            {media.map((item, index) => {
                // Bento Logic: First item spans 2x2 if we have enough items
                const isFeatured = index === 0 && media.length >= 3

                return (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <div
                                className={cn(
                                    "relative group cursor-pointer overflow-hidden rounded-xl bg-muted",
                                    isFeatured ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"
                                )}
                            >
                                <Image
                                    src={item.thumbnail || item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {item.type === 'video' ? (
                                            <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                                        ) : (
                                            <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
                            <div className="relative h-[80vh] w-full flex items-center justify-center">
                                {item.type === 'video' ? (
                                    <video
                                        src={item.src}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-full"
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            })}
        </div>
    )
}
