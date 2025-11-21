"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { useInView } from "react-intersection-observer"

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = "",
  direction = "up"
}: ScrollRevealProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const directionOffset = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0,
        ...directionOffset[direction]
      }}
      animate={inView ? { 
        opacity: 1,
        x: 0,
        y: 0
      } : {}}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
