"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { DockArt, dockBg, TileArt } from "./glyphs";
import { LiquidGlassLayers } from "@/components/ui/liquid-glass-button";
import { APPS } from "@/lib/desktop/apps";
import { desktop, useDesktop } from "@/lib/desktop/store";
import { DOCK_END, DOCK_LINKS, DOCK_MAIN, type DockItemDef } from "@/data/desktop";

const BASE = 48;
const PEAK = 72; // size of the icon right under the pointer
const REACH = 140; // px either side of the pointer that still grow

/**
 * The dock: icons magnify as the pointer passes (like macOS), a dot marks windows that are open,
 * and minimized windows sit on the right until clicked.
 */
export default function Dock() {
  const { wins } = useDesktop();
  // Pointer x across the dock; Infinity = not hovering, so every icon is at rest.
  const mouseX = useMotionValue(Infinity);
  const open = new Set(wins.map((w) => w.id));
  const minimized = wins.filter((w) => w.minimized);

  const item = (d: DockItemDef) => (
    <DockButton
      key={d.app}
      mouseX={mouseX}
      label={d.label}
      bg={dockBg(d.app)}
      running={d.running.some((id) => open.has(id))}
      onClick={(el) => desktop.open(d.app, APPS[d.app].width, el)}
    >
      <DockArt id={d.app} />
    </DockButton>
  );

  return (
    <nav
      className="dock lg"
      aria-label="Dock"
      onPointerMove={(e) => e.pointerType === "mouse" && mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      {/* Same clear liquid glass as the buttons (`.lg` in globals.css), tuned clearer for the dock. */}
      <LiquidGlassLayers />
      <div className="dock-row">
        {DOCK_MAIN.map(item)}
        <span className="dock-sep" aria-hidden="true" />
        {DOCK_LINKS.map(item)}
        <span className="dock-sep" aria-hidden="true" />
        {DOCK_END.map(item)}
        <DockButton mouseX={mouseX} label="Close all windows" bg={dockBg("closeAll")} running={false} onClick={() => desktop.closeAll()}>
          <DockArt id="closeAll" />
        </DockButton>
        {minimized.length > 0 && <span className="dock-sep" aria-hidden="true" />}
        {minimized.map((w) => (
          <DockButton
            key={w.id}
            mouseX={mouseX}
            label={`Restore ${APPS[w.id]?.name ?? w.id}`}
            winId={w.id}
            bg="#ffffff"
            running
            onClick={(el) => desktop.open(w.id, APPS[w.id]?.width ?? 560, el)}
          >
            <TileArt id={w.id} size={30} />
          </DockButton>
        ))}
      </div>
    </nav>
  );
}

function DockButton({
  mouseX,
  label,
  bg,
  winId,
  running,
  onClick,
  children,
}: {
  mouseX: MotionValue<number>;
  label: string;
  bg: string;
  /** For a minimized window's button: the genie effect aims at it. */
  winId?: string;
  running: boolean;
  onClick: (el: HTMLElement) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE]);
  const size = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <div className="dock-slot">
      <motion.button
        ref={ref}
        type="button"
        className="dock-btn"
        aria-label={label}
        title={label}
        data-win={winId}
        style={{ width: size, height: size, background: bg }}
        whileTap={{ scale: 0.88 }}
        onClick={(e) => onClick(e.currentTarget)}
      >
        <span className="dock-art">{children}</span>
      </motion.button>
      <span className="dock-dot" data-on={running || undefined} aria-hidden="true" />
    </div>
  );
}

