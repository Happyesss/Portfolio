'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Navigation from '@/components/ui/Navigation';
import CustomCursor from '@/components/ui/CustomCursor';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import GitHubStats from '@/components/sections/GitHubStats';
import Timeline from '@/components/sections/Timeline';
import PortfolioModes from '@/components/sections/PortfolioModes';
import Contact from '@/components/sections/Contact';
import BlackHoleSection from '@/components/sections/BlackHoleSection';
import SmoothScroll from '@/components/ui/SmoothScroll';

// Lazy-load heavy 3D AI Orb
const AIOrb = dynamic(() => import('@/components/3d/AIOrb'), { ssr: false });

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Simulate minimum loading time for cinematic effect
    const timer = setTimeout(() => setIsLoaded(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoaded={isLoaded} />

      {isLoaded && (
        <>
          <CustomCursor />
          <SmoothScroll>
            <Navigation activeSection={activeSection} />

            <main className="relative">
              {/* Ambient background orbs */}
              <div
                className="orb-ambient w-96 h-96 bg-accent-blue/10"
                style={{ top: '10%', left: '-10%' }}
                aria-hidden="true"
              />
              <div
                className="orb-ambient w-80 h-80 bg-accent-orange/8"
                style={{ top: '40%', right: '-8%' }}
                aria-hidden="true"
              />
              <div
                className="orb-ambient w-64 h-64 bg-accent-teal/8"
                style={{ top: '70%', left: '20%' }}
                aria-hidden="true"
              />

              <section id="hero">
                <Hero setActiveSection={setActiveSection} />
              </section>
              <section id="about">
                <About setActiveSection={setActiveSection} />
              </section>
              <section id="skills">
                <Skills setActiveSection={setActiveSection} />
              </section>
              <section id="projects">
                <Projects setActiveSection={setActiveSection} />
              </section>
              <section id="github">
                <GitHubStats setActiveSection={setActiveSection} />
              </section>
              <section id="timeline">
                <Timeline setActiveSection={setActiveSection} />
              </section>
              <section id="portfolio-modes">
                <PortfolioModes setActiveSection={setActiveSection} />
              </section>
              <section id="contact">
                <Contact setActiveSection={setActiveSection} />
              </section>
              <section id="blackhole">
                <BlackHoleSection />
              </section>
            </main>

            <footer className="py-8 text-center text-text-muted text-sm font-mono border-t border-surface-border">
              <p>
                Built with{' '}
                <span className="gradient-text-blue">precision</span> &{' '}
                <span className="gradient-text-orange">passion</span> — 2026
              </p>
            </footer>
          </SmoothScroll>

          {/* Floating AI assistant */}
          <AIOrb activeSection={activeSection} />
        </>
      )}
    </>
  );
}
