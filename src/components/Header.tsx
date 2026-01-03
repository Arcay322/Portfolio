"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Code, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {tA11y('skip_to_content')}
      </a>

      <header
        className="sticky top-0 z-50 w-full border-b border-border/40 glass-card"
        role="banner"
      >
        <div className="container flex h-20 items-center">
          <div className="mr-4 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold font-headline"
              aria-label={tA11y('home_label')}
            >
              <Code className="h-6 w-6 text-primary" aria-hidden="true" />
              <span>Arcay.dev</span>
            </Link>
          </div>
          <nav
            ref={navRef}
            className="hidden md:flex items-center space-x-6 text-sm font-medium"
            aria-label="Navegación principal"
          >
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={label}
                ref={setItemRef(index)}
                href={href}
                className={cn(
                  "transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:rounded px-2 py-1 inline-block",
                  pathname === href ? "text-primary" : "text-muted-foreground"
                )}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex flex-1 items-center justify-end gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="flex flex-1 items-center justify-end md:hidden gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={isMobileMenuOpen ? tA11y('close_menu') : tA11y('open_menu')}
                  aria-expanded={isMobileMenuOpen}
                  className="relative min-h-[44px] min-w-[44px]"
                >
                  <AnimatePresence mode="wait">
                    {!isMobileMenuOpen ? (
                      <motion.div
                        key="menu"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" aria-hidden="true" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="x"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" aria-hidden="true" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">
                    {isMobileMenuOpen ? tA11y('close_menu') : tA11y('open_menu')}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between border-b pb-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2 font-bold font-headline"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label={tA11y('home_label')}
                    >
                      <Code className="h-6 w-6 text-primary" aria-hidden="true" />
                      <span>Arcay.dev</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-label={tA11y('close_menu')}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                      <span className="sr-only">{tA11y('close_menu')}</span>
                    </Button>
                  </div>
                  <nav
                    className="flex flex-col gap-4 mt-8"
                    aria-label="Navegación móvil"
                  >
                    {navLinks.map(({ href, label }, index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-primary block",
                            pathname === href ? "text-primary" : "text-muted-foreground"
                          )}
                          aria-current={pathname === href ? "page" : undefined}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
