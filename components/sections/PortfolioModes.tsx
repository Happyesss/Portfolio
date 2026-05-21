'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useSectionInView } from '@/hooks/useScrollProgress';

/* ─── Hex SVG pattern for hacker planet ──────────────────────────────────── */
const HEX_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'>` +
  `<polygon points='30,1 59,16 59,36 30,51 1,36 1,16' fill='none' stroke='rgba(0,255,70,0.2)' stroke-width='0.7'/></svg>`
);

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Theme = 'simple' | 'hacker' | 'garden';

interface PlanetCfg {
  rotSpeed:     number;
  atmoGlow:     string;
  ringBorder:   string;
  ringGlow:     string;
  ringAngle:    string;
  ringWidthPct: number;
  moonColor:    string;
  moonGlow:     string;
  moonOrbit:    number;
  surface:      string;
}

/* ─── Planet configs ──────────────────────────────────────────────────────── */
const CONFIGS: Record<Theme, PlanetCfg> = {
  simple: {
    rotSpeed: 22,
    atmoGlow:
      '0 0 55px 22px rgba(100,190,255,0.55), 0 0 110px 45px rgba(80,155,240,0.2)',
    ringBorder:   'rgba(185,225,255,0.55)',
    ringGlow:     '0 0 14px 5px rgba(175,220,255,0.45)',
    ringAngle:    'rotateX(74deg)',
    ringWidthPct: 0.045,
    moonColor:    '#cce4f6',
    moonGlow:     'rgba(175,220,250,0.65)',
    moonOrbit:    13,
    surface: `linear-gradient(90deg,
      #cceaf8 0%,  #b0d6ee 7%,  #8cc2e8 14%, #68aade 20%,
      #4494d0 27%, #68aade 34%, #8cc2e8 41%, #b0d6ee 49%,
      #d4ecfa 56%, #e4f4ff 63%, #c8e4f5 71%, #9ecce8 79%,
      #cceaf8 100%
    )`,
  },
  hacker: {
    rotSpeed: 7,
    atmoGlow:
      '0 0 55px 22px rgba(0,255,80,0.45), 0 0 110px 45px rgba(0,180,50,0.15)',
    ringBorder:   'rgba(0,255,100,0.65)',
    ringGlow:     '0 0 16px 6px rgba(0,255,100,0.55)',
    ringAngle:    'rotateX(70deg)',
    ringWidthPct: 0.04,
    moonColor:    '',
    moonGlow:     '',
    moonOrbit:    0,
    surface: `linear-gradient(90deg,
      #000c04 0%, #001908 8%, #002b0e 18%, #001908 28%,
      #000c04 36%, #002214 45%, #001508 54%,
      #000c04 63%, #001908 72%, #002b0e 81%,
      #001908 91%, #000c04 100%
    )`,
  },
  garden: {
    rotSpeed: 16,
    atmoGlow:
      '0 0 55px 22px rgba(55,188,95,0.45), 0 0 110px 45px rgba(35,148,75,0.2)',
    ringBorder:   'rgba(145,105,60,0.65)',
    ringGlow:     '0 0 10px 4px rgba(165,125,75,0.4)',
    ringAngle:    'rotateX(73deg)',
    ringWidthPct: 0.038,
    moonColor:    '#486c2e',
    moonGlow:     'rgba(65,105,42,0.6)',
    moonOrbit:    18,
    surface: `linear-gradient(90deg,
      #193c19 0%, #2b6826 5%,  #3e74ae 13%, #346028 20%,
      #4c8438 28%, #1c3a1c 34%, #3870ae 42%, #346028 50%,
      #264e22 57%, #5e944e 63%, #346026 70%,
      #3a6ca4 78%, #244220 85%, #193c19 100%
    )`,
  },
};

