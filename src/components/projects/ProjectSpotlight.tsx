"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight, Star, CheckCircle } from "lucide-react"
import { techColors } from "@/lib/constants"
import { useTranslations } from "next-intl"

interface ProjectSpotlightProps {
    project: {
        title: string
        description: string
        image: string
        tags: string[]
        liveUrl?: string
        githubUrl?: string
        slug: string
        inProduction?: boolean
        featured?: boolean
    }
}

export function ProjectSpotlight({ project }: ProjectSpotlightProps) {
    const tBadges = useTranslations('projects.badges')
    const tButtons = useTranslations('projects.buttons')

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl mb-16 group"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background" />
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-12 flex flex-col justify-center relative">
                    <div className="flex flex-wrap gap-2 mb-4 lg:absolute lg:top-6 lg:right-6 lg:mb-0 z-10">
                        {project.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1 px-3 py-1 text-sm">
                                <Star className="h-3 w-3" /> {tBadges('featured')}
                            </Badge>
                        )}
                        {project.inProduction && (
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg flex items-center gap-1 px-3 py-1 text-sm">
                                <CheckCircle className="h-3 w-3" /> {tBadges('in_production')}
                            </Badge>
                        )}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4 lg:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {project.title}
                    </h2>

                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {project.tags.map((tag) => {
                            const color = techColors[tag] || "hsl(var(--foreground))"
                            return (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    style={{ borderColor: color }}
                                    className="px-3 py-1"
                                >
                                    {tag}
                                </Badge>
                            )
                        })}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button asChild size="lg" className="rounded-full px-8">
                            <Link href={`/projects/${project.slug}`}>
                                {tButtons('view_details')} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        {project.liveUrl && (
                            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                                <Link href={project.liveUrl} target="_blank">
                                    <ExternalLink className="mr-2 h-4 w-4" /> {tButtons('demo')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
