"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./contact-form";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('contact');
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://arcay.dev' },
    { name: 'Contacto', url: 'https://arcay.dev/contact' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Mesh gradient background */}
        <div className="absolute top-0 right-0 w-1/2 h-96 mesh-gradient-3 opacity-40 -z-10" />
        
        <Breadcrumbs items={[{ label: t('title'), href: '/contact' }]} />
        <section className="text-center">
        <FadeIn>
          <h1 className="text-5xl font-bold font-headline">{t('title')}</h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </FadeIn>
      </section>

      <ScrollReveal className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('form_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </ScrollReveal>

       <ScrollReveal delay={0.2} className="mt-12 text-center">
        <h2 className="text-2xl font-bold font-headline">{t('other_ways')}</h2>
        <div className="mt-4 flex justify-center gap-8">
            <Link href="tel:+51918793956" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all">
              <Phone className="h-8 w-8" />
              <span className="sr-only">{t('phone')}</span>
            </Link>
            <Link href="https://www.linkedin.com/in/arnie-calderon-869159305" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all">
              <Linkedin className="h-8 w-8" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://github.com/arcay322" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all">
              <Github className="h-8 w-8" />
              <span className="sr-only">GitHub</span>
            </Link>
        </div>
      </ScrollReveal>
      </div>
    </>
  );
}
