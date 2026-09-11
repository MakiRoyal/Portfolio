import { heroMeta, profile } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100cqh] flex-col justify-center px-6 pb-20 pt-24"
    >
      <p className="mb-5 font-mono text-xs text-teal">
        <span className="text-muted">~/mika</span> $ whoami
        <span className="caret ml-2" aria-hidden />
      </p>
      <h1 className="font-display text-[clamp(2.5rem,13cqw,3.6rem)] font-medium leading-[0.95] tracking-tight">
        Mika
        <br />
        Ramanantsoa
      </h1>
      <p className="mt-5 font-display text-[clamp(1.15rem,5.5cqw,1.5rem)] italic leading-snug text-accent">
        développeur full-stack &amp; mobile
      </p>
      <p className="mt-5 text-sm leading-relaxed text-muted">
        {profile.tagline}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="#projets"
          data-hover
          data-label="voir"
          data-magnetic
          className="btn-primary rounded-full bg-accent px-5 py-3 font-mono text-sm font-medium text-bg"
        >
          voir les projets
        </a>
        <a
          href="#contact"
          data-hover
          data-label="contact"
          data-magnetic
          className="rounded-full border border-line px-5 py-3 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          me contacter
        </a>
      </div>
      <ul className="mt-10 flex flex-col gap-1.5 font-mono text-xs text-muted">
        {heroMeta.map((item) => (
          <li key={item}>{`// ${item}`}</li>
        ))}
      </ul>
      <p
        aria-hidden
        className="absolute bottom-5 left-6 font-mono text-[11px] text-muted"
      >
        scroll ↓
      </p>
    </section>
  );
}
