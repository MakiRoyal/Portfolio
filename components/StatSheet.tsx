"use client";

import { m } from "framer-motion";
import { profile, quests, skillCategories } from "@/lib/data";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Compétences façon fiche de personnage RPG, barres animées à l’entrée dans le viewport. */
export default function StatSheet() {
  return (
    <section id="stack" className="border-t border-line px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal">
        03 — attributs & compétences
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium">Stack</h2>

      <div className="mt-8 grid gap-5">
        <aside className="rounded-card border border-line bg-surface p-5">
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

        {skillCategories.map((category, categoryIndex) => (
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
            <ul className="mt-4 space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <li key={skill.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm">{skill.name}</span>
                    <span className="font-mono text-xs tabular-nums text-muted">
                      {skill.level}
                      <span className="opacity-60">/100</span>
                    </span>
                  </div>
                  {skill.note && (
                    <p className="mt-0.5 font-mono text-[11px] text-teal">
                      {skill.note}
                    </p>
                  )}
                  <div
                    role="meter"
                    aria-label={`${skill.name} : ${skill.level} sur 100`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={skill.level}
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
                  >
                    <m.div
                      className={`h-full origin-left rounded-full ${
                        categoryIndex % 2 ? "bg-teal" : "bg-accent"
                      }`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: skill.level / 100 }}
                      viewport={{ once: true, margin: "-15% 0px" }}
                      transition={{
                        duration: 0.9,
                        delay: 0.08 * skillIndex,
                        ease: EASE_OUT,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
