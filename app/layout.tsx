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
  title: 'Shashank Kumar Rathour | Software Development Engineer',
  description:
    'Software Development Engineer building scalable products and innovative solutions. Specializing in React, Spring Boot, Redis, Azure, and AI-driven applications.',
  keywords: [
    'Shashank Kumar Rathour',
    'software development engineer',
    'full-stack developer',
    'React developer',
    'Spring Boot',
    'Fairlx',
    'Resumy',
    'Assignme',
    'AKTU Resources',
    'Noida',
    'portfolio',
  ],
  authors: [{ name: 'Shashank Kumar Rathour' }],
  creator: 'Shashank Kumar Rathour',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Shashank Kumar Rathour | Software Development Engineer',
    description:
      'Software Development Engineer building scalable products and innovative solutions that impact millions of users.',
    siteName: 'Shashank Kumar Rathour Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shashank Kumar Rathour | Software Development Engineer',
    description:
      'Software Development Engineer building scalable products and innovative solutions that impact millions of users.',
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
