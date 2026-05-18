'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo, codeSnippets } from '@/lib/data';
import { staggerContainer, fadeInUp, letterReveal } from '@/lib/animations';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => null,
});

const TITLE_WORDS = personalInfo.name.split(' ');

export default function Hero({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('hero', setActiveSection);
  const { normalizedX, normalizedY } = useMousePosition(true);
  const [codeIndex, setCodeIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Rotate code snippets
  useEffect(() => {
    const snippet = codeSnippets[codeIndex];
    let i = 0;
    setDisplayedCode('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (i < snippet.length) {
        setDisplayedCode(snippet.slice(0, ++i));
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        const pause = setTimeout(() => {
          setCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 3000);
        return () => clearTimeout(pause);
      }
    }, 28);

    return () => clearInterval(typeInterval);
  }, [codeIndex]);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D scene background */}
      <div className="absolute inset-0 z-0">
        <HeroScene mouseX={normalizedX} mouseY={normalizedY} />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-radial from-transparent via-bg-primary/20 to-bg-primary/70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg-primary to-transparent z-1 pointer-events-none" />

      {/* Code snippet background */}
      <motion.div
        className="absolute top-12 right-8 w-72 z-10 pointer-events-none hidden lg:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.5, x: 0 }}
        transition={{ duration: 1.2, delay: 1.5 }}
      >
        <div className="glass rounded-xl p-4 border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-text-muted font-mono text-xs">workspace.ts</span>
          </div>
          <pre className="font-mono text-xs text-accent-blue/70 leading-relaxed overflow-hidden whitespace-pre-wrap">
            {displayedCode}
            {isTyping && <span className="animate-cursor-blink text-accent-blue">|</span>}
          </pre>
        </div>
      </motion.div>

      {/* Floating status badge */}
      <motion.div
        className="absolute top-36 left-8 z-10 hidden lg:flex items-center gap-2 glass rounded-full px-4 py-2"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono text-xs text-text-secondary">Available for work</span>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Pre-title label */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          <span className="font-mono text-xs text-accent-blue tracking-widest uppercase">
            Digital Architect Studio
          </span>
        </motion.div>

        {/* Main name */}
        <div className="overflow-hidden mb-4">
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={staggerContainer(0.12, 0.5)}
            initial="hidden"
            animate="visible"
          >
            {TITLE_WORDS.map((word, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  className="block font-display text-hero font-bold text-text-primary tracking-tight"
                  variants={letterReveal}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Role */}
        <motion.div
          className="overflow-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="font-display text-xl md:text-2xl font-light text-text-secondary tracking-wide">
            Full-Stack Engineer &amp;{' '}
            <span className="gradient-text-orange font-medium">Product Architect</span>
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.a
            href="#projects"
            className="group px-8 py-4 rounded-2xl bg-accent-blue text-bg-primary font-semibold text-base hover:bg-accent-blue/90 transition-all duration-300 shadow-glow-blue"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="flex items-center gap-2">
              View My Work
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </motion.a>

          <motion.a
            href="#contact"
            className="px-8 py-4 rounded-2xl glass-bright text-text-primary font-medium text-base hover:bg-white/10 transition-all duration-300"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Let's Connect
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-1 h-2 rounded-full bg-accent-blue" />
          </motion.div>
        </motion.div>
      </div>

      {/* Stats pills */}
      <motion.div
        className="absolute bottom-16 right-8 hidden xl:flex flex-col gap-3 z-10"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        {[
          { value: '6+', label: 'Years Exp.' },
          { value: '50K+', label: 'Users Served' },
          { value: '$2.5M', label: 'Raised' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl px-4 py-2 text-right">
            <div className="font-display font-bold text-lg gradient-text-blue">{stat.value}</div>
            <div className="text-text-muted font-mono text-xs">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
