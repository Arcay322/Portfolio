import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold font-headline mb-4">
          Proyecto No Encontrado
        </h1>
        <p className="text-muted-foreground mb-8">
          El proyecto que buscas no existe o ha sido eliminado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/projects">
              Ver Todos los Proyectos
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Volver al Inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
