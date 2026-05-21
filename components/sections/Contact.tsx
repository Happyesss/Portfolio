'use client';

import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

const GithubIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.93-.62.07-.6.07-.6 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.93.84.09-.66.35-1.1.64-1.35-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.65.7 1.03 1.59 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default function Contact({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('contact', setActiveSection);

  const contactLinks = [
    {
      icon: <MailIcon />,
      title: 'Email',
      label: 'Drop a line',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      color: '#4facfe',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: <LinkedinIcon />,
      title: 'LinkedIn',
      label: "Let's connect",
      value: 'shashank-kumar-rathour',
      href: personalInfo.linkedin,
      color: '#a855f7',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: <GithubIcon />,
      title: 'GitHub',
      label: 'Check my code',
      value: 'github.com/Happyesss',
      href: personalInfo.github,
      color: '#00f5d4',
      gradient: 'from-teal-500/20 to-emerald-500/20',
    },
  ];

  return (
    <div ref={ref} className="relative section-padding bg-bg-tertiary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-radial from-accent-blue/5 via-transparent to-transparent" aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader
          label="Contact Portal"
          title="Let's Build Together"
          subtitle="Have a vision you want to turn into reality? I'm always open to interesting projects, startup opportunities, and great conversations."
          accentColor="blue"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {contactLinks.map((link) => (
            <motion.a
              key={link.title}
              variants={fadeInUp}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="relative group block h-full focus:outline-none"
            >
              {/* Animated glow on hover */}
              <div 
                className={`absolute -inset-0.5 bg-gradient-to-br ${link.gradient} rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 will-change-transform`} 
              />
              
              <div className="relative h-full glass-bright rounded-2xl p-8 border border-surface-border/50 group-hover:border-transparent transition-all duration-300 overflow-hidden flex flex-col items-center text-center">
                {/* Background accent layer */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${link.color}, transparent 80%)` }}
                />

                <div 
                  className="w-20 h-20 mb-8 rounded-2xl flex items-center justify-center shadow-inner transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 relative z-10 border border-white/5"
                  style={{ 
                    background: `linear-gradient(135deg, ${link.color}15, ${link.color}05)`, 
                    color: link.color,
                    boxShadow: `0 8px 32px -8px ${link.color}40`,
                  }}
                >
                  <span className="relative z-10">{link.icon}</span>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="font-display text-2xl font-bold text-text-primary mb-2 group-hover:text-white transition-colors relative z-10">
                  {link.title}
                </h3>
                <p className="text-text-secondary text-sm mb-6 relative z-10">
                  {link.label}
                </p>
                
                {/* Email / Username value inside a pill */}
                <div className="mt-auto px-4 py-2 w-full truncate rounded-full border border-surface-border bg-white/[0.02] text-text-muted font-mono text-xs group-hover:text-white group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all duration-300 relative z-10">
                  {link.value}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Global availability signal */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.6 }}
           className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full border border-surface-border hover:border-white/20 transition-colors cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-text-secondary font-mono text-sm tracking-wide">
              Currently open to new opportunities
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
