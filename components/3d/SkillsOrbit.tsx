'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { skills as allSkills } from '@/lib/data';
import { SKILL_CATEGORIES } from '@/lib/constants';

type CategoryKey = keyof typeof SKILL_CATEGORIES;
type Skill = (typeof allSkills)[number];

interface SkillsOrbitProps {
  skills?: Skill[];
  activeCategory?: CategoryKey | 'all';
}

interface RingConfig {
  category: CategoryKey;
  radius: number;
  tilt: number;
  speed: number;
  color: string;
}

const CATEGORY_RINGS: RingConfig[] = [
  { category: 'frontend', radius: 1.15, tilt: 0.35, speed: 0.45, color: '#4facfe' },
  { category: 'backend', radius: 1.54, tilt: 0.8, speed: 0.38, color: '#00f5d4' },
  { category: 'ai', radius: 1.93, tilt: 1.1, speed: 0.32, color: '#a855f7' },
  { category: 'cloud', radius: 2.26, tilt: 0.55, speed: 0.28, color: '#f77f00' },
  { category: 'database', radius: 2.59, tilt: 1.6, speed: 0.24, color: '#4ade80' },
  { category: 'devops', radius: 2.92, tilt: 2.1, speed: 0.2, color: '#f43f5e' },
];

function SunCore() {
  const shellRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shellRef.current) {
      shellRef.current.rotation.y = t * 0.2;
      shellRef.current.rotation.x = Math.sin(t * 0.15) * 0.18;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.35;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color="#ffc36a"
          emissive="#ff9f2a"
          emissiveIntensity={1.5}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.68, 2]} />
        <meshStandardMaterial
          color="#1a2140"
          wireframe
          transparent
          opacity={0.4}
          emissive="#4facfe"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshBasicMaterial
          color="#ff9f2a"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({ ring, isActive }: { ring: RingConfig; isActive: boolean }) {
  return (
    <mesh>
      <torusGeometry args={[ring.radius, 0.014, 12, 180]} />
      <meshBasicMaterial
        color={ring.color}
        transparent
        opacity={isActive ? 0.32 : 0.1}
      />
    </mesh>
  );
}

function SkillNode({
  skill,
  ring,
  index,
  total,
  isDimmed,
  showLabel,
}: {
  skill: Skill;
  ring: RingConfig;
  index: number;
  total: number;
  isDimmed: boolean;
  showLabel: boolean;
}) {
  const nodeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const size = 0.035 + (skill.level / 100) * 0.055;
  const baseAngle = useMemo(() => (index / Math.max(total, 1)) * Math.PI * 2, [index, total]);

  useFrame((state) => {
    if (!nodeRef.current) return;
    const angle = baseAngle + state.clock.elapsedTime * ring.speed;
    // torus is in local XY plane — orbit nodes in XY plane too so they sit on the ring
    nodeRef.current.position.x = Math.cos(angle) * ring.radius;
    nodeRef.current.position.y = Math.sin(angle) * ring.radius;
    nodeRef.current.position.z = 0;
  });

  const nodeOpacity = isDimmed && !hovered ? 0.35 : 1;

  return (
    <group ref={nodeRef}>
          <mesh
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            setHovered(false);
          }}
        >
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={hovered ? 1.4 : 0.85}
            metalness={0.6}
            roughness={0.25}
            transparent
            opacity={nodeOpacity}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[size * 1.35, 20, 20]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={hovered ? 0.2 : 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {(hovered || showLabel) && (
          <Html
            center
            distanceFactor={8}
            position={[0, size + 0.22, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div className="glass rounded-md px-2.5 py-1.5 border border-surface-border text-xs text-text-primary min-w-[120px] text-center">
              <div className="font-mono text-[9px] text-text-muted uppercase tracking-wider mb-0.5">
                {SKILL_CATEGORIES[skill.category as CategoryKey]?.label}
              </div>
              <div className="font-semibold text-xs">{skill.name}</div>
              <div className="mt-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${skill.level}%`, background: ring.color, boxShadow: `0 0 6px ${ring.color}88` }}
                />
              </div>
            </div>
          </Html>
        )}
    </group>
  );
}

function Scene({ skills, activeCategory }: { skills: Skill[]; activeCategory: CategoryKey | 'all' }) {
  const skillsToRender = useMemo(() => {
    if (activeCategory === 'all') return skills;
    return skills.filter((skill) => skill.category === activeCategory);
  }, [skills, activeCategory]);

  const grouped = useMemo(() => {
    const initial: Record<CategoryKey, Skill[]> = {
      frontend: [],
      backend: [],
      ai: [],
      cloud: [],
      database: [],
      devops: [],
    };
    skillsToRender.forEach((skill) => {
      const category = skill.category as CategoryKey;
      if (initial[category]) {
        initial[category].push(skill);
      }
    });
    return initial;
  }, [skillsToRender]);

  return (
    <>
      <color attach="background" args={['#070711']} />
      <ambientLight intensity={0.4} color="#ffffff" />
      <pointLight position={[4, 4, 4]} color="#4facfe" intensity={1.8} />
      <pointLight position={[-4, -2.5, 2]} color="#a855f7" intensity={1.2} />
      <directionalLight position={[0, 3, -2.5]} intensity={0.6} color="#ffffff" />

      <Stars radius={14} depth={30} count={900} factor={2.5} saturation={0.15} fade speed={0.4} />

      <SunCore />

      {CATEGORY_RINGS.map((ring) => {
        const isActive = activeCategory === 'all' || activeCategory === ring.category;
        const showLabel = activeCategory !== 'all' && isActive;
        const ringSkills = grouped[ring.category] ?? [];
        return (
          <group key={ring.category} rotation={[ring.tilt, 0, 0]}>
            <OrbitRing ring={ring} isActive={isActive} />
            {ringSkills.map((skill, index) => (
              <SkillNode
                key={skill.name}
                skill={skill}
                ring={ring}
                index={index}
                total={ringSkills.length}
                isDimmed={!isActive}
                showLabel={showLabel}
              />
            ))}
          </group>
        );
      })}
    </>
  );
}

export default function SkillsOrbit({ skills = allSkills, activeCategory = 'all' }: SkillsOrbitProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.35, 5.2], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      aria-hidden="true"
    >
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <Scene skills={skills} activeCategory={activeCategory} />
    </Canvas>
  );
}
