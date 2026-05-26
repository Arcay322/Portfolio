"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition } from 'react';
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
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'es' | 'en') => {
    // No hacer nada si ya estamos en ese idioma
    if (newLocale === locale) {
      console.log('🌍 Ya estás en', newLocale);
      return;
    }

    console.log('🌍 Cambiando idioma de', locale, 'a', newLocale);
    console.log('📍 Pathname sin prefijo:', pathname);

    // Cambiar de idioma fluidamente sin bloquear la UI (modo SPA con transiciones)
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
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
          disabled={isPending}
        >
          <Globe className={`h-5 w-5 transition-all ${isPending ? 'animate-spin opacity-50' : ''}`} />
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
            disabled={isPending}
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