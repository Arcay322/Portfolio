import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center">
        <h1 className="text-5xl font-bold font-headline">Ponte en Contacto</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          ¿Tienes una pregunta o quieres trabajar juntos? Rellena el formulario y me pondré en contacto contigo lo antes posible.
        </p>
      </section>

      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Envíame un mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>

       <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold font-headline">Otras formas de conectar</h2>
        <div className="mt-4 flex justify-center gap-8">
            <Link href="tel:+51918793956" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-8 w-8" />
              <span className="sr-only">Teléfono</span>
            </Link>
            <Link href="https://www.linkedin.com/in/arnie-calderon-869159305" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-8 w-8" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://github.com/arcay322" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-8 w-8" />
              <span className="sr-only">GitHub</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
