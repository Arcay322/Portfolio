"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Typewriter from "@/components/Typewriter";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-32">
        <div className="max-w-3xl">
        <div className="text-4xl sm:text-5xl md:text-7xl font-bold font-headline tracking-tighter">
          <Typewriter text="Arnie Calderon" speed={150} className="text-primary" />
          </div>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-foreground/90 font-headline">
            Desarrollador Full-Stack
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Construyo aplicaciones web modernas, responsivas y escalables. Apasionado por el código limpio, el diseño centrado en el usuario y las tecnologías innovadoras.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/projects">
                Ver Mi Trabajo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contáctame</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
