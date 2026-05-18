'use client';

import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends Omit<ComponentPropsWithoutRef<typeof motion.div>, 'children'> {
  children: ReactNode;
  glow?: 'blue' | 'orange' | 'teal' | 'none';
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  glow = 'none',
  hover = true,
  onClick,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    blue: 'border-glow-blue',
    orange: 'border-glow-orange',
    teal: 'border border-accent-teal/30 shadow-glow-teal',
    none: 'border border-surface-border',
  };

  return (
    <motion.div
      className={clsx(
        'glass rounded-2xl',
        glowClasses[glow],
        hover && 'transition-all duration-500 hover:bg-white/[0.07] hover:shadow-glass-lg',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Section header component
export function SectionHeader({
  label,
  title,
  subtitle,
  accentColor = 'blue',
}: {
  label: string;
  title: string;
  subtitle?: string;
  accentColor?: 'blue' | 'orange' | 'teal' | 'purple';
}) {
  const accent = {
    blue: 'text-accent-blue',
    orange: 'text-accent-orange',
    teal: 'text-accent-teal',
    purple: 'text-accent-purple',
  };

  return (
    <div className="text-center mb-16 md:mb-24">
      <motion.div
        className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full glass border-surface-border`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={`w-1.5 h-1.5 rounded-full bg-current ${accent[accentColor]} animate-pulse-glow`} />
        <span className={`font-mono text-xs tracking-widest uppercase ${accent[accentColor]}`}>
          {label}
        </span>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h2
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h2>
      </div>

      {subtitle && (
        <motion.p
          className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
