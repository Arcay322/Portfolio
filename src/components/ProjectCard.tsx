"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Github, Star, Sparkles, MonitorPlay } from "lucide-react";
import { getProjectSlug } from "@/lib/project-utils";
import { trackProjectClick } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { techColors } from "@/lib/constants";

type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
  isNew?: boolean;
  inProduction?: boolean;
};

type ProjectCardProps = {
  project: Project;
  isPriority: boolean;
  className?: string;
};

export function ProjectCard({ project, isPriority, className }: ProjectCardProps) {
  const t = useTranslations('projects.badges');
  const tButtons = useTranslations('projects.buttons');
  const [imageLoaded, setImageLoaded] = useState(false);
  const projectSlug = getProjectSlug(project.title);

  const handleProjectClick = () => {
    trackProjectClick(project.title);
  };

  return (
    <div className={`group relative flex flex-col h-full rounded-[var(--radius)] overflow-hidden transition-all duration-500 hover:shadow-glow hover:-translate-y-1 ${className}`}>
      {/* Glow Effect Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

      {/* Glass Border Container - Replaces standard border */}
      <div className="absolute inset-0 rounded-[var(--radius)] border border-[rgba(var(--glass-border),var(--glass-opacity))] group-hover:border-primary/30 transition-colors duration-500 z-20 pointer-events-none" />

      {/* Main Link Wrapper */}
      <Link
        href={`/projects/${projectSlug}`}
        onClick={handleProjectClick}
        className="flex-grow flex flex-col z-10"
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden w-full bg-muted/20">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full animate-pulse" />
          )}

          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={500}
            className={`object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            priority={isPriority}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay Gradient on Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80" />

          {/* Badges Floating on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            {project.featured && (
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 backdrop-blur-md">
                <Star className="w-3 h-3 mr-1" /> {t('featured')}
              </Badge>
            )}
            {project.isNew && (
              <Badge className="bg-primary/20 text-primary-foreground border-primary/20 backdrop-blur-md animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" /> {t('new')}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section - Seamless Flow */}
        <div className="relative flex flex-col flex-grow p-6 bg-card/75 backdrop-blur-[2px] -mt-12">

          <div className="mb-4">
            {/* Title with decorative element */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-headline text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all duration-300">
                {project.title}
              </h3>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
            </div>

            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-4">
              {project.description}
            </p>
          </div>

          {/* Tech Stack - Minimalist Pills */}
          <div className="flex flex-wrap gap-2 mt-auto mb-6">
            {project.tags.slice(0, 4).map((tag) => {
              const color = techColors[tag] || "hsl(var(--primary))";
              return (
                <span
                  key={tag}
                  className="text-xs font-mono font-medium px-2 py-1 rounded-md backdrop-blur-sm transition-colors duration-300"
                  style={{
                    backgroundColor: `${color}15`, // ~8% opacity
                    color: color,
                    borderColor: `${color}30`, // ~19% opacity
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  {tag}
                </span>
              );
            })}
            {project.tags.length > 4 && (
              <span className="text-xs font-mono px-2 py-1 text-muted-foreground">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Footer - Only visible on hover/focus if needed, or subtle always */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        {project.liveUrl && (
          <Button size="icon" variant="glass" className="h-9 w-9 rounded-full" asChild>
            <Link href={project.liveUrl} target="_blank" title={tButtons('demo')}>
              <MonitorPlay className="h-4 w-4" />
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button size="icon" variant="glass" className="h-9 w-9 rounded-full" asChild>
            <Link href={project.githubUrl} target="_blank" title={tButtons('code')}>
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