/* ─── Planet component ──────────────────────────────────────────────────────── */
function Planet({ theme, size = 200 }: { theme: Theme; size?: number }) {
  const c = CONFIGS[theme];
  const rw = Math.round(size * c.ringWidthPct);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>

      {/* Ring back half */}
      <div style={{
        position: 'absolute', left: '-40%', right: '-40%',
        top: '41%', height: size * 0.3,
        borderRadius: '50%',
        border: `${rw}px solid ${c.ringBorder}`,
        boxShadow: c.ringGlow,
        transform: c.ringAngle,
        clipPath: 'inset(0 0 50% 0)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Sphere */}
      <div style={{
        position: 'relative', width: size, height: size,
        borderRadius: '50%', overflow: 'hidden',
        boxShadow: c.atmoGlow, zIndex: 2,
      }}>
        {/* Rolling surface — creates rotation illusion */}
        <motion.div style={{
          position: 'absolute', width: '300%', height: '100%',
          left: 0, top: 0, background: c.surface,
        }}
          animate={{ x: [0, '-33.33%'] }}
          transition={{ duration: c.rotSpeed, ease: 'linear', repeat: Infinity }}
        />

        {/* Simple: cloud bands + polar caps + aurora streaks */}
        {theme === 'simple' && (<>
          <motion.div style={{
            position: 'absolute', width: '200%', height: '17%',
            top: '24%', left: 0, filter: 'blur(4px)',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent,rgba(255,255,255,0.24),transparent)',
          }} animate={{ x: [0, '-50%'] }} transition={{ duration: 34, ease: 'linear', repeat: Infinity }} />
          <motion.div style={{
            position: 'absolute', width: '200%', height: '13%',
            top: '57%', left: 0, filter: 'blur(3px)',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent,rgba(255,255,255,0.38),transparent)',
          }} animate={{ x: ['-50%', '0%'] }} transition={{ duration: 27, ease: 'linear', repeat: Infinity }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '21%',
            background: 'radial-gradient(ellipse at 50% -12%,rgba(255,255,255,0.97) 0%,rgba(240,248,255,0.6) 45%,transparent 72%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%',
            background: 'radial-gradient(ellipse at 50% 118%,rgba(255,255,255,0.9) 0%,rgba(240,248,255,0.5) 45%,transparent 72%)',
          }} />
          {[0.12, 0.45, 0.72].map((pos, i) => (
            <motion.div key={i} style={{
              position: 'absolute', width: '100%', height: 1,
              top: `${pos * 100}%`,
              background: 'linear-gradient(90deg,transparent,rgba(100,220,255,0.18),rgba(160,240,200,0.12),transparent)',
            }} animate={{ opacity: [0, 0.8, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 2.2, ease: 'easeInOut' }} />
          ))}
        </>)}

        {/* Hacker: hex grid + data streams + scanline */}
        {theme === 'hacker' && (<>
          <motion.div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,${HEX_SVG}")`,
            backgroundSize: '28px 24px', mixBlendMode: 'screen',
          }}
            animate={{ backgroundPositionX: ['0px','28px'], backgroundPositionY: ['0px','24px'] }}
            transition={{ duration: 3.2, ease: 'linear', repeat: Infinity }}
          />
          {[9,24,40,56,72,86].map((pct, i) => (
            <motion.div key={i} style={{
              position: 'absolute', width: 1, height: '100%',
              left: `${pct}%`, top: 0,
              background: `linear-gradient(180deg,transparent,rgba(0,255,70,${0.12+i*0.04}) 25%,rgba(0,255,120,0.55) 50%,rgba(0,255,70,${0.12+i*0.04}) 75%,transparent)`,
            }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.1+i*0.22, ease: 'easeInOut', repeat: Infinity, delay: i*0.14 }} />
          ))}
          <motion.div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg,transparent,rgba(0,255,80,0.6),transparent)',
            filter: 'blur(1px)',
          }} animate={{ top: ['-5%', '105%'] }} transition={{ duration: 3, ease: 'linear', repeat: Infinity }} />
        </>)}

        {/* Garden: cloud wisps */}
        {theme === 'garden' && (<>
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'radial-gradient(ellipse at 55% 28%,rgba(180,240,200,0.2) 0%,transparent 46%),' +
              'radial-gradient(ellipse at 26% 64%,rgba(155,230,185,0.14) 0%,transparent 38%)',
          }} />
          <motion.div style={{
            position: 'absolute', width: '200%', height: '10%',
            top: '35%', left: 0, filter: 'blur(5px)',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent,rgba(255,255,255,0.14),transparent)',
          }} animate={{ x: [0, '-50%'] }} transition={{ duration: 38, ease: 'linear', repeat: Infinity }} />
        </>)}

        {/* Atmosphere rim */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: theme === 'hacker'
            ? 'radial-gradient(circle at 30% 28%,transparent 42%,rgba(0,25,8,0.92) 100%)'
            : theme === 'garden'
              ? 'radial-gradient(circle at 30% 28%,transparent 42%,rgba(0,22,8,0.88) 100%)'
              : 'radial-gradient(circle at 30% 28%,transparent 42%,rgba(4,18,42,0.85) 100%)',
          mixBlendMode: 'multiply',
        }} />

        {/* Specular highlight */}
        <div style={{
          position: 'absolute', top: '10%', left: '16%',
          width: '26%', height: '26%',
          borderRadius: '50%', filter: 'blur(5px)',
          background: theme === 'hacker'
            ? 'radial-gradient(circle,rgba(60,255,120,0.38) 0%,rgba(20,200,70,0.12) 42%,transparent 70%)'
            : theme === 'garden'
              ? 'radial-gradient(circle,rgba(120,255,160,0.3) 0%,rgba(60,200,90,0.1) 42%,transparent 70%)'
              : 'radial-gradient(circle,rgba(255,255,255,0.55) 0%,rgba(220,240,255,0.2) 42%,transparent 70%)',
        }} />

        {/* Shadow limb */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 73% 71%,rgba(0,0,0,0.84) 0%,transparent 52%)',
        }} />
      </div>

      {/* Ring front half */}
      <div style={{
        position: 'absolute', left: '-40%', right: '-40%',
        top: '41%', height: size * 0.3,
        borderRadius: '50%',
        border: `${rw}px solid ${c.ringBorder}`,
        boxShadow: c.ringGlow,
        transform: c.ringAngle,
        clipPath: 'inset(50% 0 0 0)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* Moon */}
      {c.moonColor && (
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          marginTop: -(size*0.085), marginLeft: -(size*0.085),
          width: 0, height: 0, zIndex: 4,
        }} animate={{ rotate: 360 }} transition={{ duration: c.moonOrbit, ease: 'linear', repeat: Infinity }}>
          <div style={{
            position: 'absolute', width: size*0.17, height: size*0.17,
            borderRadius: '50%',
            background: `radial-gradient(circle at 34% 30%,${c.moonColor},rgba(0,0,0,0.65))`,
            boxShadow: `0 0 14px 6px ${c.moonGlow}`,
            top: -(size*0.82), left: -(size*0.085),
          }} />
        </motion.div>
      )}

      {/* Hacker satellites */}
      {theme === 'hacker' && [{dur:5,dist:1.15},{dur:7.8,dist:1.3}].map((sat,i) => (
        <motion.div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          marginTop: -(size*0.05), marginLeft: -(size*0.05),
          width: 0, height: 0, zIndex: 4,
        }} animate={{ rotate: i%2===0 ? 360 : -360 }} transition={{ duration: sat.dur, ease: 'linear', repeat: Infinity }}>
          <div style={{
            position: 'absolute', width: size*0.1, height: size*0.04, borderRadius: 3,
            background: 'linear-gradient(90deg,#0d0d1a,#00ff46)',
            boxShadow: '0 0 10px 4px rgba(0,255,70,0.75)',
            top: -(size*sat.dist), left: -(size*0.05),
          }} />
        </motion.div>
      ))}

      {/* Garden second moon */}
      {theme === 'garden' && (
        <motion.div style={{
          position: 'absolute', top: '50%', left: '50%',
          marginTop: -(size*0.055), marginLeft: -(size*0.055),
          width: 0, height: 0, zIndex: 4,
        }} animate={{ rotate: -360 }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }}>
          <div style={{
            position: 'absolute', width: size*0.11, height: size*0.11,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%,#6a5040,rgba(0,0,0,0.7))',
            boxShadow: '0 0 8px 3px rgba(120,90,60,0.4)',
            top: -(size*1.05), left: -(size*0.055),
          }} />
        </motion.div>
      )}
    </div>
  );
}

