"use client"
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/projects";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { JsonLd } from "@/components/JsonLd";
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { trackTechFilter } from "@/lib/analytics";
import { CTASection } from "@/components/CTAComponents";
import { SortDropdown, sortProjects, type SortOption } from "@/components/SortDropdown";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useTranslations } from "next-intl";
import { Search, X, Filter } from "lucide-react";
import { techColors } from "@/lib/constants";
import { ProjectSpotlight } from "@/components/projects/ProjectSpotlight";
import { getProjectSlug } from "@/lib/project-utils";

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const projects = getProjects((key: string) => t(key));

  // Add slug to projects for Spotlight
  const projectsWithSlug = projects.map(p => ({
    ...p,
    slug: getProjectSlug(p.title)
  }));

  const projectSchemas = projects.map(project => generateProjectSchema(project));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://arcay.dev' },
    { name: 'Proyectos', url: 'https://arcay.dev/projects' },
  ]);

  const [selectedTag, setSelectedTag] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Keyboard navigation
  useKeyboardNavigation({
    enableHomeEnd: true,
    enableShortcuts: true,
  });

  // Obtener todas las tecnologías únicas
  const allTags = [t('all'), ...new Set(projects.flatMap(project => project.tags))];

  // Featured Project (Spotlight) - Prioritize Ventify, then featured, then first
  const spotlightProject = projectsWithSlug.find(p => p.slug === 'ventify') || projectsWithSlug.find(p => p.featured) || projectsWithSlug[0];

  // Filtrar y Buscar proyectos
  const filteredProjects = useMemo(() => {
    return projectsWithSlug.filter(project => {
      // Filter by Tag
      const matchesTag = selectedTag === "Todos" || (selectedTag === t('all')) || project.tags.includes(selectedTag);

      // Filter by Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // Exclude spotlight from grid if no filters are active (to avoid duplication)
      // But show it if searching/filtering to ensure results are complete
      const isSpotlight = project.title === spotlightProject.title;
      const showSpotlightInGrid = searchQuery !== "" || (selectedTag !== "Todos" && selectedTag !== t('all'));

      return matchesTag && matchesSearch && (!isSpotlight || showSpotlightInGrid);
    });
  }, [projectsWithSlug, selectedTag, searchQuery, spotlightProject, t]);

  // Ordenar proyectos
  const sortedProjects = sortProjects(filteredProjects, sortBy);

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    trackTechFilter(tag);
  };

  return (
    <>
      <JsonLd data={[...projectSchemas, breadcrumbSchema]} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-screen">
        {/* Mesh gradient background */}
        <div className="absolute top-0 left-0 w-full h-96 mesh-gradient-2 opacity-50 -z-10" />

        <Breadcrumbs items={[{ label: t('title'), href: '/projects' }]} />

        <section className="mb-16">
          <FadeIn>
            <h1 className="text-5xl font-bold font-headline mb-4">{t('title')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t('description')}
            </p>
          </FadeIn>
        </section>

        {/* Spotlight Section (Only visible when no filters active) */}
        {selectedTag === "Todos" && searchQuery === "" && (
          <FadeIn delay={0.2}>
            <ProjectSpotlight project={spotlightProject} />
          </FadeIn>
        )}

        {/* Search and Filter Bar */}
        <div className="sticky top-16 z-30 py-6 -mx-4 px-4 mb-8">
          {/* Glass Background Streamer */}
          <div className="absolute inset-x-0 top-0 bottom-0 bg-background/60 backdrop-blur-xl border-y border-[rgba(var(--glass-border),var(--glass-opacity))] shadow-sm -z-10" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Input - Glass Variant */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/40 border-primary/20 focus:border-primary/60 focus:bg-background/60 focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-foreground placeholder:text-muted-foreground rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-background/50 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-auto">
              <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {/* Tags Filter - Glass Pills */}
          <div className="max-w-7xl mx-auto mt-4 flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto p-4 md:p-2 justify-start md:justify-start scrollbar-hide mask-fade-sides">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 border border-primary/20 mr-2 flex-shrink-0">
              <Filter className="h-4 w-4 text-primary" />
            </div>

            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              const color = techColors[tag] || "hsl(var(--primary))";

              return (
                <button
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 border",
                    isActive
                      ? "border-transparent text-white shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                      : "border-primary/10 bg-background/30 text-muted-foreground hover:bg-primary/5 hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTag"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: tag === t('all') ? "hsl(var(--primary))" : color,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tag}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.section
              key={selectedTag + searchQuery + sortBy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedProjects.length > 0 ? (
                sortedProjects.map((project, index) => (
                  <ScrollReveal key={`${project.title}-${sortBy}`} delay={index * 0.05}>
                    <ProjectCard project={project} isPriority={false} />
                  </ScrollReveal>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('no_projects')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('try_adjusting')}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTag(t('all'));
                      setSearchQuery("");
                    }}
                  >
                    {t('clear_filters')}
                  </Button>
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <div className="mt-24">
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
      </div>
    </>
  );
}
