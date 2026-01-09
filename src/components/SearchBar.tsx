'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SearchResult {
  type: 'project' | 'blog' | 'page';
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

// Simulated search data - replace with actual API call
const searchableContent: SearchResult[] = [
  {
    type: 'page',
    title: 'Inicio',
    description: 'Página principal del portfolio',
    url: '/',
  },
  {
    type: 'page',
    title: 'Sobre Mí',
    description: 'Información sobre mi experiencia y habilidades',
    url: '/about',
  },
  {
    type: 'page',
    title: 'Proyectos',
    description: 'Galería de proyectos destacados',
    url: '/projects',
  },
  {
    type: 'page',
    title: 'Contacto',
    description: 'Formulario de contacto',
    url: '/contact',
  },
  {
    type: 'page',
    title: 'Blog',
    description: 'Artículos sobre desarrollo web',
    url: '/blog',
  },
  {
    type: 'page',
    title: 'FAQ',
    description: 'Preguntas frecuentes',
    url: '/faq',
  },
  {
    type: 'page',
    title: 'Changelog',
    description: 'Historial de cambios',
    url: '/changelog',
  },
];

export function SearchBar() {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const filtered = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle result selection
  const handleSelect = useCallback(
    (result: SearchResult) => {
      // Save to recent searches
      const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));

      // Navigate
      router.push(result.url);
      setIsOpen(false);
      setQuery('');
    },
    [query, recentSearches, router]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
        aria-label="Buscar"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl">
            <div
              className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('search_placeholder')}
                  className="flex-1 bg-transparent outline-none text-base"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="p-1 hover:bg-muted rounded"
                    aria-label={t('clear_search')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden md:inline-flex px-2 py-1 bg-muted border border-border rounded text-xs">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query && recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t('recent_searches')}
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        {t('clear')}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>{t('no_results')} &quot;{query}&quot;</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    {results.map((result, index) => (
                      <button
                        key={result.url}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                          selectedIndex === index ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold truncate">{result.title}</span>
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.description}
                          </p>
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 bg-muted rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-3 bg-muted/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-background border border-border rounded">
                        ↑↓
                      </kbd>
                      Navegar
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-background border border-border rounded">
                        ↵
                      </kbd>
                      Seleccionar
                    </span>
                  </div>
                  <span>{results.length} resultados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
