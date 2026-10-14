"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useDragControls, useMotionValue, useReducedMotion } from "motion/react";
import { desktop, type Win } from "@/lib/desktop/store";
import type { AppDef } from "@/lib/desktop/apps";

const OPEN = { type: "spring", stiffness: 360, damping: 32, mass: 0.8 } as const;

type Props = {
  win: Win;
  app: AppDef;
  focused: boolean;
  /** Phones: windows fill the screen and can't be dragged. */
  compact: boolean;
  bounds: React.RefObject<HTMLDivElement | null>;
};

/**
 * A macOS-style window: traffic-light buttons, drag by the title bar, click to bring to front.
 * It grows out of the icon that opened it, and shrinks into the dock when minimized (staying
 * mounted, so a demo keeps its state).
 */
export default function Window({ win, app, focused, compact, bounds }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useDragControls();
  const reduce = useReducedMotion();
  // Offset while a drag is in progress; folded into the stored position when it ends.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  // Move keyboard focus into a window when it opens or comes back from the dock.
  useEffect(() => {
    if (!win.minimized) ref.current?.focus({ preventScroll: true });
  }, [win.minimized]);

  const full = compact || win.maximized;
  // The point the window grows from / shrinks to, in the window's own coordinates.
  const ox = win.origin.x - (full ? 0 : win.x);
  const oy = win.origin.y - (full ? 0 : win.y);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={app.name}
      // Minimized windows stay mounted (keeping their state) but must not be reachable with Tab.
      inert={win.minimized}
      tabIndex={-1}
      className="mac-win"
      data-focused={focused || undefined}
      data-full={full || undefined}
      // No left/top transition while dragging or while the drag is being committed.
      data-dragging={dragging || undefined}
      style={{
        x,
        y,
        zIndex: win.z,
        left: full ? undefined : win.x,
        top: full ? undefined : win.y,
        width: full ? undefined : `min(${app.width}px, calc(100vw - 16px))`,
        // Stop above the dock (≈100px tall incl. its margin).
        maxHeight: full ? undefined : `calc(100dvh - ${win.y}px - 104px)`,
        transformOrigin: `${ox}px ${oy}px`,
        pointerEvents: win.minimized ? "none" : undefined,
      }}
      drag={!full}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        desktop.move(win.id, win.x + x.get(), win.y + y.get());
        x.set(0);
        y.set(0);
        requestAnimationFrame(() => setDragging(false));
      }}
      onPointerDownCapture={() => desktop.focus(win.id)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.08 }}
      animate={
        win.minimized
          ? { opacity: 0, scale: reduce ? 1 : 0.06, transition: { duration: 0.32, ease: [0.4, 0, 0.6, 1] } }
          : { opacity: 1, scale: 1, transition: OPEN }
      }
      exit={{ opacity: 0, scale: reduce ? 1 : 0.92, transition: { duration: 0.16 } }}
    >
      <div
        className="mac-titlebar"
        onPointerDown={(e) => {
          if (!full && !(e.target as Element).closest("button")) controls.start(e);
        }}
        onDoubleClick={(e) => {
          if (!compact && !(e.target as Element).closest("button")) desktop.toggleMaximize(win.id);
        }}
      >
        <div className="mac-lights">
          <button type="button" className="light light-close" aria-label={`Close ${app.name}`} onClick={() => desktop.close(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" />
            </svg>
          </button>
          <button type="button" className="light light-min" aria-label={`Minimize ${app.name}`} onClick={() => desktop.minimize(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 5h6" />
            </svg>
          </button>
          {!compact && (
            <button
              type="button"
              className="light light-max"
              aria-label={win.maximized ? `Restore ${app.name}` : `Maximize ${app.name}`}
              onClick={() => desktop.toggleMaximize(win.id)}
            >
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <path d="M3 7V3h4M7 3v4H3" />
              </svg>
            </button>
          )}
        </div>
        <span className="mac-file">{app.file}</span>
        <span className="mac-lights-spacer" aria-hidden="true" />
      </div>
      <div className="mac-body">{app.render()}</div>
    </motion.div>
  );
}
