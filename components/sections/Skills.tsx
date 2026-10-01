'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { skills } from '@/lib/data';
import { SKILL_CATEGORIES } from '@/lib/constants';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// Preload SkillsOrbit immediately in the browser
if (typeof window !== 'undefined') {
  import('@/components/3d/SkillsOrbit');
}

const SkillsOrbit = dynamic(() => import('@/components/3d/SkillsOrbit'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-accent-blue/30 border-t-accent-blue animate-spin" />
    </div>
  ),
});

type CategoryKey = keyof typeof SKILL_CATEGORIES;

export default function Skills({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('skills', setActiveSection);
  const { ref: orbitInViewRef, inView: orbitInView } = useInView({
    threshold: 0,
    rootMargin: '400px 0px 400px 0px',
    initialInView: true,
  });
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <div ref={ref} className="relative section-padding bg-bg-secondary overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Technical Universe"
          title="Skills & Expertise"
          subtitle="A constantly evolving constellation of technologies I wield to build world-class products."
          accentColor="teal"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 3D Orbit visualization - rendered immediately from starting */}
          <div
            ref={orbitInViewRef}
            className="relative h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl overflow-hidden glass border-surface-border order-2 lg:order-1"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 right-8 w-56 h-56 bg-accent-blue/10 blur-[90px]" />
              <div className="absolute bottom-8 left-8 w-52 h-52 bg-accent-purple/10 blur-[90px]" />
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] sm:text-xs text-text-muted font-mono pointer-events-none">
              <span>Drag to rotate • Hover a planet</span>
              <span className="uppercase tracking-wider">Orbit View</span>
            </div>

            <SkillsOrbit skills={skills} activeCategory={activeCategory} inView={orbitInView} />

            {/* Legend */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 flex flex-wrap gap-1.5 sm:gap-2 justify-center">
              {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key === activeCategory ? 'all' : key as CategoryKey)}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full glass font-mono text-[10px] sm:text-xs transition-all duration-200 border ${
                    activeCategory === key
                      ? 'text-white border-white/30'
                      : 'text-text-muted border-surface-border hover:text-text-secondary'
                  }`}
                  style={activeCategory === key ? { borderColor: `${cat.color}50`, color: cat.color, background: `${cat.color}15` } : {}}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cat.color }}
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skill list */}
          <div className="order-1 lg:order-2 space-y-3">
            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              <button
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 glass border ${
                  activeCategory === 'all' ? 'text-accent-blue border-accent-blue/40 bg-accent-blue/10' : 'text-text-muted border-surface-border'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {Object.entries(SKILL_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 glass border`}
                  style={activeCategory === key ? {
                    color: cat.color,
                    borderColor: `${cat.color}50`,
                    background: `${cat.color}15`,
                  } : { color: 'var(--text-muted)', borderColor: 'var(--border-glass)' }}
                  onClick={() => setActiveCategory(activeCategory === key ? 'all' : key as CategoryKey)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="space-y-2 sm:space-y-2.5 max-h-[380px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin"
                variants={staggerContainer(0.04)}
                initial="hidden"
                animate="visible"
              >
                {filtered.map((skill) => {
                  const category = SKILL_CATEGORIES[skill.category as CategoryKey];
                  return (
                    <motion.div
                      key={skill.name}
                      variants={fadeInUp}
                      className="glass rounded-xl p-3 sm:p-3.5 border-surface-border hover:bg-white/[0.06] transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          {skill.icon.startsWith('http') ? (
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-4 h-4 sm:w-5 sm:h-5 object-contain flex-shrink-0"
                            />
                          ) : (
                            <span className="text-sm sm:text-base w-5 sm:w-6 text-center shrink-0">{skill.icon}</span>
                          )}
                          <span className="text-text-primary font-medium text-xs sm:text-sm truncate">{skill.name}</span>
                          <span
                            className="hidden sm:inline-block px-2 py-0.5 rounded-full font-mono text-[10px] sm:text-xs shrink-0"
                            style={{ background: `${category?.color}15`, color: category?.color }}
                          >
                            {category?.label}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-text-muted group-hover:text-text-secondary transition-colors shrink-0">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${category?.color}, ${category?.color}88)` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
