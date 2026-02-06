"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useTranslations } from "next-intl"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  image: string
  content: string
  rating: number
}

export function Testimonials() {
  const t = useTranslations('home.testimonials')
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: t('inversiones_max.name'),
      role: t('inversiones_max.role'),
      company: t('inversiones_max.company'),
      image: "/testimonials/inversiones-max.jpg",
      content: t('inversiones_max.content'),
      rating: 5,
    },
  ]

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTestimonial.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden border border-[rgba(var(--glass-border),var(--glass-opacity))] bg-card/75 backdrop-blur-md shadow-xl">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="h-24 w-24 text-primary" />
            </div>

            <CardContent className="pt-8 pb-6 px-8">
              {/* Stars Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-500 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                &ldquo;{currentTestimonial.content}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary bg-gradient-to-br from-blue-600 to-cyan-600">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-xl">
                    IMP
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground">{currentTestimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Only show if there are multiple testimonials */}
      {testimonials.length > 1 && (
        <>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={previous}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted hover:bg-muted-foreground'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Counter */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {currentIndex + 1} / {testimonials.length}
          </p>
        </>
      )}
    </div>
  )
}
