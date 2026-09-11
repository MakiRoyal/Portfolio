"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneQuality } from "@/hooks/useSceneEligibility";
import type { ThemePalette } from "@/hooks/useThemeColors";
import type { ChoreoState } from "../choreography";

const PARTICLE_COUNT = 90;
const PARTICLE_HEIGHT = 1.7;

/** Le cylindre de données — verre, plateaux type « DB » et flux de particules. */
export default function DataCylinder({
  palette,
  choreo,
  quality,
}: {
  palette: ThemePalette;
  choreo: ChoreoState;
  quality: SceneQuality;
}) {
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const particleMat = useRef<THREE.PointsMaterial>(null);

  const colors = useMemo(
    () => ({
      glass: new THREE.Color(palette.teal).lerp(new THREE.Color("#ffffff"), 0.55),
      platter: new THREE.Color(palette.line),
      platterGlow: new THREE.Color(palette.accent),
      // > 1 pour dépasser le seuil de luminance du bloom
      ring: new THREE.Color(palette.teal).multiplyScalar(1.9),
      particle: new THREE.Color(palette.accent).multiplyScalar(2.1),
    }),
    [palette],
  );

  // flux de particules ascendant (tier full uniquement — coût continu)
  const particles = useMemo(() => {
    if (quality !== "full") return null;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.04 + Math.random() * 0.26;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * PARTICLE_HEIGHT;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      speeds[i] = 0.22 + Math.random() * 0.55;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry, speeds };
  }, [quality]);

  useEffect(() => {
    if (!particles) return;
    return () => particles.geometry.dispose();
  }, [particles]);

  useFrame((state, delta) => {
    const dataEmphasis = choreo.emphasis[1];
    const dimFactor = 1 - choreo.dim * 0.6;

    if (ringA.current) ringA.current.rotation.z += delta * 0.35;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.5;
    if (ringMat.current) {
      ringMat.current.opacity = (0.3 + dataEmphasis * 0.6) * dimFactor;
    }
    if (particles && particleMat.current) {
      particleMat.current.opacity = (0.3 + dataEmphasis * 0.7) * dimFactor;
      const attribute = particles.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      const speedScale = 0.6 + dataEmphasis * 1.1;
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        let y = array[i * 3 + 1] + particles.speeds[i] * speedScale * delta;
        if (y > PARTICLE_HEIGHT) y -= PARTICLE_HEIGHT;
        array[i * 3 + 1] = y;
      }
      attribute.needsUpdate = true;
    }
    void state;
  });

  return (
    <group position={[0.8, 0, -0.55]}>
      {/* plateaux façon base de données */}
      {[0.28, 0.62, 0.96].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.09, 24]} />
          <meshStandardMaterial
            color={colors.platter}
            emissive={colors.platterGlow}
            emissiveIntensity={0.35}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* enveloppe de verre */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 1.06, 32]} />
        {quality === "full" ? (
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            transmission={1}
            thickness={0.5}
            roughness={0.18}
            ior={1.3}
            chromaticAberration={0.03}
            color={colors.glass}
          />
        ) : (
          <meshStandardMaterial
            color={colors.glass}
            transparent
            opacity={0.22}
            roughness={0.2}
          />
        )}
      </mesh>
      {/* anneaux orbitaux */}
      <mesh ref={ringA} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.012, 8, 48]} />
        <meshBasicMaterial
          ref={ringMat}
          color={colors.ring}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh ref={ringB} position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.012, 8, 48]} />
        <meshBasicMaterial color={colors.ring} transparent opacity={0.5} />
      </mesh>
      {/* flux de particules */}
      {particles && (
        <points geometry={particles.geometry}>
          <pointsMaterial
            ref={particleMat}
            color={colors.particle}
            size={0.035}
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
}
