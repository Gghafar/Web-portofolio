/**
 * The macOS "genie" effect: a window is sucked into its dock icon (and poured back out on restore).
 *
 * The window is cut into horizontal bands, each a clone of the window clipped to its own rows.
 * Every row slides toward the dock (bottom rows first) and narrows as it nears it. Each band is then
 * warped (a projective `matrix3d`) onto the trapezoid between its top and bottom rows, so neighbouring
 * bands share edges: the silhouette bends into a smooth funnel and the content squeezes with it.
 * Only transforms change per frame, so it stays on the compositor.
 */

export type Box = { x: number; y: number; w: number; h: number };

const DURATION = 520;
/** Effects in flight; while any runs, `<html data-genie>` switches off costly effects elsewhere. */
let running = 0;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * CSS matrix3d that maps a w×h box onto the quad tl, tr, br, bl (Heckbert's square-to-quad mapping).
 * Needs `transform-origin: 0 0`.
 */
function quad(w: number, h: number, [x0, y0]: number[], [x1, y1]: number[], [x2, y2]: number[], [x3, y3]: number[]) {
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  let g = 0;
  let k = 0;
  if (Math.abs(sx) > 1e-6 || Math.abs(sy) > 1e-6) {
    const dx1 = x1 - x2;
    const dx2 = x3 - x2;
    const dy1 = y1 - y2;
    const dy2 = y3 - y2;
    const den = dx1 * dy2 - dx2 * dy1 || 1e-6;
    g = (sx * dy2 - dx2 * sy) / den;
    k = (dx1 * sy - sx * dy1) / den;
  }
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + k * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${e / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}

/** A copy of the window for one band: unpositioned, fully visible, its canvases and scroll copied. */
function cloneWindow(el: HTMLElement, w: number, h: number, offsetY: number) {
  const c = el.cloneNode(true) as HTMLElement;
  c.removeAttribute("id");
  c.setAttribute("inert", "");
  Object.assign(c.style, {
    position: "absolute",
    left: "0px",
    top: `${-offsetY}px`,
    width: `${w}px`,
    height: `${h}px`,
    maxHeight: "none",
    margin: "0",
    transform: "none",
    opacity: "1",
    visibility: "visible",
  });
  c.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
  const from = el.querySelectorAll("canvas");
  c.querySelectorAll("canvas").forEach((cv, i) => cv.getContext("2d")?.drawImage(from[i], 0, 0));
  return c;
}

/**
 * Plays the effect over the page. `dir: "in"` = minimize (window → `target`), `"out"` = restore.
 * The caller hides the real window while it runs.
 */
export function genie(el: HTMLElement, target: Box, dir: "in" | "out"): Promise<void> {
  const r = el.getBoundingClientRect();
  const W = r.width;
  const H = r.height;
  if (W < 1 || H < 1) return Promise.resolve();

  // Every band is a full clone of the window, so keep them few (fewer still for big windows like the
  // Hiring Match graph): the trapezoid warp keeps the edges smooth anyway.
  const nodes = el.getElementsByTagName("*").length;
  const count = Math.max(8, Math.min(16, Math.round(H / 40), Math.round(4000 / Math.max(1, nodes))));
  const layer = document.createElement("div");
  layer.className = "genie";
  layer.setAttribute("aria-hidden", "true");

  const scrollFrom = el.querySelector<HTMLElement>(".mac-body");
  const bands = Array.from({ length: count }, (_, i) => {
    const y0 = (H * i) / count;
    const y1 = (H * (i + 1)) / count;
    const wrap = document.createElement("div");
    wrap.className = "genie-band";
    wrap.style.width = `${W}px`;
    wrap.style.height = `${y1 - y0}px`;
    wrap.append(cloneWindow(el, W, H, y0));
    layer.append(wrap);
    return { wrap, y0, y1 };
  });
  document.body.append(layer);
  running++;
  document.documentElement.dataset.genie = "";
  // Scroll positions only take once the clones are in the document.
  if (scrollFrom?.scrollTop) layer.querySelectorAll<HTMLElement>(".mac-body").forEach((b) => (b.scrollTop = scrollFrom.scrollTop));

  // Distance from the window's top to the dock: rows bend more the closer they get to it.
  const drop = Math.max(1, target.y - r.top);

  /** Where source row `v` (0 = top, 1 = bottom) lands at progress p (0 = window, 1 = in the dock). */
  const rowAt = (v: number, p: number) => {
    const pinch = smooth(clamp01(p / 0.4));
    const slide = clamp01((p - 0.2) / 0.8);
    // Bottom rows set off first; the top row leaves last.
    const s = easeInOut(clamp01((slide - (1 - v) * 0.45) / 0.55));
    const y = lerp(r.top + v * H, target.y + v * target.h, s);
    const k = pinch * smooth(clamp01((y - r.top) / drop));
    return { y, w: lerp(W, target.w, k), cx: lerp(r.left + W / 2, target.x + target.w / 2, k) };
  };

  const draw = (p: number) => {
    // Rows at every band edge, shared by the band above and the one below.
    const rows = [bands[0].y0, ...bands.map((b) => b.y1)].map((y) => rowAt(y / H, p));
    bands.forEach((b, i) => {
      const t = rows[i];
      const u = rows[i + 1];
      // Keep a hair of height so the mapping never collapses.
      const by = Math.max(u.y, t.y + 0.01);
      b.wrap.style.transform = quad(
        W,
        b.y1 - b.y0,
        [t.cx - t.w / 2, t.y],
        [t.cx + t.w / 2, t.y],
        [u.cx + u.w / 2, by],
        [u.cx - u.w / 2, by],
      );
    });
    // Fade the last sliver so it melts into the icon instead of popping.
    layer.style.opacity = String(1 - clamp01((p - 0.85) / 0.15));
  };

  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now: number) => {
      const t = clamp01((now - start) / DURATION);
      draw(dir === "in" ? t : 1 - t);
      if (t < 1) requestAnimationFrame(frame);
      else {
        layer.remove();
        if (--running === 0) delete document.documentElement.dataset.genie;
        resolve();
      }
    };
    draw(dir === "in" ? 0 : 1);
    requestAnimationFrame(frame);
  });
}
