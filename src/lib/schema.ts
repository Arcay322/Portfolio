export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arnie Calderon',
    jobTitle: 'Desarrollador Full-Stack',
    description: 'Desarrollador web full-stack especializado en React, Next.js, Node.js y TypeScript',
    url: 'https://arcay.dev',
    image: 'https://storage.googleapis.com/ticket_world_media/foto%20portfolio.png',
    sameAs: [
      'https://github.com/arcay322',
      'https://www.linkedin.com/in/arnie-calderon-869159305',
    ],
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Python',
      'Django',
      'PostgreSQL',
      'Docker',
      'Tailwind CSS',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Arnie Calderon - Portafolio',
    description: 'Portafolio profesional de un desarrollador full-stack',
    url: 'https://arcay.dev',
    author: {
      '@type': 'Person',
      name: 'Arnie Calderon',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://arcay.dev/projects?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateProjectSchema(project: {
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.image,
    url: project.liveUrl,
    author: {
      '@type': 'Person',
      name: 'Arnie Calderon',
    },
    keywords: project.tags.join(', '),
    sameAs: project.githubUrl,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
