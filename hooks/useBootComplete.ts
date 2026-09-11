"use client";

import { useEffect, useState } from "react";

export const BOOT_COMPLETE_EVENT = "portfolio:boot-complete";

/**
 * true quand le boot terminal est terminé — soit immédiatement si le boot
 * a déjà tourné cette session (html[data-booted], posé avant la peinture
 * par le script inline du layout), soit à réception de l’évènement
 * dispatché par le finish() du Loader.
 */
export function useBootComplete(): boolean {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.booted === "1") {
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(BOOT_COMPLETE_EVENT, onDone);
    return () => window.removeEventListener(BOOT_COMPLETE_EVENT, onDone);
  }, []);

  return done;
}
