'use client';

import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';
import GlassCard, { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';

const values = [
  {
    icon: '⚡',
    title: 'Speed + Craft',
    description: "I build fast and ship quality. From a viral open-source tool with 3.2M views to enterprise-grade SaaS — speed and craft go hand in hand.",
    color: '#4facfe',
  },
  {
    icon: '🧠',
    title: 'Systems Thinking',
    description: 'Every product decision is rooted in deep technical understanding of LLD/HLD, system design, and product empathy.',
    color: '#a855f7',
  },
  {
    icon: '✦',
    title: 'Creative Engineering',
    description: 'Code is a medium. I use it to craft products that feel inevitable — from Redis-cached APIs to AI-powered resume builders.',
    color: '#00f5d4',
  },
  {
    icon: '🚀',
    title: 'Builder Mentality',
    description: "I build products people actually use — 28K+ users, 3.2M views, 1K+ AI users. I know what it takes to go from 0 to scale.",
    color: '#f77f00',
  },
];

export default function About({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('about', setActiveSection);

  return (
    <div ref={ref} className="relative section-padding bg-bg-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-accent-blue/30" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="About Me"
          title="The Engineer Behind the Code"
          subtitle="SDE, builder, and maker obsessed with creating products that impact millions of users."
          accentColor="blue"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Photo / visual element */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Profile visual */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background shapes */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-teal/10" />
              <div className="absolute inset-0 rounded-3xl border border-surface-border" />

              {/* Avatar placeholder */}
              <div className="absolute inset-8 rounded-2xl glass flex items-center justify-center">
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-teal/20 border-2 border-accent-blue/40 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-4xl font-bold gradient-text-blue">
                      {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                    </span>
                  </div>
                  <p className="font-display font-semibold text-text-primary">{personalInfo.name}</p>
                  <p className="text-text-muted text-sm mt-1">{personalInfo.location}</p>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -right-6 top-12 glass rounded-xl px-3 py-2 border-glow-blue"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚛</span>
                  <div>
                    <div className="text-text-primary font-mono text-xs font-semibold">React / Next.js</div>
                    <div className="text-accent-blue font-mono text-xs">Expert</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-16 glass rounded-xl px-3 py-2 border border-accent-orange/30"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <div>
                    <div className="text-text-primary font-mono text-xs font-semibold">AI / ML</div>
                    <div className="text-accent-orange font-mono text-xs">Advanced</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute right-0 bottom-8 glass rounded-xl px-3 py-2 border border-accent-teal/30"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400">●</span>
                  <span className="text-text-primary font-mono text-xs">Open to work</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Bio content */}
          <motion.div
            variants={staggerContainer(0.1, 0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary text-lg leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted leading-relaxed"
            >
              {personalInfo.bioExtended}
            </motion.p>

            {/* Quick stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { n: '6+', l: 'Years' },
                { n: '2', l: 'Startups' },
                { n: '100K+', l: 'Users' },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-4 text-center border-surface-border">
                  <div className="font-display text-2xl font-bold gradient-text-blue">{s.n}</div>
                  <div className="text-text-muted font-mono text-xs mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="flex gap-3 pt-2">
              {[
                { label: 'GitHub', href: personalInfo.github, icon: '⬡' },
                { label: 'LinkedIn', href: personalInfo.linkedin, icon: '◈' },
                { label: 'Twitter', href: personalInfo.twitter, icon: '◎' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl px-4 py-2.5 text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 border border-surface-border transition-all duration-300 font-mono text-sm flex items-center gap-2"
                >
                  <span>{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Values grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-20"
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((val) => (
            <motion.div key={val.title} variants={fadeInUp}>
              <GlassCard className="p-6 h-full" hover>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${val.color}15`, border: `1px solid ${val.color}30` }}
                >
                  {val.icon}
                </div>
                <h3
                  className="font-display font-semibold text-text-primary mb-2"
                  style={{ color: val.color }}
                >
                  {val.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{val.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
