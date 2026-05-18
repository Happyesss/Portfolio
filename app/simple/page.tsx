import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shashank Kumar Rathour — Software Development Engineer',
  description: 'Clean, minimal portfolio focused on content clarity. Software Development Engineer building scalable products.',
};

export default function SimplePage() {
  return (
    <iframe
      src="/simple/index.html"
      title="Simple Portfolio"
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
