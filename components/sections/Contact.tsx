'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { personalInfo } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('contact', setActiveSection);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate async send
    await new Promise((res) => setTimeout(res, 1800));
    setStatus('sent');
  };

  const inputClasses = (field: string) =>
    `w-full bg-white/4 rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 font-sans text-sm border ${
      focused === field
        ? 'border-accent-blue/60 shadow-[0_0_0_3px_rgba(79,172,254,0.1)]'
        : 'border-surface-border hover:border-white/15'
    }`;

  const contactLinks = [
    {
      icon: '✉',
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      color: '#4facfe',
    },
    {
      icon: '⬡',
      label: 'GitHub',
      value: 'github.com/Happyesss',
      href: personalInfo.github,
      color: '#00f5d4',
    },
    {
      icon: '◈',
      label: 'LinkedIn',
      value: 'linkedin.com/in/shashank-kumar-rathour',
      href: personalInfo.linkedin,
      color: '#a855f7',
    },
    {
      icon: '◎',
      label: 'Twitter',
      value: '@shashankrathour',
      href: personalInfo.twitter,
      color: '#f77f00',
    },
  ];

  return (
    <div ref={ref} className="relative section-padding bg-bg-tertiary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />

      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-accent-blue/5 via-transparent to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeader
          label="Contact Portal"
          title="Let's Build Together"
          subtitle="Have a vision you want to turn into reality? I'm always open to interesting projects, startup opportunities, and great conversations."
          accentColor="blue"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Info panel */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInLeft}>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                Available for
              </h3>
              <div className="space-y-2.5">
                {[
                  { icon: '🚀', text: 'Full-time CTO / Lead Engineer roles' },
                  { icon: '🤝', text: 'Technical co-founder partnerships' },
                  { icon: '⚡', text: 'Contract & consulting engagements' },
                  { icon: '🧠', text: 'AI product & architecture consulting' },
                  { icon: '🎓', text: 'Mentorship for early engineers' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                    <span className="text-base">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact links */}
            <motion.div variants={fadeInLeft} className="space-y-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 glass rounded-xl px-4 py-3 border border-surface-border hover:border-opacity-50 transition-all duration-300 group"
                  style={{ '--hover-color': link.color } as React.CSSProperties}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: `${link.color}15`, color: link.color }}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <div className="text-text-muted font-mono text-xs">{link.label}</div>
                    <div className="text-text-primary text-sm group-hover:text-white transition-colors">{link.value}</div>
                  </div>
                  <svg className="w-4 h-4 text-text-muted group-hover:text-text-primary ml-auto transition-all duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              ))}
            </motion.div>

            {/* Response time */}
            <motion.div
              variants={fadeInLeft}
              className="glass rounded-xl p-4 border border-surface-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-text-primary font-medium text-sm">Currently Available</span>
              </div>
              <p className="text-text-muted text-xs leading-relaxed">
                I typically respond within 24 hours. Looking for opportunities starting Q2 2024.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="glass-bright rounded-3xl p-8 border border-surface-border">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-3xl">✓</span>
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
                      Message Received!
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Thanks for reaching out. I'll get back to you within 24 hours.
                    </p>
                    <button
                      className="mt-6 text-accent-blue font-mono text-sm hover:underline"
                      onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-text-secondary font-mono text-xs mb-2 uppercase tracking-wide" htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className={inputClasses('name')}
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary font-mono text-xs mb-2 uppercase tracking-wide" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className={inputClasses('email')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-secondary font-mono text-xs mb-2 uppercase tracking-wide" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused('subject')}
                        onBlur={() => setFocused(null)}
                        className={inputClasses('subject')}
                      />
                    </div>

                    <div>
                      <label className="block text-text-secondary font-mono text-xs mb-2 uppercase tracking-wide" htmlFor="message">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell me about your project, idea, or just say hi..."
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        className={`${inputClasses('message')} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-4 rounded-xl font-semibold text-bg-primary transition-all duration-300 disabled:opacity-70 relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #4facfe, #00f5d4)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Send Message
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </span>
                      )}
                    </motion.button>

                    <p className="text-text-muted font-mono text-xs text-center">
                      No spam. No cold calls. Just great conversations.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
