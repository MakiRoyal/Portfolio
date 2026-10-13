"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useScrollShellRef } from "./ScrollShell";

/**
 * Conteneur de scroll plein viewport qui porte le contenu du site — le
 * diorama 3D évolue dans les marges visuelles de part et d'autre de la
 * colonne de contenu. Le contenu reste du vrai HTML crawlable/accessible.
 * La molette est nativement gérée par ce conteneur (il couvre tout le
 * viewport) ; seul le clavier a besoin d'un relais, car html/body sont en
 * overflow:hidden pour laisser ce conteneur porter seul le scroll.
 */
export default function ReaderShell({ children }: { children: ReactNode }) {
  const columnRef = useScrollShellRef();

  // clavier quand rien n'a le focus (body) → scroll de la colonne
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const column = columnRef.current;
      if (!column) return;
      const target = event.target;
      if (
        target !== document.body &&
        target !== document.documentElement &&
        target !== null
      ) {
        return;
      }
      const page = column.clientHeight * 0.85;
      if (event.key === "Home") {
        event.preventDefault();
        column.scrollTo({ top: 0 });
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        column.scrollTo({ top: column.scrollHeight });
        return;
      }
      const deltas: Record<string, number> = {
        ArrowDown: 64,
        ArrowUp: -64,
        PageDown: page,
        PageUp: -page,
        " ": event.shiftKey ? -page : page,
      };
      const delta = deltas[event.key];
      if (delta !== undefined) {
        event.preventDefault();
        column.scrollBy({ top: delta });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [columnRef]);

  return (
    <div ref={columnRef} className="reader-column">
      <div className="reader-content">{children}</div>
    </div>
  );
}
