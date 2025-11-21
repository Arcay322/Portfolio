"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxHeroProps {
  children: React.ReactNode
}

export function ParallaxHero({ children }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax effect - content moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}
