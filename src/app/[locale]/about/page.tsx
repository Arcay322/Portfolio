"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code, Lightbulb, TrendingUp, Mail, Linkedin, Github, Gamepad2, Cpu, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { DownloadCVButton } from "@/components/DownloadCVButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { generatePersonSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { Timeline } from "@/components/Timeline";
import { StatsCounter } from "@/components/StatsCounter";
import { CTASection } from "@/components/CTAComponents";
import { useTranslations } from "next-intl";
import { skills } from "@/lib/skills";

export default function AboutPage() {
  const t = useTranslations('about');

  const experiences = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: t('projects.methodology.title'),
      description: t('projects.methodology.description'),
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: t('projects.problem_solving.title'),
      description: t('projects.problem_solving.description'),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: t('projects.learning.title'),
      description: t('projects.learning.description'),
    },
  ];

  const hobbies = [
    {
      icon: <Gamepad2 className="h-8 w-8 text-primary" />,
      title: t('hobbies.gaming.title'),
      description: t('hobbies.gaming.description'),
    },
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: t('hobbies.tech.title'),
      description: t('hobbies.tech.description'),
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: t('hobbies.learning.title'),
      description: t('hobbies.learning.description'),
    },
  ];

  const personSchema = generatePersonSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://arcay.dev' },
    { name: 'Sobre Mí', url: 'https://arcay.dev/about' },
  ]);

  return (
    <>
      <JsonLd data={[personSchema, breadcrumbSchema]} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ label: t('title'), href: '/about' }]} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <FadeIn className="lg:col-span-1 flex flex-col items-center text-center">
            <Avatar className="h-40 w-40 border-4 border-primary">
              <AvatarImage
                src="https://storage.googleapis.com/ticket_world_media/foto%20portfolio.png"
                alt="Arnie Calderon"
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <h1 className="mt-6 text-4xl font-bold font-headline">
              {t('name')}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground">
              {t('role')}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link
                  href="/contact"
                  aria-label="Contact"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link
                  href="https://www.linkedin.com/in/arnie-calderon-869159305"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <Link
                  href="https://github.com/arcay322"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-4">
              <DownloadCVButton />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">{t('bio_title')}</CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground space-y-4">
                <p>
                  {t('bio_paragraph1')}
                </p>
                <p>
                  {t('bio_paragraph2')}
                </p>
                <p>
                  {t('bio_paragraph3')}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Stats Counter */}
        <section className="mt-16">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-4">
              {t('stats_title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              {t('stats_subtitle')}
            </p>
          </ScrollReveal>
          <StatsCounter />
        </section>

        <section className="mt-16">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline">
              {t('skills_title')}
            </h2>
          </ScrollReveal>
          <StaggerContainer className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {skills.map((skill) => (
              <StaggerItem key={skill.name}>
                <Card className="flex flex-col items-center justify-center p-6 hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 min-h-[140px] gap-4">
                  {skill.icon}
                  <p className="font-semibold text-lg text-center">{skill.name}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <section className="mt-16">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-12">
              {t('timeline_title')}
            </h2>
          </ScrollReveal>
          <Timeline />
        </section>

        <section className="mt-16">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline">
              {t('projects_title')}
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <ScrollReveal key={exp.title} delay={index * 0.15}>
                <Card className="hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader className="items-center text-center">
                    {exp.icon}
                    <CardTitle className="font-headline text-2xl mt-4">
                      {exp.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      {exp.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="mt-16">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline">
              {t('hobbies_title')}
            </h2>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby, index) => (
              <ScrollReveal key={hobby.title} delay={index * 0.15}>
                <Card className="hover:shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader className="items-center text-center">
                    {hobby.icon}
                    <CardTitle className="font-headline text-2xl mt-4">
                      {hobby.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      {hobby.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-16">
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
              href: "/CV_ArnieCalderon.pdf",
              icon: "download"
            }}
          />
        </div>
      </div>
    </>
  );
}
