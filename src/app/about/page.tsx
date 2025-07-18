import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CssIcon,
  DjangoIcon,
  DockerIcon,
  HtmlIcon,
  JavascriptIcon,
  NextjsIcon,
  NodejsIcon,
  PostgresqlIcon,
  PythonIcon,
  ReactIcon,
  TailwindCssIcon,
  TypescriptIcon,
} from "@/components/icons";
import { Code, Database, Palette } from "lucide-react";

const skills = [
  { name: "Python", icon: <PythonIcon className="h-10 w-10" /> },
  { name: "Django", icon: <DjangoIcon className="h-10 w-10" /> },
  { name: "React", icon: <ReactIcon className="h-10 w-10" /> },
  { name: "Node.js", icon: <NodejsIcon className="h-10 w-10" /> },
  { name: "Next.js", icon: <NextjsIcon className="h-10 w-10" /> },
  { name: "TypeScript", icon: <TypescriptIcon className="h-10 w-10" /> },
  { name: "PostgreSQL", icon: <PostgresqlIcon className="h-10 w-10" /> },
  { name: "Docker", icon: <DockerIcon className="h-10 w-10" /> },
  { name: "Tailwind CSS", icon: <TailwindCssIcon className="h-10 w-10" /> },
  { name: "HTML", icon: <HtmlIcon className="h-10 w-10" /> },
  { name: "CSS", icon: <CssIcon className="h-10 w-10" /> },
  { name: "JavaScript", icon: <JavascriptIcon className="h-10 w-10" /> },
];

const experiences = [
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: "Desarrollo Full-Stack",
    description:
      "He construido aplicaciones completas desde cero, manejando tanto el frontend con React y Next.js como el backend con Node.js, demostrando mi capacidad para llevar una idea desde el concepto hasta el despliegue.",
  },
  {
    icon: <Database className="h-8 w-8 text-primary" />,
    title: "Gestión de Datos",
    description:
      "En mis proyectos, he trabajado con bases de datos como PostgreSQL y Firebase, diseñando esquemas de datos eficientes y gestionando la persistencia de la información de forma segura.",
  },
  {
    icon: <Palette className="h-8 w-8 text-primary" />,
    title: "UI/UX y Diseño Responsivo",
    description:
      "Pongo un fuerte énfasis en crear interfaces de usuario intuitivas y estéticamente agradables utilizando Tailwind CSS y Shadcn UI, asegurando que sean totalmente responsivas y accesibles.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-1 flex flex-col items-center text-center">
          <Avatar className="h-40 w-40 border-4 border-primary">
            <AvatarImage
              src="https://storage.googleapis.com/ticket_world_media/foto%20portfolio.png"
              alt="Arnie Calderon"
            />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <h1 className="mt-6 text-4xl font-bold font-headline">
            Arnie Calderon
          </h1>
          <p className="mt-2 text-xl text-muted-foreground">
            Desarrollador Full-Stack
          </p>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Sobre Mí</CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-muted-foreground space-y-4">
              <p>
                ¡Hola! Soy Arnie, un desarrollador web full-stack proactivo y
                autodidacta, actualmente cursando el 7mo ciclo de Ingeniería de
                Software. Me apasiona crear soluciones web eficientes,
                funcionales y centradas en el usuario.
              </p>
              <p>
                Con un sólido dominio de tecnologías front-end como React y
                back-end como Node.js y Python, disfruto el desafío de aprender
                y mejorar continuamente. Mi viaje en el desarrollo lo he
                demostrado a través de innovadores proyectos personales que
                puedes ver en este portafolio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-4xl font-bold text-center font-headline">
          Mis Habilidades
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {skills.map((skill) => (
            <Card
              key={skill.name}
              className="flex flex-col items-center justify-center p-6 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300 min-h-[140px] gap-4"
            >
              {skill.icon}
              <p className="font-semibold text-lg text-center">{skill.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-4xl font-bold text-center font-headline">
          Experiencia a Través de Proyectos
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp) => (
            <Card key={exp.title}>
              <CardHeader className="items-center text-center">
                {exp.icon}
                <CardTitle className="font-headline text-2xl mt-4">
                  {exp.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {exp.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
