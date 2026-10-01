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
          className="relative glass-bright rounded-2xl sm:rounded-3xl w-full max-w-xl sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          style={{ borderColor: `${project.color}30`, boxShadow: `0 0 60px ${project.color}15` }}
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Header */}
          <div
            className="relative p-5 sm:p-6 pb-3.5 rounded-t-2xl sm:rounded-t-3xl overflow-hidden flex-shrink-0 border-b border-white/[0.06]"
            style={{ background: `linear-gradient(135deg, ${project.color}12, transparent)` }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-xs text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
              aria-label="Close project details"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5">
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 overflow-hidden bg-white/[0.04]"
                style={{ border: `1px solid ${project.color}35` }}
              >
                {project.logo ? (
                  <img src={`${BASE}${project.logo}`} alt={project.title} className="w-full h-full object-contain p-1.5" />
                ) : (
                  <span>
                    {project.category === 'AI/ML' ? '🧠' : project.category === 'Cloud' ? '☁' : project.category === 'Backend' ? '⚙' : '◈'}
                  </span>
                )}
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase font-semibold" style={{ color: project.color }}>
                  {project.category}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-text-primary mt-0.5">{project.title}</h3>
                <p className="text-text-secondary text-xs">{project.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 px-5 sm:px-6 pb-5 pt-3.5">
            <div className="space-y-3.5">
              {/* Description */}
              <p className="text-text-secondary text-xs sm:text-[13px] leading-relaxed">{project.longDescription}</p>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(project.metrics).map(([key, value]) => (
                  <div key={key} className="glass rounded-xl p-2.5 text-center border border-white/[0.06]">
                    <div className="font-display font-bold text-sm sm:text-base" style={{ color: project.color }}>{value}</div>
                    <div className="text-text-muted font-mono text-[10px] capitalize mt-0.5">{key}</div>
                  </div>
                ))}
              </div>

              {/* Architecture */}
              <div>
                <h4 className="text-text-primary font-semibold mb-2 font-mono text-xs">Architecture</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.architecture.map((layer, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-1 rounded-lg glass font-mono text-[11px] text-text-secondary border border-surface-border"
                      >
                        {layer}
                      </span>
                      {i < project.architecture.length - 1 && (
                        <span className="text-text-muted text-[10px]">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div>
                <h4 className="text-text-primary font-semibold mb-2 font-mono text-xs">Tech Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[11px]"
                      style={{ background: `${project.color}15`, color: project.color, border: `1px solid ${project.color}30` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA links */}
              <div className="flex gap-2.5 pt-1">
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-center font-semibold text-xs sm:text-sm transition-all duration-300 hover:opacity-95"
                  style={{ background: project.color, color: '#070711' }}
                >
                  Live Demo →
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-xl glass text-center font-medium text-xs sm:text-sm text-text-secondary hover:text-text-primary border border-surface-border transition-all duration-300 hover:bg-white/10"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const metricsEntries = Object.entries(project.metrics).slice(0, 2);

  return (
    <motion.div
      className="project-card group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#151726]/90 via-[#0d0f1a]/95 to-[#080911]/95 backdrop-blur-2xl shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-400 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open ${project.title} details`}
      variants={scaleIn}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right color glow */}
        <div
          className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-20 group-hover:opacity-35 blur-3xl transition-opacity duration-500 pointer-events-none"
          style={{ background: project.color }}
        />
        {/* Top border specular light */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col p-5 sm:p-5.5">
        {/* Top row: Logo, badges, and quick links */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo */}
            <div
              className="relative h-10 w-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white/[0.04] border border-white/[0.1] group-hover:scale-105 group-hover:border-white/25 transition-all duration-300"
              style={{ boxShadow: `0 0 16px ${project.color}15` }}
            >
              {project.logo ? (
                <img
                  src={`${BASE}${project.logo}`}
                  alt={project.title}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <span className="text-lg">
                  {project.category === 'AI/ML' ? '🧠' : project.category === 'Cloud' ? '☁' : project.category === 'Backend' ? '⚙' : '◈'}
                </span>
              )}
            </div>

            {/* Category & Year */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-full font-mono text-[9.5px] font-semibold uppercase tracking-wider"
                  style={{
                    background: `${project.color}18`,
                    color: project.color,
                    border: `1px solid ${project.color}35`,
                  }}
                >
                  {project.category}
                </span>
                <span className="px-1.5 py-0.5 rounded-full font-mono text-[9.5px] text-text-muted bg-white/[0.03] border border-white/[0.08]">
                  {project.year}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Icons: Live Demo & Crisp Non-Dulled GitHub link */}
          <div className="flex items-center gap-1.5 shrink-0">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.08] hover:border-white/25 text-text-muted hover:text-white transition-all duration-200"
                title="Live Preview"
                aria-label={`Live preview of ${project.title}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 hover:border-white/40 text-white transition-all duration-200"
                title="View GitHub Repository"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}

            <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/[0.08] group-hover:border-white/20 text-text-muted group-hover:text-white transition-all duration-200">
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-3.5">
          <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-text-primary group-hover:text-white transition-colors duration-200">
            {project.title}
          </h3>
          <p className="font-medium text-xs mt-0.5 line-clamp-1" style={{ color: `${project.color}ee` }}>
            {project.subtitle}
          </p>
        </div>

        {/* Description with fixed compact rhythm */}
        <p className="text-text-muted text-xs leading-relaxed mt-2 line-clamp-2 min-h-[2.5rem]">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono text-text-secondary bg-white/[0.03] border border-white/[0.07] group-hover:border-white/[0.12] transition-colors"
            >
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: project.color }} />
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md text-[9.5px] font-mono text-text-muted bg-white/[0.02] border border-white/[0.06]">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        {/* Metrics Grid: Two clean compact mini-cards */}
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          {metricsEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl p-2 px-2.5 bg-white/[0.02] border border-white/[0.06] group-hover:border-white/[0.12] group-hover:bg-white/[0.04] transition-all flex flex-col justify-center min-w-0"
            >
              <div
                className="font-display font-bold text-sm sm:text-[15px] tracking-tight truncate"
                style={{ color: project.color }}
                title={value}
              >
                {value}
              </div>
              <div className="text-text-muted font-mono text-[9.5px] uppercase tracking-wider mt-0.5 truncate">
                {key}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: Dedicated Case Study row */}
        <div className="mt-3.5 pt-2.5 flex items-center justify-between border-t border-white/[0.08] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-text-muted group-hover:text-text-secondary transition-colors">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: project.color }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: project.color }}
              />
            </span>
            <span className="text-[10.5px] tracking-wide">Case Study & Architecture</span>
          </div>

          <span
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold tracking-wider uppercase transition-all duration-300 group-hover:translate-x-1"
            style={{ color: project.color }}
          >
            <span>Explore</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('projects', setActiveSection);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

        {/* Project grid - all projects displayed together directly */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>

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
