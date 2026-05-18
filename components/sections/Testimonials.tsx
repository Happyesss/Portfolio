'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSectionInView } from '@/hooks/useScrollProgress';
import { testimonials } from '@/lib/data';
import { SectionHeader } from '@/components/ui/GlassCard';
import { staggerContainer, scaleIn } from '@/lib/animations';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-accent-orange' : 'text-white/10'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ setActiveSection }: { setActiveSection: (id: string) => void }) {
  const ref = useSectionInView('testimonials', setActiveSection);
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div ref={ref} className="relative section-padding bg-bg-secondary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-orange/30 to-transparent" aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Social Proof"
          title="What People Say"
          subtitle="Perspectives from founders, engineers, and investors I've had the privilege of working with."
          accentColor="orange"
        />

        {/* Featured testimonial */}
        <div className="mb-16">
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="glass-bright rounded-3xl p-8 md:p-12 border"
                style={{ borderColor: `${testimonials[active].color}25` }}
                initial={{ opacity: 0, x: 60, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Quote mark */}
                <div
                  className="text-8xl font-display leading-none mb-4 select-none"
                  style={{ color: `${testimonials[active].color}25` }}
                  aria-hidden="true"
                >
                  "
                </div>

                <StarRating rating={testimonials[active].rating} />

                <blockquote className="text-text-primary text-lg md:text-xl leading-relaxed my-6 font-light">
                  "{testimonials[active].text}"
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
                    style={{ background: `${testimonials[active].color}20`, color: testimonials[active].color, border: `2px solid ${testimonials[active].color}40` }}
                  >
                    {testimonials[active].avatar}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-text-primary">
                      {testimonials[active].name}
                    </div>
                    <div className="text-text-muted text-sm">{testimonials[active].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full glass border border-surface-border text-text-muted hover:text-text-primary hover:border-white/20 transition-all duration-200 flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                ←
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all duration-300 ${
                      active === i ? 'w-6 h-2' : 'w-2 h-2'
                    }`}
                    style={{ background: active === i ? t.color : 'rgba(255,255,255,0.15)' }}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={active === i}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full glass border border-surface-border text-text-muted hover:text-text-primary hover:border-white/20 transition-all duration-200 flex items-center justify-center"
                aria-label="Next testimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial grid — all others */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t, i) => (
            <motion.button
              key={t.id}
              variants={scaleIn}
              className={`glass rounded-2xl p-5 text-left border transition-all duration-300 ${
                active === i ? 'border-opacity-50' : 'border-surface-border'
              }`}
              style={active === i ? { borderColor: `${t.color}40`, background: `${t.color}05` } : {}}
              onClick={() => setActive(i)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-text-primary font-medium text-sm">{t.name}</div>
                  <div className="text-text-muted text-xs">{t.role}</div>
                </div>
              </div>
              <p className="text-text-muted text-xs leading-relaxed line-clamp-3">"{t.text}"</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
