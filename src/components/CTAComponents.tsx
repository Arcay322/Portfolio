"use client"

import { ArrowRight, Mail, Phone, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  icon?: "arrow" | "mail" | "phone" | "download" | "external"
  size?: "default" | "sm" | "lg"
  external?: boolean
  className?: string
}

export function CTAButton({ 
  href, 
  children, 
  variant = "default", 
  icon = "arrow",
  size = "default",
  external = false,
  className = ""
}: CTAButtonProps) {
  const iconMap = {
    arrow: ArrowRight,
    mail: Mail,
    phone: Phone,
    download: Download,
    external: ExternalLink,
  }

  const Icon = iconMap[icon]

  const buttonContent = (
    <Button 
      variant={variant} 
      size={size}
      className={`group relative overflow-hidden ${className}`}
      asChild
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2"
      >
        <span>{children}</span>
        <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "200%" }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </Button>
  )

  if (external) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </Link>
    )
  }

  return (
    <Link href={href}>
      {buttonContent}
    </Link>
  )
}

// CTA Section Component
interface CTASectionProps {
  title: string
  description: string
  primaryAction: {
    label: string
    href: string
    icon?: "arrow" | "mail" | "phone" | "download" | "external"
  }
  secondaryAction?: {
    label: string
    href: string
    icon?: "arrow" | "mail" | "phone" | "download" | "external"
  }
}

export function CTASection({ title, description, primaryAction, secondaryAction }: CTASectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-16 overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-animated -z-10" />
      
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-headline text-4xl md:text-5xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <CTAButton
            href={primaryAction.href}
            icon={primaryAction.icon || "arrow"}
            size="lg"
            className="min-w-[200px]"
          >
            {primaryAction.label}
          </CTAButton>
          
          {secondaryAction && (
            <CTAButton
              href={secondaryAction.href}
              icon={secondaryAction.icon || "arrow"}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              {secondaryAction.label}
            </CTAButton>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
