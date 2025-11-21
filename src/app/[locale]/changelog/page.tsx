import { Metadata } from 'next';
import { Calendar, GitCommit, Tag, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Changelog | Portfolio',
  description: 'Historial de cambios, mejoras y nuevas características del portfolio.',
};

const changelog = [
  {
    version: '3.0.0',
    date: '2024-01-15',
    type: 'major',
    changes: [
      {
        type: 'feature',
        title: 'Sistema de Blog MDX',
        description:
          'Implementado sistema completo de blog con MDX, soporte para syntax highlighting, imágenes optimizadas y metadata dinámica.',
      },
      {
        type: 'feature',
        title: 'Sistema de i18n',
        description:
          'Agregado soporte multi-idioma con next-intl. Soporta Español e Inglés con detección automática de idioma.',
      },
      {
        type: 'feature',
        title: 'Testing Suite Completo',
        description:
          'Implementado Jest para tests unitarios y Playwright para tests E2E. Cobertura de código objetivo: 70%.',
      },
      {
        type: 'improvement',
        title: 'Optimización de Rendimiento',
        description:
          'Implementadas mejoras en Core Web Vitals: lazy loading de imágenes, code splitting, y optimización de bundle size.',
      },
    ],
  },
  {
    version: '2.5.0',
    date: '2024-01-10',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        title: 'Modo Oscuro Mejorado',
        description:
          'Transiciones suaves entre temas, persistencia de preferencia, y mejor contraste en todos los componentes.',
      },
      {
        type: 'feature',
        title: 'Navegación con Teclado',
        description:
          'Implementada navegación completa con teclado, skip links para accesibilidad, y focus indicators mejorados.',
      },
      {
        type: 'improvement',
        title: 'SEO Avanzado',
        description:
          'Agregados meta tags estructurados, JSON-LD para rich snippets, y Open Graph tags optimizados.',
      },
      {
        type: 'fix',
        title: 'Correcciones de Responsive',
        description: 'Mejorado diseño responsive en tablets y dispositivos móviles pequeños.',
      },
    ],
  },
  {
    version: '2.0.0',
    date: '2024-01-05',
    type: 'major',
    changes: [
      {
        type: 'feature',
        title: 'Migración a Next.js 14',
        description:
          'Migrado completamente a Next.js 14 con App Router, Server Components, y Server Actions.',
      },
      {
        type: 'feature',
        title: 'Formulario de Contacto',
        description:
          'Implementado formulario de contacto con validación, rate limiting, y protección contra spam.',
      },
      {
        type: 'feature',
        title: 'Sección de Proyectos',
        description:
          'Galería de proyectos con filtrado por tecnología, detalles expandibles, y enlaces a demos en vivo.',
      },
      {
        type: 'improvement',
        title: 'Animaciones Suaves',
        description: 'Agregadas animaciones con Framer Motion para transiciones y micro-interacciones.',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2023-12-20',
    type: 'minor',
    changes: [
      {
        type: 'feature',
        title: 'Integración de Analytics',
        description: 'Agregado Google Analytics 4 y seguimiento de Web Vitals.',
      },
      {
        type: 'feature',
        title: 'Sitemap XML',
        description: 'Generación automática de sitemap para mejor indexación en buscadores.',
      },
      {
        type: 'improvement',
        title: 'Optimización de Imágenes',
        description: 'Implementado next/image para todas las imágenes con lazy loading automático.',
      },
      {
        type: 'fix',
        title: 'Corrección de Hydration',
        description: 'Resueltos errores de hydration en el theme provider.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2023-12-01',
    type: 'major',
    changes: [
      {
        type: 'feature',
        title: 'Lanzamiento Inicial',
        description: 'Primera versión del portfolio con Next.js 13, Tailwind CSS, y TypeScript.',
      },
      {
        type: 'feature',
        title: 'Diseño Responsive',
        description: 'Diseño completamente responsive optimizado para móviles, tablets y desktop.',
      },
      {
        type: 'feature',
        title: 'Sección About',
        description: 'Página sobre mí con habilidades, experiencia y educación.',
      },
      {
        type: 'feature',
        title: 'Theme System',
        description: 'Sistema de temas con soporte para modo claro y oscuro.',
      },
    ],
  },
];

const typeColors = {
  feature: 'bg-green-500/10 text-green-500 border-green-500/20',
  improvement: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  fix: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

const typeIcons = {
  feature: '✨',
  improvement: '🚀',
  fix: '🐛',
};

const versionColors = {
  major: 'bg-red-500',
  minor: 'bg-blue-500',
  patch: 'bg-green-500',
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <GitCommit className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Changelog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Historial completo de cambios, mejoras y nuevas características
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-border" />

          {/* Changelog entries */}
          <div className="space-y-12">
            {changelog.map((release) => (
              <div key={release.version} className="relative pl-16">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 w-12 h-12 rounded-full ${
                    versionColors[release.type as keyof typeof versionColors]
                  } flex items-center justify-center text-white font-bold border-4 border-background`}
                >
                  <Tag className="w-5 h-5" />
                </div>

                {/* Release card */}
                <div className="bg-card border border-border rounded-lg p-6">
                  {/* Release header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        Version {release.version}
                        <span
                          className={`ml-3 text-xs px-2 py-1 rounded ${
                            versionColors[release.type as keyof typeof versionColors]
                          } text-white`}
                        >
                          {release.type}
                        </span>
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(release.date).toLocaleDateString('es', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Changes list */}
                  <div className="space-y-4">
                    {release.changes.map((change, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${
                              typeColors[change.type as keyof typeof typeColors]
                            } border`}
                          >
                            {typeIcons[change.type as keyof typeof typeIcons]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{change.title}</h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                typeColors[change.type as keyof typeof typeColors]
                              } border`}
                            >
                              {change.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{change.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">¿Sugerencias?</h2>
          <p className="text-muted-foreground mb-6">
            Si tienes ideas para nuevas características o mejoras, me encantaría escucharlas.
          </p>
          <a
            href="https://github.com/yourusername/portfolio/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            <GitCommit className="w-5 h-5" />
            Reportar en GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
