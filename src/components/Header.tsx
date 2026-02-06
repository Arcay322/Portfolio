"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Code, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboardNavigation } from "@/lib/keyboard-navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const t = useTranslations('nav');
  const tA11y = useTranslations('a11y');

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    { href: "/projects", label: t('projects') },
    { href: "/contact", label: t('contact') },
  ];

  const { setItemRef, handleKeyDown } = useKeyboardNavigation<HTMLAnchorElement>(
    navLinks.length,
    {
      arrows: true,
      enter: true,
      homeEnd: true,
      loop: true,
      orientation: 'horizontal',
    }
  );

  useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('keydown', handleKeyDown);
      return () => {
        nav.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {tA11y('skip_to_content')}
      </a>

      {/* Floating Glass Dock - Universal */}
      <div className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4">
        <header
          className={cn(
            "pointer-events-auto flex items-center h-14 rounded-full border border-[rgba(var(--glass-border),var(--glass-opacity))] bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-primary/5 px-2 md:px-4 gap-2 transition-all duration-300 hover:border-primary/20 hover:shadow-primary/10",
            isMobileMenuOpen ? "rounded-b-none border-b-0" : "" // Optional: flat bottom if connecting, but let's keep it detached for now or check design. actually detached is better.
          )}
          role="banner"
        >
          {/* Logo - Compact */}
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10 transition-colors"
            aria-label={tA11y('home_label')}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Code className="h-5 w-5 text-primary" aria-hidden="true" />
          </Link>

          {/* Desktop Nav */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center gap-1"
            aria-label="Navegación principal"
          >
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={label}
                ref={setItemRef(index)}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
                  pathname === href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-primary/5"
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
                {pathname === href && (
                  <span className="absolute inset-0 rounded-full ring-1 ring-primary/20 pointer-events-none" />
                )}
              </Link>
            ))}
          </nav>

          {/* Separator */}
          <div className="hidden md:block w-px h-6 bg-border/50 mx-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />

            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-10 h-10 hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? tA11y('close_menu') : tA11y('open_menu')}
                aria-expanded={isMobileMenuOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Dropdown - Detached Floating Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto md:hidden absolute top-full w-[calc(100%-2rem)] max-w-sm rounded-[2rem] border border-[rgba(var(--glass-border),var(--glass-opacity))] bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden p-4 flex flex-col gap-2"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-6 py-3 rounded-xl transition-all duration-200",
                    pathname === href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              ))}

              <div className="mx-2 my-2 h-px bg-border/40" />

              <div className="flex justify-center pb-2">
                <LanguageSwitcher />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
