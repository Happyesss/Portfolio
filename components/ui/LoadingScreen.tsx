'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoaded: boolean;
}

const PHASES = ['Initializing workspace...', 'Loading 3D environment...', 'Preparing experience...'];

interface ParticleData {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function createParticles() {
  return Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));
}

export default function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [exit, setExit] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    // Show logo after a brief delay
    const logoTimer = setTimeout(() => setShowLogo(true), 300);

    // Animate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 12 + 3;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(prog, 100));
    }, 80);

    // Cycle through phases
    const phaseTimers = PHASES.map((_, i) =>
      setTimeout(() => setPhase(i), i * 1000)
    );

    // Generate particles only on the client after mount
    setParticles(createParticles());

    return () => {
      clearTimeout(logoTimer);
      clearInterval(interval);
      phaseTimers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setExit(true);
    }
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-bg-primary flex flex-col items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Particle background */}
          <div className="absolute inset-0" aria-hidden="true">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-accent-blue/30"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Radial glow */}
          <div
            className="absolute inset-0 bg-gradient-radial from-accent-blue/8 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Grid */}
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

          {/* Logo reveal */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                className="relative z-10 text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Icon mark */}
                <motion.div
                  className="mx-auto mb-6 w-20 h-20 relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: [0.175, 0.885, 0.32, 1.275] }}
                >
                  <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4facfe" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#f77f00" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="40,4 76,22 76,58 40,76 4,58 4,22"
                      fill="none"
                      stroke="url(#logoGrad)"
                      strokeWidth="2"
                    />
                    <polygon
                      points="40,16 64,28 64,52 40,64 16,52 16,28"
                      fill="none"
                      stroke="url(#logoGrad)"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <circle cx="40" cy="40" r="6" fill="url(#logoGrad)" />
                  </svg>
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-accent-blue/30"
                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                </motion.div>

                {/* Name */}
                <div className="overflow-hidden">
                  <motion.h1
                    className="font-display text-4xl font-bold gradient-text-blue tracking-tight"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Digital Architect
                  </motion.h1>
                </div>

                <motion.p
                  className="text-text-muted font-mono text-xs mt-3 tracking-widest uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Loading workspace
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress section */}
          <motion.div
            className="relative z-10 w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: showLogo ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {/* Phase text */}
            <div className="text-center mb-4 h-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase}
                  className="text-text-muted font-mono text-xs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {PHASES[phase]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue via-accent-teal to-accent-blue rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress percentage */}
            <div className="flex justify-between mt-2">
              <span className="text-text-muted font-mono text-xs">
                {Math.round(progress)}%
              </span>
              <span className="text-accent-blue/60 font-mono text-xs">
                v1.0.0
              </span>
            </div>
          </motion.div>

          {/* Corner decorations */}
          {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
            <div key={i} className={`absolute ${pos}`} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d={i < 2 ? (i === 0 ? 'M0,10 L0,0 L10,0' : 'M10,0 L20,0 L20,10') : (i === 2 ? 'M0,10 L0,20 L10,20' : 'M10,20 L20,20 L20,10')}
                  fill="none"
                  stroke="rgba(79,172,254,0.3)"
                  strokeWidth="1"
                />
              </svg>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
