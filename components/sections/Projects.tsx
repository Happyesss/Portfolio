'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { projects } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

type Project = typeof projects[0];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    // Prevent background scroll when modal is open
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original scroll behavior when modal closes
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative glass-bright rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          style={{ borderColor: `${project.color}30`, boxShadow: `0 0 80px ${project.color}20` }}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div
            className="relative p-8 pb-6 rounded-t-3xl overflow-hidden flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${project.color}15, transparent)` }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full glass flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close project details"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                style={{ background: `${project.color}20`, border: `1px solid ${project.color}40` }}
              >
              {project.logo ? (
                  <img src={`${BASE}${project.logo}`} alt={project.title} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <>
                    {project.category === 'AI/ML' ? '🧠' : project.category === 'Cloud' ? '☁' : project.category === 'Backend' ? '⚙' : '◈'}
                  </>
                )}
              </div>
              <div>
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: project.color }}>
                  {project.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-text-primary mt-1">{project.title}</h3>
                <p className="text-text-secondary mt-1">{project.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-8 pb-8">
            <div className="space-y-6 pt-6">
            {/* Description */}
            <p className="text-text-secondary leading-relaxed">{project.longDescription}</p>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div key={key} className="glass rounded-xl p-3 text-center">
                  <div className="font-display font-bold text-xl" style={{ color: project.color }}>{value}</div>
                  <div className="text-text-muted font-mono text-xs capitalize mt-1">{key}</div>
                </div>
              ))}
            </div>

            {/* Architecture */}
            <div>
              <h4 className="text-text-primary font-semibold mb-3 font-mono text-sm">Architecture</h4>
              <div className="flex flex-wrap gap-2">
                {project.architecture.map((layer, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="px-3 py-1.5 rounded-lg glass font-mono text-xs text-text-secondary border border-surface-border"
                    >
                      {layer}
                    </span>
                    {i < project.architecture.length - 1 && (
                      <span className="text-text-muted text-xs">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <h4 className="text-text-primary font-semibold mb-3 font-mono text-sm">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full font-mono text-xs"
                    style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA links */}
            <div className="flex gap-3 pt-2">
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl text-center font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{ background: project.color, color: '#070711' }}
              >
                Live Demo →
              </a>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl glass text-center font-medium text-sm text-text-secondary hover:text-text-primary border border-surface-border transition-all duration-300 hover:scale-105"
              >
                GitHub →
              </a>
            </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.button
      className="project-card group relative isolate w-full overflow-hidden rounded-3xl glass shadow-glass text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent-blue/60"
      onClick={onClick}
      aria-label={`Open ${project.title} details`}
      variants={scaleIn}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      {/* Ambient glass layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 -right-16 h-44 w-44 rounded-full opacity-35 blur-3xl"
          style={{ background: project.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-70" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{ background: `radial-gradient(140px 90px at 85% 15%, ${project.color}55, transparent 70%)` }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute inset-0 ring-1 ring-white/10 ring-inset" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="relative h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 overflow-hidden"
              style={{ background: `${project.color}18`, border: `1px solid ${project.color}40` }}
            >
              {project.logo ? (
                <img src={`${BASE}${project.logo}`} alt={project.title} className="w-full h-full object-contain p-1.5" />
              ) : (
                <>
                  {project.category === 'AI/ML' ? '🧠' : project.category === 'Cloud' ? '☁' : project.category === 'Backend' ? '⚙' : '◈'}
                </>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider"
                  style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}
                >
                  {project.category}
                </span>
                <span className="px-2.5 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider glass text-text-muted border-surface-border">
                  {project.year}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mt-2 tracking-tight group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-text-secondary text-sm mt-1">{project.subtitle}</p>
            </div>
          </div>
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-muted group-hover:text-text-primary group-hover:border-white/30 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        <p className="text-text-secondary/90 text-sm leading-relaxed mt-4 line-clamp-3">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono text-text-muted border border-white/10 bg-white/5"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-text-muted border border-white/10 bg-white/5">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/10">
          <div className="flex gap-6">
            {Object.entries(project.metrics)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key}>
                  <div className="font-display font-semibold text-sm" style={{ color: project.color }}>{value}</div>
                  <div className="text-text-muted font-mono text-[11px] uppercase tracking-wider">{key}</div>
                </div>
              ))}
          </div>
          <span className="text-text-muted text-[11px] uppercase tracking-widest font-mono group-hover:text-text-secondary transition-colors">
            View case study →
          </span>
        </div>
      </div>
    </motion.button>
  );
}

export default function Projects({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('projects', setActiveSection);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('featured');

  const displayed = filter === 'featured'
    ? projects.filter((p) => p.featured)
    : projects;

  return (
    <div ref={ref} className="relative section-padding bg-bg-primary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-orange/30 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Featured Work"
          title="Projects I've Shipped"
          subtitle="Products that solve real problems, serve real users, and reflect how I think about engineering."
          accentColor="orange"
        />

        {/* Filter */}
        <div className="flex justify-center gap-3 mb-12">
          {(['featured', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 glass border ${
                filter === f
                  ? 'text-accent-orange border-accent-orange/40 bg-accent-orange/10'
                  : 'text-text-muted border-surface-border hover:text-text-secondary'
              }`}
            >
              {f === 'featured' ? '✦ Featured' : 'All Projects'}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
          >
            {displayed.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl glass-bright border border-surface-border text-text-secondary hover:text-text-primary hover:border-white/20 transition-all duration-300 font-medium"
          >
            <span>View all on GitHub</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Project modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
