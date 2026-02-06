"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowDown } from "lucide-react"

interface ProjectHeroProps {
    title: string
    description: string
    image: string
    liveUrl?: string
    githubUrl?: string
    t: {
        view_live_demo: string
        view_source_code: string
    }
}

export function ProjectHero({
    title,
    description,
    image,
    liveUrl,
    githubUrl,
    t
}: ProjectHeroProps) {
    return (
        <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-end pb-20">
            {/* Background Image with Parallax-like fixed position or just absolute */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover blur-[3px] scale-105"
                    priority
                />
                {/* Dark Overlay for general contrast */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Bottom Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold font-headline mb-6 text-white tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {liveUrl && (
                            <Button asChild size="lg" className="text-lg px-8 h-14 rounded-full bg-white text-black hover:bg-gray-200 border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
                                <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                                    {t.view_live_demo} <ExternalLink className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        )}
                        {githubUrl && (
                            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md transition-all duration-300">
                                <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 h-5 w-5" />
                                    {t.view_source_code}
                                </Link>
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
            >
                <ArrowDown className="h-8 w-8" />
            </motion.div>
        </div>
    )
}
