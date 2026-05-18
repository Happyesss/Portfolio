'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
  velocityX: number;
  velocityY: number;
}

export function useMousePosition(smooth = true): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
  });

  const lastPosition = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    if (smooth) {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12);
    } else {
      currentRef.current.x = targetRef.current.x;
      currentRef.current.y = targetRef.current.y;
    }

    const vx = currentRef.current.x - lastPosition.current.x;
    const vy = currentRef.current.y - lastPosition.current.y;
    lastPosition.current = { x: currentRef.current.x, y: currentRef.current.y };

    setPosition({
      x: currentRef.current.x,
      y: currentRef.current.y,
      normalizedX: (currentRef.current.x / window.innerWidth) * 2 - 1,
      normalizedY: -((currentRef.current.y / window.innerHeight) * 2 - 1),
      velocityX: vx,
      velocityY: vy,
    });

    rafRef.current = requestAnimationFrame(animate);
  }, [smooth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return position;
}
