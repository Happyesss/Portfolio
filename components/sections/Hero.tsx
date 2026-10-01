'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';
import { staggerContainer, letterReveal } from '@/lib/animations';

const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => null,
});

const TITLE_WORDS = personalInfo.name.split(' ');

export default function Hero({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const sectionRef = useSectionInView('hero', setActiveSection);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.05, initialInView: true });

  const setRefs = (el: HTMLDivElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    inViewRef(el);
  };

  return (
    <div
      ref={setRefs}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D scene background */}
      <div className="absolute inset-0 z-0">
        <HeroScene inView={inView} />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-radial from-transparent via-bg-primary/20 to-bg-primary/70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg-primary to-transparent z-1 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
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
    </div>
  );
}
