"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Award, Clock, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"
import { getSkillsCount } from "@/lib/skills"
import { getProjectsCount } from "@/lib/projects-config"

interface Stat {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  prefix?: string
}

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const duration = 2000 // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function (easeOutExpo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      setCount(Math.floor(easeOutExpo * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref} className="text-5xl font-bold font-headline text-primary">
      {prefix}{count}{suffix}
    </span>
  )
}

export function StatsCounter() {
  const t = useTranslations('about.stats')

  // Obtener contadores dinámicamente
  const projectsCount = getProjectsCount()
  const skillsCount = getSkillsCount()

  const stats: Stat[] = [
    {
      icon: <Clock className="h-8 w-8" />,
      value: 3,
      label: t('experience.label'),
      suffix: "+",
    },
    {
      icon: <Code className="h-8 w-8" />,
      value: projectsCount,
      label: t('projects.label'),
      suffix: "+",
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: skillsCount,
      label: t('technologies.label'),
      suffix: "+",
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      value: 100,
      label: t('commits.label'),
      suffix: "+",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="text-primary">
              {stat.icon}
            </div>
            <AnimatedNumber 
              value={stat.value} 
              suffix={stat.suffix} 
              prefix={stat.prefix}
            />
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
