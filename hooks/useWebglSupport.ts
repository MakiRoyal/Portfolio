"use client";

import { useEffect, useState } from "react";

let cached: boolean | null = null;

function detect(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}

/**
 * Détecte le support WebGL (ex. désactivé par politique IT sur certains
 * postes). Renvoie false côté serveur et au premier rendu (hydration-safe),
 * puis la valeur réelle — mémorisée au niveau module, elle ne change pas
 * en cours de session.
 */
export function useWebglSupport(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(detect());
  }, []);

  return supported;
}
