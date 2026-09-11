"use client";

import { m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useScrollShellRef } from "./ScrollShell";

/** Barre de progression du scroll de la colonne de lecture, bord droit du viewport. */
export default function ScrollProgress() {
  const container = useScrollShellRef();
  const { scrollYProgress } = useScroll({ container });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.4,
  });
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-[40] w-[3px] bg-line/30"
    >
      <m.div
        className="h-full w-full origin-top bg-accent"
        style={{ scaleY: reduced ? scrollYProgress : smooth }}
      />
    </div>
  );
}
