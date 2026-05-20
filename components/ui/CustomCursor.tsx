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
    default: {
      width: 14,
      height: 14,
      background: 'linear-gradient(135deg, rgba(79,172,254,1), rgba(0,245,212,1))',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 0 10px rgba(79,172,254,0.85), 0 0 18px rgba(0,245,212,0.45)',
    },
    hover: {
      width: 14,
      height: 14,
      background: 'linear-gradient(135deg, rgba(79,172,254,1), rgba(0,245,212,1))',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.95)',
      boxShadow: '0 0 14px rgba(79,172,254,1), 0 0 24px rgba(0,245,212,0.6)',
    },
    click: {
      width: 10,
      height: 10,
      backgroundColor: 'rgba(247,127,0,0.95)',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.85)',
      boxShadow: '0 0 10px rgba(247,127,0,0.8)',
    },
    text: {
      width: 4,
      height: 26,
      backgroundColor: 'rgba(232,234,246,0.9)',
      borderRadius: '2px',
      border: '1px solid rgba(79,172,254,0.8)',
      boxShadow: '0 0 8px rgba(79,172,254,0.7)',
    },
    drag: {
      width: 16,
      height: 16,
      backgroundColor: 'rgba(0,245,212,0.15)',
      borderRadius: '50%',
      border: '2px solid rgba(0,245,212,0.8)',
      boxShadow: '0 0 14px rgba(0,245,212,0.6)',
    },
  };

  const ringVariants = {
    default: {
      width: 36,
      height: 36,
      opacity: 0.5,
      borderColor: 'rgba(79,172,254,0.55)',
      boxShadow: '0 0 18px rgba(79,172,254,0.25)',
    },
    hover: {
      width: 58,
      height: 58,
      opacity: 0.7,
      borderColor: 'rgba(0,245,212,0.7)',
      boxShadow: '0 0 26px rgba(0,245,212,0.35)',
    },
    click: {
      width: 24,
      height: 24,
      opacity: 0.9,
      borderColor: 'rgba(247,127,0,0.75)',
      boxShadow: '0 0 18px rgba(247,127,0,0.35)',
    },
    text: {
      width: 22,
      height: 22,
      opacity: 0.35,
      borderColor: 'rgba(79,172,254,0.4)',
      boxShadow: '0 0 12px rgba(79,172,254,0.2)',
    },
    drag: {
      width: 72,
      height: 72,
      opacity: 0.55,
      borderColor: 'rgba(0,245,212,0.55)',
      boxShadow: '0 0 30px rgba(0,245,212,0.3)',
    },
  };

  const accentVariants = {
    default: {
      width: 8,
      height: 8,
      opacity: 0.9,
      rotate: 45,
      borderColor: 'rgba(255,255,255,0.75)',
      backgroundColor: 'rgba(7,7,17,0.55)',
    },
    hover: {
      width: 12,
      height: 12,
      opacity: 1,
      rotate: 45,
      borderColor: 'rgba(0,245,212,0.85)',
      backgroundColor: 'rgba(7,7,17,0.45)',
    },
    click: {
      width: 6,
      height: 6,
      opacity: 1,
      rotate: 45,
      borderColor: 'rgba(247,127,0,0.85)',
      backgroundColor: 'rgba(7,7,17,0.4)',
    },
    text: {
      width: 0,
      height: 0,
      opacity: 0,
      rotate: 45,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    drag: {
      width: 10,
      height: 10,
      opacity: 0.9,
      rotate: 45,
      borderColor: 'rgba(0,245,212,0.8)',
      backgroundColor: 'rgba(7,7,17,0.5)',
    },
  };

  const cursorOffsets = {
    default: { x: 7, y: 7 },
    hover: { x: 7, y: 7 },
    click: { x: 5, y: 5 },
    text: { x: 2, y: 13 },
    drag: { x: 8, y: 8 },
  };

  const ringOffsets = {
    default: 18,
    hover: 29,
    click: 12,
    text: 11,
    drag: 36,
  };

  const accentOffsets = {
    default: 4,
    hover: 6,
    click: 3,
    text: 0,
    drag: 5,
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: x - cursorOffsets[cursorState].x, y: y - cursorOffsets[cursorState].y }}
        animate={cursorVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.3 }}
      />

      {/* Inner diamond accent */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none border"
        style={{ x: x - accentOffsets[cursorState], y: y - accentOffsets[cursorState] }}
        animate={accentVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 700, damping: 35, mass: 0.25 }}
      />

      {/* Outer ring — follows with lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{
          x: x - ringOffsets[cursorState],
          y: y - ringOffsets[cursorState],
        }}
        animate={ringVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }}
      />

      {/* Glow halo */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: x - 36,
          y: y - 36,
          width: 72,
          height: 72,
          background: 'radial-gradient(circle, rgba(79,172,254,0.18) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        animate={{ opacity: cursorState === 'hover' ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
