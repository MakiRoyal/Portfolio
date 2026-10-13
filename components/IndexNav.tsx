"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/lib/data";

const EASE_IN_OUT: [number, number, number, number] = [0.83, 0, 0.17, 1];
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Burger + menu plein écran type « index » : liste numérotée géante en Fraunces. */
export default function IndexNav() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Menu ouvert : scroll verrouillé, focus déplacé, Échap ferme, Tab piégé.
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const burger = burgerRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    overlay?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !overlay) return;
      const focusables = [
        burger,
        ...overlay.querySelectorAll<HTMLElement>("a[href]"),
      ].filter((el): el is HTMLElement => el !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      burger?.focus({ preventScroll: true });
    };
  }, [open, close]);

  const overlayMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { clipPath: "inset(0 0 100% 0)" },
        animate: { clipPath: "inset(0 0 0% 0)" },
        exit: {
          clipPath: "inset(0 0 100% 0)",
          transition: { duration: 0.4, ease: EASE_IN_OUT, delay: 0.1 },
        },
        transition: { duration: 0.55, ease: EASE_IN_OUT },
      };

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="index-menu"
        data-hover
        data-label={open ? "fermer" : "menu"}
        data-magnetic
        className="fixed right-5 top-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface/80 backdrop-blur-sm"
      >
        <span className="sr-only">
          {open ? "Fermer le menu" : "Ouvrir le menu"}
        </span>
        <span aria-hidden className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 top-[2px] h-[2px] w-full bg-fg transition-transform duration-300 ${
              open ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-[2px] left-0 h-[2px] w-full bg-fg transition-transform duration-300 ${
              open ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            ref={overlayRef}
            id="index-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed inset-0 z-[60] flex flex-col justify-center bg-bg/[0.98] px-6 backdrop-blur-md sm:px-12 lg:px-24"
            {...overlayMotion}
          >
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              index — navigation
            </p>
            <nav>
              <ul className="flex flex-col">
                {navLinks.map((link, i) => (
                  <li
                    key={link.href}
                    className="overflow-hidden border-b border-line/60"
                  >
                    <m.div
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      exit={
                        reduced
                          ? { opacity: 0 }
                          : { y: "110%", transition: { duration: 0.25 } }
                      }
                      transition={{
                        delay: 0.12 + i * 0.06,
                        duration: 0.55,
                        ease: EASE_OUT,
                      }}
                    >
                      <a
                        href={link.href}
                        onClick={close}
                        data-hover
                        data-label="aller"
                        className="group flex items-baseline gap-5 py-3 sm:gap-8"
                      >
                        <span className="font-mono text-sm text-muted transition-colors duration-300 group-hover:text-teal group-focus-visible:text-teal">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[clamp(2.2rem,7.5vw,5rem)] font-medium leading-[1.05] text-fg transition-[color,transform] duration-300 group-hover:translate-x-3 group-hover:text-accent group-focus-visible:text-accent">
                          {link.label}
                        </span>
                      </a>
                    </m.div>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted">
              <a
                href={`mailto:${profile.email}`}
                data-hover
                data-label="écrire"
                className="inline-flex min-h-11 items-center underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:text-fg focus-visible:underline"
              >
                {profile.email}
              </a>
              <span>{profile.location}</span>
              <span>{profile.availability.toLowerCase()}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
