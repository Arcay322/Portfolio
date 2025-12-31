"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Star, Sparkles, CheckCircle, ExternalLink, Github } from "lucide-react";
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
};



export function ProjectCard({ project, isPriority }: ProjectCardProps) {
  const t = useTranslations('projects.badges');
  const tButtons = useTranslations('projects.buttons');
  const [imageLoaded, setImageLoaded] = useState(false);
  const projectSlug = getProjectSlug(project.title);

  const handleProjectClick = () => {
    trackProjectClick(project.title);
  };

  return (
    <Card className="flex flex-col overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] h-full">
      <Link
        href={`/projects/${projectSlug}`}
        className="cursor-pointer"
        onClick={handleProjectClick}
      >
        <div className="overflow-hidden relative aspect-video bg-muted">
          {/* Badges de Featured y New */}
          {(project.featured || project.isNew || project.inProduction) && (
            <div className="absolute top-3 left-3 z-10 flex gap-2">
              {project.featured && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                  <Star className="h-3 w-3" /> {t('featured')}
                </Badge>
              )}
              {project.isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg animate-pulse flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {t('new')}
                </Badge>
              )}
              {project.inProduction && (
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {t('in_production')}
                </Badge>
              )}
            </div>
          )}
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <Image
            src={project.image}
            alt={project.title}
            width={600}
            height={400}
            className={`w-full h-auto object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
              }`}
            priority={isPriority}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-primary-foreground bg-primary/90 px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye className="h-5 w-5" />
              <span className="font-semibold">{tButtons('view_details')}</span>
            </div>
          </div>
        </div>
      </Link>
      <CardHeader>
        <Link
          href={`/projects/${projectSlug}`}
          className="hover:text-primary transition-colors"
          onClick={handleProjectClick}
        >
          <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
        </Link>
        <CardDescription className="line-clamp-3">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => {
            const color = techColors[tag] || "hsl(var(--foreground))";
            return (
              <Badge
                key={tag}
                variant="outline"
                style={{
                  borderColor: color,
                  color: "hsl(var(--foreground))",
                  backgroundColor: "transparent",
                }}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.liveUrl && (
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {tButtons('demo')}
            </Link>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {tButtons('code')}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
