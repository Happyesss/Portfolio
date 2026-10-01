'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';
import GlassCard, { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';
import profileImage from '@/assets/my.jpeg';

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
            {/* Profile visual - full cover portrait without floating labels */}
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] min-h-[380px] sm:min-h-[460px] max-w-md mx-auto rounded-3xl overflow-hidden glass border border-surface-border shadow-2xl group">
              {/* Ambient backdrop glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent-blue/20 via-accent-purple/15 to-accent-teal/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none" />

              {/* Cover profile image */}
              <Image
                src={profileImage}
                alt={personalInfo.name}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />

              {/* Gradient overlay for bottom text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent pointer-events-none" />

              {/* Name & Location overlay badge */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-surface-border/80 text-text-muted text-xs font-mono mb-2">
                  <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                  {personalInfo.location}
                </div>
                <h3 className="font-display font-bold text-2xl text-text-primary tracking-tight">
                  {personalInfo.name}
                </h3>
                <p className="text-text-secondary text-sm font-mono mt-0.5">
                  Software Development Engineer
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio content */}
          <motion.div
            variants={staggerContainer(0.1, 0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-text-muted text-xs sm:text-sm md:text-base leading-relaxed"
            >
              {personalInfo.bioExtended}
            </motion.p>

            {/* Quick stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4"
            >
              {[
                { n: '4+', l: 'Years Exp' },
                { n: '4M+', l: 'Views' },
                { n: '30K+', l: 'Users' },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-2.5 sm:p-4 text-center border-surface-border">
                  <div className="font-display text-xl sm:text-2xl font-bold gradient-text-blue">{s.n}</div>
                  <div className="text-text-muted font-mono text-[11px] sm:text-xs mt-0.5 sm:mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>

            {/* Social links */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 sm:gap-3 pt-2">
              {[
                { label: 'GitHub', href: personalInfo.github, icon: '⬡' },
                { label: 'LinkedIn', href: personalInfo.linkedin, icon: '◈' },
                { label: 'X (Twitter)', href: personalInfo.twitter, icon: '𝕏' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 border border-surface-border transition-all duration-300 font-mono text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-12 sm:mt-20"
          variants={staggerContainer(0.1, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {values.map((val) => (
            <motion.div key={val.title} variants={fadeInUp}>
              <GlassCard className="p-4 sm:p-6 h-full" hover>
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4"
                  style={{ background: `${val.color}15`, border: `1px solid ${val.color}30` }}
                >
                  {val.icon}
                </div>
                <h3
                  className="font-display font-semibold text-text-primary text-sm sm:text-base mb-1.5 sm:mb-2"
                  style={{ color: val.color }}
                >
                  {val.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">{val.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
