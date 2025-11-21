/**
 * SEO Utilities
 * 
 * Helper functions for generating SEO metadata
 */

import { Metadata } from 'next';

interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: string;
  siteName?: string;
}

const DEFAULT_CONFIG = {
  siteName: 'Portfolio',
  locale: 'es_ES',
  type: 'website' as const,
};

/**
 * Generate complete SEO metadata
 */
export function generateSeoMetadata(config: SeoConfig): Metadata {
  const {
    title,
    description,
    url,
    image,
    type = DEFAULT_CONFIG.type,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    locale = DEFAULT_CONFIG.locale,
    siteName = DEFAULT_CONFIG.siteName,
  } = config;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`;

  return {
    title: `${title} | ${siteName}`,
    description,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      locale,
      type,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        tags,
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@yourusername', // Replace with actual Twitter handle
    },

    // Additional metadata
    alternates: {
      canonical: fullUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification
    verification: {
      // Add your verification codes
      // google: 'google-verification-code',
      // yandex: 'yandex-verification-code',
      // bing: 'bing-verification-code',
    },
  };
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(type: string, data: Record<string, unknown>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schemas: Record<string, Record<string, unknown>> = {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: baseUrl,
      description: data.description,
      inLanguage: 'es',
    },

    person: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      url: baseUrl,
      image: data.image,
      sameAs: data.socialLinks,
      jobTitle: data.jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: data.company,
      },
    },

    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher || DEFAULT_CONFIG.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
    },

    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data.items as Array<{ name: string; url: string }>).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    },

    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      sameAs: data.socialLinks,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: data.email,
      },
    },
  };

  return schemas[type] || schemas.website;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(siteUrl: string): string {
  return `
# *
User-agent: *
Allow: /

# Disallow admin and api routes
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Google
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /
  `.trim();
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${siteUrl}${path}`;
}

/**
 * Generate hreflang links for i18n
 */
export function getHreflangLinks(path: string, locales: string[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return locales.map((locale) => ({
    hreflang: locale,
    href: `${siteUrl}/${locale}${path}`,
  }));
}
