"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/** Les ids existent déjà dans le DOM (cf. navLinks de lib/data.ts). */
const SECTION_IDS = ["top", "a-propos", "projets", "stack", "contact"];

export interface SectionRanges {
  /** position de scroll (px, dans le conteneur) où chaque chapitre devient courant */
  boundaries: number[];
  /** scroll maximum du conteneur (px) */
  end: number;
  ready: boolean;
}

/**
 * Mesure les offsets des cinq sections dans la colonne de lecture (le
 * conteneur de scroll) pour piloter la chorégraphie 3D. Stocké dans une ref
 * (lu à chaque frame dans useFrame), aucun re-render. Les sections ont pour
 * offsetParent .reader-content (position: relative), donc offsetTop est
 * directement la position dans le contenu scrollé.
 */
export function useSectionRanges(
  container: RefObject<HTMLElement | null>,
): RefObject<SectionRanges> {
  const ranges = useRef<SectionRanges>({
    boundaries: SECTION_IDS.map(() => 0),
    end: 1,
    ready: false,
  });

  useEffect(() => {
    const scroller = container.current;
    if (!scroller) return;
    const measure = () => {
      const anchor = scroller.clientHeight * 0.35;
      ranges.current.boundaries = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        return el ? Math.max(0, el.offsetTop - anchor) : 0;
      });
      ranges.current.end = Math.max(
        1,
        scroller.scrollHeight - scroller.clientHeight,
      );
      ranges.current.ready = true;
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scroller);
    if (scroller.firstElementChild) {
      resizeObserver.observe(scroller.firstElementChild);
    }
    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [container]);

  return ranges;
}
