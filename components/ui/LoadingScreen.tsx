'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoaded: boolean;
}

const PHASES = ['Initializing workspace...', 'Loading 3D environment...', 'Preparing experience...'];

interface ParticleData {
  id: number; x: number; y: number;
  size: number; delay: number; duration: number; col: number;
}

function createParticles(): ParticleData[] {
  return Array.from({ length: 65 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5, delay: Math.random() * 3,
    duration: Math.random() * 3 + 2.5, col: i % 3,
  }));
}

export default function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exit, setExit] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    const logoTimer = setTimeout(() => setRevealed(true), 200);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 10 + 4;
      if (prog >= 100) { prog = 100; clearInterval(interval); }
      setProgress(Math.min(prog, 100));
    }, 80);
    const phaseTimers = PHASES.map((_, i) => setTimeout(() => setPhase(i), i * 1000));
    setParticles(createParticles());
    return () => {
      clearTimeout(logoTimer); clearInterval(interval);
      phaseTimers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => { if (isLoaded) setExit(true); }, [isLoaded]);

  // Arc progress maths (270° sweep)
  const R = 68;
  const circ = 2 * Math.PI * R;
  const arcLen = (progress / 100) * circ * 0.75;

  const LETTERS = 'HAPPYESSS'.split('');
  const particleColors = ['#4facfe', '#a855f7', '#f97316'];

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#030509' }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Ambient glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 700, height: 700,
                background: 'radial-gradient(circle, rgba(79,172,254,0.09) 0%, transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 500, height: 500,
                background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)',
                top: '25%', left: '65%',
              }}
              animate={{ scale: [1.1, 0.85, 1.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`, top: `${p.y}%`,
                  width: p.size, height: p.size,
                  background: particleColors[p.col],
                  opacity: 0.35,
                }}
                animate={{ opacity: [0, 0.55, 0], y: [0, -18, 0] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>

          {/* Grid */}
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />

          {/* Main content */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo with circular arc progress */}
                <div className="relative mb-8 flex items-center justify-center" style={{ width: 180, height: 180 }}>
                  {/* Arc ring SVG */}
                  <svg
                    width="180" height="180" viewBox="0 0 180 180"
                    className="absolute inset-0"
                    style={{ transform: 'rotate(135deg)' }}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="loadArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4facfe" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle
                      cx="90" cy="90" r={R} fill="none"
                      stroke="rgba(255,255,255,0.07)" strokeWidth="2"
                      strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
                      strokeLinecap="round"
                    />
                    {/* Progress fill */}
                    <circle
                      cx="90" cy="90" r={R} fill="none"
                      stroke="url(#loadArcGrad)" strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${arcLen} ${circ}`}
                      style={{ filter: 'drop-shadow(0 0 7px rgba(79,172,254,0.85))' }}
                    />
                  </svg>

                  {/* Logo mark */}
                  <motion.div
                    className="relative"
                    style={{ width: 100, height: 100 }}
                    initial={{ scale: 0, rotate: -60 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.175, 0.885, 0.32, 1.275] }}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 48 48" fill="none" width="100" height="100">
                      <defs>
                        <linearGradient id="loadLogoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#4facfe" />
                          <stop offset="55%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <filter id="loadLogoGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      {/* Outer hexagon */}
                      <polygon points="24,2 43,13 43,35 24,46 5,35 5,13"
                        stroke="url(#loadLogoGrad)" strokeWidth="1.5" fill="none" opacity="0.75" />
                      {/* H — left bar */}
                      <rect x="11" y="11" width="7" height="26" rx="2"
                        fill="url(#loadLogoGrad)" filter="url(#loadLogoGlow)" />
                      {/* H — right bar */}
                      <rect x="30" y="11" width="7" height="26" rx="2"
                        fill="url(#loadLogoGrad)" filter="url(#loadLogoGlow)" />
                      {/* H — crossbar */}
                      <rect x="18" y="20" width="12" height="8" rx="2"
                        fill="url(#loadLogoGrad)" filter="url(#loadLogoGlow)" />
                      {/* Hexagon vertex nodes */}
                      <circle cx="24" cy="2" r="2" fill="url(#loadLogoGrad)" />
                      <circle cx="43" cy="13" r="2" fill="url(#loadLogoGrad)" />
                      <circle cx="43" cy="35" r="2" fill="url(#loadLogoGrad)" />
                      <circle cx="24" cy="46" r="2" fill="url(#loadLogoGrad)" />
                      <circle cx="5" cy="35" r="2" fill="url(#loadLogoGrad)" />
                      <circle cx="5" cy="13" r="2" fill="url(#loadLogoGrad)" />
                    </svg>
                    {/* Pulse rings */}
                    {[1, 1.35].map((s, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-blue-400/25"
                        style={{ inset: `-${(s - 1) * 50}%` }}
                        animate={{ opacity: [0.5, 0, 0.5], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2.8, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* HAPPYESSS letter-by-letter */}
                <div className="flex items-end gap-[1px] mb-2" aria-label="Happyesss">
                  {LETTERS.map((letter, i) => (
                    <motion.span
                      key={i}
                      className="font-display font-black text-5xl md:text-6xl tracking-wider select-none"
                      style={{
                        background: 'linear-gradient(135deg,#4facfe 0%,#a855f7 50%,#f97316 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        display: 'inline-block',
                      }}
                      initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.55, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>

                {/* Portfolio subtitle */}
                <motion.p
                  className="font-mono text-xs tracking-[0.5em] text-text-muted uppercase mb-10"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  Portfolio
                </motion.p>

                {/* Progress info */}
                <motion.div
                  className="flex flex-col items-center gap-3 w-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="h-5 text-center">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={phase}
                        className="font-mono text-xs text-text-muted"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {PHASES[phase]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  <div className="w-full rounded-full overflow-hidden" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg,#4facfe,#a855f7,#f97316)',
                        boxShadow: '0 0 8px rgba(79,172,254,0.65)',
                      }}
                      transition={{ duration: 0.12 }}
                    />
                  </div>

                  <div className="flex justify-between w-full">
                    <span className="font-mono text-xs text-text-muted">{Math.round(progress)}%</span>
                    <span className="font-mono text-xs" style={{ color: 'rgba(79,172,254,0.45)' }}>v1.0.0</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner brackets */}
          {(['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'] as const).map((pos, i) => (
            <div key={i} className={`absolute ${pos}`} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22">
                <path
                  d={i === 0 ? 'M0,11 L0,0 L11,0' : i === 1 ? 'M11,0 L22,0 L22,11' : i === 2 ? 'M0,11 L0,22 L11,22' : 'M11,22 L22,22 L22,11'}
                  fill="none" stroke="rgba(79,172,254,0.4)" strokeWidth="1.5"
                />
              </svg>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
