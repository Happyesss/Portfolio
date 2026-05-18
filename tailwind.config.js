/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#070711',
          secondary: '#0d0d1a',
          tertiary: '#12122a',
        },
        accent: {
          blue: '#4facfe',
          'blue-dim': '#2a7fc4',
          orange: '#f77f00',
          'orange-dim': '#c46200',
          teal: '#00f5d4',
          purple: '#a855f7',
        },
        surface: {
          glass: 'rgba(255,255,255,0.04)',
          'glass-hover': 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.08)',
        },
        text: {
          primary: '#e8eaf6',
          secondary: '#9ba8c4',
          muted: '#4a5270',
        },
        silver: '#8892a4',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1.05' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '0.95' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-glow': 'radial-gradient(ellipse at center, rgba(79,172,254,0.15) 0%, transparent 70%)',
        'orange-glow': 'radial-gradient(ellipse at center, rgba(247,127,0,0.15) 0%, transparent 70%)',
        'hero-grid': 'linear-gradient(rgba(79,172,254,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,172,254,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-sm': '40px 40px',
        'grid-md': '60px 60px',
        'grid-lg': '80px 80px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 2s',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'orbit': 'orbit 10s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'cursor-blink': 'blink 1s step-end infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.8s ease-out',
        'meteor': 'meteor 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(79,172,254,0.4), 0 0 60px rgba(79,172,254,0.15)',
        'glow-orange': '0 0 20px rgba(247,127,0,0.4), 0 0 60px rgba(247,127,0,0.15)',
        'glow-teal': '0 0 20px rgba(0,245,212,0.4), 0 0 60px rgba(0,245,212,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'inner-glow': 'inset 0 0 30px rgba(79,172,254,0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'cinematic': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
