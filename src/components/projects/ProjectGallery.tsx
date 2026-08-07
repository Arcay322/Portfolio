"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Maximize2, PlayCircle, ChevronLeft, ChevronRight } from "lucide-react"

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
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const t = useTranslations('common')

    const handleNext = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! + 1) % media.length);
    }, [selectedIndex, media.length]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex((prev) => (prev! - 1 + media.length) % media.length);
    }, [selectedIndex, media.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, handleNext, handlePrev]);

    if (!media || media.length === 0) return null

    const activeItem = selectedIndex !== null ? media[selectedIndex] : null;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[250px]">
                {media.map((item, index) => {
                    // Nuevo Bento Logic para 5 imágenes exactas en md:grid-cols-6:
                    // index 0: ocupa 4 columnas x 2 filas
                    // index 1 y 2: ocupan 2 columnas x 1 fila (al lado derecho de la imagen principal)
                    // index 3 y 4: ocupan 3 columnas x 1 fila (se reparten 50/50 la última fila)
                    const isFeatured = index === 0 && media.length >= 3;
                    const isBottomRow = media.length === 5 && (index === 3 || index === 4);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            aria-label={`${t('open')} ${item.alt}`}
                            className={cn(
                                "relative group cursor-pointer overflow-hidden rounded-xl bg-muted border border-[rgba(var(--glass-border),var(--glass-opacity))] text-left",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2",
                                isFeatured ? "md:col-span-4 md:row-span-2" : isBottomRow ? "md:col-span-3 row-span-1" : "md:col-span-2 row-span-1"
                            )}
                        >
                            <Image
                                src={item.thumbnail || item.src}
                                alt={item.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    {item.type === 'video' ? (
                                        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" aria-hidden="true" />
                                    ) : (
                                        <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" aria-hidden="true" />
                                    )}
                                </span>
                            </span>
                        </button>
                    )
                })}
            </div>

            <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
                <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-none shadow-none flex items-center justify-center h-[90vh]">
                    <DialogTitle className="sr-only">
                        {activeItem ? activeItem.alt : t('projects_title')}
                    </DialogTitle>
                    {activeItem && (
                        <div className="relative w-full h-full flex items-center justify-center group">
                            {/* Previous Button */}
                            {media.length > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    aria-label={t('previous')}
                                    className="absolute left-2 md:left-8 z-50 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary/70 outline-none backdrop-blur-sm"
                                >
                                    <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
                                </button>
                            )}

                            {/* Media Content */}
                            <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center bg-black/90 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                                {activeItem.type === 'video' ? (
                                    <video
                                        src={activeItem.src}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-full"
                                    />
                                ) : (
                                    <Image
                                        src={activeItem.src}
                                        alt={activeItem.alt}
                                        fill
                                        sizes="90vw"
                                        className="max-w-full max-h-full object-contain select-none"
                                    />
                                )}
                            </div>

                            {/* Next Button */}
                            {media.length > 1 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label={t('next')}
                                    className="absolute right-2 md:right-8 z-50 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-primary/70 outline-none backdrop-blur-sm"
                                >
                                    <ChevronRight className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
                                </button>
                            )}

                            {/* Image Counter */}
                            {media.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                                    {selectedIndex! + 1} / {media.length}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
