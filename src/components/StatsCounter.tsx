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
          className="relative group overflow-hidden border border-primary/20 bg-background/40 backdrop-blur-md p-6 rounded-2xl hover:border-primary/50 transition-all duration-500"
        >
          {/* HUD Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/30 group-hover:border-primary/80 transition-colors" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/30 group-hover:border-primary/80 transition-colors" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary/30 group-hover:border-primary/80 transition-colors" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/30 group-hover:border-primary/80 transition-colors" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(var(--primary),0.6)]">
              {stat.icon}
            </div>
            <div className="drop-shadow-[0_0_10px_rgba(var(--primary),0.4)]">
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
