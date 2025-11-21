import {
  CssIcon,
  DjangoIcon,
  DockerIcon,
  FirebaseIcon,
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

export const skills = [
  { name: "Python", icon: <PythonIcon className="h-10 w-10" /> },
  { name: "Django", icon: <DjangoIcon className="h-10 w-10" /> },
  { name: "React", icon: <ReactIcon className="h-10 w-10" /> },
  { name: "Node.js", icon: <NodejsIcon className="h-10 w-10" /> },
  { name: "Next.js", icon: <NextjsIcon className="h-10 w-10" /> },
  { name: "TypeScript", icon: <TypescriptIcon className="h-10 w-10" /> },
  { name: "PostgreSQL", icon: <PostgresqlIcon className="h-10 w-10" /> },
  { name: "Firebase", icon: <FirebaseIcon className="h-10 w-10" /> },
  { name: "Docker", icon: <DockerIcon className="h-10 w-10" /> },
  { name: "Tailwind CSS", icon: <TailwindCssIcon className="h-10 w-10" /> },
  { name: "HTML", icon: <HtmlIcon className="h-10 w-10" /> },
  { name: "CSS", icon: <CssIcon className="h-10 w-10" /> },
  { name: "JavaScript", icon: <JavascriptIcon className="h-10 w-10" /> },
];

export function getSkillsCount(): number {
  return skills.length;
}
