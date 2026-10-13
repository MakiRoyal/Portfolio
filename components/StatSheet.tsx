"use client";

import { m } from "framer-motion";
import { profile, quests, skillCategories } from "@/lib/data";
import type { SkillRank } from "@/lib/types";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RANK_META: Record<SkillRank, { word: string; className: string }> = {
  S: { word: "quotidien", className: "border-accent/50 bg-accent/15 text-accent" },
  A: { word: "confirmé", className: "border-teal/50 bg-teal/10 text-teal" },
  B: { word: "opérationnel", className: "border-line bg-surface-2 text-fg/80" },
  C: { word: "notions", className: "border-line bg-surface-2 text-muted" },
};

/** Compétences façon fiche de personnage RPG — rang (S/A/B/C) plutôt qu'une jauge. */
export default function StatSheet() {
  return (
    <section id="stack" className="border-t border-line px-6 py-16 lg:px-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
        03 — attributs & compétences
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium lg:text-4xl">
        Stack
      </h2>

      <div className="mt-8 lg:flex lg:items-start lg:gap-6">
        <aside className="rounded-card border border-line bg-surface p-5 lg:w-72 lg:shrink-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            fiche de personnage
          </p>
          <p className="mt-3 font-display text-xl">{profile.name}</p>
          <dl className="mt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">classe</dt>
              <dd className="text-right">lead dev full-stack</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">niveau</dt>
              <dd className="text-right">A5 · IIM Digital School</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">guilde</dt>
              <dd className="text-right">Ville de Paris</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">spawn</dt>
              <dd className="text-right">Paris</dd>
            </div>
          </dl>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            quêtes actives
          </p>
          <ul className="mt-3 space-y-2">
            {quests.map((quest) => (
              <li key={quest.label} className="flex items-baseline gap-2 text-sm">
                <span aria-hidden className="text-accent">
                  ◆
                </span>
                <span>
                  {quest.label}{" "}
                  <span className="font-mono text-xs text-muted">
                    — {quest.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-0 lg:flex-1 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-card border border-line bg-surface p-5"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-medium">
                  {category.title}
                </h3>
                <span className="font-mono text-[11px] text-muted">
                  [{category.code}]
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skill.name} className="flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm">{skill.name}</span>
                      {skill.note && (
                        <p className="mt-0.5 font-mono text-[11px] text-teal">
                          {skill.note}
                        </p>
                      )}
                    </div>
                    <m.span
                      aria-label={`Rang ${skill.rank} — ${RANK_META[skill.rank].word}`}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[11px] ${RANK_META[skill.rank].className}`}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.06 * skillIndex,
                        ease: EASE_OUT,
                      }}
                    >
                      <span className="font-display font-semibold">
                        {skill.rank}
                      </span>
                      <span className="opacity-80">{RANK_META[skill.rank].word}</span>
                    </m.span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
