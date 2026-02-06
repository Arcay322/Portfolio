"use client"

import { ArrowUpDown, Calendar, Star, Code2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export type SortOption = "date-desc" | "date-asc" | "featured" | "name"

interface SortDropdownProps {
  onSortChange: (sortBy: SortOption) => void
  currentSort: SortOption
}

export function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
  const t = useTranslations('projects.sort');
  const Icon = currentSort === "date-desc" || currentSort === "date-asc" ? Calendar :
    currentSort === "featured" ? Star : Code2

  const sortOptions = [
    {
      value: "date-desc" as SortOption,
      label: t('newest'),
      icon: Calendar,
    },
    {
      value: "date-asc" as SortOption,
      label: t('oldest'),
      icon: Calendar,
    },
    {
      value: "featured" as SortOption,
      label: t('featured'),
      icon: Star,
    },
    {
      value: "name" as SortOption,
      label: t('name'),
      icon: Code2,
    },
  ]

  const currentOption = sortOptions.find((opt) => opt.value === currentSort)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-background/40 backdrop-blur-md hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full h-10 px-4">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{t('label')}</span>
          <span>{currentOption?.label || t('select')}</span>
          <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => {
          const OptionIcon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className="cursor-pointer"
            >
              <OptionIcon className="h-4 w-4 mr-2" />
              <span>{option.label}</span>
              {currentSort === option.value && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Función helper para ordenar proyectos
export function sortProjects<T extends {
  title: string
  featured?: boolean
  isNew?: boolean
}>(
  projects: T[],
  sortBy: SortOption
): T[] {
  const sorted = [...projects]

  switch (sortBy) {
    case "date-desc":
      // Asume que los proyectos más recientes están primero en el array
      // Si tienes fecha en los proyectos, úsala aquí
      return sorted.reverse()

    case "date-asc":
      return sorted

    case "featured":
      return sorted.sort((a, b) => {
        // Primero featured, luego new, luego el resto
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return 0
      })

    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))

    default:
      return sorted
  }
}
