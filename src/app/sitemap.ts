import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://arcay.dev'
  const currentDate = new Date()

  const routes = ['', '/about', '/projects', '/contact', '/blog']
  const languages = ['es', 'en']

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Base routes
  routes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: route === '' ? 1.0 : 0.8,
    })
  })

  // Language prefixed routes
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: route === '' ? 0.9 : 0.7,
      })
    })
  })

  return sitemapEntries
}
