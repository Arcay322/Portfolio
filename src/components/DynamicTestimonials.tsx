'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

const TestimonialsLoading = () => (
  <div className="max-w-4xl mx-auto px-4">
    <Card className="border border-[rgba(var(--glass-border),var(--glass-opacity))] bg-card/75">
      <CardContent className="pt-8 pb-6 px-8">
        <div className="flex gap-1 mb-4">
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-6 w-full mb-3" />
        <Skeleton className="h-6 w-5/6 mb-6" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export const DynamicTestimonials = dynamic(
  () => import('@/components/Testimonials').then((mod) => mod.Testimonials),
  {
    loading: () => <TestimonialsLoading />,
    ssr: true,
  }
)
