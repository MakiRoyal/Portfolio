"use client";

import { useReducedMotion } from "framer-motion";
import { useBootComplete } from "./useBootComplete";
import { useIsFinePointer } from "./useIsFinePointer";
import { useWebglSupport } from "./useWebglSupport";

export type SceneQuality = "full" | "lite";

export interface SceneEligibility {
  /** true → la scène 3D se monte (et son bundle se télécharge) */
  mounted: boolean;
  /** full : desktop/pointeur fin — lite : tactile, allégé */
  quality: SceneQuality;
}

/**
 * Trois niveaux d’expérience :
 * - none  (mounted=false) : reduced-motion ou pas de WebGL → zéro bundle 3D chargé
 * - lite  : tactile/pointeur grossier → scène simplifiée, rendu à la demande
 * - full  : desktop → scène complète, parallax pointeur, postprocessing
 * Le montage attend la fin du boot terminal pour ne pas concurrencer
 * le chargement initial de la page.
 */
export function useSceneEligibility(): SceneEligibility {
  const reduced = useReducedMotion();
  const fine = useIsFinePointer();
  const webgl = useWebglSupport();
  const booted = useBootComplete();

  return {
    mounted: !reduced && webgl && booted,
    quality: fine ? "full" : "lite",
  };
}
