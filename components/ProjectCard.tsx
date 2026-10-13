import type { Project } from "@/lib/types";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accentText = project.accent === "teal" ? "text-teal" : "text-accent";
  const accentGlow = project.accent === "teal" ? "bg-teal/10" : "bg-accent/10";

  return (
    <article className="flex w-[min(82cqw,340px)] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative flex aspect-[16/9] select-none items-end justify-between overflow-hidden border-b border-line bg-surface-2 p-4">
        <div
          aria-hidden
          className={`absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${accentGlow}`}
        />
        <span
          aria-hidden
          className={`font-display text-[4.5rem] font-medium leading-none opacity-15 ${accentText}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[11px] text-muted">{project.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-medium">{project.title}</h3>
        <p className={`mt-1 font-mono text-xs ${accentText}`}>
          {project.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-fg/80"
            >
              {tech}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[11px] text-muted">{project.role}</p>
        <div className="mt-auto flex gap-4 pt-4">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              data-label="github"
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline"
            >
              code ↗
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              data-label="démo"
              className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-widest underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:text-accent focus-visible:underline"
            >
              démo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
