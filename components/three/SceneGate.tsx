"use client";

import dynamic from "next/dynamic";
import { useSceneEligibility } from "@/hooks/useSceneEligibility";

/**
 * Import dynamique sans SSR : le bundle three/fiber/drei n'est téléchargé
 * que si la scène est réellement éligible — un visiteur en reduced-motion
 * ou sans WebGL ne charge jamais un octet de 3D.
 */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneGate() {
  const { mounted, quality } = useSceneEligibility();
  if (!mounted) return null;
  return <Scene quality={quality} />;
}
