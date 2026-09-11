"use client";

import { useEffect, useState } from "react";

export interface ThemePalette {
  bg: string;
  surface: string;
  surface2: string;
  line: string;
  fg: string;
  muted: string;
  accent: string;
  teal: string;
}

function read(): ThemePalette {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return {
    bg: get("--bg"),
    surface: get("--surface"),
    surface2: get("--surface-2"),
    line: get("--line"),
    fg: get("--fg"),
    muted: get("--muted"),
    accent: get("--accent"),
    teal: get("--teal"),
  };
}

/**
 * Lit les tokens CSS du design system pour les injecter dans la scène 3D
 * (fond, brouillard, lumières, émissifs). Se rafraîchit quand data-theme
 * change sur <html> — le konami code (thème PS2) re-skinne donc aussi la 3D.
 */
export function useThemeColors(): ThemePalette | null {
  const [palette, setPalette] = useState<ThemePalette | null>(null);

  useEffect(() => {
    setPalette(read());
    const observer = new MutationObserver(() => setPalette(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return palette;
}
