// Color palette
export const COLORS = {
  bgPrimary: '#070711',
  bgSecondary: '#0d0d1a',
  bgTertiary: '#12122a',
  accentBlue: '#4facfe',
  accentOrange: '#f77f00',
  accentTeal: '#00f5d4',
  accentPurple: '#a855f7',
  silver: '#8892a4',
  metallicLight: '#c0c8d8',
  textPrimary: '#e8eaf6',
  textSecondary: '#9ba8c4',
  textMuted: '#4a5270',
} as const;

// Three.js colors (hex numbers)
export const THREE_COLORS = {
  bgPrimary: 0x070711,
  accentBlue: 0x4facfe,
  accentOrange: 0xf77f00,
  accentTeal: 0x00f5d4,
  accentPurple: 0xa855f7,
  silver: 0x8892a4,
  metallicLight: 0xc0c8d8,
  white: 0xffffff,
  glassBlue: 0x1a2a4a,
} as const;

// Navigation sections
export const SECTIONS = [
  { id: 'hero', label: 'Home', icon: '⬡' },
  { id: 'about', label: 'About', icon: '◈' },
  { id: 'skills', label: 'Skills', icon: '◎' },
  { id: 'projects', label: 'Projects', icon: '◰' },
  { id: 'portfolio-modes', label: 'Modes', icon: '⬢' },
  { id: 'github', label: 'GitHub', icon: '◉' },
  { id: 'timeline', label: 'Education', icon: '🎓' },
  { id: 'testimonials', label: 'Reviews', icon: '◍' },
  { id: 'contact', label: 'Contact', icon: '◆' },
] as const;

// Skill categories
export const SKILL_CATEGORIES = {
  frontend: { color: '#4facfe', label: 'Frontend' },
  backend: { color: '#00f5d4', label: 'Backend' },
  ai: { color: '#a855f7', label: 'AI / ML' },
  cloud: { color: '#f77f00', label: 'Cloud' },
  database: { color: '#4ade80', label: 'Databases' },
  devops: { color: '#f43f5e', label: 'DevOps' },
} as const;

// Easing curves
export const EASINGS = {
  spring: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
  smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
  cinematic: [0.77, 0, 0.175, 1] as [number, number, number, number],
  bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
