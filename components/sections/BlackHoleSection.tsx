'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const PLANETS = [
  {
    name: 'Serenity',
    subtitle: 'Simple Portfolio',
    link: '/simple',
    tagline: 'Clean. Clear. Focused.',
    desc: 'A pristine design that lets the work speak for itself.',
    theme: 'simple' as const,
  },
  {
    name: 'Nexus',
    subtitle: 'Hacker Portfolio',
    link: '/hacker',
    tagline: 'Access Granted.',
    desc: 'Terminal-based immersive cyberpunk interface.',
    theme: 'hacker' as const,
  },
  {
    name: 'Verdania',
    subtitle: 'Garden Portfolio',
    link: '/tree',
    tagline: 'Grow. Breathe. Wonder.',
    desc: 'A living 3D forest you can explore.',
    theme: 'garden' as const,
  },
];

/* ─── Planet ─────────────────────────────────────────────────────────────────── */

type PlanetTheme = 'simple' | 'hacker' | 'garden';

function Planet({ theme, size = 160 }: { theme: PlanetTheme; size?: number }) {
  const cfgs = {
    simple: {
      rotSpeed: 22,
      atmoGlow: '0 0 50px 20px rgba(100,190,255,0.55), 0 0 100px 40px rgba(80,160,240,0.2)',
      ringBorder: 'rgba(190,230,255,0.55)',
      ringGlow:   '0 0 12px 4px rgba(180,225,255,0.45)',
      ringWidth:  Math.round(size * 0.045),
      ringAngle:  'rotateX(74deg)',
      moonColor:  '#d0e8f8',
      moonGlow:   'rgba(180,220,250,0.7)',
      moonOrbit:  13,
      surface: `linear-gradient(90deg,
        #d0ecfa 0%,  #b4d8f0 7%,  #8fc4e8 14%, #6aaede 20%,
        #4898d0 28%, #6aaede 35%, #8fc4e8 42%, #b4d8f0 50%,
        #d8f0fc 57%, #e8f6ff 65%, #cce6f6 72%, #a0ceea 80%,
        #d0ecfa 100%
      )`,
    },
    hacker: {
      rotSpeed: 7,
      atmoGlow: '0 0 50px 20px rgba(0,255,80,0.45), 0 0 100px 40px rgba(0,180,50,0.15)',
      ringBorder: 'rgba(0,255,100,0.65)',
      ringGlow:   '0 0 14px 5px rgba(0,255,100,0.6)',
      ringWidth:  Math.round(size * 0.04),
      ringAngle:  'rotateX(70deg)',
      moonColor:  '',
      moonGlow:   '',
      moonOrbit:  0,
      surface: `linear-gradient(90deg,
        #000c05 0%, #001a09 9%, #002c10 18%, #001a09 28%,
        #000c05 36%, #002418 46%, #001508 55%,
        #000c05 64%, #001a09 73%, #002c10 82%,
        #001a09 91%, #000c05 100%
      )`,
    },
    garden: {
      rotSpeed: 16,
      atmoGlow: '0 0 50px 20px rgba(60,190,100,0.45), 0 0 100px 40px rgba(40,150,80,0.2)',
      ringBorder: 'rgba(150,110,65,0.65)',
      ringGlow:   '0 0 8px 3px rgba(170,130,80,0.35)',
      ringWidth:  Math.round(size * 0.038),
      ringAngle:  'rotateX(73deg)',
      moonColor:  '#4a7030',
      moonGlow:   'rgba(70,110,45,0.6)',
      moonOrbit:  18,
      surface: `linear-gradient(90deg,
        #194019 0%, #2d6a28 5%,  #4878b4 13%, #386230 20%,
        #508840 28%, #1e3c1e 34%, #3e78b0 42%, #386230 50%,
        #285025 57%, #60985c 63%, #38602a 70%,
        #3c72a8 78%, #284520 85%, #194019 100%
      )`,
    },
  };

  const c = cfgs[theme];

  const hexSvg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'>` +
    `<polygon points='30,1 59,16 59,36 30,51 1,36 1,16' fill='none' stroke='rgba(0,255,70,0.22)' stroke-width='0.7'/></svg>`
  );

  return (
    <div style={{ position: 'relative', width: size, height: size }}>

      {/* ── Ring back half ── */}
      <div style={{
        position: 'absolute',
        left:  '-38%', right: '-38%',
        top:   '41%',
        height: size * 0.28,
        borderRadius: '50%',
        border: `${c.ringWidth}px solid ${c.ringBorder}`,
        boxShadow: c.ringGlow,
        transform: c.ringAngle,
        clipPath: 'inset(0 0 50% 0)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* ── Sphere ── */}
      <div style={{
        position: 'relative', width: size, height: size,
        borderRadius: '50%', overflow: 'hidden',
        boxShadow: c.atmoGlow,
        zIndex: 2,
      }}>

        {/* Surface strip — scrolls to simulate rotation */}
        <motion.div
          style={{
            position: 'absolute', width: '300%', height: '100%',
            left: 0, top: 0, background: c.surface,
          }}
          animate={{ x: [0, '-33.33%'] }}
          transition={{ duration: c.rotSpeed, ease: 'linear', repeat: Infinity }}
        />

        {/* Hacker: hex grid overlay */}
        {theme === 'hacker' && (
          <motion.div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url("data:image/svg+xml,${hexSvg}")`,
            backgroundSize: '30px 26px',
            mixBlendMode: 'screen',
          }}
            animate={{ backgroundPositionX: ['0px','30px'], backgroundPositionY: ['0px','26px'] }}
            transition={{ duration: 3.5, ease: 'linear', repeat: Infinity }}
          />
        )}

        {/* Hacker: vertical data-stream lines */}
        {theme === 'hacker' && [...Array(6)].map((_, i) => (
          <motion.div key={i} style={{
            position: 'absolute',
            width: 1, height: '100%',
            left: `${10 + i * 16}%`, top: 0,
            background: `linear-gradient(180deg, transparent, rgba(0,255,70,${0.15 + i * 0.04}) 30%,
              rgba(0,255,120,0.5) 50%, rgba(0,255,70,${0.15+i*0.04}) 70%, transparent)`,
          }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2 + i * 0.25, ease: 'easeInOut', repeat: Infinity, delay: i * 0.15 }}
          />
        ))}

        {/* Simple: cloud bands */}
        {theme === 'simple' && (
          <>
            <motion.div style={{
              position: 'absolute', width: '200%', height: '18%',
              top: '26%', left: 0, filter: 'blur(3px)',
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent,rgba(255,255,255,0.22),transparent)',
            }} animate={{ x: [0, '-50%'] }} transition={{ duration: 32, ease: 'linear', repeat: Infinity }} />
            <motion.div style={{
              position: 'absolute', width: '200%', height: '14%',
              top: '58%', left: 0, filter: 'blur(2px)',
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent,rgba(255,255,255,0.35),transparent)',
            }} animate={{ x: ['-50%', '0%'] }} transition={{ duration: 26, ease: 'linear', repeat: Infinity }} />
            {/* Polar caps */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
              background: 'radial-gradient(ellipse at 50% -10%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.55) 45%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '14%',
              background: 'radial-gradient(ellipse at 50% 115%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 45%, transparent 70%)',
            }} />
          </>
        )}

        {/* Garden: atmosphere wisps */}
        {theme === 'garden' && (
          <div style={{
            position: 'absolute', inset: 0,
            background:
              'radial-gradient(ellipse at 55% 28%, rgba(180,240,200,0.22) 0%, transparent 48%), ' +
              'radial-gradient(ellipse at 25% 65%, rgba(160,230,190,0.16) 0%, transparent 40%)',
          }} />
        )}

        {/* Atmosphere overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: theme === 'hacker'
            ? 'radial-gradient(circle at 30% 30%, transparent 42%, rgba(0,30,10,0.92) 100%)'
            : theme === 'garden'
              ? 'radial-gradient(circle at 32% 28%, transparent 42%, rgba(0,25,10,0.85) 100%)'
              : 'radial-gradient(circle at 32% 28%, transparent 42%, rgba(5,20,45,0.82) 100%)',
          mixBlendMode: 'multiply',
        }} />

        {/* Specular highlight */}
        <div style={{
          position: 'absolute', top: '11%', left: '17%',
          width: '28%', height: '28%',
          borderRadius: '50%', filter: 'blur(4px)',
          background: theme === 'hacker'
            ? 'radial-gradient(circle, rgba(80,255,130,0.35) 0%, rgba(40,200,80,0.12) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)',
        }} />

        {/* Shadow limb */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 74% 72%, rgba(0,0,0,0.82) 0%, transparent 52%)',
        }} />
      </div>

      {/* ── Ring front half ── */}
      <div style={{
        position: 'absolute',
        left: '-38%', right: '-38%',
        top: '41%',
        height: size * 0.28,
        borderRadius: '50%',
        border: `${c.ringWidth}px solid ${c.ringBorder}`,
        boxShadow: c.ringGlow,
        transform: c.ringAngle,
        clipPath: 'inset(50% 0 0 0)',
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* ── Moon ── */}
      {c.moonColor && (
        <motion.div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          marginTop: -(size * 0.085),
          marginLeft: -(size * 0.085),
          width: 0, height: 0, zIndex: 4,
        }}
          animate={{ rotate: 360 }}
          transition={{ duration: c.moonOrbit, ease: 'linear', repeat: Infinity }}
        >
          <div style={{
            position: 'absolute',
            width: size * 0.17, height: size * 0.17,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${c.moonColor}, rgba(0,0,0,0.6))`,
            boxShadow: `0 0 12px 5px ${c.moonGlow}`,
            top: -(size * 0.78),
            left: -(size * 0.085),
          }} />
        </motion.div>
      )}

      {/* Hacker: two orbiting satellites */}
      {theme === 'hacker' && (
        <>
          {[{ dur: 5, dist: 1.1 }, { dur: 7.5, dist: 1.25 }].map((sat, i) => (
            <motion.div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              marginTop: -(size * 0.045),
              marginLeft: -(size * 0.045),
              width: 0, height: 0, zIndex: 4,
            }}
              animate={{ rotate: 360 }}
              transition={{ duration: sat.dur, ease: 'linear', repeat: Infinity }}
            >
              <div style={{
                position: 'absolute',
                width: size * 0.09, height: size * 0.045,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #1a1a2e, #00ff46)',
                boxShadow: '0 0 8px 3px rgba(0,255,70,0.7)',
                top: -(size * sat.dist),
                left: -(size * 0.045),
              }} />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

/* ─── Canvas black hole renderer ────────────────────────────────────────────── */

function useBlackHoleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  active: boolean,
  growing: boolean,
) {
  const rafRef    = useRef<number>(0);
  const starsRef  = useRef<Array<{ x:number; y:number; r:number; br:number; freq:number; ph:number; col:string }>>([]);
  const ptclsRef  = useRef<Array<{ angle:number; radius:number; spd:number; sz:number; col:string; op:number }>>([]);
  const tRef      = useRef(0);
  const growRef   = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Init stars
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 350 }, () => ({
        x: Math.random() * 3000, y: Math.random() * 2000,
        r:  Math.random() * 1.4 + 0.2,
        br: Math.random() * 0.65 + 0.35,
        freq: Math.random() * 2.5 + 0.4,
        ph: Math.random() * Math.PI * 2,
        col: ['#ffffff','#fff5e0','#e8f4ff','#ffeaea'][Math.floor(Math.random()*4)],
      }));
    }

    if (ptclsRef.current.length === 0) {
      ptclsRef.current = Array.from({ length: 120 }, (_, i) => ({
        angle:  (i / 120) * Math.PI * 2 + Math.random() * 0.4,
        radius: 160 + Math.random() * 220,
        spd:    0.0012 + Math.random() * 0.0022,
        sz:     Math.random() * 2.2 + 0.4,
        col: ['#ff8800','#ffcc00','#ff4400','#ff6633','#ffe066'][Math.floor(Math.random()*5)],
        op: Math.random() * 0.75 + 0.25,
      }));
    }

    function render() {
      const w = W(), h = H();
      const cx = w / 2, cy = h / 2;
      if (growing) growRef.current = Math.min(growRef.current + 0.008, 1);
      const t = tRef.current;
      const r = Math.min(w, h) * (0.1 + growRef.current * 0.35);

      // Background
      ctx!.fillStyle = `rgb(0,0,${Math.round(8 * (1 - growRef.current * 0.5))})`;
      ctx!.fillRect(0, 0, w, h);

      // Stars
      starsRef.current.forEach(s => {
        const tw = 0.45 + 0.55 * Math.sin(t * s.freq + s.ph);
        ctx!.globalAlpha = s.br * tw * (1 - growRef.current * 0.6);
        ctx!.fillStyle = s.col;
        ctx!.beginPath();
        ctx!.arc(s.x % w, s.y % h, s.r, 0, Math.PI * 2);
        ctx!.fill();
      });
      ctx!.globalAlpha = 1;

      // Gravitational lensing — warped arcs
      for (let i = 0; i < 14; i++) {
        const ar = r * (2.6 + i * 0.38);
        const op = (14 - i) / 14 * 0.09;
        ctx!.strokeStyle = `rgba(255,225,150,${op})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        for (let j = 0; j <= 120; j++) {
          const a = (j / 120) * Math.PI * 2;
          const warp = 1 + 0.03 * Math.sin(a * 4 + t * 0.4 + i * 0.5);
          const x = cx + Math.cos(a) * ar * warp;
          const y = cy + Math.sin(a) * ar * 0.82 * warp;
          j === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y);
        }
        ctx!.closePath();
        ctx!.stroke();
      }

      // Accretion disk — back (top clipped)
      drawDisk(ctx!, cx, cy, r, t, 'back');

      // Relativistic jets
      [1, -1].forEach(dir => {
        const len = r * 7;
        const wig = Math.sin(t * 1.8 + dir * 1.2) * r * 0.09;
        const g = ctx!.createLinearGradient(cx, cy + dir * r, cx + wig, cy + dir * len);
        g.addColorStop(0,   'rgba(110,190,255,0.75)');
        g.addColorStop(0.25,'rgba(70,130,255,0.4)');
        g.addColorStop(0.65,'rgba(50,90,220,0.12)');
        g.addColorStop(1,   'rgba(30,60,180,0)');
        ctx!.strokeStyle = g;
        ctx!.lineWidth = r * 0.19;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(cx, cy + dir * r);
        ctx!.quadraticCurveTo(cx + wig, cy + dir * len * 0.5, cx + wig * 0.4, cy + dir * len);
        ctx!.stroke();
        // Inner bright core
        ctx!.lineWidth = r * 0.04;
        ctx!.strokeStyle = `rgba(180,220,255,${0.28 + 0.22 * Math.sin(t * 3 + dir)})`;
        ctx!.beginPath();
        ctx!.moveTo(cx, cy + dir * r);
        ctx!.quadraticCurveTo(cx + wig, cy + dir * len * 0.5, cx + wig * 0.4, cy + dir * len);
        ctx!.stroke();
      });

      // Corona / outer dark disk
      const corona = ctx!.createRadialGradient(cx, cy, r * 0.75, cx, cy, r * 3.5);
      corona.addColorStop(0,   `rgba(20,8,0,${0.96 - growRef.current*0.2})`);
      corona.addColorStop(0.35,`rgba(8,2,0,${0.68 - growRef.current*0.1})`);
      corona.addColorStop(1,   'rgba(0,0,0,0)');
      ctx!.fillStyle = corona;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 3.5, 0, Math.PI * 2);
      ctx!.fill();

      // Photon ring
      const phr = ctx!.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.38);
      phr.addColorStop(0,   'rgba(255,240,195,0.98)');
      phr.addColorStop(0.45,'rgba(255,155,55,0.5)');
      phr.addColorStop(1,   'rgba(255,75,15,0)');
      ctx!.fillStyle = phr;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r * 1.38, 0, Math.PI * 2);
      ctx!.arc(cx, cy, r * 0.96, 0, Math.PI * 2, true);
      ctx!.fill();

      // Event horizon
      ctx!.fillStyle = '#000000';
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.fill();

      // Subtle inner shadow
      const ins = ctx!.createRadialGradient(cx - r*0.28, cy - r*0.22, r*0.04, cx, cy, r);
      ins.addColorStop(0, 'rgba(0,0,12,1)');
      ins.addColorStop(1, 'rgba(0,0,0,1)');
      ctx!.fillStyle = ins;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.fill();

      // Accretion disk — front (bottom)
      drawDisk(ctx!, cx, cy, r, t, 'front');

      // Infalling particles
      const ptcls = ptclsRef.current;
      ptcls.forEach(p => {
        p.angle  += p.spd + (r / Math.max(r, p.radius)) * 0.006;
        p.radius -= 0.18;
        if (p.radius < r * 0.9) {
          p.angle  = Math.random() * Math.PI * 2;
          p.radius = 180 + Math.random() * 200;
        }
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.38;
        const prox = Math.max(0, 1 - (p.radius - r) / 200);
        const stretch = 1 + prox * 3.5;
        ctx!.save();
        ctx!.translate(x, y);
        ctx!.rotate(p.angle + Math.PI / 2);
        ctx!.globalAlpha = p.op * (1 - prox * 0.85);
        ctx!.fillStyle = p.col;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, p.sz * stretch, p.sz * 0.45, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      });
      ctx!.globalAlpha = 1;

      tRef.current += 0.016;
      rafRef.current = requestAnimationFrame(render);
    }

    render();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, [active, canvasRef, growing]);
}

function drawDisk(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, t: number, half: 'back' | 'front',
) {
  ctx.save();
  const dA = r * 4.6, dB = r * 0.72;
  ctx.beginPath();
  if (half === 'back')
    ctx.rect(cx - dA - 20, cy - dB * 4, (dA + 20) * 2, dB * 4);
  else
    ctx.rect(cx - dA - 20, cy, (dA + 20) * 2, dB * 4);
  ctx.clip();

  for (let ring = 22; ring >= 0; ring--) {
    const prog = ring / 22;
    const a = r * (1.18 + prog * (4.6 - 1.18));
    const b = r * (0.14 + prog * (0.72 - 0.14));
    const temp = 1 - prog;
    const rc = temp > 0.65 ? 255 : Math.round(80 + 175 * (temp / 0.65));
    const gc = Math.round(140 * Math.max(0, temp * 1.6 - 0.3));
    const bc = Math.round(220 * Math.max(0, temp * 2.2 - 1.1));
    const doppler = 0.7 + 0.65 * Math.sin(t * 0.28);
    const alpha = (1 - prog * 0.7) * (0.12 + prog * 0.08);
    const g = ctx.createLinearGradient(cx - a, cy, cx + a, cy);
    g.addColorStop(0,   `rgba(${rc},${gc},${bc},${alpha * (1 + doppler)})`);
    g.addColorStop(0.38,`rgba(${Math.min(255,rc*1.35)},${Math.min(255,gc*1.35)},${bc},${alpha * 1.6})`);
    g.addColorStop(1,   `rgba(${rc},${gc},${bc},${alpha * (1 - doppler * 0.45)})`);
    ctx.strokeStyle = g;
    ctx.lineWidth = b * 0.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function BlackHoleSection() {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'ambient' | 'consuming' | 'flash' | 'portal'>('ambient');
  const triggeredRef     = useRef(false);

  const { ref: inViewRef, inView } = useInView({ threshold: 0.7, triggerOnce: true });

  useBlackHoleCanvas(canvasRef, true, false);
  useBlackHoleCanvas(overlayCanvasRef, phase === 'consuming' || phase === 'flash', phase === 'consuming');

  const trigger = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setPhase('consuming');
    const totalAnim = 4000;
    setTimeout(() => setPhase('flash'), totalAnim);
    setTimeout(() => setPhase('portal'), totalAnim + 900);
  }, []);

  // Auto-trigger when section scrolls into view
  useEffect(() => {
    if (inView && !triggeredRef.current) {
      const t = setTimeout(trigger, 1800);
      return () => clearTimeout(t);
    }
  }, [inView, trigger]);

  // White dots spiraling into the black hole
  useEffect(() => {
    if (phase !== 'consuming') return;
    const container = document.getElementById('bh-clone-container');
    if (!container) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh / 2;

    const DOT_COUNT = 200;
    const dots: HTMLElement[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < DOT_COUNT; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 3 + 1.2;
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * Math.min(vw, vh) * 0.48;
      const startX = cx + Math.cos(angle) * dist;
      const startY = cy + Math.sin(angle) * dist;

      dot.style.cssText = [
        'position:absolute',
        `left:${startX}px`,
        `top:${startY}px`,
        `width:${size}px`,
        `height:${size}px`,
        'border-radius:50%',
        'background:rgba(255,255,255,0.92)',
        'pointer-events:none',
        'will-change:transform,opacity',
        'opacity:0',
        'transform:translate(-50%,-50%)',
        `box-shadow:0 0 ${size * 2}px ${size * 0.5}px rgba(255,255,255,0.35)`,
      ].join(';');

      container.appendChild(dot);
      dots.push(dot);

      const stagger = Math.random() * 1500;
      const t1 = setTimeout(() => {
        dot.style.transition = 'opacity 0.22s ease-out';
        dot.style.opacity = String(0.5 + Math.random() * 0.5);
        const t2 = setTimeout(() => {
          const dx = cx - startX;
          const dy = cy - startY;
          const dur = (0.6 + Math.random() * 0.9).toFixed(2);
          dot.style.transition = [
            `transform ${dur}s cubic-bezier(0.55,0,1,0.55)`,
            `opacity 0.28s ease-in calc(${dur}s * 0.68)`,
          ].join(',');
          dot.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.05)`;
          dot.style.opacity = '0';
        }, 180 + Math.random() * 450);
        timers.push(t2);
      }, stagger);
      timers.push(t1);
    }

    return () => {
      timers.forEach(clearTimeout);
      dots.forEach(d => d.remove());
    };
  }, [phase]);

  // Reset on bfcache restore (browser back/forward)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setPhase('ambient');
        triggeredRef.current = false;
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  return (
    <>
      {/* ── Ambient section ──────────────────────────────────────── */}
      <section ref={inViewRef} className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Top fade from previous section */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

        <AnimatePresence>
          {phase === 'ambient' && (
            <motion.div
              className="relative z-20 flex flex-col items-center text-center px-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.2 }}
            >
              <motion.p
                className="font-mono text-xs tracking-[0.35em] text-orange-400/70 uppercase mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Singularity Detected
              </motion.p>

              <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-3 leading-tight">
                The Event Horizon
              </h2>
              <p className="text-white/40 text-base md:text-lg max-w-md font-light mb-10">
                Beyond this point, no information escapes.<br />
                Choose your universe.
              </p>

              {/* Auto-trigger pulse — no button needed */}
              <motion.div className="relative flex items-center justify-center mt-6">
                {[1, 2, 3].map(i => (
                  <motion.div key={i}
                    className="absolute rounded-full border border-orange-400/25"
                    style={{ width: i * 52, height: i * 52 }}
                    animate={{ scale: [0.7, 1.6], opacity: [0.5, 0] }}
                    transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                ))}
                <div
                  className="w-3 h-3 rounded-full bg-orange-400/65"
                  style={{ boxShadow: '0 0 14px 5px rgba(255,140,60,0.65)' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Full-screen consuming overlay ────────────────────────── */}
      <AnimatePresence>
        {(phase === 'consuming' || phase === 'flash') && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Full-screen black hole canvas */}
            <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full" />

            {/* Central "mouth" overlay ring */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {[80, 140, 220, 340].map((sz, i) => (
                <motion.div key={i}
                  className="absolute rounded-full border border-orange-400/20"
                  style={{ width: sz, height: sz }}
                  animate={{ scale: [1, 0.6, 1], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>

            {/* Real page sections cloned and spaghettified into the event horizon */}
            <div id="bh-clone-container" className="absolute inset-0 overflow-hidden pointer-events-none" />

            {/* Flash effect */}
            {phase === 'flash' && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, times: [0, 0.3, 1] }}
              />
            )}

            {/* Center text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="font-mono text-xs tracking-[0.4em] text-orange-400/60 uppercase">
                Consuming the website…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Planet portal modal ───────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'portal' && (
          <motion.div
            className="fixed inset-0 z-[110] overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 40%, #03001a, #000000)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* CSS star field */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              {Array.from({ length: 180 }).map((_, i) => (
                <motion.div key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width:  Math.random() * 2 + 0.5,
                    height: Math.random() * 2 + 0.5,
                    left: `${Math.random() * 100}%`,
                    top:  `${Math.random() * 100}%`,
                  }}
                  animate={{ opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.7 + 0.3, Math.random() * 0.2 + 0.1] }}
                  transition={{ duration: Math.random() * 3 + 1.5, repeat: Infinity, delay: Math.random() * 3 }}
                />
              ))}
            </div>

            {/* Nebula glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 35% at 20% 30%, rgba(60,0,120,0.25), transparent),' +
                  'radial-gradient(ellipse 50% 30% at 80% 70%, rgba(0,40,80,0.2), transparent)',
              }}
            />

            {/* Scrollable content layer */}
            <div
              className="absolute inset-0 z-10 overflow-y-auto"
              data-lenis-prevent
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
            <div className="flex flex-col items-center justify-center min-h-full py-6 md:py-12 px-4">

            {/* Header */}
            <motion.div
              className="relative z-10 text-center mb-6 md:mb-14"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-orange-400/70 uppercase mb-2 md:mb-3">
                — Portal Open —
              </p>
              <h2 className="font-display text-2xl md:text-5xl font-black text-white leading-tight">
                Choose Your Universe
              </h2>
              <p className="text-white/35 text-xs md:text-base mt-2 md:mt-3 font-light max-w-lg mx-auto">
                Three worlds. Each designed for a different kind of exploration.
              </p>
            </motion.div>

            {/* Planets */}
            <div className="relative z-10 flex flex-row gap-3 md:gap-12 lg:gap-16 items-start justify-center px-2 md:px-6 w-full">
              {PLANETS.map((planet, i) => (
                <motion.div
                  key={planet.name}
                  initial={{ opacity: 0, y: 60, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.85, delay: 0.4 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center group flex-1 min-w-0"
                >
                  <Link href={planet.link} className="flex flex-col items-center cursor-pointer w-full">
                    {/* Planet float + hover */}
                    <motion.div
                      className="relative"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4 + i * 0.8, ease: 'easeInOut', repeat: Infinity, delay: i * 1.2 }}
                      whileHover={{ scale: 1.08 }}
                    >
                      <Planet theme={planet.theme} size={110} />

                      {/* Hover glow ring under planet */}
                      <motion.div
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full blur-xl pointer-events-none"
                        style={{
                          background: planet.theme === 'simple' ? 'rgba(120,190,255,0.5)'
                            : planet.theme === 'hacker'  ? 'rgba(0,255,80,0.5)'
                            : 'rgba(80,200,100,0.5)',
                        }}
                        animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.7, 1.1, 0.7] }}
                        transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </motion.div>

                    {/* Planet info */}
                    <div className="mt-4 md:mt-10 text-center">
                      <p className="font-mono text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.35em] uppercase mb-0.5 md:mb-1"
                        style={{
                          color: planet.theme === 'simple' ? '#7ab8e8'
                            : planet.theme === 'hacker'  ? '#00ff50'
                            : '#5cb86a',
                        }}
                      >
                        {planet.subtitle}
                      </p>
                      <h3 className="font-display text-base md:text-3xl font-bold text-white mb-0.5 md:mb-1">
                        {planet.name}
                      </h3>
                      <p className="text-white/40 text-[10px] md:text-xs font-mono italic mb-1 md:mb-3">
                        "{planet.tagline}"
                      </p>
                      <p className="text-white/30 text-[10px] md:text-xs hidden md:block max-w-[160px] leading-relaxed mb-5">
                        {planet.desc}
                      </p>

                      {/* Enter button */}
                      <motion.div
                        className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-mono font-semibold border transition-all duration-300
                          group-hover:gap-3"
                        style={{
                          borderColor: planet.theme === 'simple' ? 'rgba(100,180,255,0.45)'
                            : planet.theme === 'hacker'  ? 'rgba(0,255,70,0.45)'
                            : 'rgba(70,190,90,0.45)',
                          color: planet.theme === 'simple' ? '#88c8ff'
                            : planet.theme === 'hacker'  ? '#00ff60'
                            : '#60cc70',
                          background: planet.theme === 'simple' ? 'rgba(60,140,220,0.08)'
                            : planet.theme === 'hacker'  ? 'rgba(0,200,50,0.08)'
                            : 'rgba(50,180,70,0.08)',
                        }}
                      >
                        <span>Enter</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Back / Reset */}
            <motion.button
              className="relative z-10 mt-6 md:mt-14 font-mono text-xs tracking-widest text-white/25 hover:text-white/50 transition-colors uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => { setPhase('ambient'); triggeredRef.current = false; }}
            >
              ← Return to the observable universe
            </motion.button>
            </div>{/* end content wrapper */}
            </div>{/* end scroll wrapper */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
