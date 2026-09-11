"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useScrollShellRef } from "./ScrollShell";

/**
 * Colonne de lecture qui contient le site — c'est le conteneur de scroll.
 * Le diorama 3D évolue librement dans les marges de part et d'autre.
 * Le contenu reste du vrai HTML crawlable/accessible.
 */
export default function ReaderShell({ children }: { children: ReactNode }) {
  const columnRef = useScrollShellRef();

  // molette dans les marges (hors colonne) → scroll de la colonne
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const column = columnRef.current;
      if (!column) return;
      if (event.target instanceof Node && column.contains(event.target)) return;
      column.scrollBy({ top: event.deltaY });
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [columnRef]);

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
    <div className="reader-stage">
      <div ref={columnRef} className="reader-column">
        <div className="reader-content">{children}</div>
      </div>
    </div>
  );
}
