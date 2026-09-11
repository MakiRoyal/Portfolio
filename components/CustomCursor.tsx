"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIsFinePointer } from "@/hooks/useIsFinePointer";

const RING_LERP = 0.16;
const SCALE_LERP = 0.2;
const HOVER_SCALE = 1.7;
const MAGNET_PULL = 0.3;
const MAGNET_MAX = 8;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Curseur custom magnétique avec label contextuel.
 * Cible les éléments porteurs de [data-hover] (+ [data-label] pour le texte,
 * [data-magnetic] pour l’attraction). Désactivé sur tactile et reduced-motion.
 */
export default function CustomCursor() {
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelWrapRef = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelWrap = labelWrapRef.current;
    if (!dot || !ring || !labelWrap) return;

    document.documentElement.classList.add("has-custom-cursor");

    const s = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      ringX: window.innerWidth / 2,
      ringY: window.innerHeight / 2,
      scale: 1,
      targetScale: 1,
      opacity: 0,
      raf: 0,
    };
    let magnetEl: HTMLElement | null = null;

    const onMouseMove = (event: MouseEvent) => {
      s.x = event.clientX;
      s.y = event.clientY;
      s.opacity = 1;
      if (magnetEl) {
        const rect = magnetEl.getBoundingClientRect();
        const dx = clampValue(
          (event.clientX - (rect.left + rect.width / 2)) * MAGNET_PULL,
          -MAGNET_MAX,
          MAGNET_MAX,
        );
        const dy = clampValue(
          (event.clientY - (rect.top + rect.height / 2)) * MAGNET_PULL,
          -MAGNET_MAX,
          MAGNET_MAX,
        );
        magnetEl.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };

    const onPointerOver = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      const hoverEl = target?.closest<HTMLElement>("[data-hover]") ?? null;
      s.targetScale = hoverEl ? HOVER_SCALE : 1;
      setLabel(hoverEl?.dataset.label ?? "");

      const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (nextMagnet !== magnetEl) {
        if (magnetEl) magnetEl.style.transform = "";
        magnetEl = nextMagnet;
      }
    };

    const onLeaveWindow = () => {
      s.opacity = 0;
    };

    const loop = () => {
      s.ringX += (s.x - s.ringX) * RING_LERP;
      s.ringY += (s.y - s.ringY) * RING_LERP;
      s.scale += (s.targetScale - s.scale) * SCALE_LERP;
      const opacity = `${s.opacity}`;
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
      labelWrap.style.opacity = opacity;
      dot.style.transform = `translate3d(${s.x - 3}px, ${s.y - 3}px, 0)`;
      ring.style.transform = `translate3d(${s.ringX - 18}px, ${s.ringY - 18}px, 0) scale(${s.scale})`;
      labelWrap.style.transform = `translate3d(${s.ringX + 18}px, ${s.ringY + 14}px, 0)`;
      s.raf = requestAnimationFrame(loop);
    };
    s.raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      if (magnetEl) magnetEl.style.transform = "";
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[110]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 will-change-transform"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-fg/40 opacity-0 will-change-transform"
      />
      <div
        ref={labelWrapRef}
        className="absolute left-0 top-0 opacity-0 will-change-transform"
      >
        <AnimatePresence>
          {label && (
            <m.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              className="inline-block whitespace-nowrap rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bg"
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
