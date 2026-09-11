import { aboutParagraphs, identityCard } from "@/lib/data";

export default function About() {
  return (
    <section id="a-propos" className="border-t border-line px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
        01 — à propos
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium">Profil</h2>
      {aboutParagraphs.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-sm leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
      <dl className="mt-8 divide-y divide-line rounded-card border border-line bg-surface px-5">
        {identityCard.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 py-3.5"
          >
            <dt className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-muted">
              {row.label}
            </dt>
            <dd className="text-right text-sm">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
