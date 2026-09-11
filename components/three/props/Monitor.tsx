"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ThemePalette } from "@/hooks/useThemeColors";
import type { ChoreoState } from "../choreography";
import {
  ScreenShaderMaterial,
  type ScreenShaderMaterialImpl,
} from "../materials/screenShaderMaterial";

/** Le moniteur CRT — représente le web/full-stack. Porte le shader custom. */
export default function Monitor({
  palette,
  choreo,
}: {
  palette: ThemePalette;
  choreo: ChoreoState;
}) {
  const screenMat = useRef<ScreenShaderMaterialImpl>(null);

  const colors = useMemo(
    () => ({
      body: new THREE.Color(palette.surface2),
      stand: new THREE.Color(palette.line),
      screen: new THREE.Color(palette.accent),
      screenBg: new THREE.Color(palette.bg).lerp(
        new THREE.Color(palette.surface),
        0.6,
      ),
    }),
    [palette],
  );

  useEffect(() => {
    const material = screenMat.current;
    if (!material) return;
    material.uColor.copy(colors.screen);
    material.uBg.copy(colors.screenBg);
  }, [colors]);

  useFrame((_, delta) => {
    const material = screenMat.current;
    if (!material) return;
    material.uTime += delta;
    const target = (0.65 + choreo.emphasis[0] * 0.85) * (1 - choreo.dim * 0.6);
    easing.damp(material, "uIntensity", target, 0.4, delta);
  });

  return (
    <group position={[-0.85, 0, 0.15]} rotation={[0, 0.28, 0]}>
      {/* pied */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.08, 24]} />
        <meshStandardMaterial color={colors.stand} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.14, 0.34, 0.1]} />
        <meshStandardMaterial color={colors.stand} roughness={0.6} />
      </mesh>
      {/* corps */}
      <RoundedBox args={[1.62, 1.08, 0.16]} radius={0.05} position={[0, 0.95, 0]}>
        <meshStandardMaterial
          color={colors.body}
          roughness={0.45}
          metalness={0.25}
        />
      </RoundedBox>
      {/* écran (shader CRT custom) */}
      <mesh position={[0, 0.95, 0.085]}>
        <planeGeometry args={[1.42, 0.88]} />
        <screenShaderMaterial ref={screenMat} key={ScreenShaderMaterial.key} />
      </mesh>
    </group>
  );
}
