"use client";

import { useEffect, useRef } from "react";

const MAP = [
  "........................",
  ".###......##......###...",
  ".#........##........#...",
  ".#...##.........##..#...",
  ".....##.........##......",
  ".........######.........",
  "........................",
  "...##..............##...",
  "...##....#....#....##...",
  ".........#....#.........",
  ".#.......######.......#.",
  ".#....................#.",
  ".####....##....##...###.",
  "........................",
];
const COLS = 24, ROWS = 14, TICK = 120, SIGHT = 11, RANGE = 8;
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;
const SPAWNS = [[0, 0], [23, 0], [0, 13], [23, 13], [12, 0], [12, 13]] as const;

type State = "IDLE" | "CHASE" | "ATTACK";
type Pt = { x: number; y: number };
type Ent = Pt & { px: number; py: number };
type Zombie = Ent & { state: State };
type Tracer = { x1: number; y1: number; x2: number; y2: number; t: number };
type Game = {
  tick: number; wave: number; hp: number; kills: number; player: Ent; target: Pt | null;
  zombies: Zombie[]; tracers: Tracer[]; down: number; waveWait: number; msg: string; hurt: number; dist: Int16Array;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const wall = (x: number, y: number) => x < 0 || y < 0 || x >= COLS || y >= ROWS || MAP[y][x] === "#";

function bfs(sx: number, sy: number) {
  const d = new Int16Array(COLS * ROWS).fill(-1), q = [sx + sy * COLS];
  d[q[0]] = 0;
  for (let h = 0; h < q.length; h++) {
    const i = q[h], x = i % COLS, y = (i / COLS) | 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (wall(nx, ny)) continue;
      const j = nx + ny * COLS;
      if (d[j] >= 0) continue;
      d[j] = d[i] + 1; q.push(j);
    }
  }
  return d;
}
/** Next cell that moves `ent` closer along distance field `d`, skipping occupied cells when `occ` is given. */
function downhill(ent: Pt, d: Int16Array, occ?: Set<string>): [number, number] | null {
  const here = d[ent.x + ent.y * COLS];
  let best: [number, number] | null = null, bv = here, fallback: [number, number] | null = null;
  for (const [dx, dy] of DIRS) {
    const nx = ent.x + dx, ny = ent.y + dy;
    if (wall(nx, ny)) continue;
    const v = d[nx + ny * COLS];
    if (v >= 0 && v < here) {
      if (occ && occ.has(nx + "," + ny)) { fallback = fallback || [nx, ny]; continue; }
      if (v < bv) { bv = v; best = [nx, ny]; }
    }
  }
  return best || (occ ? null : fallback);
}
function los(a: Pt, b: Pt) {
  const x0 = a.x + 0.5, y0 = a.y + 0.5, x1 = b.x + 0.5, y1 = b.y + 0.5;
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 5);
  for (let i = 1; i < n; i++) { const t = i / n; if (MAP[(y0 + (y1 - y0) * t) | 0][(x0 + (x1 - x0) * t) | 0] === "#") return false; }
  return true;
}

