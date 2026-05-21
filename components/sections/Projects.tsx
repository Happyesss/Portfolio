'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { projects } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp, scaleIn } from '@/lib/animations';

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
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                style={{ background: `${project.color}20`, border: `1px solid ${project.color}40` }}
              >
                {project.logo ? (
                  <img src={project.logo} alt={project.title} className="w-full h-full object-contain p-1.5" />
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
      className="project-card glass rounded-2xl overflow-hidden border border-surface-border text-left w-full group"
      onClick={onClick}
      variants={scaleIn}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Color accent top bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}44)` }} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden"
            style={{ background: `${project.color}15`, border: `1px solid ${project.color}30` }}
          >
            {project.logo ? (
              <img src={project.logo} alt={project.title} className="w-full h-full object-contain p-1" />
            ) : (
              <>
                {project.category === 'AI/ML' ? '🧠' : project.category === 'Cloud' ? '☁' : project.category === 'Backend' ? '⚙' : '◈'}
              </>
            )}
          </div>
          <div className="flex gap-1.5">
            <span
              className="px-2.5 py-1 rounded-full font-mono text-xs"
              style={{ background: `${project.color}15`, color: project.color }}
            >
              {project.category}
            </span>
            <span className="px-2.5 py-1 rounded-full font-mono text-xs glass text-text-muted border-surface-border">
              {project.year}
            </span>
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-text-primary mb-1 group-hover:text-white transition-colors">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm mb-3">{project.subtitle}</p>
        <p className="text-text-muted text-sm leading-relaxed mb-5 line-clamp-2">{project.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded glass font-mono text-xs text-text-muted border-surface-border">
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-2 py-0.5 rounded glass font-mono text-xs text-text-muted">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Key metric */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <div className="flex gap-4">
            {Object.entries(project.metrics)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key}>
                  <div className="font-display font-bold text-sm" style={{ color: project.color }}>{value}</div>
                  <div className="text-text-muted font-mono text-xs capitalize">{key}</div>
                </div>
              ))}
          </div>
          <span className="text-text-muted text-xs group-hover:text-accent-blue transition-colors font-mono">
            View details →
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
