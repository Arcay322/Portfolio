// Colores personalizados para cada tecnología
export const techColors: Record<string, string> = {
  // Backend
  "Python": "bg-blue-500/90 text-white hover:bg-blue-600",
  "Django": "bg-emerald-700/90 text-white hover:bg-emerald-800",
  "Node.js": "bg-green-600/90 text-white hover:bg-green-700",
  
  // Frontend
  "React": "bg-cyan-500/90 text-white hover:bg-cyan-600",
  "Next.js": "bg-slate-900/90 text-white hover:bg-slate-950",
  "TypeScript": "bg-blue-600/90 text-white hover:bg-blue-700",
  "JavaScript": "bg-yellow-400/90 text-slate-900 hover:bg-yellow-500",
  "HTML": "bg-orange-500/90 text-white hover:bg-orange-600",
  "CSS": "bg-blue-400/90 text-white hover:bg-blue-500",
  "HTML/CSS": "bg-orange-500/90 text-white hover:bg-orange-600",
  
  // Databases
  "PostgreSQL": "bg-sky-700/90 text-white hover:bg-sky-800",
  "MongoDB": "bg-green-500/90 text-white hover:bg-green-600",
  "Firebase": "bg-amber-500/90 text-white hover:bg-amber-600",
  
  // Styling
  "Tailwind CSS": "bg-cyan-400/90 text-slate-900 hover:bg-cyan-500",
  "Shadcn/ui": "bg-slate-800/90 text-white hover:bg-slate-900",
  
  // DevOps & Tools
  "Docker": "bg-blue-500/90 text-white hover:bg-blue-600",
  "Git": "bg-orange-600/90 text-white hover:bg-orange-700",
  
  // Default
  "default": "bg-secondary text-secondary-foreground hover:bg-secondary/80"
};

export function getTechColor(tech: string): string {
  return techColors[tech] || techColors.default;
}
