"use client";

import { useEffect, useRef } from "react";

const LERP = 0.09;
const FRICTION = 0.94;
const DRAG_CLICK_THRESHOLD = 6;
const FOCUS_MARGIN = 24;

/**
 * Galerie horizontale drag-to-explore avec inertie (pointer events + lerp),
 * molette/trackpad et navigation clavier (← → Home End).
 * Quand `enabled` est false, ne fait rien : le conteneur garde son
 * comportement de scroll natif (mobile/tactile, prefers-reduced-motion).
 */
export function useDragRail(enabled: boolean) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!enabled || !viewport || !track) return;

    const s = {
      current: 0,
      target: 0,
      velocity: 0,
      max: 0,
      dragging: false,
      startX: 0,
      startTarget: 0,
      lastX: 0,
      moved: 0,
      raf: 0,
    };

    const clamp = (value: number) => Math.min(Math.max(value, 0), s.max);

    const measure = () => {
      s.max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      s.target = clamp(s.target);
    };

    const onPointerDown = (event: PointerEvent) => {
      s.dragging = true;
      s.startX = event.clientX;
      s.lastX = event.clientX;
      s.startTarget = s.target;
      s.velocity = 0;
      s.moved = 0;
      viewport.setPointerCapture(event.pointerId);
      viewport.dataset.dragging = "true";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!s.dragging) return;
      const dx = event.clientX - s.startX;
      s.moved = Math.max(s.moved, Math.abs(dx));
      s.target = clamp(s.startTarget - dx);
      s.velocity = s.velocity * 0.75 + (s.lastX - event.clientX) * 0.6;
      s.lastX = event.clientX;
    };

    const endDrag = () => {
      if (!s.dragging) return;
      s.dragging = false;
      delete viewport.dataset.dragging;
    };

    // Après un vrai drag, on avale le clic pour ne pas suivre un lien par accident.
    const onClickCapture = (event: MouseEvent) => {
      if (s.moved > DRAG_CLICK_THRESHOLD) {
        event.preventDefault();
        event.stopPropagation();
      }
      s.moved = 0;
    };

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const atStart = s.target <= 0.5;
      const atEnd = s.target >= s.max - 0.5;
      // Aux extrémités, on laisse la page scroller verticalement.
      if ((delta > 0 && !atEnd) || (delta < 0 && !atStart)) {
        event.preventDefault();
        s.velocity = 0;
        s.target = clamp(s.target + delta);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step = viewport.clientWidth * 0.55;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        s.velocity = 0;
        s.target = clamp(s.target + step);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        s.velocity = 0;
        s.target = clamp(s.target - step);
      } else if (event.key === "Home") {
        event.preventDefault();
        s.velocity = 0;
        s.target = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        s.velocity = 0;
        s.target = s.max;
      }
    };

    // Navigation Tab : ramène la carte focusée dans la zone visible.
    const onFocusIn = (event: FocusEvent) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-rail-item]",
      );
      if (!item) return;
      const left = item.offsetLeft;
      const right = left + item.offsetWidth;
      const viewLeft = s.target;
      const viewRight = s.target + viewport.clientWidth;
      if (left < viewLeft + FOCUS_MARGIN) {
        s.target = clamp(left - FOCUS_MARGIN);
      } else if (right > viewRight - FOCUS_MARGIN) {
        s.target = clamp(right - viewport.clientWidth + FOCUS_MARGIN);
      }
    };

    const loop = () => {
      if (!s.dragging && s.velocity !== 0) {
        s.target = clamp(s.target + s.velocity);
        s.velocity *= FRICTION;
        if (
          Math.abs(s.velocity) < 0.08 ||
          s.target === 0 ||
          s.target === s.max
        ) {
          s.velocity = 0;
        }
      }
      s.current += (s.target - s.current) * LERP;
      if (Math.abs(s.target - s.current) < 0.05) s.current = s.target;
      track.style.transform = `translate3d(${-s.current}px, 0, 0)`;
      if (progressRef.current && s.max > 0) {
        progressRef.current.style.transform = `scaleX(${s.current / s.max})`;
      }
      s.raf = requestAnimationFrame(loop);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("keydown", onKeyDown);
    viewport.addEventListener("focusin", onFocusIn);
    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      resizeObserver.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("keydown", onKeyDown);
      viewport.removeEventListener("focusin", onFocusIn);
      track.style.transform = "";
      delete viewport.dataset.dragging;
      if (progressRef.current) progressRef.current.style.transform = "";
    };
  }, [enabled]);

  return { viewportRef, trackRef, progressRef };
}
