'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'click' | 'text' | 'drag';
type ClickType = 'left' | 'right' | null;

const MOUSE_WIDTH = 26;
const MOUSE_HEIGHT = 38;
const GLOW_SIZE = 72;

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [activeClick, setActiveClick] = useState<ClickType>(null);
  const [scrollPulse, setScrollPulse] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // High-performance Framer Motion values: updates GPU transform directly without React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast, responsive spring tracking for the mouse body (no lag)
  const cursorX = useSpring(mouseX, { stiffness: 750, damping: 38, mass: 0.15 });
  const cursorY = useSpring(mouseY, { stiffness: 750, damping: 38, mass: 0.15 });

  // Smooth ambient glow spring
  const glowX = useSpring(mouseX, { stiffness: 250, damping: 26, mass: 0.4 });
  const glowY = useSpring(mouseY, { stiffness: 250, damping: 26, mass: 0.4 });

  const moveTimeoutRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Check for touch-only devices
    if (typeof window !== 'undefined') {
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      if (isTouch) {
        setIsTouchDevice(true);
        return;
      }
    }

    const setVisible = (visible: boolean) => {
      isVisibleRef.current = visible;
      setIsVisible(visible);
      if (visible) {
        document.documentElement.classList.add('has-custom-cursor');
      } else {
        document.documentElement.classList.remove('has-custom-cursor');
      }
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      // Ignore touch pointers on hybrid laptops
      if ('pointerType' in e && e.pointerType === 'touch') {
        return;
      }

      // Ensure cursor is visible on the first move (solves Brave / reload issues where mouseenter doesn't fire)
      if (!isVisibleRef.current) {
        setVisible(true);
      }

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      setIsMoving(true);
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = window.setTimeout(() => setIsMoving(false), 140);

      if (isPointerDownRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList?.contains('hoverable') ||
        target.classList?.contains('cursor-pointer') ||
        (typeof window !== 'undefined' && window.getComputedStyle(target).cursor === 'pointer')
      ) {
        setCursorState('hover');
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4'
      ) {
        setCursorState('text');
      } else {
        setCursorState('default');
      }
    };

    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if ('pointerType' in e && e.pointerType === 'touch') return;
      isPointerDownRef.current = true;
      if (!isVisibleRef.current) setVisible(true);
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

    const handlePointerUp = () => {
      isPointerDownRef.current = false;
      setCursorState('default');
      setActiveClick(null);
    };

    const handlePointerLeave = (e: MouseEvent) => {
      // Only hide if the pointer actually leaves the browser viewport
      if (!e.relatedTarget || e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setVisible(false);
      }
    };

    const handlePointerEnter = () => {
      setVisible(true);
    };

    const handleWheel = () => {
      setScrollPulse(true);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => setScrollPulse(false), 140);
    };

    const handleWindowBlur = () => {
      setVisible(false);
    };

    const handleWindowFocus = () => {
      setVisible(true);
    };

    // Attach both pointer and mouse events for maximum cross-browser compatibility (Brave, Chrome, Firefox, Safari)
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('wheel', handleWheel);
      document.documentElement.classList.remove('has-custom-cursor');
      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
      if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [mouseX, mouseY]);

  if (isTouchDevice) return null;

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

  return (
    <>
      {/* Ambient glow follower */}
      <motion.div
        className="fixed top-0 left-0 z-[9997] pointer-events-none rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: -GLOW_SIZE / 2,
          translateY: -GLOW_SIZE / 2,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          background: 'radial-gradient(circle, rgba(79,172,254,0.35) 0%, transparent 70%)',
          filter: 'blur(10px)',
          opacity: isVisible ? (glowVariants[cursorState]?.opacity ?? 0.22) : 0,
        }}
        animate={glowVariants[cursorState]}
        transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 0.5 }}
      />

      {/* Main Mouse Body */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: -MOUSE_WIDTH / 2,
          translateY: -MOUSE_HEIGHT / 2,
          width: MOUSE_WIDTH,
          height: MOUSE_HEIGHT,
          opacity: isVisible ? 1 : 0,
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
            background: 'linear-gradient(180deg, rgba(28,28,30,0.98) 0%, rgba(10,10,10,0.98) 100%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.28), inset 0 -6px 10px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          {/* Top highlight glare */}
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

          {/* Center seam */}
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

          {/* Left mouse button */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: 3,
              width: 10,
              height: 12,
              borderRadius: '7px',
              background: 'linear-gradient(180deg, rgba(40,40,42,0.98) 0%, rgba(20,20,22,0.98) 100%)',
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

          {/* Right mouse button */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 3,
              width: 10,
              height: 12,
              borderRadius: '7px',
              background: 'linear-gradient(180deg, rgba(40,40,42,0.98) 0%, rgba(20,20,22,0.98) 100%)',
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

          {/* Scroll wheel */}
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

          {/* Red optical sensor dot */}
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
