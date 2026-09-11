"use client";

import { useReducedMotion } from "framer-motion";
import { useDragRail } from "@/hooks/useDragRail";
import { useIsFinePointer } from "@/hooks/useIsFinePointer";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

/**
 * Galerie de projets en drag-to-explore horizontal, dans l'écran du téléphone.
 * Sur tactile ou en reduced-motion : scroll horizontal natif + scroll-snap.
 */
export default function ProjectRail() {
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();
  const interactive = fine && !reduced;
  const { viewportRef, trackRef, progressRef } = useDragRail(interactive);

  return (
    <section
      id="projets"
      aria-labelledby="titre-projets"
      className="border-t border-line py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
            02 — travaux sélectionnés
          </p>
          <h2
            id="titre-projets"
            className="mt-3 font-display text-3xl font-medium"
          >
            Projets
          </h2>
        </div>
        {interactive && (
          <p aria-hidden className="font-mono text-[11px] text-muted">
            [ glisser · molette · ← → ]
          </p>
        )}
      </div>

      <div
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-roledescription={interactive ? "carrousel" : undefined}
        aria-label="Galerie de projets — utilisez les flèches gauche et droite pour naviguer"
        data-hover
        data-label="glisser"
        className={
          interactive
            ? "mt-8 cursor-grab overflow-hidden px-6 data-[dragging=true]:cursor-grabbing"
            : "rail-native mt-8 snap-x snap-mandatory overflow-x-auto px-6"
        }
      >
        <div
          ref={trackRef}
          className={`flex w-max gap-4 pb-2 pr-6 ${
            interactive ? "select-none" : ""
          }`}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      {interactive && (
        <div aria-hidden className="mx-6 mt-8 h-px bg-line">
          <div
            ref={progressRef}
            className="h-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      )}
    </section>
  );
}
