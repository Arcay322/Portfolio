"use client"
import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { JsonLd } from "@/components/JsonLd";
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trackTechFilter } from "@/lib/analytics";
import { CTASection } from "@/components/CTAComponents";
import { SortDropdown, sortProjects, type SortOption } from "@/components/SortDropdown";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useTranslations } from "next-intl";

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const projects = getProjects((key: string) => t(key));
  const projectSchemas = projects.map(project => generateProjectSchema(project));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://arcay.dev' },
    { name: 'Proyectos', url: 'https://arcay.dev/projects' },
  ]);
  const [selectedTag, setSelectedTag] = useState<string>("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  
  // Keyboard navigation
  useKeyboardNavigation({
    enableHomeEnd: true,
    enableShortcuts: true,
  });

  // Obtener todas las tecnologías únicas
  const allTags = [t('all'), ...new Set(projects.flatMap(project => project.tags))];

  // Filtrar proyectos según la tecnología seleccionada
  const filteredProjects = selectedTag === "Todos" 
    ? projects 
    : projects.filter(project => project.tags.includes(selectedTag));

  // Ordenar proyectos
  const sortedProjects = sortProjects(filteredProjects, sortBy);

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    trackTechFilter(tag);
  };

  return (
    <>
      <JsonLd data={[...projectSchemas, breadcrumbSchema]} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Mesh gradient background */}
        <div className="absolute top-0 left-0 w-full h-96 mesh-gradient-2 opacity-50 -z-10" />
        
        <Breadcrumbs items={[{ label: t('title'), href: '/projects' }]} />
        <section className="text-center">
        <FadeIn>
          <h1 className="text-5xl font-bold font-headline">{t('title')}</h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('description')}
          </p>
        </FadeIn>
      </section>

      {/* Filtros y Sorting */}
      <FadeIn delay={0.3} className="mt-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter(tag)}
              className="transition-all hover:scale-105"
            >
              {tag}
            </Button>
          ))}
        </div>
        <div className="flex justify-center">
          <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
        </div>
      </FadeIn>

      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.section
            key={selectedTag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project, index) => (
                <ScrollReveal key={`${project.title}-${sortBy}`} delay={index * 0.1}>
                  <ProjectCard project={project} isPriority={index === 0} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-muted-foreground">{t('no_projects')}</p>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <CTASection
        title={t('cta_title')}
        description={t('cta_description')}
        primaryAction={{
          label: t('cta_primary'),
          href: "/contact",
          icon: "mail"
        }}
        secondaryAction={{
          label: t('cta_secondary'),
          href: "/about",
          icon: "arrow"
        }}
      />
      </div>
    </>
  );
}
