import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Arcay.dev. {t('rights')}.
        </p>
        <nav aria-label={t('social')} className="flex items-center gap-6 mt-4 sm:mt-0">
          <Link 
            href="https://github.com/arcay322" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Visitar perfil de GitHub"
          >
            <Github className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link 
            href="https://www.linkedin.com/in/arnie-calderon-869159305" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Visitar perfil de LinkedIn"
          >
            <Linkedin className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link 
            href="/contact" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Ir a página de contacto"
          >
            <Mail className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Email</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
