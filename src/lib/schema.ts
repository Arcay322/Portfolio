import { toAbsoluteUrl } from "@/lib/site-url";

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

export function generateProjectSchema(
  project: {
    title: string
    description: string
    image: string
    tags: string[]
    liveUrl: string
    githubUrl: string
  },
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: toAbsoluteUrl(project.image),
    url: pageUrl,
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

export function generateFaqSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(post: {
  title: string
  description: string
  image?: string
  date: string
  author: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? toAbsoluteUrl(post.image) : undefined,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Person',
      name: 'Arnie Calderon',
    },
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
  }
}
