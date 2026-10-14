"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Window from "./Window";
import { TileArt } from "./glyphs";
import { APPS } from "@/lib/desktop/apps";
import { desktop, focusedId, useDesktop } from "@/lib/desktop/store";
import { DESKTOP_ICONS } from "@/data/desktop";

const COMPACT_MQ = "(max-width: 760px)";
const subscribeCompact = (cb: () => void) => {
  const mq = matchMedia(COMPACT_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** Phones and narrow windows: icons become a grid and windows fill the screen. */
function useCompact() {
  return useSyncExternalStore(subscribeCompact, () => matchMedia(COMPACT_MQ).matches, () => false);
}

const idFromHash = () => decodeURIComponent(location.hash.slice(1));

/** Open the window named in the URL hash (/#mtla), and keep the hash in step with the window in front. */
function useHashWindows() {
  const state = useDesktop();
  const front = focusedId(state);

  useEffect(() => {
    const openFromHash = () => {
      const id = idFromHash();
      if (APPS[id]) desktop.open(id, APPS[id].width);
    };
    openFromHash();
    // Links inside windows (folder rows, "Read the full entry", timeline bars) are plain #hash links.
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    if (idFromHash() === (front ?? "")) return;
    history.replaceState(null, "", front ? `#${front}` : location.pathname + location.search);
  }, [front]);
}

export default function Desktop() {
  const state = useDesktop();
  const compact = useCompact();
  const bounds = useRef<HTMLDivElement>(null);
  const front = focusedId(state);
  useHashWindows();

  // Esc closes the window in front (Spotlight handles its own Esc while open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || document.body.hasAttribute("data-scroll-locked")) return;
      const id = focusedId();
      if (id) desktop.close(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="desk">
      <Wallpaper />
      <MenuBar />

      {/* Area windows can be dragged in: below the menu bar, down to the bottom edge. */}
      <div ref={bounds} className="desk-bounds" aria-hidden="true" />

      <div className="icons" role="list" aria-label="Files">
        {DESKTOP_ICONS.map((ic, i) => (
          // The slot keeps its CSS centring transform; the inner element does the entrance animation.
          <div key={ic.app} role="listitem" className="ic-slot" style={{ left: `${ic.left}%`, top: `${ic.top}%` }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.025, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <button type="button" className="ic" onClick={(e) => desktop.open(ic.app, APPS[ic.app].width, e.currentTarget)}>
                <span className="ic-tile">
                  <TileArt id={ic.app} />
                </span>
                <span className="ic-label">{ic.label}</span>
              </button>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {state.wins.length === 0 && (
          <motion.span className="desk-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Click any file to open it · ⌘K to search
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.wins.map((w) =>
          APPS[w.id] ? <Window key={w.id} win={w} app={APPS[w.id]} focused={w.id === front} compact={compact} bounds={bounds} /> : null,
        )}
      </AnimatePresence>

      <Dock />
    </div>
  );
}

/** Blurred portrait placeholder from the design; swap the SVG for a photo later. */
function Wallpaper() {
  return (
    <div className="portrait" aria-hidden="true">
      <svg viewBox="0 0 600 700" width="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 700 C60 560 170 500 300 500 C430 500 540 560 560 700 Z" fill="#1E1B19" />
        <rect x="250" y="400" width="100" height="130" rx="40" fill="#B48B72" />
        <ellipse cx="300" cy="320" rx="130" ry="150" fill="#C9A48A" />
        <path d="M175 300 C170 230 200 200 230 200 L380 200 C410 200 440 240 432 310 C420 260 390 250 300 250 C220 250 185 270 175 300 Z" fill="#3A2A22" />
        <path d="M150 230 C150 120 230 70 320 70 C420 70 470 140 470 220 C430 200 380 192 310 192 C240 192 190 205 150 230 Z" fill="#C7C4D9" />
        <path d="M430 210 C500 205 560 220 575 245 C540 250 480 245 440 238 Z" fill="#B3AFCB" />
        <rect x="215" y="300" width="80" height="34" rx="14" fill="#141414" />
        <rect x="315" y="300" width="80" height="34" rx="14" fill="#141414" />
      </svg>
    </div>
  );
}
