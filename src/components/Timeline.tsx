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
      year: "2025",
      title: t('portfolio.title'),
      description: t('portfolio.description'),
      icon: "project",
    },
    {
      year: "2025",
      title: t('ventify.title'),
      description: t('ventify.description'),
      icon: "achievement",
    },
    {
      year: "2024",
      title: t('sumaq_uywa.title'),
      description: t('sumaq_uywa.description'),
      icon: "achievement",
    },
    {
      year: "2024",
      title: t('ticket_world.title'),
      description: t('ticket_world.description'),
      icon: "achievement",
    },
    {
      year: "2022-2025",
      title: t('university.title'),
      description: t('university.description'),
      icon: "education",
    },
    {
      year: "2022",
      title: t('start.title'),
      description: t('start.description'),
      icon: "work",
    },
  ]

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Línea vertical con gradiente */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-transparent opacity-50" />

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
              {/* Icono en la línea */}
              <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                <div className="relative z-10 w-12 h-12 rounded-full bg-background border-2 border-primary/50 group-hover:border-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <div className="absolute inset-0 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300" />
                  <Icon className="h-5 w-5 text-primary relative z-10" />
                </div>
                {/* Conector horizontal */}
                <div className="absolute left-12 top-1/2 w-12 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>

              {/* Contenido */}
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-muted/40 bg-background/50 backdrop-blur-sm group-hover:border-primary/30">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
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
