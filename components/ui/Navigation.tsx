'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECTIONS } from '@/lib/constants';
import { useScrollProgress } from '@/hooks/useScrollProgress';

interface NavigationProps {
  activeSection: string;
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsExpanded(false);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-50 bg-gradient-to-r from-accent-blue via-accent-teal to-accent-blue origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Main navigation dock */}
      <motion.nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
      >
        <div
          className={`glass-bright rounded-full px-6 py-3 flex items-center gap-6 transition-all duration-500 ${
            isScrolled ? 'shadow-glow-blue' : ''
          }`}
        >
          {/* Logo */}
          <button
            className="flex items-center gap-2 group"
            onClick={() => scrollTo('hero')}
            aria-label="Scroll to top"
          >
            <div className="w-7 h-7">
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <polygon
                  points="20,2 38,11 38,29 20,38 2,29 2,11"
                  fill="none"
                  stroke="url(#navLogoGrad)"
                  strokeWidth="2"
                />
                <circle cx="20" cy="20" r="4" fill="url(#navLogoGrad)" />
              </svg>
            </div>
            <span className="font-display font-semibold text-sm text-text-primary hidden sm:block group-hover:text-accent-blue transition-colors">
              DA
            </span>
          </button>

          <div className="w-px h-5 bg-white/10" aria-hidden="true" />

          {/* Nav items */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.slice(0, 6).map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? 'text-accent-blue'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-accent-blue/10 border border-accent-blue/30"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{section.label}</span>
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-white/10 hidden md:block" aria-hidden="true" />

          {/* CTA */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden sm:block px-4 py-1.5 rounded-full text-sm font-semibold bg-accent-blue/20 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/30 transition-all duration-300"
          >
            Hire Me
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-1.5 rounded-full text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle navigation menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                className="block h-px bg-current rounded-full"
                animate={{ rotate: isExpanded ? 45 : 0, y: isExpanded ? 7.5 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-px bg-current rounded-full"
                animate={{ opacity: isExpanded ? 0 : 1, scaleX: isExpanded ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-current rounded-full"
                animate={{ rotate: isExpanded ? -45 : 0, y: isExpanded ? -7.5 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-x-4 top-20 z-30 glass-bright rounded-2xl overflow-hidden md:hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-4 grid grid-cols-3 gap-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-accent-blue/15 text-accent-blue'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg" aria-hidden="true">{section.icon}</span>
                  <span className="text-xs font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section indicator dots — right side */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-end gap-3"
            aria-label={`Go to ${section.label}`}
          >
            <motion.span
              className="text-text-muted text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              initial={false}
            >
              {section.label}
            </motion.span>
            <div
              className={`rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'w-6 h-2 bg-accent-blue shadow-glow-blue'
                  : 'w-2 h-2 bg-white/20 group-hover:bg-white/40'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
