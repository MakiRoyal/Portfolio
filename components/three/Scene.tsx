"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, invalidate, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { easing } from "maath";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { useScrollShellRef } from "@/components/ScrollShell";
import type { SceneQuality } from "@/hooks/useSceneEligibility";
import { useSectionRanges, type SectionRanges } from "@/hooks/useSectionRanges";
import { useThemeColors, type ThemePalette } from "@/hooks/useThemeColors";
import {
  CAMERA_ZOOM,
  createChoreoState,
  KEYFRAMES,
  lerp,
  smoothstep,
  type ChoreoState,
} from "./choreography";
import Workbench from "./Workbench";

/**
 * Traduit la position de scroll en cibles de chorégraphie (chapitre courant +
 * transition vers le suivant). Tourne en priorité -1 pour que les cibles
 * soient à jour avant les useFrame des composants qui les consomment.
 */
function ChoreoDriver({
  scrollY,
  ranges,
  choreo,
}: {
  scrollY: MotionValue<number>;
  ranges: RefObject<SectionRanges>;
  choreo: ChoreoState;
}) {
  useFrame(() => {
    const r = ranges.current;
    if (!r.ready) return;
    const y = scrollY.get();
    const b = r.boundaries;
    let i = 0;
    while (i < b.length - 1 && y >= b[i + 1]) i += 1;
    const next = i < b.length - 1 ? b[i + 1] : r.end;
    const span = Math.max(1, next - b[i]);
    const t = Math.min(Math.max((y - b[i]) / span, 0), 1);
    // le chapitre « tient » sur 55 % de la section puis transitionne
    const blend = smoothstep(0.55, 1, t);
    const from = KEYFRAMES[i];
    const to = KEYFRAMES[Math.min(i + 1, KEYFRAMES.length - 1)];

    choreo.pos[0] = lerp(from.pos[0], to.pos[0], blend);
    choreo.pos[1] = lerp(from.pos[1], to.pos[1], blend);
    choreo.pos[2] = lerp(from.pos[2], to.pos[2], blend);
    choreo.rotY = lerp(from.rotY, to.rotY, blend);
    choreo.scale = lerp(from.scale, to.scale, blend);
    choreo.dim = lerp(from.dim, to.dim, blend);
    choreo.emphasis[0] = lerp(from.emphasis[0], to.emphasis[0], blend);
    choreo.emphasis[1] = lerp(from.emphasis[1], to.emphasis[1], blend);
  }, -1);
  return null;
}

/** Rig d’éclairage 3 points fait main — aucune HDRI externe, zéro requête. */
function Rig({
  palette,
  choreo,
}: {
  palette: ThemePalette;
  choreo: ChoreoState;
}) {
  const key = useRef<THREE.DirectionalLight>(null);
  const accentLight = useRef<THREE.PointLight>(null);

  const colors = useMemo(
    () => ({
      accent: new THREE.Color(palette.accent),
      teal: new THREE.Color(palette.teal),
    }),
    [palette],
  );

  useFrame((_, delta) => {
    if (key.current) {
      easing.damp(
        key.current,
        "intensity",
        1.15 * (1 - choreo.dim * 0.55),
        0.4,
        delta,
      );
    }
    if (accentLight.current) {
      easing.damp(
        accentLight.current,
        "intensity",
        7 * (1 - choreo.dim * 0.4),
        0.4,
        delta,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight ref={key} position={[4, 7, 5]} intensity={1.15} />
      <pointLight
        ref={accentLight}
        color={colors.accent}
        position={[-3.2, 2.6, -1.6]}
        intensity={7}
        distance={14}
        decay={2}
      />
      <pointLight
        color={colors.teal}
        position={[3.2, 1.6, 2.6]}
        intensity={3.5}
        distance={12}
        decay={2}
      />
    </>
  );
}

/**
 * Le canvas WebGL persistant, fixé derrière tout le contenu.
 * pointer-events: none + aria-hidden : il ne peut ni intercepter un clic
 * ni piéger le focus clavier — le DOM reste la seule surface interactive.
 */
export default function Scene({ quality }: { quality: SceneQuality }) {
  const palette = useThemeColors();
  const container = useScrollShellRef();
  const ranges = useSectionRanges(container);
  const { scrollY } = useScroll({ container });
  const choreo = useMemo(createChoreoState, []);
  const [dpr, setDpr] = useState<number | [number, number]>(
    quality === "full" ? [1, 2] : [1, 1.5],
  );

  // le body devient transparent pendant que la scène est active (globals.css)
  useEffect(() => {
    document.documentElement.dataset.scene = "active";
    return () => {
      delete document.documentElement.dataset.scene;
    };
  }, []);

  // tier lite : frameloop à la demande, invalidé par le scroll uniquement
  useEffect(() => {
    if (quality !== "lite") return;
    invalidate();
    return scrollY.on("change", () => invalidate());
  }, [quality, scrollY]);

  // parallax pointeur (tier full) — même approche fenêtre que CustomCursor
  useEffect(() => {
    if (quality !== "full") return;
    const onMove = (event: PointerEvent) => {
      choreo.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      choreo.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [quality, choreo]);

  // re-rendre après un changement de thème (konami PS2)
  useEffect(() => {
    invalidate();
  }, [palette]);

  if (!palette) return null;

  return (
    <div aria-hidden className="scene-layer">
      <Canvas
        orthographic
        camera={{ position: [7, 6, 7], zoom: CAMERA_ZOOM, near: 0.1, far: 60 }}
        dpr={dpr}
        frameloop={quality === "full" ? "always" : "demand"}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ camera }) => camera.lookAt(0, 0.5, 0)}
      >
        <color attach="background" args={[palette.bg]} />
        <fog attach="fog" args={[palette.bg, 12, 28]} />
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(quality === "full" ? [1, 2] : [1, 1.5])}
        />
        <Suspense fallback={null}>
          <Rig palette={palette} choreo={choreo} />
          <ChoreoDriver scrollY={scrollY} ranges={ranges} choreo={choreo} />
          <Workbench palette={palette} quality={quality} choreo={choreo} />
          {quality === "full" && (
            <EffectComposer multisampling={0}>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={0.65} />
              <Vignette offset={0.22} darkness={0.5} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
