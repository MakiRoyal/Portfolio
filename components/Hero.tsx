"use client";

import { m } from "framer-motion";
import { useBootComplete } from "@/hooks/useBootComplete";
import { heroMeta, profile } from "@/lib/data";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

export default function Hero() {
  const booted = useBootComplete();

  return (
    <section
      id="top"
      className="relative flex min-h-[100cqh] flex-col justify-center px-6 pb-20 pt-24 lg:px-16"
    >
      <m.div
        className="max-w-xl"
        initial="hidden"
        animate={booted ? "visible" : "hidden"}
        variants={stagger}
      >
        <m.p variants={reveal} className="mb-5 font-mono text-xs text-teal">
          <span className="text-muted">~/mika</span> $ whoami
          <span className="caret ml-2" aria-hidden />
        </m.p>
        <m.h1
          variants={reveal}
          className="hero-name font-display text-[clamp(2.5rem,13cqw,4.6rem)] font-medium leading-[0.95] tracking-tight"
        >
          Mika
          <br />
          Ramanantsoa
        </m.h1>
        <m.p
          variants={reveal}
          className="mt-5 font-display text-[clamp(1.15rem,5.5cqw,1.75rem)] italic leading-snug text-accent"
        >
          développeur full-stack &amp; mobile
        </m.p>
        <m.p variants={reveal} className="mt-5 text-sm leading-relaxed text-muted">
          {profile.tagline}
        </m.p>
        <m.div variants={reveal} className="mt-8 flex flex-wrap items-center gap-3">
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
        </m.div>
        <m.ul
          variants={reveal}
          className="mt-10 flex flex-col gap-1.5 font-mono text-xs text-muted"
        >
          {heroMeta.map((item) => (
            <li key={item}>{`// ${item}`}</li>
          ))}
        </m.ul>
      </m.div>
      <p
        aria-hidden
        className="absolute bottom-5 left-6 font-mono text-[11px] text-muted"
      >
        scroll ↓
      </p>
    </section>
  );
}
