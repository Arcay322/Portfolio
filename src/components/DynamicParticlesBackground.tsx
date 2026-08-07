'use client'

import dynamic from 'next/dynamic'

export const DynamicParticlesBackground = dynamic(
  () => import('@/components/ParticlesBackground').then((mod) => mod.ParticlesBackground),
  {
    loading: () => null,
    ssr: false, // Canvas decorativo, se carga solo en el cliente para reducir JS inicial
  }
)