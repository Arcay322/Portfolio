import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getAllPosts } from "@/lib/blog";
import { getAllProjectSlugs } from "@/lib/project-utils";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import esMessages from "@/messages/es.json";

const locales = ["es", "en"] as const;

function localize(path: string, locale: string): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  return locale === "es" ? `${base}${path}` : `${base}/en${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tProjects = (key: string) => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = esMessages.projects;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  const projectSlugs = getAllProjectSlugs(tProjects).map((p) => p.slug);

  const staticPaths = [
    { path: "", lastModified: new Date() },
    { path: "/about", lastModified: new Date() },
    { path: "/projects", lastModified: new Date() },
    { path: "/blog", lastModified: new Date() },
    { path: "/contact", lastModified: new Date() },
    { path: "/faq", lastModified: new Date() },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const item of staticPaths) {
      entries.push({
        url: localize(item.path, locale),
        lastModified: item.lastModified,
        changeFrequency: "monthly",
        priority: item.path === "" ? 1 : 0.8,
      });
    }

    for (const post of posts) {
      entries.push({
        url: localize(`/blog/${post.slug}`, locale),
        lastModified: new Date(post.date),
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }

    for (const slug of projectSlugs) {
      entries.push({
        url: localize(`/projects/${slug}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
