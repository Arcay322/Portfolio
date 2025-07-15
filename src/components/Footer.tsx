import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Arcay.dev. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
          <Link href="https://github.com/arcay322" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/arnie-calderon-869159305" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-6 w-6" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
