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
import { ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
};

type ProjectCardProps = {
  project: Project;
  isPriority: boolean;
};

const techColors: { [key: string]: string } = {
  Python: "#3776AB",
  Django: "#092E20",
  PostgreSQL: "#336791",
  JavaScript: "#F7DF1E",
  "HTML/CSS": "#E34F26",
  React: "#61DAFB",
  TypeScript: "#3178C6",
  "Node.js": "#339933",
  "Tailwind CSS": "#06B6D4",
  "Next.js": "#FFFFFF",
  "Shadcn UI": "#FFFFFF",
};

export function ProjectCard({ project, isPriority }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden group">
      <div className="overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          width={600}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          priority={isPriority}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
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
      <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-4">
        <Button asChild size="lg">
          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            Demo en Vivo <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="hover:text-primary hover:border-primary">
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Código Fuente
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
