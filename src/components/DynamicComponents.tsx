/**
 * Dynamic Imports for Code Splitting
 * 
 * Este archivo centraliza todos los dynamic imports para mejorar
 * el code splitting y reducir el tamaño inicial del bundle.
 */

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

// Loading fallbacks
const TestimonialsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <Skeleton className="h-20 w-20 rounded-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const TimelineLoading = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
)

const StatsCounterLoading = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const SkillBarsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    ))}
  </div>
)

const CertificationsLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))}
  </div>
)

// Dynamic imports con loading states
export const DynamicTestimonials = dynamic(
  () => import("@/components/Testimonials").then((mod) => mod.Testimonials),
  {
    loading: () => <TestimonialsLoading />,
    ssr: true,
  }
)

export const DynamicTimeline = dynamic(
  () => import("@/components/Timeline").then((mod) => mod.Timeline),
  {
    loading: () => <TimelineLoading />,
    ssr: true,
  }
)

export const DynamicStatsCounter = dynamic(
  () => import("@/components/StatsCounter").then((mod) => mod.StatsCounter),
  {
    loading: () => <StatsCounterLoading />,
    ssr: true,
  }
)

export const DynamicSkillBars = dynamic(
  () => import("@/components/SkillBars").then((mod) => mod.SkillBars),
  {
    loading: () => <SkillBarsLoading />,
    ssr: true,
  }
)

export const DynamicCertifications = dynamic(
  () => import("@/components/Certifications").then((mod) => mod.Certifications),
  {
    loading: () => <CertificationsLoading />,
    ssr: true,
  }
)

export const DynamicCTASection = dynamic(
  () => import("@/components/CTAComponents").then((mod) => mod.CTASection),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: true,
  }
)

// Components que no son críticos para el primer render
export const DynamicContactForm = dynamic(
  () => import("@/app/[locale]/contact/contact-form").then((mod) => mod.ContactForm),
  {
    loading: () => (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ),
    ssr: false, // No renderizar en servidor para reducir tiempo de SSR
  }
)

export const DynamicAnimatedBackground = dynamic(
  () => import("@/components/AnimatedBackground").then((mod) => mod.AnimatedBackground),
  {
    loading: () => null,
    ssr: false, // Background animado no necesita SSR
  }
)
