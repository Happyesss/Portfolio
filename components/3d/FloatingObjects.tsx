'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  rotation,
  scale,
  color,
  speed,
  type,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  type: 'icosahedron' | 'octahedron' | 'torusKnot' | 'torus' | 'dodecahedron';
}) {
  const mesh = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    switch (type) {
      case 'icosahedron': return new THREE.IcosahedronGeometry(1, 1);
      case 'octahedron': return new THREE.OctahedronGeometry(1, 0);
      case 'torusKnot': return new THREE.TorusKnotGeometry(0.6, 0.15, 80, 12);
      case 'torus': return new THREE.TorusGeometry(0.8, 0.2, 16, 50);
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1, 0);
      default: return new THREE.IcosahedronGeometry(1, 1);
    }
  }, [type]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * speed;
    mesh.current.rotation.x = rotation[0] + t * 0.3;
    mesh.current.rotation.y = rotation[1] + t * 0.4;
    mesh.current.rotation.z = rotation[2] + t * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      <mesh
        ref={mesh}
        position={position}
        scale={scale}
        geometry={geometry}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.15}
          wireframe={type === 'icosahedron' || type === 'dodecahedron'}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

// Glowing ring
function GlowRing({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={mesh} position={position}>
        <torusGeometry args={[radius, 0.03, 8, 80]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Animated code bracket
function CodeBracket({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
  });
  return (
    <group ref={group} position={position}>
      {/* < bracket */}
      <mesh position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.05, 0.8, 0.05]} />
        <meshStandardMaterial color="#4facfe" emissive="#4facfe" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.15, 0.35, 0]} rotation={[0, 0, 0.8]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#4facfe" emissive="#4facfe" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.15, -0.35, 0]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#4facfe" emissive="#4facfe" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export default function FloatingObjects() {
  const shapes = [
    { position: [-4, 2, -3] as [number,number,number], rotation: [0.3, 0.5, 0] as [number,number,number], scale: 0.9, color: '#4facfe', speed: 0.3, type: 'icosahedron' as const },
    { position: [4, 1.5, -4] as [number,number,number], rotation: [0.1, 0.2, 0.4] as [number,number,number], scale: 0.7, color: '#a855f7', speed: 0.25, type: 'torusKnot' as const },
    { position: [-3, -1.5, -2] as [number,number,number], rotation: [0.5, 0.1, 0.3] as [number,number,number], scale: 0.6, color: '#00f5d4', speed: 0.35, type: 'octahedron' as const },
    { position: [3.5, -2, -3] as [number,number,number], rotation: [0.2, 0.6, 0.1] as [number,number,number], scale: 0.75, color: '#f77f00', speed: 0.2, type: 'dodecahedron' as const },
    { position: [0, 3, -5] as [number,number,number], rotation: [0.4, 0.3, 0.6] as [number,number,number], scale: 0.55, color: '#4ade80', speed: 0.28, type: 'torus' as const },
    { position: [-5, 0, -6] as [number,number,number], rotation: [0.1, 0.5, 0.2] as [number,number,number], scale: 0.65, color: '#f43f5e', speed: 0.22, type: 'icosahedron' as const },
  ];

  return (
    <group>
      {shapes.map((props, i) => (
        <FloatingShape key={i} {...props} />
      ))}

      {/* Glowing rings */}
      <GlowRing position={[-2, 3, -5]} color="#4facfe" radius={1.5} />
      <GlowRing position={[4, -1, -6]} color="#a855f7" radius={1.2} />
      <GlowRing position={[0, -3, -4]} color="#00f5d4" radius={0.8} />

      {/* Code brackets */}
      <CodeBracket position={[2, 2.5, -3]} />
    </group>
  );
}
