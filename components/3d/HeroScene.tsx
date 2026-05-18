'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import FloatingObjects from './FloatingObjects';
import GridFloor from './GridFloor';

// Camera controller that follows mouse
function CameraController({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());

  useFrame(() => {
    // Gentle parallax movement
    targetPos.current.x = mouseX * 1.5;
    targetPos.current.y = mouseY * 0.8;

    camera.position.x += (targetPos.current.x - camera.position.x) * 0.04;
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Ambient animated light
function DynamicLighting({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) {
      light1.current.position.x = mouseX * 8 + Math.sin(t * 0.4) * 3;
      light1.current.position.y = mouseY * 5 + Math.cos(t * 0.3) * 2;
      light1.current.intensity = 1.5 + Math.sin(t * 0.8) * 0.3;
    }
    if (light2.current) {
      light2.current.position.x = -mouseX * 5 + Math.cos(t * 0.35) * 4;
      light2.current.position.y = -mouseY * 3 + Math.sin(t * 0.45) * 3;
      light2.current.intensity = 0.8 + Math.cos(t * 0.6) * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#1a2040" />
      <pointLight ref={light1} position={[5, 5, 3]} color="#4facfe" intensity={1.5} distance={20} />
      <pointLight ref={light2} position={[-5, -3, 2]} color="#a855f7" intensity={0.8} distance={15} />
      <pointLight position={[0, -2, 5]} color="#f77f00" intensity={0.4} distance={12} />
      <directionalLight position={[0, 10, 5]} intensity={0.3} color="#ffffff" />
    </>
  );
}

interface HeroSceneProps {
  mouseX?: number;
  mouseY?: number;
}

export default function HeroScene({ mouseX = 0, mouseY = 0 }: HeroSceneProps) {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <CameraController mouseX={mouseX} mouseY={mouseY} />
        <DynamicLighting mouseX={mouseX} mouseY={mouseY} />

        {/* Star field background */}
        <Stars
          radius={80}
          depth={50}
          count={4000}
          factor={3}
          saturation={0.2}
          fade
          speed={0.6}
        />

        {/* Interactive particles */}
        <ParticleField count={2500} mouseX={mouseX} mouseY={mouseY} />

        {/* Floating 3D objects */}
        <FloatingObjects />

        {/* Grid floor */}
        <GridFloor />

        {/* Environment for reflections */}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
