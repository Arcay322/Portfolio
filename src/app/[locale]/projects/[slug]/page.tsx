import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle2, Zap, Quote, Eye, Star } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/project-utils"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScrollReveal } from "@/components/animations/ScrollReveal"
import { JsonLd } from "@/components/JsonLd"
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/schema"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

// New Components
import { ProjectHero } from "@/components/projects/ProjectHero"
import { ProjectSidebar } from "@/components/projects/ProjectSidebar"
import { ProjectGallery } from "@/components/projects/ProjectGallery"
import { techColors } from "@/lib/constants"



export async function generateStaticParams() {
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

  const sidebarItems = [
    { id: "about", label: t('about_project') },
    { id: "technologies", label: t('technologies_used') },
    { id: "gallery", label: t('gallery') },
    { id: "features", label: t('main_features') },
    { id: "challenges", label: t('technical_challenges') },
  ]

  if (params.slug === 'ventify') {
    sidebarItems.push({ id: "testimonial", label: t('testimonial') })
  }

  return (
    <>
      <JsonLd data={[projectSchema, breadcrumbSchema]} />

      {/* 1. Cinematic Hero */}
      <ProjectHero
        title={project.title}
        description={project.description}
        image={project.image}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        t={{
          view_live_demo: t('view_live_demo'),
          view_source_code: t('view_source_code')
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back Button (Mobile only or top of content) */}
        <div className="mb-8 lg:hidden">
          <Link href="/projects">
            <Button variant="ghost" className="hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back_to_projects')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* 2. Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <Link href="/projects" className="mb-8 block">
                <Button variant="ghost" className="hover:translate-x-[-4px] transition-transform pl-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('back_to_projects')}
                </Button>
              </Link>
              <ProjectSidebar items={sidebarItems} title={t('table_of_contents')} />
            </div>
          </aside>

          {/* 3. Main Content */}
          <main className="lg:col-span-9 space-y-20">

            {/* About Section */}
            <section id="about" className="scroll-mt-24">
              <FadeIn>
                <Card className="border-none shadow-none bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <h2 className="text-3xl font-bold font-headline mb-6 text-foreground">{t('about_project')}</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: project.longDescription?.replace(/\n/g, '<br/>') || project.description }} />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </section>

            {/* Technologies Section */}
            <section id="technologies" className="scroll-mt-24">
              <ScrollReveal>
                <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-3 text-foreground">
                  <Zap className="h-8 w-8 text-primary" />
                  {t('technologies_used')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => {
                    const color = techColors[tag] || "hsl(var(--foreground))";
                    return (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-base px-4 py-2 transition-colors"
                        style={{
                          borderColor: color,
                          color: "hsl(var(--foreground))",
                          backgroundColor: "transparent",
                        }}
                      >
                        {tag}
                      </Badge>
                    )
                  })}
                </div>
              </ScrollReveal>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="scroll-mt-24">
              <ScrollReveal>
                <h2 className="text-3xl font-bold font-headline mb-8">{t('gallery')}</h2>
                {project.media && project.media.length > 0 ? (
                  <ProjectGallery media={project.media} />
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </ScrollReveal>
            </section>

            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <section id="features" className="scroll-mt-24">
                <ScrollReveal>
                  <h2 className="text-3xl font-bold font-headline mb-8">{t('main_features')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.features.map((feature, index) => (
                      <Card key={index} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <CardContent className="pt-6 flex items-start gap-4">
                          <CheckCircle2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                          <p className="text-lg">{feature}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollReveal>
              </section>
            )}

            {/* Challenges Section */}
            {project.challenges && project.challenges.length > 0 && (
              <section id="challenges" className="scroll-mt-24">
                <ScrollReveal>
                  <h2 className="text-3xl font-bold font-headline mb-8">{t('technical_challenges')}</h2>
                  <div className="space-y-4">
                    {project.challenges.map((challenge, index) => (
                      <div key={index} className="flex gap-4 items-start p-4 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl">0{index + 1}</span>
                        <p className="text-lg text-muted-foreground">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </section>
            )}

            {/* Testimonial Section */}
            {params.slug === 'ventify' && (
              <section id="testimonial" className="scroll-mt-24">
                <ScrollReveal>
                  <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="absolute top-4 right-4 opacity-10">
                      <Quote className="h-32 w-32 text-primary" />
                    </div>
                    <CardContent className="pt-12 pb-8 px-8 md:px-12 text-center">
                      <div className="flex gap-1 mb-6 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed font-medium">
                        &ldquo;{t('testimonial.content')}&rdquo;
                      </p>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="font-bold text-xl">{t('testimonial.name')}</p>
                        <p className="text-muted-foreground">{t('testimonial.role')}</p>
                        <p className="text-primary font-semibold">{t('testimonial.company')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </section>
            )}

            <Separator className="my-12" />

            {/* Related Projects */}
            {project.relatedProjects && project.relatedProjects.length > 0 && (
              <section id="related">
                <h2 className="text-3xl font-bold font-headline mb-8">{t('related_projects')}</h2>
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="secondary" size="sm" className="gap-2">
                                <Eye className="h-4 w-4" /> {t('view_details')}
                              </Button>
                            </div>
                          </div>
                        </Link>
                        <CardHeader>
                          <CardTitle>{relatedProject.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{relatedProject.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Final CTA */}
            <section className="text-center py-12 bg-muted/30 rounded-2xl">
              <h2 className="text-3xl font-bold font-headline mb-4">{t('interested_title')}</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('interested_description', { project: project.title })}
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">{t('contact_me')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/projects">{t('view_more_projects')}</Link>
                </Button>
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  )
}
