import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'H4CK3R_P0RTF0LI0 // SYS.ROOT',
  description: 'Terminal-inspired hacker portfolio with 3D scene, interactive terminal, and immersive experience.',
};

export default function HackerPage() {
  return (
    <iframe
      src="/hacker/Index.html"
      title="Hacker Portfolio"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        zIndex: 9999,
        overflow: 'hidden',
      }}
      allowFullScreen
    />
  );
}
