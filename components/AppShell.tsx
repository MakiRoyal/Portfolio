"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * LazyMotion (mode strict) réduit le bundle framer-motion,
 * MotionConfig `reducedMotion="user"` neutralise globalement les
 * animations de transform quand prefers-reduced-motion est actif.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
