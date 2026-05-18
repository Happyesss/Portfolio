'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'drag';

export default function CustomCursor() {
  const { x, y } = useMousePosition(true);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setCursorState('click');
    const handleMouseUp = () => setCursorState('default');

    // Detect interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('hoverable')
      ) {
        setCursorState('hover');
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3'
      ) {
        setCursorState('text');
      } else {
        setCursorState('default');
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleElementHover);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleElementHover);
    };
  }, []);

  const cursorVariants = {
    default: { width: 12, height: 12, backgroundColor: 'rgba(79,172,254,0.9)', borderRadius: '50%', border: 'none' },
    hover: { width: 44, height: 44, backgroundColor: 'transparent', borderRadius: '50%', border: '2px solid rgba(79,172,254,0.8)' },
    click: { width: 8, height: 8, backgroundColor: 'rgba(247,127,0,0.9)', borderRadius: '50%', border: 'none' },
    text: { width: 3, height: 28, backgroundColor: 'rgba(79,172,254,0.9)', borderRadius: '2px', border: 'none' },
    drag: { width: 50, height: 50, backgroundColor: 'transparent', borderRadius: '50%', border: '2px dashed rgba(0,245,212,0.6)' },
  };

  const ringVariants = {
    default: { width: 36, height: 36, opacity: 0.3 },
    hover: { width: 60, height: 60, opacity: 0.5 },
    click: { width: 20, height: 20, opacity: 0.8 },
    text: { width: 20, height: 20, opacity: 0.2 },
    drag: { width: 70, height: 70, opacity: 0.4 },
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-screen"
        style={{ x: x - 6, y: y - 6 }}
        animate={cursorVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.3 }}
      />

      {/* Outer ring — follows with lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          x: x - 18,
          y: y - 18,
          border: '1px solid rgba(79,172,254,0.4)',
          borderRadius: '50%',
        }}
        animate={ringVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
      />

      {/* Glow halo */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: x - 30,
          y: y - 30,
          width: 60,
          height: 60,
          background: 'radial-gradient(circle, rgba(79,172,254,0.12) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{ opacity: cursorState === 'hover' ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
