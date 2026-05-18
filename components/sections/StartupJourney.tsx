'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { startupJourney } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function StartupJourney({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('startup', setActiveSection);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={ref} className="relative section-padding bg-bg-tertiary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent" aria-hidden="true" />

      <div className="max-w-5xl mx-auto" ref={containerRef}>
        <SectionHeader
          label="Origin Story"
          title="The Startup Journey"
          subtitle="From side projects to funded startups — the path that shaped how I think and build."
          accentColor="purple"
        />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full origin-top"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, #4facfe, #a855f7, #00f5d4, #f77f00)',
              }}
            />
          </div>

          <motion.div
            className="space-y-16"
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {startupJourney.map((phase, i) => (
              <motion.div
                key={phase.phase}
                variants={fadeInUp}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full border-2 bg-bg-tertiary flex items-center justify-center z-10"
                  style={{ borderColor: phase.color, boxShadow: `0 0 12px ${phase.color}50` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: phase.color }} />
                </div>

                {/* Empty spacer for alternating layout */}
                <div className="hidden md:block flex-1" />

                {/* Card — offset from center */}
                <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <motion.div
                    className="glass rounded-2xl p-6 border"
                    style={{ borderColor: `${phase.color}25` }}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    {/* Phase number */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{ background: `${phase.color}15`, color: phase.color }}
                      >
                        Phase {phase.phase}
                      </span>
                      <span className="text-text-muted font-mono text-xs">{phase.period}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-text-primary mb-3">
                      {phase.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-4">
                      {phase.description}
                    </p>

                    {/* Milestone badge */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
                      style={{ background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}30` }}
                    >
                      <span>✦</span>
                      <span>{phase.milestone}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
