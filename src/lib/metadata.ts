import { Metadata } from "next"

interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  path: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

const baseUrl = "https://arcay.dev"
const siteName = "Arnie Calderon - Portfolio"
const defaultImage = "https://storage.googleapis.com/ticket_world_media/arcay-dev-portfolio.png"
const twitterHandle = "@arcaydev"

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = defaultImage,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Arnie Calderon",
}: PageMetadata): Metadata {
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`
  const canonicalUrl = `${baseUrl}${path}`

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    
    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_ES",
      ...(publishedTime && type === "article" ? { publishedTime } : {}),
      ...(modifiedTime && type === "article" ? { modifiedTime } : {}),
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },

    // Alternates
    alternates: {
      canonical: canonicalUrl,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Verification
    verification: {
      google: "your-google-verification-code", // Actualizar con código real
    },

    // Icons
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },

    // Manifest
    manifest: "/site.webmanifest",

    // Base URL
    metadataBase: new URL(baseUrl),
  }
}

// Metadatas predefinidas para páginas comunes
export const homeMetadata = generateMetadata({
  title: "Inicio",
  description: "Portafolio profesional de Arnie Calderon, desarrollador full-stack especializado en React, Next.js, TypeScript y Node.js. Explora mis proyectos y conoce mi experiencia.",
  keywords: [
    "desarrollador full-stack",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "portafolio",
    "web developer",
    "frontend",
    "backend",
    "Arnie Calderon"
  ],
  path: "/",
})

export const aboutMetadata = generateMetadata({
  title: "Sobre Mí",
  description: "Conoce más sobre Arnie Calderon: mi experiencia, habilidades, educación y trayectoria como desarrollador full-stack. Especializado en crear aplicaciones web modernas y escalables.",
  keywords: [
    "sobre mí",
    "experiencia",
    "habilidades",
    "educación",
    "desarrollador",
    "full-stack",
    "React",
    "Next.js",
  ],
  path: "/about",
  type: "profile",
})

export const projectsMetadata = generateMetadata({
  title: "Proyectos",
  description: "Explora mi portafolio de proyectos web: aplicaciones full-stack, e-commerce, dashboards, sistemas de gestión y más. Construidos con React, Next.js, TypeScript, Node.js y PostgreSQL.",
  keywords: [
    "proyectos",
    "portafolio",
    "aplicaciones web",
    "React projects",
    "Next.js projects",
    "full-stack projects",
    "web development",
  ],
  path: "/projects",
})

export const contactMetadata = generateMetadata({
  title: "Contacto",
  description: "¿Tienes un proyecto en mente? Contáctame para discutir cómo puedo ayudarte a construir tu próxima aplicación web. Disponible para freelance, consultoría y colaboraciones.",
  keywords: [
    "contacto",
    "freelance",
    "consultoría",
    "contratar desarrollador",
    "web developer for hire",
    "React developer",
  ],
  path: "/contact",
})

// Helper para generar metadata de proyectos individuales
export function generateProjectMetadata(project: {
  title: string
  description: string
  image: string
  tags: string[]
  slug: string
  date?: string
}): Metadata {
  return generateMetadata({
    title: project.title,
    description: project.description,
    keywords: [
      ...project.tags,
      "proyecto web",
      "case study",
      "portfolio project",
    ],
    image: project.image,
    path: `/projects/${project.slug}`,
    type: "article",
    publishedTime: project.date,
    modifiedTime: project.date,
  })
}
