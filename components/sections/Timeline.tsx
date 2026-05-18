'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { experience } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const TYPE_ICONS: Record<string, string> = {
  Startup: '🚀',
  'Scale-up': '📈',
  Independent: '🌐',
};

export default function Timeline({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('timeline', setActiveSection);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative section-padding bg-bg-primary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />

      <div className="max-w-4xl mx-auto" ref={containerRef}>
        <SectionHeader
          label="Experience"
          title="Career Timeline"
          subtitle="Every role, every company, every challenge that built who I am as an engineer."
          accentColor="blue"
        />

        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-8 md:left-16 top-0 bottom-0 w-px bg-white/5">
            <motion.div
              className="w-full origin-top"
              style={{
                scaleY: lineScaleY,
                background: 'linear-gradient(to bottom, #4facfe, #a855f7, #00f5d4, transparent)',
              }}
            />
          </div>

          <motion.div
            className="space-y-12"
            variants={staggerContainer(0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {experience.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${i}`}
                variants={fadeInUp}
                className="relative pl-20 md:pl-32"
              >
                {/* Timeline node */}
                <div
                  className="absolute left-6 md:left-14 -translate-x-1/2 w-5 h-5 rounded-full border-2 bg-bg-primary flex items-center justify-center"
                  style={{ borderColor: exp.color, boxShadow: `0 0 12px ${exp.color}60` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: exp.color }} />
                </div>

                {/* Type icon above node */}
                <div className="absolute left-4 md:left-[3.1rem] -top-6 text-sm">
                  {TYPE_ICONS[exp.type] ?? '💼'}
                </div>

                {/* Card */}
                <motion.div
                  className="glass rounded-2xl p-6 border"
                  style={{ borderColor: `${exp.color}20` }}
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="font-mono text-xs tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                          style={{ background: `${exp.color}15`, color: exp.color }}
                        >
                          {exp.type}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-text-primary">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-text-secondary font-medium">{exp.company}</span>
                        <span className="text-text-muted">·</span>
                        <span className="text-text-muted text-sm">{exp.location}</span>
                      </div>
                    </div>
                    <span className="text-text-muted font-mono text-sm bg-white/5 px-3 py-1 rounded-lg whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{exp.description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((highlight, j) => (
                      <li key={j} className="flex items-start gap-2 text-text-muted text-sm">
                        <span className="mt-1 text-xs" style={{ color: exp.color }}>▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full font-mono text-xs"
                        style={{ background: `${exp.color}10`, color: exp.color, border: `1px solid ${exp.color}25` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Timeline end */}
          <div className="relative pl-20 md:pl-32 mt-8">
            <div className="absolute left-6 md:left-[3.5rem] -translate-x-1/2 w-3 h-3 rounded-full bg-accent-blue/30 border border-accent-blue/40" />
            <p className="text-text-muted font-mono text-sm pt-1">The journey continues...</p>
          </div>
        </div>

        {/* Download resume CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-bright border border-surface-border text-text-primary hover:border-accent-blue/40 hover:text-accent-blue transition-all duration-300 font-medium group"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Résumé
          </a>
        </motion.div>
      </div>
    </div>
  );
}
