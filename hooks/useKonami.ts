"use client";

import { useEffect, useRef } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Une seule lettre (b/a) : on compare le caractère produit, pas la position physique. */
const normalize = (key: string) => (key.length === 1 ? key.toLowerCase() : key);

/**
 * Déclenche `onUnlock` quand ↑ ↑ ↓ ↓ ← → ← → B A est tapé au clavier physique.
 * Comparé sur `event.key` (dépendant de la disposition) plutôt que `event.code`
 * (position physique façon QWERTY) : sur un clavier AZERTY, la touche portant
 * la lettre A a le code "KeyQ" — comparer sur `code` cassait la séquence.
 */
export function useKonami(onUnlock: () => void) {
  const position = useRef(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const pressed = normalize(event.key);
      if (pressed === SEQUENCE[position.current]) {
        position.current += 1;
        if (position.current === SEQUENCE.length) {
          position.current = 0;
          onUnlock();
        }
      } else {
        position.current = pressed === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onUnlock]);
}
