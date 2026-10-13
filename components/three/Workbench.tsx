"use client";

import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneQuality } from "@/hooks/useSceneEligibility";
import type { ThemePalette } from "@/hooks/useThemeColors";
import { CAMERA_ZOOM, type ChoreoState } from "./choreography";
import DataCylinder from "./props/DataCylinder";
import Monitor from "./props/Monitor";

/** Largeur max de la colonne de contenu (doit suivre .reader-content dans globals.css). */
const READER_MAX_WIDTH = 1280;

/** Arcs lumineux entre le moniteur et le cylindre — la « glue full-stack ». */
const CONNECTORS: {
  from: [number, number, number];
  to: [number, number, number];
  lift: number;
  phase: number;
  tint: "accent" | "teal";
}[] = [
  { from: [-0.5, 1.1, 0.3], to: [0.85, 1.15, -0.75], lift: 0.55, phase: 0, tint: "accent" },
  { from: [-0.7, 0.85, -0.05], to: [0.55, 0.95, -0.95], lift: 0.85, phase: 2.1, tint: "teal" },
];

function Connector({
  from,
  to,
  lift,
  phase,
  color,
  choreo,
}: {
  from: [number, number, number];
  to: [number, number, number];
  lift: number;
  phase: number;
  color: THREE.Color;
  choreo: ChoreoState;
}) {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  const geometry = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += lift;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return new THREE.TubeGeometry(curve, 28, 0.013, 6, false);
    // from/to/lift sont des constantes module — géométrie construite une fois
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!material.current) return;
    const pulse = 0.45 + 0.35 * Math.sin(state.clock.elapsedTime * 1.8 + phase);
    material.current.opacity = pulse * (1 - choreo.dim * 0.7);
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial ref={material} color={color} transparent opacity={0.6} />
    </mesh>
  );
}

/**
 * Le diorama « Workbench » — moniteur (web) + cylindre de données (data),
 * reliés par des arcs. La colonne de lecture (ReaderShell) reste du DOM
 * au centre de l'écran. Le diorama danse dans les marges qui l'entourent,
 * chapitre par chapitre.
 */
export default function Workbench({
  palette,
  quality,
  choreo,
}: {
  palette: ThemePalette;
  quality: SceneQuality;
  choreo: ChoreoState;
}) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);

  const colors = useMemo(
    () => ({
      plate: new THREE.Color(palette.surface),
      plateTop: new THREE.Color(palette.surface2),
      accentArc: new THREE.Color(palette.accent).multiplyScalar(1.7),
      tealArc: new THREE.Color(palette.teal).multiplyScalar(1.7),
    }),
    [palette],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // position cible : le centre de la marge entre la colonne et le bord
    const viewportHalf = size.width / 2;
    const columnHalf = Math.min(READER_MAX_WIDTH, size.width) / 2;
    const gutter = viewportHalf - columnHalf;
    let xTarget: number;
    let responsive: number;
    if (size.width < 700) {
      // colonne plein viewport et transparente : diorama derrière
      xTarget = choreo.pos[0] * 0.35;
      responsive = 0.6;
    } else if (gutter < 150) {
      // tablette : à moitié caché derrière le bord de la colonne
      xTarget = (Math.sign(choreo.pos[0]) || 1) * (viewportHalf * 0.72) / CAMERA_ZOOM;
      responsive = 0.75;
    } else {
      const gutterCenter = columnHalf + gutter * 0.52;
      xTarget = choreo.pos[0] * (gutterCenter / CAMERA_ZOOM);
      responsive = Math.min(1, gutter / 420);
    }

    const wobble =
      quality === "full" ? Math.sin(state.clock.elapsedTime * 0.3) * 0.05 : 0;
    easing.damp3(g.position, [xTarget, choreo.pos[1], choreo.pos[2]], 0.55, delta);
    easing.damp(
      g.rotation,
      "y",
      choreo.rotY + wobble + choreo.pointer.x * 0.16,
      0.5,
      delta,
    );
    easing.damp(g.rotation, "x", choreo.pointer.y * 0.05, 0.6, delta);
    const s = choreo.scale * (0.55 + 0.45 * responsive);
    easing.damp3(g.scale, [s, s, s], 0.5, delta);
  });

  return (
    <group ref={group}>
      {quality === "full" && (
        <ContactShadows
          position={[0, -0.42, 0]}
          scale={8}
          blur={2.6}
          opacity={0.4}
          far={3.5}
          frames={1}
        />
      )}
      <Float
        speed={1.1}
        rotationIntensity={0.18}
        floatIntensity={0.4}
        floatingRange={[-0.06, 0.06]}
      >
        {/* socle flottant */}
        <RoundedBox args={[3.6, 0.16, 2.6]} radius={0.06} position={[0, -0.09, 0]}>
          <meshStandardMaterial color={colors.plate} roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[3.3, 0.05, 2.3]} radius={0.025} position={[0, 0.0, 0]}>
          <meshStandardMaterial
            color={colors.plateTop}
            roughness={0.5}
            metalness={0.15}
          />
        </RoundedBox>

        <Monitor palette={palette} choreo={choreo} />
        <DataCylinder palette={palette} choreo={choreo} quality={quality} />

        {CONNECTORS.map((connector) => (
          <Connector
            key={connector.phase}
            from={connector.from}
            to={connector.to}
            lift={connector.lift}
            phase={connector.phase}
            color={connector.tint === "accent" ? colors.accentArc : colors.tealArc}
            choreo={choreo}
          />
        ))}
      </Float>
    </group>
  );
}
