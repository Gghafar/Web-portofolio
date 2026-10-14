"use client";

import { useSyncExternalStore } from "react";

export type Point = { x: number; y: number };

export type Win = {
  id: string;
  /** Stacking order: higher is in front. */
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Top-left corner in px, relative to the desktop (the viewport). */
  x: number;
  y: number;
  /** Viewport point the window grows out of / shrinks into (the icon or the dock). */
  origin: Point;
};

type State = { wins: Win[]; topZ: number };

const MENU_BAR = 34;
const CASCADE = 28;

let state: State = { wins: [], topZ: 10 };
const listeners = new Set<() => void>();
/** The element that opened each window, so focus can go back to it on close. */
const openers = new Map<string, HTMLElement | null>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: State = { wins: [], topZ: 10 };

export function useDesktop(): State {
  return useSyncExternalStore(subscribe, () => state, () => EMPTY);
}

/** The window in front (ignoring minimized ones), or null. */
export function focusedId(s: State = state): string | null {
  let top: Win | null = null;
  for (const w of s.wins) if (!w.minimized && (!top || w.z > top.z)) top = w;
  return top?.id ?? null;
}

/** Where the dock sits; minimized windows shrink into it. */
function dockPoint(): Point {
  return { x: window.innerWidth / 2, y: window.innerHeight - 40 };
}

function centre(): Point {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

/** New windows open centred, each one stepped down-right from the last so they don't stack exactly. */
function placement(width: number): Point {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const step = state.wins.filter((w) => !w.minimized).length % 6;
  const w = Math.min(width, vw - 32);
  const x = Math.round(Math.max(8, Math.min((vw - w) / 2 - 2.5 * CASCADE + step * CASCADE, vw - w - 8)));
  const y = Math.round(Math.min(MENU_BAR + 26 + step * CASCADE, vh * 0.35));
  return { x, y };
}

export const desktop = {
  /**
   * Open (or bring back) a window. `from` is the element clicked: the window grows out of it,
   * and focus returns to it when the window closes.
   */
  open(id: string, width: number, from?: HTMLElement | null) {
    const r = from?.getBoundingClientRect();
    const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : centre();
    openers.set(id, from ?? (document.activeElement as HTMLElement | null));
    const topZ = state.topZ + 1;
    const existing = state.wins.find((w) => w.id === id);
    if (existing) {
      set({
        topZ,
        wins: state.wins.map((w) => (w.id === id ? { ...w, z: topZ, minimized: false, origin: w.minimized ? dockPoint() : w.origin } : w)),
      });
      return;
    }
    const pos = placement(width);
    set({ topZ, wins: [...state.wins, { id, z: topZ, minimized: false, maximized: false, ...pos, origin }] });
  },

  close(id: string) {
    set({ ...state, wins: state.wins.filter((w) => w.id !== id) });
    const el = openers.get(id);
    openers.delete(id);
    if (el?.isConnected) window.setTimeout(() => el.focus({ preventScroll: true }), 0);
  },

  closeAll() {
    set({ ...state, wins: [] });
    openers.clear();
  },

  focus(id: string) {
    const w = state.wins.find((x) => x.id === id);
    if (!w || (w.z === state.topZ && !w.minimized)) return;
    const topZ = state.topZ + 1;
    set({ topZ, wins: state.wins.map((x) => (x.id === id ? { ...x, z: topZ, minimized: false } : x)) });
  },

  minimize(id: string) {
    set({ ...state, wins: state.wins.map((w) => (w.id === id ? { ...w, minimized: true, origin: dockPoint() } : w)) });
  },

  /** Commit a finished drag: the window's new top-left corner. */
  move(id: string, x: number, y: number) {
    set({ ...state, wins: state.wins.map((w) => (w.id === id ? { ...w, x: Math.round(x), y: Math.round(y) } : w)) });
  },

  toggleMaximize(id: string) {
    set({ ...state, wins: state.wins.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)) });
  },
};
