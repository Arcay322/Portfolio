"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import Typewriter from "@/components/Typewriter";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { DownloadCVButton } from "@/components/DownloadCVButton";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTAComponents";
import { JsonLd } from "@/components/JsonLd";
import { generatePersonSchema, generateWebsiteSchema } from "@/lib/schema";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const t = useTranslations('home');
  const tContact = useTranslations('contact');
  const tProjects = useTranslations('projects');
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebsiteSchema();

  // Obtener proyectos destacados
  const allProjects = getProjects(tProjects);
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 3);

  return (
    <>
      <JsonLd data={[personSchema, websiteSchema]} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 relative z-10">
          <div className="max-w-4xl">
            <div className="text-5xl sm:text-7xl md:text-9xl font-bold font-headline tracking-tighter mb-6">
              <Typewriter text="Arnie Calderon" speed={150} className="text-primary drop-shadow-2xl" />
            </div>
            <FadeIn delay={0.3} direction="up">
              <p className="mt-4 text-2xl sm:text-3xl md:text-4xl text-foreground/90 font-headline font-light tracking-wide">
                {t('title')}
              </p>
            </FadeIn>
            <FadeIn delay={0.5} direction="up">
              <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t('subtitle')}
              </p>
            </FadeIn>
            <FadeIn delay={0.7} direction="up">
              <div className="mt-10 flex justify-center gap-6 flex-wrap">
                <Button asChild size="lg" className="h-12 px-8 text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                  <Link href="/projects">
                    {t('cta')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg hover:scale-105 transition-transform backdrop-blur-sm bg-background/50">
                  <Link href="/contact">{tContact('title')}</Link>
                </Button>
                <DownloadCVButton />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-24 relative z-10">
          <ScrollReveal>
            <h2 className="text-5xl font-bold text-center font-headline mb-6 tracking-tight">
              {tProjects('featured')}
            </h2>
            <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto text-lg">
              {tProjects('description')}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.title} delay={index * 0.1}>
                <ProjectCard
                  project={project}
                  isPriority={index < 2}
                />
              </ScrollReveal>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild size="lg" variant="ghost" className="text-lg hover:bg-primary/10">
              <Link href="/projects">
                Ver Todos los Proyectos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-4">
              {t('testimonials_title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('testimonials_subtitle')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Testimonials />
          </ScrollReveal>
        </section>

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
            href: "/projects",
            icon: "arrow"
          }}
        />
      </div>
    </>
  );
}
