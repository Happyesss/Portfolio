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
      className="relative min-h-0 sm:min-h-[100svh] flex flex-col justify-center items-center overflow-hidden px-4 pt-44 pb-8 sm:py-0"
    >
      {/* 3D scene background */}
      <div className="absolute inset-0 z-0">
        <HeroScene inView={inView} />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-radial from-transparent via-bg-primary/20 to-bg-primary/70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-48 bg-gradient-to-t from-bg-primary to-transparent z-1 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto w-full px-2 sm:px-6">
        {/* Main name */}
        <div className="overflow-hidden mb-2 sm:mb-4">
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-4"
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
          className="overflow-hidden mb-3 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="font-display text-base sm:text-xl md:text-2xl font-light text-text-secondary tracking-wide">
            Full-Stack Engineer &amp;{' '}
            <span className="gradient-text-orange font-medium">Product Architect</span>
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-text-secondary text-xs sm:text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-6 sm:mb-10 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* CTA buttons — side-by-side on mobile, tablet, and desktop */}
        <motion.div
          className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-sm sm:max-w-md mx-auto px-2 mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.a
            href="#projects"
            className="flex-1 px-3 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-accent-blue text-bg-primary font-semibold text-xs sm:text-sm md:text-base hover:bg-accent-blue/90 transition-all duration-300 shadow-glow-blue flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap text-center"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>View My Work</span>
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>

          <motion.a
            href="#contact"
            className="flex-1 px-3 sm:px-7 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl glass-bright text-text-primary font-medium text-xs sm:text-sm md:text-base hover:bg-white/10 transition-all duration-300 flex items-center justify-center whitespace-nowrap text-center"
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

        {/* Social proof quick stats — fills the bottom gap on mobile with high credibility */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-white/[0.08] max-w-sm sm:max-w-md mx-auto text-text-muted font-mono text-[11px] sm:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="text-accent-blue font-bold">4+</span> Years Exp
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent-teal font-bold">4M+</span> Views
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent-orange font-bold">30K+</span> Users
          </span>
        </motion.div>

        {/* Scroll indicator — shown on tablet/desktop, hidden on mobile */}
        <motion.div
          className="hidden md:flex absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none"
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
