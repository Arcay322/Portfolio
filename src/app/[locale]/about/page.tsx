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
import { techColors } from "@/lib/constants";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-screen">
        {/* Mesh gradient background */}
        <div className="absolute top-0 left-0 w-full h-96 mesh-gradient-2 opacity-50 -z-10" />

        <Breadcrumbs items={[{ label: t('title'), href: '/about' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <FadeIn className="lg:col-span-1 flex flex-col items-center text-center sticky top-24">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full opacity-25 group-hover:opacity-50 blur transition duration-1000 group-hover:duration-200" />
              <Avatar className="h-48 w-48 border-4 border-background relative shadow-xl">
                <AvatarImage
                  src="/images/profile/avatar.webp"
                  alt="Arnie Calderon"
                  className="object-cover object-center"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>

            <h1 className="mt-8 text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {t('name')}
            </h1>
            <p className="mt-2 text-xl text-muted-foreground font-medium">
              {t('role')}
            </p>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
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
                className="rounded-full w-12 h-12 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all duration-300 hover:scale-110"
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
                className="rounded-full w-12 h-12 hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:scale-110"
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
            <div className="mt-6 w-full max-w-xs">
              <DownloadCVButton />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary rounded-full inline-block" />
                  {t('bio_title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg text-muted-foreground space-y-6 leading-relaxed">
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
        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-4">
              {t('stats_title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('stats_subtitle')}
            </p>
          </ScrollReveal>
          <StatsCounter />
        </section>

        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-12">
              {t('skills_title')}
            </h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {skills.map((skill) => {
              const color = techColors[skill.name] || "hsl(var(--primary))";

              return (
                <StaggerItem key={skill.name}>
                  <Card
                    className="group flex flex-col items-center justify-center p-6 hover:shadow-xl transition-all duration-300 min-h-[140px] gap-4 border-muted/40 bg-background/50 backdrop-blur-sm relative overflow-hidden"
                    style={{
                      // We use CSS variables for the hover color to keep it clean
                      // @ts-expect-error - CSS custom properties are valid in style objects but TS complains
                      "--hover-color": color
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="transform group-hover:scale-110 transition-transform duration-300 text-muted-foreground group-hover:text-[var(--hover-color)]"
                      style={{ color: 'inherit' }}
                    >
                      <div style={{ color: "inherit" }}>
                        {skill.icon}
                      </div>
                    </div>
                    <p
                      className="font-semibold text-lg text-center transition-colors group-hover:text-[var(--hover-color)]"
                    >
                      {skill.name}
                    </p>

                    <div
                      className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--hover-color)] rounded-xl transition-colors duration-300 pointer-events-none"
                    />
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer >
        </section >


        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-16">
              {t('timeline_title')}
            </h2>
          </ScrollReveal>
          <Timeline />
        </section>

        <section className="mt-24">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-12">
              {t('projects_title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <ScrollReveal key={exp.title} delay={index * 0.15}>
                <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-muted/40 bg-background/50 backdrop-blur-sm">
                  <CardHeader className="items-center text-center pb-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {exp.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">
                      {exp.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Hobbies Section */}
        <section className="mt-24 mb-12">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center font-headline mb-12">
              {t('hobbies_title')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hobbies.map((hobby, index) => (
              <ScrollReveal key={hobby.title} delay={index * 0.15}>
                <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-muted/40 bg-background/50 backdrop-blur-sm">
                  <CardHeader className="items-center text-center pb-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {hobby.icon}
                    </div>
                    <CardTitle className="font-headline text-2xl">
                      {hobby.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {hobby.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

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
              href: "/CV_ArnieCalderon.pdf",
              icon: "download"
            }}
          />
        </div>
      </div >
    </>
  );
}
