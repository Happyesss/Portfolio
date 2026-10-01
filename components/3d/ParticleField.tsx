'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  mouseX?: number;
  mouseY?: number;
}

export default function ParticleField({ count = 1600, mouseX, mouseY }: ParticleFieldProps) {
  const mesh = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorOptions = [
      new THREE.Color('#4facfe'),
      new THREE.Color('#00f5d4'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#8892a4'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Distribute in a spherical cloud
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    return { positions, colors, sizes };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.08,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.elapsedTime * 0.12;
    const mx = mouseX !== undefined ? mouseX : state.pointer.x;
    const my = mouseY !== undefined ? mouseY : state.pointer.y;

    // Hardware-accelerated GPU transformation (zero CPU buffer re-upload overhead)
    mesh.current.rotation.y = time * 0.04 + mx * 0.2;
    mesh.current.rotation.x = Math.sin(time * 0.4) * 0.04 + my * 0.1;
    mesh.current.rotation.z = Math.cos(time * 0.3) * 0.02;
  });

  return <primitive object={new THREE.Points(geometry, material)} ref={mesh} />;
}
