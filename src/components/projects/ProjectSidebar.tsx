"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SidebarItem {
    id: string
    label: string
}

interface ProjectSidebarProps {
    items: SidebarItem[]
    title?: string
}

export function ProjectSidebar({ items, title = "Índice" }: ProjectSidebarProps) {
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        const observers: IntersectionObserver[] = []

        items.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setActiveId(id)
                            }
                        })
                    },
                    { rootMargin: "-20% 0px -50% 0px" }
                )
                observer.observe(element)
                observers.push(observer)
            }
        })

        return () => {
            observers.forEach((observer) => observer.disconnect())
        }
    }, [items])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const offset = 100 // Adjust for sticky header if any
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    return (
        <nav className="sticky top-24 hidden lg:block">
            <h3 className="font-headline font-bold text-lg mb-4 px-4">{title}</h3>
            <ul className="space-y-1 relative border-l border-border/50 ml-2">
                {items.map((item) => (
                    <li key={item.id} className="relative">
                        <button
                            onClick={() => scrollToSection(item.id)}
                            className={cn(
                                "block w-full text-left px-4 py-2 text-sm transition-colors duration-200",
                                activeId === item.id
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </button>
                        {activeId === item.id && (
                            <motion.div
                                layoutId="activeSidebar"
                                className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-primary"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    )
}
