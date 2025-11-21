import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full" />
      
      <CardHeader>
        {/* Title Skeleton */}
        <Skeleton className="h-7 w-3/4 mb-2" />
        {/* Description Skeleton */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
      
      {/* Buttons Skeleton */}
      <div className="p-6 pt-0 space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </Card>
  )
}

export function SkillCardSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 min-h-[140px] gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-5 w-20" />
    </Card>
  )
}

export function TestimonialSkeleton() {
  return (
    <Card className="p-8">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-5" />
        ))}
      </div>
      
      {/* Content */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Author */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </Card>
  )
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="relative pl-20">
          <div className="absolute left-0 w-16 h-16 flex items-center justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </div>
  )
}
