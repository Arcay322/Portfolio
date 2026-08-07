'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

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

export const DynamicTestimonials = dynamic(
  () => import('@/components/Testimonials').then((mod) => mod.Testimonials),
  {
    loading: () => <TestimonialsLoading />,
    ssr: true,
  }
)
