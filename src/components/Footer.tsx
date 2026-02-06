import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('footer');
  const tA11y = useTranslations('a11y');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20" role="contentinfo">
      {/* Horizon Line (Glowing Separator) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center gap-6">
        <nav aria-label={t('social')} className="flex items-center gap-8">
          <Link
            href="https://github.com/arcay322"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-300"
            aria-label={tA11y('visit_github')}
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.linkedin.com/in/arnie-calderon-869159305"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-300"
            aria-label={tA11y('visit_linkedin')}
          >
            <Linkedin className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-300"
            aria-label={tA11y('visit_contact')}
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Email</span>
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
          &copy; {currentYear} Arnie Calderon. {t('rights')}.
        </p>
      </div>
    </footer>
  );
}
