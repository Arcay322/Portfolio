export type MediaType = "image" | "video" | "gif"

export interface MediaItem {
  type: MediaType
  src: string
  alt: string
  thumbnail?: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured?: boolean
  isNew?: boolean
  inProduction?: boolean
  longDescription: string
  features: string[]
  challenges: string[]
  technologies?: string[]
  slug?: string
  date?: string
  // Nueva propiedad para multimedia
  media?: MediaItem[]
  // Para proyectos relacionados
  relatedProjects?: string[] // Array de slugs
}
