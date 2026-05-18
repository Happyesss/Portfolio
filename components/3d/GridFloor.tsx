'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GridFloorProps {
  size?: number;
  divisions?: number;
}

export default function GridFloor({ size = 40, divisions = 30 }: GridFloorProps) {
  const gridRef = useRef<THREE.GridHelper>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(size, divisions, 0x0d1a2a, 0x0d1a2a);
    const mat = helper.material as THREE.LineBasicMaterial;
    mat.color.set(0x1a3a5c);
    mat.opacity = 0.35;
    mat.transparent = true;
    return helper;
  }, [size, divisions]);

  // Glow plane
  const glowGeometry = useMemo(() => new THREE.PlaneGeometry(size, size), [size]);
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x0a1a2f,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((state) => {
    if (!gridRef.current) return;
    // Subtle pulse on grid lines
    const mat = gridRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group position={[0, -3.5, 0]}>
      <primitive ref={gridRef} object={grid} />
      <mesh ref={glowRef} geometry={glowGeometry} material={glowMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} />

      {/* Horizon glow line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={0x4facfe}
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Center glow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshBasicMaterial
          color={0x4facfe}
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
