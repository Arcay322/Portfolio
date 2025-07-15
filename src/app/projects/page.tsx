import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center">
        <h1 className="text-5xl font-bold font-headline">Mis Proyectos</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Una selección de mi trabajo. Siéntete libre de explorar.
        </p>
      </section>

      <div className="max-w-6xl mx-auto">
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} isPriority={index === 0} />
          ))}
        </section>
      </div>
    </div>
  );
}
