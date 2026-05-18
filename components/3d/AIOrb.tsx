'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES: Record<string, string> = {
  hero: 'Welcome to my digital workspace ✦',
  about: 'Learn about who I am and what drives me →',
  skills: 'Explore my technical universe →',
  projects: 'Discover what I\'ve built →',
  startup: 'Follow my entrepreneurial journey →',
  github: 'See my open source contributions →',
  timeline: 'Trace my career path →',
  testimonials: 'Hear from people I\'ve worked with →',
  contact: 'Ready to build something together? →',
};

interface AIOrbProps {
  activeSection: string;
}

export default function AIOrb({ activeSection }: AIOrbProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState(MESSAGES['hero']);
  const [prevSection, setPrevSection] = useState('');
  const orbRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeSection !== prevSection) {
      setPrevSection(activeSection);
      setMessage(MESSAGES[activeSection] ?? MESSAGES['hero']);
      // Auto-show message briefly on section change
      setIsExpanded(true);
      const timer = setTimeout(() => setIsExpanded(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [activeSection, prevSection]);

  return (
    <div className="fixed bottom-8 right-8 z-40 flex items-end gap-3">
      {/* Message bubble */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="glass-bright rounded-2xl px-4 py-3 max-w-[220px] mb-1"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <p className="text-text-primary text-xs leading-relaxed">{message}</p>
            <div className="absolute -right-2 bottom-4 w-0 h-0" style={{
              borderLeft: '8px solid rgba(255,255,255,0.06)',
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb button */}
      <motion.button
        ref={orbRef}
        className="relative w-14 h-14 rounded-full flex items-center justify-center group"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label="Toggle AI guide"
        aria-expanded={isExpanded}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 15px rgba(79,172,254,0.4), 0 0 30px rgba(79,172,254,0.15)',
              '0 0 25px rgba(79,172,254,0.6), 0 0 50px rgba(79,172,254,0.25)',
              '0 0 15px rgba(79,172,254,0.4), 0 0 30px rgba(79,172,254,0.15)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-accent-blue/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            borderTopColor: 'rgba(79,172,254,0.6)',
          }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border border-accent-teal/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ borderRightColor: 'rgba(0,245,212,0.4)' }}
        />

        {/* Core */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-teal/20 glass flex items-center justify-center">
          <motion.div
            className="w-4 h-4"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4facfe" />
                  <stop offset="100%" stopColor="#00f5d4" />
                </linearGradient>
              </defs>
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                fill="url(#orbGrad)"
              />
              <circle cx="12" cy="12" r="3" fill="url(#orbGrad)" />
            </svg>
          </motion.div>
        </div>

        {/* Particle sparks */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-1 h-1 rounded-full bg-accent-blue"
            style={{
              transform: `rotate(${deg}deg) translateX(28px)`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: deg / 360 * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.button>
    </div>
  );
}