/* ─── Mode data ─────────────────────────────────────────────────────────────── */
const MODES = [
  {
    name:        'Simple',
    planet:      'Serenity',
    link:        '/simple',
    tagline:     'Clean. Clear. Focused.',
    desc:        'A pristine portfolio stripped to its essentials — letting the work breathe and speak for itself.',
    theme:       'simple' as Theme,
    accentColor: '#88c8ff',
    stats:       ['Minimal UI', 'Fast Load', 'Content First'],
  },
  {
    name:        'Hacker',
    planet:      'Nexus',
    link:        '/hacker',
    tagline:     'Access Granted.',
    desc:        'A terminal-inspired cyberpunk interface with live commands, ASCII art, and immersive interactivity.',
    theme:       'hacker' as Theme,
    accentColor: '#00ff60',
    stats:       ['Terminal UI', 'Interactive', 'Cyberpunk'],
  },
  {
    name:        'Garden',
    planet:      'Verdania',
    link:        '/tree',
    tagline:     'Grow. Breathe. Wonder.',
    desc:        'A living Three.js forest scene — an interactive 3D garden where code and nature coexist.',
    theme:       'garden' as Theme,
    accentColor: '#60cc70',
    stats:       ['3D Scene', 'Three.js', 'Immersive'],
  },
];

