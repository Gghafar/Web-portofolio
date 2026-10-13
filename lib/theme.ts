"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./theme-script";

export type Theme = "light" | "dark";
const DARK_MQ = "(prefers-color-scheme: dark)";

function resolved(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia(DARK_MQ).matches ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const mq = matchMedia(DARK_MQ);
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
}

export function toggleTheme() {
  setTheme(resolved() === "dark" ? "light" : "dark");
}

/** The theme actually on screen: the saved choice, else the OS preference. `null` during SSR. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, resolved, () => null);
}
