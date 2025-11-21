import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, CheckCircle2, Zap, Quote, Building2, Eye, Star, Sparkles, CheckCircle } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/project-utils"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScrollReveal } from "@/components/animations/ScrollReveal"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { JsonLd } from "@/components/JsonLd"
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/schema"

import { ImageCarousel } from "@/components/ImageCarousel"
import { getTranslations } from "next-intl/server"

export async function generateStaticParams() {
  // Get translations for generating slugs
  const { default: esMessages } = await import('@/messages/es.json');
  const tProjects = (key: string) => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = esMessages.projects;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return getAllProjectSlugs(tProjects);
}

export default async function ProjectDetailPage(props: { params: Promise<{ slug: string, locale: string }> }) {
  const params = await props.params
  const t = await getTranslations('project_detail')
  const tProjects = await getTranslations('projects')
  const tBadges = await getTranslations('projects.badges')
  const tButtons = await getTranslations('projects.buttons')
  const project = getProjectBySlug(params.slug, tProjects)

  if (!project) {
    notFound()
  }

  const projectSchema = generateProjectSchema(project)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: 'https://arcay.dev' },
    { name: 'Proyectos', url: 'https://arcay.dev/projects' },
    { name: project.title, url: `https://arcay.dev/projects/${params.slug}` },
  ])

  return (
    <>
      <JsonLd data={[projectSchema, breadcrumbSchema]} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { label: 'Proyectos', href: '/projects' },
            { label: project.title, href: `/projects/${params.slug}` }
          ]}
        />

        {/* Botón Volver */}
        <FadeIn>
          <Link href="/projects">
            <Button variant="ghost" className="mb-6 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back_to_projects')}
            </Button>
          </Link>
        </FadeIn>

        {/* Header del Proyecto */}
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  {t('view_live_demo')} <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  {t('view_source_code')}
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Galería Multimedia */}
        <ScrollReveal className="mb-12">
          {project.media && project.media.length > 0 ? (
            <ImageCarousel media={project.media} className="group" />
          ) : (
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </ScrollReveal>

        {/* Tecnologías */}
        <ScrollReveal delay={0.1} className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t('technologies_used')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-base px-4 py-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Descripción Detallada */}
          <ScrollReveal className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('about_project')}</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: project.longDescription?.replace(/\n/g, '<br/>') || project.description }} />
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Enlaces Rápidos */}
          <ScrollReveal delay={0.1} className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t('links')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    {t('view_live_demo')}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    {t('github_repository')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Características */}
        {project.features && project.features.length > 0 && (
          <ScrollReveal className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{t('main_features')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Desafíos */}
        {project.challenges && project.challenges.length > 0 && (
          <ScrollReveal delay={0.1} className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{t('technical_challenges')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">▸</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Testimonial Section - Only for Ventify */}
        {params.slug === 'ventify' && (
          <ScrollReveal delay={0.2} className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-headline mb-3">
                {t('testimonial_title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('testimonial_subtitle')}
              </p>
            </div>
            <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-32 w-32 text-primary" />
              </div>

              <CardContent className="pt-8 pb-6 px-8">
                {/* Stars Rating */}
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-6 w-6 text-yellow-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-lg text-foreground mb-8 leading-relaxed text-center max-w-4xl mx-auto">
                  &ldquo;{t('testimonial.content')}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-t pt-6">
                  {/* Company Logo */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xl text-foreground">{t('testimonial.name')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('testimonial.role')}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        {t('testimonial.company')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('testimonial.date')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Production Badge */}
                <div className="mt-6 flex justify-center">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg px-4 py-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {t('production_badge')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Proyectos Relacionados */}
        {project.relatedProjects && project.relatedProjects.length > 0 && (
          <>
            <Separator className="my-12" />
            <ScrollReveal>
              <h2 className="text-3xl font-bold font-headline mb-8">
                {t('related_projects')}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {project.relatedProjects.map((slug) => {
                  const relatedProject = getProjectBySlug(slug, tProjects)
                  if (!relatedProject) return null

                  return (
                    <Card key={slug} className="overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 h-full flex flex-col group">
                      <Link href={`/projects/${slug}`} className="cursor-pointer">
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={relatedProject.image}
                            alt={relatedProject.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                            {relatedProject.featured && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg flex items-center gap-1">
                                <Star className="h-3 w-3" /> {tBadges('featured')}
                              </Badge>
                            )}
                            {relatedProject.isNew && (
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg animate-pulse flex items-center gap-1">
                                <Sparkles className="h-3 w-3" /> {tBadges('new')}
                              </Badge>
                            )}
                            {relatedProject.inProduction && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> {tBadges('in_production')}
                              </Badge>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-primary-foreground bg-primary/90 px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              <Eye className="h-5 w-5" />
                              <span className="font-semibold">{t('view_details')}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <CardHeader>
                        <Link href={`/projects/${slug}`} className="hover:text-primary transition-colors">
                          <CardTitle className="font-headline">
                            {relatedProject.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2">
                          {relatedProject.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {relatedProject.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        {relatedProject.liveUrl && (
                          <Button asChild variant="default" size="sm" className="flex-1">
                            <a href={relatedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {tButtons('demo')}
                            </a>
                          </Button>
                        )}
                        {relatedProject.githubUrl && (
                          <Button asChild variant="outline" size="sm" className="flex-1">
                            <a href={relatedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-4 w-4" />
                              {tButtons('code')}
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </ScrollReveal>
          </>
        )}

        <Separator className="my-12" />

        {/* CTA Final */}
        <ScrollReveal className="text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">
            {t('interested_title')}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t('interested_description', { project: project.title })}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg">
              <Link href="/contact">
                {t('contact_me')}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                {t('view_more_projects')}
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </>
  )
}
