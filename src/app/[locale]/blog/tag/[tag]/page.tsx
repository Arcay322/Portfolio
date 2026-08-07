import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag, getTagFromSlug, slugifyTag } from '@/lib/blog';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/metadata';

interface BlogTagPageProps {
  params: Promise<{
    tag: string;
    locale: string;
  }>;
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: slugifyTag(tag) }));
}

export async function generateMetadata({ params }: BlogTagPageProps): Promise<Metadata> {
  const { tag, locale } = await params;
  const t = await getTranslations('blog');
  const displayTag = getTagFromSlug(tag);

  return {
    title: `${t('tag_title')}: ${displayTag ?? tag}`,
    description: `${t('tag_title')}: ${displayTag ?? tag}`,
    ...buildPageMetadata(locale, `/blog/tag/${tag}`),
  };
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { tag } = await params;
  const t = await getTranslations('blog');
  const displayTag = getTagFromSlug(tag);

  if (!displayTag) {
    notFound();
  }

  const posts = getPostsByTag(displayTag);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_blog')}
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 flex items-center justify-center gap-3">
            <Tag className="w-8 h-8 text-primary" />
            {displayTag}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('tag_title')}: {posts.length}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">{t('no_posts')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {post.image && (
                  <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                )}

                <div className="p-6">
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((postTag) => (
                        <span
                          key={postTag}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                        >
                          {postTag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('es', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readingTime} min
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center text-primary hover:underline font-medium"
                  >
                    {t('read_more')} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}