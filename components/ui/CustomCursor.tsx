'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'drag';
type ClickType = 'left' | 'right' | null;

const MOUSE_WIDTH = 26;
const MOUSE_HEIGHT = 38;
const GLOW_SIZE = 72;

export default function CustomCursor() {
  const { x, y } = useMousePosition(true);
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [activeClick, setActiveClick] = useState<ClickType>(null);
  const [scrollPulse, setScrollPulse] = useState(false);
  const moveTimeoutRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseMove = (e: MouseEvent) => {
      setIsMoving(true);
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = window.setTimeout(() => setIsMoving(false), 140);

      if (isPointerDownRef.current) return;

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

    const handleMouseDown = (e: MouseEvent) => {
      isPointerDownRef.current = true;
      setCursorState('click');

      if (e.button === 0) {
        setActiveClick('left');
      } else if (e.button === 2) {
        setActiveClick('right');
      }

      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = window.setTimeout(() => setActiveClick(null), 160);
    };

    const handleMouseUp = () => {
      isPointerDownRef.current = false;
      setCursorState('default');
      setActiveClick(null);
    };

    const handleWheel = () => {
      setScrollPulse(true);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => setScrollPulse(false), 140);
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheel);
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const mouseBodyVariants = {
    default: {
      scale: 1,
      boxShadow: '0 10px 20px rgba(0,0,0,0.45)',
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
    },
    click: {
      scale: 0.94,
      boxShadow: '0 8px 16px rgba(0,0,0,0.45)',
    },
    text: {
      scale: 1,
      boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
    },
    drag: {
      scale: 1.08,
      boxShadow: '0 14px 26px rgba(0,0,0,0.55)',
    },
  };

  const glowVariants = {
    default: { scale: 1, opacity: 0.22 },
    hover: { scale: 1.3, opacity: 0.32 },
    click: { scale: 0.85, opacity: 0.35 },
    text: { scale: 0.95, opacity: 0.2 },
    drag: { scale: 1.45, opacity: 0.4 },
  };

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: x - GLOW_SIZE / 2,
          y: y - GLOW_SIZE / 2,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          background: 'radial-gradient(circle, rgba(79,172,254,0.35) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        animate={glowVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.6 }}
      />

      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: x - MOUSE_WIDTH / 2,
          y: y - MOUSE_HEIGHT / 2,
          width: MOUSE_WIDTH,
          height: MOUSE_HEIGHT,
        }}
        animate={mouseBodyVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.4 }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '14px 14px 18px 18px',
            background: 'linear-gradient(180deg, rgba(34,38,52,0.98) 0%, rgba(12,15,24,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.28), inset 0 -6px 10px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: 4,
              right: 4,
              height: 6,
              borderRadius: '8px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))',
              opacity: 0.7,
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              width: 1,
              height: 12,
              background: 'rgba(255,255,255,0.14)',
              transform: 'translateX(-0.5px)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 4,
              left: 3,
              width: 10,
              height: 12,
              borderRadius: '7px',
              background: 'linear-gradient(180deg, rgba(50,55,70,0.98) 0%, rgba(30,34,48,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '7px',
                background:
                  'radial-gradient(circle at 50% 0%, rgba(79,172,254,0.9) 0%, rgba(79,172,254,0.2) 55%, transparent 70%)',
              }}
              animate={{ opacity: activeClick === 'left' ? 1 : 0 }}
              transition={{ duration: 0.08 }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 3,
              width: 10,
              height: 12,
              borderRadius: '7px',
              background: 'linear-gradient(180deg, rgba(50,55,70,0.98) 0%, rgba(30,34,48,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
            }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '7px',
                background:
                  'radial-gradient(circle at 50% 0%, rgba(247,127,0,0.95) 0%, rgba(247,127,0,0.25) 55%, transparent 70%)',
              }}
              animate={{ opacity: activeClick === 'right' ? 1 : 0 }}
              transition={{ duration: 0.08 }}
            />
          </div>

          <motion.div
            style={{
              position: 'absolute',
              top: 5,
              left: '50%',
              width: 4,
              height: 10,
              borderRadius: '4px',
              transform: 'translateX(-50%)',
              border: '1px solid rgba(0,0,0,0.45)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.55)',
            }}
            animate={{
              backgroundColor: scrollPulse ? 'rgba(0,245,212,0.95)' : 'rgba(200,205,218,0.8)',
              boxShadow: scrollPulse
                ? '0 0 8px rgba(0,245,212,0.85)'
                : 'inset 0 1px 2px rgba(0,0,0,0.55)',
            }}
            transition={{ duration: 0.12 }}
          />

          <motion.div
            style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255,66,66,0.9)',
            }}
            animate={
              isMoving
                ? {
                    opacity: [0.2, 1, 0.2],
                    boxShadow: [
                      '0 0 4px rgba(255,66,66,0.35)',
                      '0 0 10px rgba(255,66,66,0.9)',
                      '0 0 4px rgba(255,66,66,0.35)',
                    ],
                  }
                : { opacity: 0.2, boxShadow: '0 0 4px rgba(255,66,66,0.35)' }
            }
            transition={{ duration: 0.8, repeat: isMoving ? Infinity : 0, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </>
  );
}
