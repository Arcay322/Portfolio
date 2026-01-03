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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen">

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 md:py-32 relative z-10 min-h-[80vh]">
          {/* Mesh gradient background for Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] mesh-gradient-1 opacity-40 -z-10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-5xl relative">
            <div className="text-5xl sm:text-7xl md:text-9xl font-bold font-headline tracking-tighter mb-8">
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
              <div className="mt-12 flex justify-center gap-6 flex-wrap">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 bg-primary text-primary-foreground border-0">
                  <Link href="/projects">
                    {t('cta')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full hover:scale-105 transition-all duration-300 backdrop-blur-md bg-background/30 border-muted-foreground/20 hover:bg-background/50 hover:border-primary/50">
                  <Link href="/contact">{tContact('title')}</Link>
                </Button>
                <div className="h-14 flex items-center">
                  <DownloadCVButton />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Featured Projects Section */}
        < section className="py-24 relative z-10" >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

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
            <Button asChild size="lg" variant="ghost" className="text-lg hover:bg-primary/10 hover:text-primary transition-colors group">
              <Link href="/projects">
                {t('view_all_projects')} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section >

        {/* Testimonials Section */}
        < section className="py-20 relative z-10" >
          <div className="absolute top-0 right-0 w-1/2 h-full mesh-gradient-2 opacity-20 -z-10 blur-3xl pointer-events-none" />

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
        </section >

        {/* CTA Section */}
        < div className="mb-20" >
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
        </div >
      </div >
    </>
  );
}
