import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line px-6 pb-12 pt-16 lg:px-16">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
        <div className="lg:max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
            04 — contact
          </p>
          <a
            href={`mailto:${profile.email}`}
            data-hover
            data-label="écrire"
            className="group mt-5 block font-display text-[clamp(1.9rem,9.5cqw,3.6rem)] font-medium leading-[1.05] transition-colors hover:text-accent focus-visible:text-accent"
          >
            Travaillons ensemble
            <span
              aria-hidden
              className="inline-block text-accent transition-transform duration-300 group-hover:translate-x-2"
            >
              &nbsp;↗
            </span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Un poste full-stack, mobile ou data à pourvoir à partir de
            septembre 2026 ? Parlons-en.
          </p>
        </div>
        <ul className="mt-10 flex flex-wrap gap-5 font-mono text-xs uppercase tracking-widest lg:mt-0 lg:shrink-0 lg:flex-col lg:items-end lg:gap-3">
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              data-label="github"
              className="inline-flex min-h-11 items-center py-2 text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:text-fg focus-visible:underline"
            >
              github ↗
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              data-label="linkedin"
              className="inline-flex min-h-11 items-center py-2 text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:text-fg focus-visible:underline"
            >
              linkedin ↗
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              data-hover
              data-label="écrire"
              className="inline-flex min-h-11 items-center py-2 text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:text-fg focus-visible:underline"
            >
              email
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-10 border-t border-line pt-6">
        <p className="font-mono text-xs text-muted">
          © 2026 {profile.name} — Paris
        </p>
      </div>
      <p
        aria-hidden
        className="mt-6 select-none text-center font-mono text-[10px] tracking-[0.4em] text-muted/40"
      >
        ↑ ↑ ↓ ↓ ← → ← → B A
      </p>
    </footer>
  );
}
