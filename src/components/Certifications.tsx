"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Certification {
  title: string
  issuer: string
  date: string
  credentialId?: string
  credentialUrl?: string
  skills: string[]
  icon?: React.ReactNode
}

const certifications: Certification[] = [
  {
    title: "Next.js Development",
    issuer: "Vercel",
    date: "2024",
    skills: ["Next.js", "React", "TypeScript"],
  },
  {
    title: "Full Stack Development",
    issuer: "Self-Taught",
    date: "2022 - Present",
    skills: ["React", "Node.js", "PostgreSQL"],
  },
  {
    title: "Python & Django",
    issuer: "Django Project",
    date: "2023",
    skills: ["Python", "Django", "REST APIs"],
  },
  {
    title: "UI/UX Design",
    issuer: "Figma Community",
    date: "2023",
    skills: ["Figma", "Design Systems", "Prototyping"],
  },
]

interface CertificationCardProps {
  cert: Certification
  index: number
}

function CertificationCard({ cert, index }: CertificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-headline text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} • {cert.date}
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Credential Link */}
              {cert.credentialUrl && (
                <Link
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Ver credencial
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            {/* Verified Badge */}
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Certifications() {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">
          Certificaciones & Logros
        </h2>
        <p className="text-muted-foreground text-lg">
          Formación continua y habilidades validadas
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <CertificationCard
            key={`${cert.title}-${cert.issuer}`}
            cert={cert}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