export default function PathfindingArena() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!, ctx = canvas.getContext("2d")!;
    const playBtn = playRef.current!, resetBtn = resetRef.current!;
    const $h = (k: string) => hudRef.current!.querySelector<HTMLElement>(`[data-hud="${k}"]`)!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cell = 20, alpha = 1, G!: Game;
    let colors: Record<string, string> = {};
    let monoFont = "ui-monospace, monospace";
    let disposed = false;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement), g = (n: string) => cs.getPropertyValue(n).trim();
      colors = { surface: g("--surface"), paper: g("--paper"), line: g("--line"), wall: g("--line-strong"), ink: g("--ink"), ink2: g("--ink-2"), muted: g("--muted"), accent: g("--accent"), accentInk: g("--accent-ink") };
      monoFont = getComputedStyle(canvas).getPropertyValue("--f-mono").trim() || monoFont;
    };

    const classify = (z: Pt): State => { const d = G.dist[z.x + z.y * COLS]; return d >= 0 && d <= 1 ? "ATTACK" : d >= 0 && d <= SIGHT ? "CHASE" : "IDLE"; };
    const spawnWave = () => {
      const n = Math.min(2 + G.wave, 9);
      const sp = [...SPAWNS].sort((a, b) => Math.hypot(b[0] - G.player.x, b[1] - G.player.y) - Math.hypot(a[0] - G.player.x, a[1] - G.player.y));
      for (let i = 0; i < n; i++) { const [x, y] = sp[i % sp.length]; G.zombies.push({ x, y, px: x, py: y, state: "IDLE" }); }
    };
    const hud = () => {
      $h("wave").textContent = String(G.wave);
      $h("hp").textContent = "●".repeat(G.hp) + "○".repeat(5 - G.hp);
      $h("kills").textContent = String(G.kills);
      const c = { IDLE: 0, CHASE: 0, ATTACK: 0 };
      G.zombies.forEach((z) => c[z.state]++);
      $h("idle").textContent = String(c.IDLE); $h("chase").textContent = String(c.CHASE); $h("attack").textContent = String(c.ATTACK);
    };
    const newGame = () => {
      G = { tick: 0, wave: 1, hp: 5, kills: 0, player: { x: 12, y: 6, px: 12, py: 6 }, target: null, zombies: [], tracers: [], down: 0, waveWait: 0, msg: "", hurt: 0, dist: bfs(12, 6) };
      spawnWave();
      G.zombies.forEach((z) => (z.state = classify(z)));
      hud();
    };
    const step = () => {
      G.tick++;
      const p = G.player;
      p.px = p.x; p.py = p.y;
      G.zombies.forEach((z) => { z.px = z.x; z.py = z.y; });
      if (G.down > 0) { if (--G.down === 0) newGame(); return; }
      if (G.target) {
        if (G.target.x === p.x && G.target.y === p.y) G.target = null;
        else { const nx = downhill(p, bfs(G.target.x, G.target.y)); if (nx) { p.x = nx[0]; p.y = nx[1]; } else G.target = null; }
      }
      G.dist = bfs(p.x, p.y);
      const occ = new Set(G.zombies.map((z) => z.x + "," + z.y));
      if (G.tick % 2 === 0) {
        G.zombies.forEach((z) => {
          const st = classify(z);
          let nx: readonly [number, number] | null = null;
          if (st === "CHASE") nx = downhill(z, G.dist, occ);
          else if (st === "IDLE" && Math.random() < 0.55) {
            const opts = DIRS.map(([dx, dy]) => [z.x + dx, z.y + dy] as const).filter(([x, y]) => !wall(x, y) && !occ.has(x + "," + y));
            if (opts.length) nx = opts[(Math.random() * opts.length) | 0];
          }
          if (nx) { occ.delete(z.x + "," + z.y); z.x = nx[0]; z.y = nx[1]; occ.add(z.x + "," + z.y); }
        });
      }
      G.zombies.forEach((z) => (z.state = classify(z)));
      if (G.tick % 5 === 0 && G.zombies.some((z) => z.state === "ATTACK")) { G.hp = Math.max(0, G.hp - 1); G.hurt = performance.now(); }
      if (G.hp <= 0) { G.down = 16; G.msg = `Overrun on wave ${G.wave}. Restarting…`; hud(); return; }
      if (G.tick % 6 === 0) {
        let best: Zombie | null = null, bd = 1e9;
        G.zombies.forEach((z) => { const e = Math.hypot(z.x - p.x, z.y - p.y); if (e <= RANGE && e < bd && los(p, z)) { bd = e; best = z; } });
        if (best) {
          const b: Zombie = best;
          G.tracers.push({ x1: p.x, y1: p.y, x2: b.x, y2: b.y, t: performance.now() });
          G.zombies = G.zombies.filter((z) => z !== b);
          G.kills++;
        }
      }
      if (!G.zombies.length) {
        if (!G.waveWait) G.waveWait = 10;
        else if (--G.waveWait === 0) { G.wave++; spawnWave(); G.zombies.forEach((z) => (z.state = classify(z))); }
      }
      hud();
    };

    let running = false, visible = false, paused = reduced, last = 0, acc = 0;

    const draw = () => {
      if (!G) return;
      const now = performance.now(), C = colors, w = cell * COLS, h = cell * ROWS, cx = (x: number) => (x + 0.5) * cell;
      ctx.fillStyle = C.surface; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = C.line;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (!wall(x, y)) ctx.fillRect(cx(x) - 0.9, cx(y) - 0.9, 1.8, 1.8);
      ctx.fillStyle = C.wall;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (wall(x, y)) ctx.fillRect(x * cell + 0.5, y * cell + 0.5, cell - 1, cell - 1);
      // chase paths
      ctx.save(); ctx.strokeStyle = C.accent; ctx.globalAlpha = 0.38; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
      G.zombies.forEach((z) => {
        if (z.state !== "CHASE") return;
        let cur: Pt = { x: z.x, y: z.y }, guard = 0;
        ctx.beginPath(); ctx.moveTo(cx(cur.x), cx(cur.y));
        while (guard++ < 60) { const nx = downhill(cur, G.dist); if (!nx) break; cur = { x: nx[0], y: nx[1] }; ctx.lineTo(cx(cur.x), cx(cur.y)); }
        ctx.stroke();
      });
      ctx.restore();
      // target marker
      if (G.target) {
        const tx = cx(G.target.x), ty = cx(G.target.y), s = cell * 0.18;
        ctx.strokeStyle = C.ink2; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(tx - s, ty - s); ctx.lineTo(tx + s, ty + s); ctx.moveTo(tx + s, ty - s); ctx.lineTo(tx - s, ty + s); ctx.stroke();
      }
      // zombies
      const fs = Math.max(8, cell * 0.34);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `600 ${fs}px ${monoFont}`;
      G.zombies.forEach((z) => {
        const x = cx(lerp(z.px, z.x, alpha)), y = cx(lerp(z.py, z.y, alpha)), r = cell * 0.32;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        if (z.state === "IDLE") { ctx.fillStyle = C.muted; ctx.fill(); }
        else if (z.state === "CHASE") { ctx.fillStyle = C.accent; ctx.fill(); }
        else { ctx.fillStyle = C.surface; ctx.fill(); ctx.lineWidth = Math.max(2, cell * 0.1); ctx.strokeStyle = C.accent; ctx.stroke(); }
        if (cell >= 18) { ctx.fillStyle = z.state === "ATTACK" ? C.accentInk : C.surface; ctx.fillText(z.state[0], x, y + 0.5); }
      });
      // player
      const p = G.player, px = cx(lerp(p.px, p.x, alpha)), py = cx(lerp(p.py, p.y, alpha));
      const hurt = now - G.hurt < 180;
      ctx.beginPath(); ctx.arc(px, py, cell * 0.36, 0, Math.PI * 2); ctx.fillStyle = hurt ? C.accent : C.ink; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, cell * 0.13, 0, Math.PI * 2); ctx.fillStyle = C.surface; ctx.fill();
      // tracers
      G.tracers = G.tracers.filter((t) => now - t.t < 260);
      G.tracers.forEach((t) => {
        const k = 1 - (now - t.t) / 260;
        ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx(t.x1), cx(t.y1)); ctx.lineTo(cx(t.x2), cx(t.y2)); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx(t.x2), cx(t.y2), cell * (0.2 + 0.35 * (1 - k)), 0, Math.PI * 2); ctx.strokeStyle = C.accent; ctx.stroke();
        ctx.restore();
      });
      if (G.down > 0) {
        ctx.save(); ctx.globalAlpha = 0.88; ctx.fillStyle = C.surface; ctx.fillRect(0, h / 2 - cell * 1.1, w, cell * 2.2); ctx.restore();
        ctx.fillStyle = C.ink; ctx.font = `600 ${Math.max(11, cell * 0.5)}px ${monoFont}`; ctx.fillText(G.msg, w / 2, h / 2);
      }
      if (paused && G.down === 0) {
        ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = C.surface; const bw = Math.min(w - 20, 230), bh = 34;
        ctx.fillRect(w / 2 - bw / 2, h - bh - 10, bw, bh); ctx.restore();
        ctx.fillStyle = C.ink2; ctx.font = `500 11px ${monoFont}`; ctx.fillText("Paused · click to play", w / 2, h - 10 - bh / 2);
      }
    };

    const sizeArena = () => {
      const w = canvas.parentElement!.clientWidth;
      if (!w) return;
      const dpr = window.devicePixelRatio || 1;
      cell = w / COLS;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(cell * ROWS * dpr);
      canvas.style.height = cell * ROWS + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const arenaLoop = (now: number) => {
      if (!running || disposed) return;
      if (!last) last = now;
      acc += now - last; last = now;
      if (acc > 600) acc = TICK;
      while (acc >= TICK) { step(); acc -= TICK; }
      alpha = clamp(acc / TICK, 0, 1);
      draw();
      requestAnimationFrame(arenaLoop);
    };
    const syncArena = () => {
      const go = visible && !paused && !document.hidden;
      if (go && !running) { running = true; last = 0; acc = 0; requestAnimationFrame(arenaLoop); }
      else if (!go) running = false;
      playBtn.textContent = paused ? "Play" : "Pause";
      if (!running) { alpha = 1; draw(); }
    };

    const onPlay = () => { paused = !paused; syncArena(); };
    const onReset = () => { newGame(); alpha = 1; draw(); };
    const onPointer = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor((ev.clientX - r.left) / cell), y = Math.floor((ev.clientY - r.top) / cell);
      if (!wall(x, y)) G.target = { x, y };
      if (paused) { paused = false; syncArena(); } else draw();
    };
    const KEYS: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    const onKey = (ev: KeyboardEvent) => {
      const k = KEYS[ev.key];
      if (!k) return;
      ev.preventDefault();
      const nx = G.player.x + k[0], ny = G.player.y + k[1];
      if (!wall(nx, ny)) G.target = { x: nx, y: ny };
      if (paused) { paused = false; syncArena(); }
    };
    const onTheme = () => { readColors(); draw(); };

    readColors();
    playBtn.addEventListener("click", onPlay);
    resetBtn.addEventListener("click", onReset);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("keydown", onKey);
    const darkMQ = matchMedia("(prefers-color-scheme: dark)");
    darkMQ.addEventListener("change", onTheme);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; syncArena(); }, { threshold: 0.2 });
    io.observe(canvas);
    document.addEventListener("visibilitychange", syncArena);
    const ro = new ResizeObserver(sizeArena);
    ro.observe(canvas.parentElement!);
    newGame(); sizeArena(); syncArena();
    document.fonts?.ready.then(() => { if (!disposed) { readColors(); draw(); } });

    return () => {
      disposed = true;
      running = false;
      playBtn.removeEventListener("click", onPlay);
      resetBtn.removeEventListener("click", onReset);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("keydown", onKey);
      darkMQ.removeEventListener("change", onTheme);
      mo.disconnect(); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", syncArena);
    };
  }, []);

  return (
    <div className="demo">
      <div className="demo-top">
        <p className="demo-title">Pathfinding arena</p>
        <span className="badge">Playable</span>
      </div>
      <div className="hud" aria-live="off" ref={hudRef}>
        <div className="hud-g">
          <span>Wave <b data-hud="wave">1</b></span>
          <span>HP <b data-hud="hp">5</b></span>
          <span>Kills <b data-hud="kills">0</b></span>
        </div>
        <div className="hud-g">
          <span className="st"><i className="idle"></i>Idle <b data-hud="idle">0</b></span>
          <span className="st"><i className="chase"></i>Chase <b data-hud="chase">0</b></span>
          <span className="st"><i className="attack"></i>Attack <b data-hud="attack">0</b></span>
        </div>
      </div>
      <div className="arena-wrap">
        <canvas id="arena" ref={canvasRef} tabIndex={0} aria-label="Pathfinding arena. Click a cell or use arrow keys to move the player."></canvas>
      </div>
      <div className="arena-ctl">
        <button className="btn sm" type="button" ref={playRef}>Pause</button>
        <button className="btn sm" type="button" ref={resetRef}>Restart</button>
      </div>
      <p className="fine">Click or tap the arena to move (arrow keys work too). Zombies switch between Idle, Chase and Attack states and follow the shortest path around walls, using grid search as a stand-in for NavMesh. You fire a raycast at the nearest zombie in line of sight.</p>
    </div>
  );
}
