"use client";

import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useKonami } from "@/hooks/useKonami";

const TOAST_DURATION = 2600;

/** Konami code → bascule le thème rétro PS2 / Y2K + toast de confirmation. */
export default function KonamiListener() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef(0);

  const onUnlock = useCallback(() => {
    const root = document.documentElement;
    const activating = root.dataset.theme !== "ps2";
    if (activating) {
      root.dataset.theme = "ps2";
    } else {
      delete root.dataset.theme;
    }
    setToast(activating ? "Mode PS2 activé" : "Mode PS2 désactivé");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  useKonami(onUnlock);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[75] flex justify-center"
    >
      <AnimatePresence>
        {toast && (
          <m.p
            key={toast}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="toast-pill rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent shadow-lg"
          >
            {toast}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
