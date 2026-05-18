'use client';

import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default;
        lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 2,
        }) as { raf: (time: number) => void; destroy: () => void };

        lenisRef.current = lenis;

        const raf = (time: number) => {
          lenis?.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Lenis unavailable — fall back to native scroll
      }
    };

    initLenis();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
