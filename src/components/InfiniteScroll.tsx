'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps<T> {
  initialData: T[];
  fetchMore: (page: number) => Promise<T[]>;
  renderItem: (item: T, index: number) => React.ReactNode;
  hasMore?: boolean;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll<T>({
  initialData,
  fetchMore,
  renderItem,
  hasMore = true,
  threshold = 300,
  loader,
  endMessage,
  className = '',
}: InfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreItems, setHasMoreItems] = useState(hasMore);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMoreItems) return;

    setLoading(true);

    try {
      const newItems = await fetchMore(page + 1);
      
      if (newItems.length === 0) {
        setHasMoreItems(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMoreItems, page, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, threshold]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          {loader || (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando más...</span>
            </div>
          )}
        </div>
      )}

      {/* Observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End message */}
      {!hasMoreItems && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          {endMessage || <p>No hay más elementos para mostrar</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Hook version for more control
 */
export function useInfiniteScroll<T>(
  initialData: T[],
  fetchMore: (page: number) => Promise<T[]>,
  options?: {
    threshold?: number;
    initialPage?: number;
  }
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(options?.initialPage || 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchMore(page + 1);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading more items:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchMore]);

  const reset = useCallback(() => {
    setItems(initialData);
    setPage(options?.initialPage || 1);
    setLoading(false);
    setHasMore(true);
    setError(null);
  }, [initialData, options?.initialPage]);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
    page,
  };
}

/**
 * Example usage in a page:
 * 
 * const fetchProjects = async (page: number) => {
 *   const response = await fetch(`/api/projects?page=${page}`);
 *   return response.json();
 * };
 * 
 * <InfiniteScroll
 *   initialData={projects}
 *   fetchMore={fetchProjects}
 *   renderItem={(project) => (
 *     <ProjectCard project={project} />
 *   )}
 * />
 */
