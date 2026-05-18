import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Digital Architect | Full-Stack Engineer & Product Builder',
  description:
    'Building products, systems, and experiences that merge engineering with creativity. Full-stack engineer specializing in AI, cloud infrastructure, and product development.',
  keywords: [
    'software engineer',
    'full-stack developer',
    'AI engineer',
    'product builder',
    'React',
    'Next.js',
    'TypeScript',
    'portfolio',
  ],
  authors: [{ name: 'Digital Architect' }],
  creator: 'Digital Architect',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Digital Architect | Full-Stack Engineer & Product Builder',
    description:
      'Building products, systems, and experiences that merge engineering with creativity.',
    siteName: 'Digital Architect Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Architect | Full-Stack Engineer & Product Builder',
    description:
      'Building products, systems, and experiences that merge engineering with creativity.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070711',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
