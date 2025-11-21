"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code2, FileCode, Palette, Globe, Hexagon, FileJson, Database, Plug, Github, Box, Code, Figma } from "lucide-react"

interface SkillBarProps {
  name: string
  percentage: number
  color?: string
  icon?: React.ReactNode
  delay?: number
}

function SkillBar({ name, percentage, color = "hsl(var(--primary))", icon, delay = 0 }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span className="font-semibold text-sm">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground font-mono">{percentage}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

interface SkillCategory {
  category: string
  skills: {
    name: string
    percentage: number
  }[]
}

const skillIcons: Record<string, React.ReactNode> = {
  "React / Next.js": <Code2 className="h-5 w-5 text-blue-500" />,
  "TypeScript": <FileCode className="h-5 w-5 text-blue-600" />,
  "Tailwind CSS": <Palette className="h-5 w-5 text-cyan-500" />,
  "HTML/CSS": <Globe className="h-5 w-5 text-orange-500" />,
  "Node.js": <Hexagon className="h-5 w-5 text-green-600" />,
  "Python / Django": <FileJson className="h-5 w-5 text-blue-500" />,
  "PostgreSQL": <Database className="h-5 w-5 text-blue-700" />,
  "REST APIs": <Plug className="h-5 w-5 text-purple-500" />,
  "Git / GitHub": <Github className="h-5 w-5 text-gray-800 dark:text-white" />,
  "Docker": <Box className="h-5 w-5 text-blue-500" />,
  "VS Code": <Code className="h-5 w-5 text-blue-600" />,
  "Figma": <Figma className="h-5 w-5 text-purple-500" />,
}

const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React / Next.js", percentage: 90 },
      { name: "TypeScript", percentage: 85 },
      { name: "Tailwind CSS", percentage: 95 },
      { name: "HTML/CSS", percentage: 95 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", percentage: 85 },
      { name: "Python / Django", percentage: 80 },
      { name: "PostgreSQL", percentage: 75 },
      { name: "REST APIs", percentage: 90 },
    ],
  },
  {
    category: "Herramientas",
    skills: [
      { name: "Git / GitHub", percentage: 90 },
      { name: "Docker", percentage: 70 },
      { name: "VS Code", percentage: 95 },
      { name: "Figma", percentage: 75 },
    ],
  },
]

export function SkillBars() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsData.map((category, categoryIndex) => (
          <Card key={category.category} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <Tooltip key={skill.name}>
                  <TooltipTrigger asChild>
                    <div>
                      <SkillBar
                        name={skill.name}
                        percentage={skill.percentage}
                        icon={skillIcons[skill.name]}
                        delay={categoryIndex * 0.1 + skillIndex * 0.05}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nivel de experiencia: {skill.percentage}%</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  )
}
