"use client";

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // No hacer nada si ya estamos en ese idioma
    if (newLocale === locale) {
      console.log('🌍 Ya estás en', newLocale);
      return;
    }

    console.log('🌍 Cambiando idioma de', locale, 'a', newLocale);
    console.log('📍 Pathname actual:', pathname);

    // Construir la nueva ruta según el locale prefix 'as-needed'
    let newPath: string;

    if (newLocale === 'es') {
      // Español no tiene prefijo (locale prefix 'as-needed')
      if (pathname.startsWith('/en/')) {
        newPath = pathname.substring(3); // Quitar '/en'
      } else if (pathname === '/en') {
        newPath = '/';
      } else {
        newPath = pathname;
      }
    } else {
      // Inglés tiene prefijo '/en'
      if (pathname.startsWith('/en/')) {
        newPath = pathname; // Ya está en inglés
      } else if (pathname === '/en') {
        newPath = '/en';
      } else if (pathname === '/' || !pathname.startsWith('/')) {
        newPath = `/en${pathname}`;
      } else {
        newPath = `/en${pathname}`;
      }
    }

    console.log('🔗 Nueva ruta:', newPath);

    // Establecer cookie para persistencia (next-intl usa NEXT_LOCALE)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    console.log('🍪 Cookie establecida:', `NEXT_LOCALE=${newLocale}`);

    // Forzar cambio con window.location
    window.location.href = newPath;
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Idioma actual: ${currentLanguage?.name}`}
        >
          <Globe className="h-5 w-5" />
          <span className="ml-2 text-sm hidden md:inline">
            {currentLanguage?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-semibold">
          Idioma / Language
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLocale(language.code)}
            className={locale === language.code ? 'bg-accent font-semibold' : ''}
          >
            <span className="mr-2 text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {locale === language.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}