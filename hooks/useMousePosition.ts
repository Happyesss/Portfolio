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
  const isRunning = useRef(false);

  const startLoop = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    const loop = () => {
      const dx = targetRef.current.x - currentRef.current.x;
      const dy = targetRef.current.y - currentRef.current.y;

      if (smooth) {
        currentRef.current.x += dx * 0.15;
        currentRef.current.y += dy * 0.15;
      } else {
        currentRef.current.x = targetRef.current.x;
        currentRef.current.y = targetRef.current.y;
      }

      const vx = currentRef.current.x - lastPosition.current.x;
      const vy = currentRef.current.y - lastPosition.current.y;
      lastPosition.current = { x: currentRef.current.x, y: currentRef.current.y };

      const winW = typeof window !== 'undefined' ? window.innerWidth : 1;
      const winH = typeof window !== 'undefined' ? window.innerHeight : 1;

      setPosition({
        x: currentRef.current.x,
        y: currentRef.current.y,
        normalizedX: (currentRef.current.x / winW) * 2 - 1,
        normalizedY: -((currentRef.current.y / winH) * 2 - 1),
        velocityX: vx,
        velocityY: vy,
      });

      // Only continue the animation loop while moving
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        isRunning.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [smooth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      startLoop();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      isRunning.current = false;
    };
  }, [startLoop]);

  return position;
}
