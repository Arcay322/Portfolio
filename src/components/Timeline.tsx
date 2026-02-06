"use client"

import { motion } from "framer-motion"
import { Calendar, Code, GraduationCap, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"

interface TimelineItem {
  year: string
  title: string
  description: string
  icon: "education" | "work" | "achievement" | "project"
}

const iconMap = {
  education: GraduationCap,
  work: Code,
  achievement: Trophy,
  project: Code,
}

export function Timeline() {
  const t = useTranslations('about.timeline')

  const timeline: TimelineItem[] = [
    {
      year: t('imprex.year'),
      title: t('imprex.title'),
      description: t('imprex.description'),
      icon: "work",
    },
    {
      year: t('portfolio.year'),
      title: t('portfolio.title'),
      description: t('portfolio.description'),
      icon: "project",
    },
    {
      year: t('ventify.year'),
      title: t('ventify.title'),
      description: t('ventify.description'),
      icon: "achievement",
    },
    {
      year: t('sumaq_uywa.year'),
      title: t('sumaq_uywa.title'),
      description: t('sumaq_uywa.description'),
      icon: "achievement",
    },
    {
      year: t('ticket_world.year'),
      title: t('ticket_world.title'),
      description: t('ticket_world.description'),
      icon: "achievement",
    },
    {
      year: t('university.year'),
      title: t('university.title'),
      description: t('university.description'),
      icon: "education",
    },
    {
      year: t('start.year'),
      title: t('start.title'),
      description: t('start.description'),
      icon: "work",
    },
  ]

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Light Beam (Glowing central line) */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-transparent shadow-[0_0_15px_rgba(var(--primary),0.5)] opacity-80" />

      <div className="space-y-12">
        {timeline.map((item, index) => {
          const Icon = iconMap[item.icon]

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative pl-24 group"
            >
              {/* Node (Glass Sphere) */}
              <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                {/* Halo behind sphere */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                <div className="relative z-10 w-12 h-12 rounded-full border border-primary/30 bg-background/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-primary/80 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                  <Icon className="h-5 w-5 text-primary drop-shadow-[0_0_5px_rgba(var(--primary),0.8)] relative z-20" />
                </div>

                {/* Horizontal Beam Connector */}
                <div className="absolute left-12 top-1/2 w-12 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Contenido (Milky Glass Card) */}
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[rgba(var(--glass-border),var(--glass-opacity))] bg-card/75 backdrop-blur-md group-hover:border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(var(--primary),0.1)]">
                      <Calendar className="h-3 w-3" />
                      {item.year}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
