'use client';

import { useState, useEffect, useRef } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

export function useSectionInView(sectionId: string, setActiveSection: (id: string) => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(sectionId);
        }
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [sectionId, setActiveSection]);

  return ref;
}
