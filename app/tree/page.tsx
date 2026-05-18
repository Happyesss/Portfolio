import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Garden — Tree Animation',
  description: 'An interactive 3D tree animation built with Three.js featuring dynamic lighting and wind simulation.',
};

export default function TreePage() {
  return (
    <iframe
      src="/tree/tree.html"
      title="Tree Animation"
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
