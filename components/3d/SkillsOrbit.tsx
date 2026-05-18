'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { skills } from '@/lib/data';
import { SKILL_CATEGORIES } from '@/lib/constants';

// Central core
function CoreSphere() {
  const mesh = useRef<THREE.Mesh>(null);
  const innerMesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.15;
      mesh.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
    if (innerMesh.current) {
      innerMesh.current.rotation.y = -t * 0.25;
    }
  });

  return (
    <group>
      {/* Outer shell */}
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color="#0a1a40"
          wireframe
          transparent
          opacity={0.4}
          emissive="#4facfe"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Inner glow */}
      <mesh ref={innerMesh}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial
          color="#4facfe"
          emissive="#4facfe"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Halo */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color="#4facfe"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Orbital ring
function OrbitalRing({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <mesh ref={mesh} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.015, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

// Individual skill node
function SkillNode({
  name,
  level,
  color,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  tilt,
}: {
  name: string;
  level: number;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  tilt: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * orbitSpeed + orbitOffset;
    group.current.position.x = Math.cos(t) * orbitRadius;
    group.current.position.y = Math.sin(t) * orbitRadius * Math.sin(tilt);
    group.current.position.z = Math.sin(t) * orbitRadius * Math.cos(tilt);
  });

  const nodeSize = 0.08 + (level / 100) * 0.1;

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[nodeSize, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  const categoryRings = [
    { category: 'frontend', radius: 2.2, tilt: 0.2, speed: 0.25, color: '#4facfe' },
    { category: 'backend', radius: 2.8, tilt: 0.8, speed: 0.2, color: '#00f5d4' },
    { category: 'ai', radius: 3.5, tilt: 1.2, speed: 0.18, color: '#a855f7' },
    { category: 'cloud', radius: 4.0, tilt: 0.5, speed: 0.15, color: '#f77f00' },
    { category: 'database', radius: 4.6, tilt: 1.8, speed: 0.12, color: '#4ade80' },
    { category: 'devops', radius: 5.2, tilt: 2.4, speed: 0.1, color: '#f43f5e' },
  ];

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#4facfe" intensity={2} />
      <pointLight position={[-5, -5, 3]} color="#a855f7" intensity={1} />

      <CoreSphere />

      {categoryRings.map((ring) => (
        <OrbitalRing
          key={ring.category}
          radius={ring.radius}
          tilt={ring.tilt}
          color={ring.color}
        />
      ))}

      {skills.map((skill, i) => {
        const ring = categoryRings.find((r) => r.category === skill.category)!;
        return (
          <SkillNode
            key={skill.name}
            name={skill.name}
            level={skill.level}
            color={ring?.color ?? '#4facfe'}
            orbitRadius={ring?.radius ?? 3}
            orbitSpeed={ring?.speed ?? 0.2}
            orbitOffset={(i / skills.length) * Math.PI * 2}
            tilt={ring?.tilt ?? 0.5}
          />
        );
      })}
    </>
  );
}

export default function SkillsOrbit() {
  return (
    <Canvas
      camera={{ position: [0, 3, 9], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <Scene />
    </Canvas>
  );
}
