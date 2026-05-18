'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SectionHeader } from '@/components/ui/GlassCard';

interface PortfolioMode {
  name: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const portfolioModes: PortfolioMode[] = [
  {
    name: 'Simple',
    description: 'Clean, minimal design focused on content clarity and fast load times.',
    icon: '✨',
    link: '/simple',
    color: 'blue',
  },
  {
    name: 'Hacker',
    description: 'Terminal-inspired design with interactive elements and immersive experience.',
    icon: '⚡',
    link: '/hacker',
    color: 'purple',
  },
  {
    name: 'Garden',
    description: 'An interactive 3D tree animation scene built with Three.js — a living, breathing garden.',
    icon: '🌳',
    link: '/tree',
    color: 'teal',
  },
];

export default function PortfolioModes({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div ref={ref} className="relative section-padding bg-bg-primary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            label="Choose Your Experience"
            title="Portfolio Modes"
            subtitle="Explore different versions of my portfolio, each designed for a unique experience."
            accentColor="blue"
          />
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {portfolioModes.map((mode) => (
            <motion.div key={mode.name} variants={itemVariants}>
              <a
                href={mode.link}

                className="group block h-full"
              >
                <div
                  className="relative h-full glass rounded-3xl p-8 md:p-10 border border-accent-blue/20 hover:border-accent-blue/50 transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background:
                      mode.color === 'blue'
                        ? 'linear-gradient(135deg, rgba(79,172,254,0.05), rgba(100,200,255,0.02))'
                        : mode.color === 'purple'
                        ? 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(188,115,277,0.02))'
                        : 'linear-gradient(135deg, rgba(45,212,191,0.05), rgba(20,184,166,0.02))',
                  }}
                >
                  {/* Gradient background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      background:
                        mode.color === 'blue'
                          ? 'radial-gradient(circle at 50% 50%, #4facfe, #00f2fe)'
                          : mode.color === 'purple'
                          ? 'radial-gradient(circle at 50% 50%, #a855f7, #d946ef)'
                          : 'radial-gradient(circle at 50% 50%, #2dd4bf, #14b8a6)',
                    }}
                    aria-hidden="true"
                  />

                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                      {mode.icon}
                    </div>

                    <h3 className="font-display text-3xl font-bold text-text-primary mb-3">
                      {mode.name}
                    </h3>

                    <p className="text-text-secondary leading-relaxed mb-6">
                      {mode.description}
                    </p>

                    <div className={`flex items-center gap-2 font-medium group-hover:gap-3 transition-all duration-300 ${mode.color === 'blue' ? 'text-accent-blue' : mode.color === 'purple' ? 'text-accent-purple' : 'text-accent-teal'}`}>
                      <span>Explore</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
