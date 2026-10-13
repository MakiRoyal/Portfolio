"use client";

import { m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { bootLines } from "@/lib/data";

const CHAR_DELAY = 14;
const LINE_PAUSE = 170;
const BAR_STEP_DELAY = 28;
const TYPING_PROGRESS_MAX = 88;
const WIPE_ORIGIN = "68% 38%";

type Phase = "typing" | "bar" | "wipe";

export default function Loader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [typed, setTyped] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const timers = useRef<number[]>([]);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem("booted", "1");
    } catch {
      // stockage indisponible : le boot rejouera, sans conséquence
    }
    setTyped(bootLines);
    setProgress(100);
    setPhase("wipe");
    window.dispatchEvent(new Event("portfolio:boot-complete"));
  }, []);

  // Skip : reduced-motion (le CSS masque déjà le loader) ou déjà booté cette session.
  // Le flag est posé de façon synchrone (pas seulement l'évènement de finish())
  // car Loader est monté avant tout consommateur de useBootComplete() : son propre
  // effet de montage doit pouvoir lire le flag plutôt que risquer de manquer
  // l'évènement si les deux effets se déclenchent dans le même commit.
  useEffect(() => {
    if (reduced || document.documentElement.dataset.booted) {
      document.documentElement.dataset.booted = "1";
      finish();
      setVisible(false);
    }
  }, [reduced, finish]);

  // Verrouille le scroll pendant le boot.
  useEffect(() => {
    if (!visible) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [visible]);

  // Le boot est passable : clic, Entrée ou Échap.
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, finish]);

  // Séquence : frappe des lignes → remplissage de la barre → wipe.
  useEffect(() => {
    if (!visible || doneRef.current) return;

    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };
    const totalChars = bootLines.join("").length;
    let line = 0;
    let char = 0;
    let typedCount = 0;

    const fillBar = (value: number) => {
      if (doneRef.current) return;
      const next = Math.min(100, value + 2);
      setProgress(next);
      if (next >= 100) {
        finish();
      } else {
        schedule(() => fillBar(next), BAR_STEP_DELAY);
      }
    };

    const typeNext = () => {
      if (doneRef.current) return;
      const currentLine = bootLines[line];
      if (char < currentLine.length) {
        char += 1;
        typedCount += 1;
        setTyped([...bootLines.slice(0, line), currentLine.slice(0, char)]);
        setProgress(
          Math.round((typedCount / totalChars) * TYPING_PROGRESS_MAX),
        );
        schedule(typeNext, CHAR_DELAY);
      } else if (line < bootLines.length - 1) {
        line += 1;
        char = 0;
        schedule(typeNext, LINE_PAUSE);
      } else {
        setPhase("bar");
        schedule(() => fillBar(TYPING_PROGRESS_MAX), LINE_PAUSE);
      }
    };

    schedule(typeNext, 350);
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [visible, finish]);

  if (!visible) return null;

  return (
    <m.div
      id="loader"
      role="status"
      aria-label="Chargement du portfolio"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
      initial={false}
      animate={
        phase === "wipe"
          ? { clipPath: `circle(0% at ${WIPE_ORIGIN})` }
          : { clipPath: `circle(150% at ${WIPE_ORIGIN})` }
      }
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
      onAnimationComplete={() => {
        if (phase === "wipe") setVisible(false);
      }}
      onClick={finish}
    >
      <div
        aria-hidden
        className="w-[min(92vw,560px)] rounded-card border border-line bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-2 font-mono text-xs text-muted">
            mika@portfolio — boot
          </span>
        </div>
        <div className="min-h-[150px] px-4 py-4 font-mono text-[13px] leading-relaxed text-fg/90">
          {typed.map((typedLine, i) => (
            <p key={i}>
              {typedLine}
              {i === typed.length - 1 && phase === "typing" && (
                <span className="caret ml-1" />
              )}
            </p>
          ))}
        </div>
        <div className="border-t border-line px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full origin-left bg-accent transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-xs tabular-nums text-accent">
              {progress}%
            </span>
          </div>
        </div>
      </div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted">
        cliquer ou Échap pour passer
      </p>
    </m.div>
  );
}
