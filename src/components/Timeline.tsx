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
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-8">
        {timeline.map((item, index) => {
          const Icon = iconMap[item.icon]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-20"
            >
              {/* Icono en la línea */}
              <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Contenido */}
              <Card className="hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-primary">
                      {item.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-headline mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
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