/* ─── Section ─────────────────────────────────────────────────────────────── */
export default function PortfolioModes({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const sectionRef = useSectionInView('portfolio-modes', setActiveSection);

  const setRefs = (node: HTMLDivElement | null) => {
    (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    inViewRef(node);
  };

  return (
    <div ref={setRefs} className="relative section-padding bg-bg-primary overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" aria-hidden="true" />

      {/* Background nebula */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#4facfe,transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle,#00ff60,transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.025]"
          style={{ background: 'radial-gradient(circle,#60cc70,transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs tracking-[0.4em] text-accent-blue/70 uppercase mb-4">
            — Portfolio Modes —
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-black text-text-primary mb-4">
            Choose Your Universe
          </h2>
          <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto font-light">
            Three worlds, each crafted for a different kind of explorer.
          </p>
        </motion.div>

        {/* Planet cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {MODES.map((mode, i) => (
            <motion.div key={mode.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Link
                href={mode.link}
                className="block group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="relative flex flex-col items-center text-center rounded-3xl p-8 border border-white/5
                    hover:border-white/15 transition-all duration-500 overflow-hidden cursor-pointer"
                  style={{
                    background: hovered === i
                      ? `radial-gradient(ellipse at 50% 0%,${mode.accentColor}10,transparent 70%)`
                      : 'transparent',
                  }}
                >
                  {/* Planet */}
                  <motion.div
                    className="relative mb-10 mt-4"
                    animate={{ y: [0, -14, 0] }}
                    transition={{ duration: 4 + i * 0.7, ease: 'easeInOut', repeat: Infinity, delay: i * 1.3 }}
                  >
                    <Planet theme={mode.theme} size={190} />
                    {/* Ground glow */}
                    <motion.div
                      className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-36 h-5 rounded-full blur-2xl pointer-events-none"
                      style={{ background: mode.accentColor + '50' }}
                      animate={{ opacity: [0.3, 0.75, 0.3], scaleX: [0.7, 1.15, 0.7] }}
                      transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>

                  {/* Planet name badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: mode.accentColor }} />
                    <p className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: mode.accentColor + 'bb' }}>
                      {mode.planet}
                    </p>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    {mode.name}
                  </h3>
                  <p className="font-mono text-xs italic text-text-muted mb-4">"{mode.tagline}"</p>
                  <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-[240px]">{mode.desc}</p>

                  {/* Stat pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-7">
                    {mode.stats.map(stat => (
                      <span key={stat} className="px-2.5 py-1 rounded-full text-[10px] font-mono border"
                        style={{
                          borderColor: mode.accentColor + '35',
                          color: mode.accentColor + 'aa',
                          background: mode.accentColor + '0d',
                        }}
                      >{stat}</span>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    className="flex items-center gap-2 font-mono text-xs font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{ color: mode.accentColor }}
                  >
                    <span>Explore this universe</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>

                  {/* Corner glows */}
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right,${mode.accentColor}15,transparent 70%)` }} />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at bottom left,${mode.accentColor}10,transparent 70%)` }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
