import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
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

  const socialLinks = [
    {
      name: "LinkedIn",
      description: "Conectemos profesionalmente",
      href: "https://www.linkedin.com/in/arnie-calderon-869159305",
      icon: <Linkedin className="h-6 w-6" />,
      color: "hover:text-[#0077b5] hover:border-[#0077b5]",
      bg: "group-hover:bg-[#0077b5]/10"
    },
    {
      name: "GitHub",
      description: "Revisa mi código y proyectos",
      href: "https://github.com/arcay322",
      icon: <Github className="h-6 w-6" />,
      color: "hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white",
      bg: "group-hover:bg-black/5 dark:group-hover:bg-white/10"
    },

  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Mesh gradient background */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full mesh-gradient-3 opacity-30 -z-10" />

        <Breadcrumbs items={[{ label: t('title'), href: '/contact' }]} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
          {/* Left Column: Info & Social */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <FadeIn>
              <h1 className="text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {t('title')}
              </h1>
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-lg">
                {t('description')}
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-4">
              <h2 className="text-2xl font-bold font-headline mb-6">{t('other_ways')}</h2>
              <div className="grid gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 p-4 rounded-xl border border-muted/40 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${link.color}`}
                  >
                    <div className={`p-3 rounded-full bg-muted/20 transition-colors duration-300 ${link.bg}`}>
                      {link.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{link.name}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Form */}
          <ScrollReveal delay={0.3} className="w-full">
            <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-50" />
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-headline">{t('form_title')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
