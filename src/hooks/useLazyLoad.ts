import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  priority?: boolean;
}

export function useLazyLoad(options?: UseLazyLoadOptions) {
  const [isInView, setIsInView] = useState(options?.priority || false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options?.priority) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin || '300px',
        threshold: options?.threshold || 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.priority, options?.rootMargin, options?.threshold]);

  return { ref, isInView };
}
