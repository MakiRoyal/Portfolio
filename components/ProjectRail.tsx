import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

/** Galerie de projets en scroll horizontal natif + scroll-snap. */
export default function ProjectRail() {
  return (
    <section
      id="projets"
      aria-labelledby="titre-projets"
      className="border-t border-line py-16"
    >
      <div className="px-6">
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

      <div
        role="region"
        aria-label="Galerie de projets"
        className="rail-native mt-8 snap-x snap-mandatory overflow-x-auto px-6"
      >
        <div className="flex w-max gap-4 pb-2 pr-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
