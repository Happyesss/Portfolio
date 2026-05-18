'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { githubStats } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, counterVariant } from '@/lib/animations';

function AnimatedCounter({ value, label, color }: { value: number | string; label: string; color: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
  const suffix = typeof value === 'string' ? value.replace(/[\d.]/g, '') : '';

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, numericValue);
      setCount(Math.round(current));
      if (current >= numericValue) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, numericValue]);

  return (
    <motion.div
      ref={ref}
      className="glass rounded-2xl p-6 text-center border border-surface-border group hover:border-opacity-50 transition-all duration-300"
      style={{ '--hover-color': color } as React.CSSProperties}
      whileHover={{ y: -4 }}
    >
      <div
        className="font-display text-3xl font-bold mb-1 tabular-nums"
        style={{ color }}
      >
        {inView ? count.toLocaleString() : '0'}
        {suffix}
      </div>
      <div className="text-text-muted font-mono text-xs tracking-wide">{label}</div>
    </motion.div>
  );
}

function ContributionGraph() {
  const weeks = 26;
  const days = 7;

  const cells = Array.from({ length: weeks * days }, (_, i) => {
    const rand = Math.random();
    return rand > 0.6 ? (rand > 0.85 ? 3 : rand > 0.75 ? 2 : 1) : 0;
  });

  const intensityClass = [
    'bg-white/5',
    'bg-accent-blue/30',
    'bg-accent-blue/60',
    'bg-accent-blue',
  ];

  return (
    <div className="glass rounded-2xl p-6 border border-surface-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-text-primary font-semibold text-sm">Contribution Activity</h4>
        <span className="text-accent-blue font-mono text-sm font-bold">
          {githubStats.contributions.toLocaleString()} contributions this year
        </span>
      </div>

      <div
        className="grid gap-1 overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${days}, minmax(0, 1fr))` }}
      >
        {cells.map((intensity, i) => (
          <motion.div
            key={i}
            className={`rounded-sm aspect-square ${intensityClass[intensity]}`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % weeks) * 0.008, duration: 0.3 }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 text-text-muted font-mono text-xs">
        <span>Less</span>
        {intensityClass.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function GitHubStats({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('github', setActiveSection);

  const stats = [
    { value: githubStats.totalRepos, label: 'Repositories', color: '#4facfe' },
    { value: `${githubStats.totalStars}+`, label: 'Stars Earned', color: '#f77f00' },
    { value: githubStats.totalForks, label: 'Forks', color: '#00f5d4' },
    { value: `${githubStats.totalCommits}+`, label: 'Commits', color: '#a855f7' },
    { value: githubStats.totalPRs, label: 'Pull Requests', color: '#4ade80' },
    { value: githubStats.contributions, label: 'Contributions', color: '#f43f5e' },
  ];

  return (
    <div ref={ref} className="relative section-padding bg-bg-secondary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-teal/30 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Open Source"
          title="GitHub Activity"
          subtitle="Building in public, contributing to the community, and leaving a trail of commits."
          accentColor="teal"
        />

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={counterVariant} custom={i}>
              <AnimatedCounter value={stat.value} label={stat.label} color={stat.color} />
            </motion.div>
          ))}
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <ContributionGraph />
        </motion.div>

        {/* Language distribution */}
        <motion.div
          className="glass rounded-2xl p-6 border border-surface-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h4 className="text-text-primary font-semibold text-sm mb-5">Top Languages</h4>

          {/* Combined bar */}
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            {githubStats.topLanguages.map((lang) => (
              <motion.div
                key={lang.name}
                className="h-full"
                style={{ background: lang.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${lang.percentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {githubStats.topLanguages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: lang.color }} />
                <span className="text-text-secondary font-mono text-xs">{lang.name}</span>
                <span className="text-text-muted font-mono text-xs">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href={`https://github.com/${githubStats.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-bright border border-surface-border text-text-primary hover:border-accent-teal/30 hover:text-accent-teal transition-all duration-300 font-medium group"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View GitHub Profile
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
