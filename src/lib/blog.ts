/**
 * Blog System Utilities
 * 
 * Handles MDX blog posts with frontmatter, reading time, and utilities
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  readingTime: number;
  content: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  readingTime: number;
}

/**
 * Get all blog posts
 */
export function getAllPosts(): BlogPostMetadata[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const readingTime = calculateReadingTime(content);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        author: data.author || 'Anonymous',
        tags: data.tags || [],
        image: data.image,
        readingTime,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const readingTime = calculateReadingTime(content);

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || 'Anonymous',
      tags: data.tags || [],
      image: data.image,
      readingTime,
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

/**
 * Get related posts based on tags
 */
export function getRelatedPosts(slug: string, limit: number = 3): BlogPostMetadata[] {
  const currentPost = getPostBySlug(slug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();
  
  // Calculate relevance score based on shared tags
  const postsWithScore = allPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
      return {
        ...post,
        score: sharedTags.length,
      };
    })
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score);

  return postsWithScore.slice(0, limit);
}

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): BlogPostMetadata[] {
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter((post) => {
    const matchesTitle = post.title.toLowerCase().includes(lowerQuery);
    const matchesDescription = post.description.toLowerCase().includes(lowerQuery);
    const matchesTags = post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

    return matchesTitle || matchesDescription || matchesTags;
  });
}

/**
 * Generate RSS feed
 */
export function generateRSSFeed(siteUrl: string): string {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('\n      ')}
    </item>
  `;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Portfolio Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Blog sobre desarrollo web, tecnología y buenas prácticas</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return rssFeed;
}

/**
 * Get posts pagination
 */
export function getPaginatedPosts(page: number = 1, postsPerPage: number = 10): {
  posts: BlogPostMetadata[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
} {
  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
  };
}
