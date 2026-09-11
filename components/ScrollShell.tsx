"use client";

import { createContext, useContext, useRef } from "react";
import type { ReactNode, RefObject } from "react";

/**
 * Le site scrolle dans une colonne de lecture dédiée, plus dans la fenêtre.
 * Ce contexte partage la ref du conteneur de scroll (.reader-column) entre
 * ReaderShell (qui la pose), ScrollProgress et la scène 3D (qui la lisent).
 */
const ScrollShellContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null);

export function ScrollShellProvider({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement | null>(null);
  return (
    <ScrollShellContext.Provider value={screenRef}>
      {children}
    </ScrollShellContext.Provider>
  );
}

export function useScrollShellRef(): RefObject<HTMLDivElement | null> {
  const context = useContext(ScrollShellContext);
  if (!context) {
    throw new Error(
      "useScrollShellRef doit être utilisé sous ScrollShellProvider",
    );
  }
  return context;
}
