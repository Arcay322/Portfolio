import { generateRSSFeed } from '@/lib/blog';
import { getSiteUrl } from '@/lib/site-url';

export async function GET() {
  const siteUrl = getSiteUrl();
  const rssFeed = generateRSSFeed(siteUrl);

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
