import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line px-6 pb-12 pt-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
        04 — contact
      </p>
      <a
        href={`mailto:${profile.email}`}
        data-hover
        data-label="écrire"
        className="group mt-5 block font-display text-[clamp(1.9rem,9.5cqw,2.6rem)] font-medium leading-[1.05] transition-colors hover:text-accent focus-visible:text-accent"
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
        Un poste full-stack, mobile ou data à pourvoir à partir de septembre
        2026 ? Parlons-en.
      </p>
      <div className="mt-10 flex flex-col gap-5 border-t border-line pt-6">
        <ul className="flex flex-wrap gap-5 font-mono text-xs uppercase tracking-widest">
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              data-label="github"
              className="text-muted transition-colors hover:text-fg"
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
              className="text-muted transition-colors hover:text-fg"
            >
              linkedin ↗
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              data-hover
              data-label="écrire"
              className="text-muted transition-colors hover:text-fg"
            >
              email
            </a>
          </li>
        </ul>
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
