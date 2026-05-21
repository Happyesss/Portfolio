'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';

const LINKS = [
  {
    key:   'email',
    label: 'Email',
    sub:   personalInfo.email,
    href:  `mailto:${personalInfo.email}`,
    color: '#4facfe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    key:   'linkedin',
    label: 'LinkedIn',
    sub:   'shashank-kumar-rathour',
    href:  personalInfo.linkedin,
    color: '#a855f7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key:   'github',
    label: 'GitHub',
    sub:   'github.com/Happyesss',
    href:  personalInfo.github,
    color: '#00f5d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.93-.62.07-.6.07-.6 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.93.84.09-.66.35-1.1.64-1.35-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.65.7 1.03 1.59 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
      </svg>
    ),
  },
];

export default function Contact({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('contact', setActiveSection);
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(personalInfo.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      ref={ref}
      className="relative py-16 md:py-20 bg-bg-primary overflow-hidden"
    >
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/25 to-transparent" />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(79,172,254,0.06), transparent)',
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.4em] text-accent-blue/60 uppercase mb-2">
              — Get in touch —
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-text-primary leading-tight">
              Let's build something<br className="hidden md:block" /> great together
            </h2>
          </div>

          {/* Availability pill */}
          <div className="flex-shrink-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-500/25 bg-green-500/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-green-400/80 font-mono text-xs tracking-wide">
              Open to opportunities
            </span>
          </div>
        </motion.div>

        {/* Contact pill row */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {LINKS.map((link, i) => (
            <motion.div
              key={link.key}
              className="flex-1"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                onClick={link.key === 'email' ? copyEmail : undefined}
                onMouseEnter={() => setActive(link.key)}
                onMouseLeave={() => setActive(null)}
                className="group relative flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: active === link.key ? link.color + '50' : 'rgba(255,255,255,0.07)',
                  background:  active === link.key ? link.color + '0c' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Sweep glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 50%, ${link.color}18, transparent 60%)`,
                  }}
                  animate={{ opacity: active === link.key ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: link.color + '15',
                    color: link.color,
                    boxShadow: active === link.key ? `0 0 18px ${link.color}40` : 'none',
                  }}
                >
                  {link.icon}
                </div>

                {/* Text */}
                <div className="relative z-10 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-semibold text-sm">{link.label}</span>
                    {link.key === 'email' && (
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span
                            key="copied"
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-green-500/20 text-green-400"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            copied!
                          </motion.span>
                        ) : active === link.key ? (
                          <motion.span
                            key="copy"
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded border text-text-muted"
                            style={{ borderColor: link.color + '40' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            click to copy
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-text-muted truncate mt-0.5">{link.sub}</p>
                </div>

                {/* Arrow */}
                <motion.div
                  className="relative z-10 ml-auto flex-shrink-0"
                  style={{ color: link.color }}
                  animate={{ x: active === link.key ? 2 : 0, opacity: active === link.key ? 1 : 0.3 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </motion.div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          className="mt-8 text-center text-text-muted font-mono text-xs tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Based in Noida, India · available worldwide remotely
        </motion.p>
      </div>
    </div>
  );
}
