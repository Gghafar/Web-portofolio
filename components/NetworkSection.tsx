"use client";

import { useEffect, useRef } from "react";
import Reveal from "./motion/Reveal";
import { DEFAULT_ACTIVE, EVIDENCE, NEEDS, SKILLS, W1, W2, W3 } from "@/data/network";
import { profile } from "@/data/profile";
import type { EvidenceKind } from "@/lib/types";

const KIND: Record<EvidenceKind, string> = { job: "work experience", project: "project", role: "organization" };
const SVGNS = "http://www.w3.org/2000/svg";
const H = 640, TOP = 64, BOT = H - 30, PH = 28;
const DELAY = [0, 300, 600, 900], TRAVEL = 300;
const fmt = (v: number) => v.toFixed(2);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type NetNode = {
  id: string; label: string; layer: number; desc?: string;
  kind?: EvidenceKind; role?: string; date?: string; anchor?: string; points?: string[];
  // layout + DOM, filled in by build()
  x?: number; cy?: number; cx?: number; w?: number;
  g?: SVGGElement; ring?: SVGElement; bg?: SVGElement; hi?: SVGElement; dot?: SVGElement; arc?: SVGElement;
  textEl?: SVGTextElement; valEl?: SVGTextElement; l1?: SVGTextElement; l2?: SVGTextElement;
};
type Edge = { from: string; to: string; w: number; layer: number; g?: SVGGElement; base?: SVGPathElement; act?: SVGPathElement; len: number };
type Pulse = { e: Edge; s: number; t0: number; c: SVGCircleElement };

export default function NetworkSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
    const RM = matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => RM.matches;
    let disposed = false;

    // Local copies: layout/DOM fields are attached to these objects.
    const needs: NetNode[] = NEEDS.map((n) => ({ ...n, layer: 0 }));
    const skills: NetNode[] = SKILLS.map((n) => ({ ...n, layer: 1 }));
    const evidence: NetNode[] = EVIDENCE.map((n) => ({ ...n, layer: 2 }));
    const OUT: NetNode = { id: "o", label: profile.name, layer: 3 };
    const LAYERS = [needs, skills, evidence, [OUT]];
    const NODES = [...needs, ...skills, ...evidence, OUT];
    const BY: Record<string, NetNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));
    const EDGES: Edge[] = [];
    for (const [f, m] of Object.entries(W1)) for (const [t, w] of Object.entries(m)) EDGES.push({ from: f, to: t, w, layer: 0, len: 0 });
    for (const [f, m] of Object.entries(W2)) for (const [t, w] of Object.entries(m)) EDGES.push({ from: f, to: t, w, layer: 1, len: 0 });
    for (const [f, w] of Object.entries(W3)) EDGES.push({ from: f, to: "o", w, layer: 2, len: 0 });
    const OUTE: Record<string, Edge[]> = {}, INE: Record<string, Edge[]> = {};
    EDGES.forEach((e) => { (OUTE[e.from] ||= []).push(e); (INE[e.to] ||= []).push(e); });

    const active = new Set(DEFAULT_ACTIVE);
    let selected = "o";
    const disp: Record<string, number> = {}, target: Record<string, number> = {}, startAt: Record<string, number> = {};

    /** Noisy-OR forward pass. */
    function forward() {
      const a: Record<string, number> = {};
      needs.forEach((n) => (a[n.id] = active.has(n.id) ? 1 : 0));
      [skills, evidence, [OUT]].forEach((layer) => layer.forEach((n) => {
        let p = 1;
        (INE[n.id] || []).forEach((e) => { p *= 1 - e.w * a[e.from]; });
        a[n.id] = 1 - p;
      }));
      return a;
    }
    { const a = forward(); NODES.forEach((n) => { disp[n.id] = target[n.id] = a[n.id]; startAt[n.id] = 0; }); }

    const mk = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) => {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      if (parent) parent.appendChild(e);
      return e;
    };
    const svg = $<SVGSVGElement>("#net"), frameEl = $<HTMLDivElement>("#net-frame");
    let gPulses: SVGGElement | null = null, gNodes: SVGGElement, builtW = 0;
    let raf: number | null = null, pulses: Pulse[] = [];

    function build() {
      const fw = frameEl.clientWidth;
      const W = Math.max(fw, 880);
      builtW = fw;
      pulses.forEach((p) => p.c.remove()); pulses = [];
      svg.textContent = "";
      svg.setAttribute("width", String(W)); svg.setAttribute("height", String(H)); svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const gHead = mk("g", {}, svg);
      const gEdges = mk("g", {}, svg); gPulses = mk("g", { "aria-hidden": "true" }, svg); gNodes = mk("g", {}, svg);

      NODES.forEach(makeNode);
      const maxW = [0, 0, 0];
      NODES.forEach((n) => {
        if (n.layer < 3) {
          const tl = Math.ceil(n.textEl!.getComputedTextLength());
          n.w = tl + 30 + 14 + (n.layer === 2 ? 34 : 0);
          maxW[n.layer] = Math.max(maxW[n.layer], n.w);
        }
      });
      const PAD = 18, OUTW = 110;
      const free = W - PAD * 2 - maxW[0] - maxW[1] - maxW[2] - OUTW;
      const gap = Math.max(56, free / 3);
      const colX = [PAD, PAD + maxW[0] + gap, PAD + maxW[0] + gap + maxW[1] + gap];
      const outCx = colX[2] + maxW[2] + gap + OUTW / 2;
      const inset = [44, 0, 18];
      LAYERS.forEach((layer, li) => {
        if (li === 3) return;
        const t = TOP + inset[li], b = BOT - inset[li];
        layer.forEach((n, i) => {
          n.cy = layer.length === 1 ? (t + b) / 2 : t + (i * (b - t)) / (layer.length - 1);
          n.x = li === 0 ? colX[0] + (maxW[0] - n.w!) : colX[li];
          placePill(n);
        });
      });
      OUT.cx = outCx; OUT.cy = (TOP + BOT) / 2 - 10; placeOut();

      const heads: [string, number][] = [["Input · needs", colX[0]], ["Hidden · skills", colX[1]], ["Evidence · work", colX[2]], ["Output", outCx - 22]];
      heads.forEach(([t, x]) => { mk("text", { class: "lh", x, y: 30 }, gHead).textContent = t; });
      mk("line", { x1: PAD, x2: W - PAD, y1: 42, y2: 42, stroke: "var(--line)", "stroke-width": 1 }, gHead);

      EDGES.forEach((e) => {
        const a = BY[e.from], b = BY[e.to];
        const x1 = a.x! + a.w!, y1 = a.cy!;
        const x2 = b.layer === 3 ? b.cx! - 30 : b.x!, y2 = b.cy!;
        const dx = (x2 - x1) * 0.5;
        const d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
        e.g = mk("g", { class: "eg" }, gEdges);
        e.base = mk("path", { class: "e-base", d, "stroke-opacity": (0.35 + 0.5 * e.w).toFixed(2) }, e.g);
        e.act = mk("path", { class: "e-act", d }, e.g);
        e.len = 0;
      });
      paint();
      highlightSel();
      frameEl.classList.toggle("scrolls", W > fw + 1);
    }

    function makeNode(n: NetNode) {
      const cls = ["input", "hidden", "evid", "out"][n.layer];
      const g = mk("g", { class: "node " + cls, tabindex: 0, role: "button", "data-id": n.id }, gNodes);
      n.g = g;
      if (n.layer < 3) {
        n.ring = mk("rect", { class: "sel-ring", height: PH + 8, rx: (PH + 8) / 2 }, g);
        n.bg = mk("rect", { class: "pill-bg", height: PH, rx: PH / 2 }, g);
        n.hi = mk("rect", { class: "pill-hi", height: PH, rx: PH / 2, "stroke-opacity": 0 }, g);
        n.dot = mk("circle", { class: "dot", r: 5, "fill-opacity": 0 }, g);
        n.textEl = mk("text", { class: "n-lbl", "dominant-baseline": "central" }, g);
        n.textEl.textContent = n.label;
        if (n.layer === 2) { n.valEl = mk("text", { class: "n-val", "dominant-baseline": "central", "text-anchor": "end" }, g); n.valEl.textContent = "0.00"; }
      } else {
        n.ring = mk("circle", { class: "sel-ring", r: 37 }, g);
        n.bg = mk("circle", { class: "out-bg", r: 30 }, g);
        n.arc = mk("circle", { class: "out-arc", r: 30 }, g);
        n.valEl = mk("text", { class: "out-val", "dominant-baseline": "central" }, g);
        n.l1 = mk("text", { class: "out-lbl" }, g); n.l1.textContent = profile.firstName;
        n.l2 = mk("text", { class: "out-lbl" }, g); n.l2.textContent = profile.lastName;
      }
      if (n.layer === 0) g.setAttribute("aria-pressed", active.has(n.id) ? "true" : "false");
      g.setAttribute("aria-label", ["Input", "Skill", "Evidence", "Output"][n.layer] + ": " + n.label);
      g.addEventListener("pointerenter", () => hover(n.id));
      g.addEventListener("pointerleave", () => hover(null));
      g.addEventListener("focus", () => hover(n.id));
      g.addEventListener("blur", () => hover(null));
      g.addEventListener("click", () => activateNode(n));
      g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); activateNode(n); } });
    }
    function placePill(n: NetNode) {
      const x = n.x!, cy = n.cy!, w = n.w!, y = cy - PH / 2;
      [n.bg!, n.hi!].forEach((r) => { r.setAttribute("x", String(x)); r.setAttribute("y", String(y)); r.setAttribute("width", String(w)); });
      n.ring!.setAttribute("x", String(x - 4)); n.ring!.setAttribute("y", String(y - 4)); n.ring!.setAttribute("width", String(w + 8));
      n.dot!.setAttribute("cx", String(x + 15)); n.dot!.setAttribute("cy", String(cy));
      n.textEl!.setAttribute("x", String(x + 29)); n.textEl!.setAttribute("y", String(cy));
      if (n.valEl) { n.valEl.setAttribute("x", String(x + w - 12)); n.valEl.setAttribute("y", String(cy)); }
    }
    function placeOut() {
      const n = OUT, C = 2 * Math.PI * 30, cx = String(n.cx), cy = String(n.cy);
      [n.ring!, n.bg!, n.arc!].forEach((c) => { c.setAttribute("cx", cx); c.setAttribute("cy", cy); });
      n.arc!.setAttribute("stroke-dasharray", C.toFixed(2));
      n.arc!.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
      n.valEl!.setAttribute("x", cx); n.valEl!.setAttribute("y", cy);
      n.l1!.setAttribute("x", cx); n.l1!.setAttribute("y", String(n.cy! + 56));
      n.l2!.setAttribute("x", cx); n.l2!.setAttribute("y", String(n.cy! + 71));
    }

    function paint() {
      NODES.forEach((n) => {
        const v = disp[n.id];
        if (!n.g) return;
        if (n.layer < 3) {
          n.dot!.setAttribute("fill-opacity", v.toFixed(3));
          if (n.layer > 0) n.hi!.setAttribute("stroke-opacity", (v * 0.9).toFixed(3));
          if (n.valEl) n.valEl.textContent = fmt(v);
          if (n.layer === 0) n.g.classList.toggle("on", active.has(n.id));
        } else {
          const C = 2 * Math.PI * 30;
          n.arc!.setAttribute("stroke-dashoffset", (C * (1 - v)).toFixed(2));
          n.valEl!.textContent = fmt(v);
        }
      });
      EDGES.forEach((e) => {
        if (!e.act) return;
        const s = e.w * disp[e.from];
        e.act.setAttribute("stroke-opacity", (s * 0.85).toFixed(3));
        e.act.setAttribute("stroke-width", (0.6 + 2.6 * s).toFixed(2));
      });
    }

    /* animation */
    function kick() { if (!raf && !disposed) raf = requestAnimationFrame(loop); }
    function loop(now: number) {
      let moving = false;
      NODES.forEach((n) => {
        const id = n.id;
        if (now < startAt[id]) { moving = true; return; }
        const d = disp[id], t = target[id];
        if (d !== t) { const nd = d + (t - d) * 0.16; disp[id] = Math.abs(t - nd) < 0.003 ? t : nd; moving = true; }
      });
      paint();
      pulses = pulses.filter((p) => {
        const k = (now - p.t0) / TRAVEL;
        if (k < 0) { p.c.setAttribute("opacity", "0"); return true; }
        if (k > 1) { p.c.remove(); return false; }
        if (!p.e.len) p.e.len = p.e.base!.getTotalLength();
        const pt = p.e.base!.getPointAtLength(p.e.len * k);
        p.c.setAttribute("cx", String(pt.x)); p.c.setAttribute("cy", String(pt.y));
        p.c.setAttribute("opacity", (Math.sin(Math.PI * k) * (0.35 + 0.65 * p.s)).toFixed(3));
        return true;
      });
      if (pulses.length) moving = true;
      raf = moving && !disposed ? requestAnimationFrame(loop) : null;
    }
    function spawnPulses(now: number) {
      if (reduced() || !gPulses) return;
      EDGES.forEach((e) => {
        const s = e.w * target[e.from];
        if (s > 0.12) pulses.push({ e, s, t0: now + DELAY[e.layer], c: mk("circle", { class: "pulse", r: (1.8 + 1.6 * s).toFixed(2), opacity: 0 }, gPulses!) });
      });
      kick();
    }
    function runForward() {
      const a = forward(), now = performance.now();
      NODES.forEach((n) => { target[n.id] = a[n.id]; startAt[n.id] = reduced() ? 0 : now + DELAY[n.layer]; });
      if (reduced()) NODES.forEach((n) => (disp[n.id] = target[n.id]));
      spawnPulses(now);
      kick();
      syncChips(); renderRank(); renderInspector();
    }

    /* hover trace */
    function trace(id: string) {
      const nodes = new Set([id]), edges = new Set<Edge>();
      let fr = [id];
      while (fr.length) { const nx: string[] = []; fr.forEach((i) => (INE[i] || []).forEach((e) => { edges.add(e); if (!nodes.has(e.from)) { nodes.add(e.from); nx.push(e.from); } })); fr = nx; }
      fr = [id];
      while (fr.length) { const nx: string[] = []; fr.forEach((i) => (OUTE[i] || []).forEach((e) => { edges.add(e); if (!nodes.has(e.to)) { nodes.add(e.to); nx.push(e.to); } })); fr = nx; }
      return { nodes, edges };
    }
    function hover(id: string | null) {
      if (!id) { svg.classList.remove("hovering"); return; }
      const { nodes, edges } = trace(id);
      svg.classList.add("hovering");
      NODES.forEach((n) => n.g!.classList.toggle("rel", nodes.has(n.id)));
      EDGES.forEach((e) => e.g!.classList.toggle("hl", edges.has(e)));
    }
    function highlightSel() { NODES.forEach((n) => n.g && n.g.classList.toggle("sel", n.id === selected)); }
    function select(id: string) { selected = id; highlightSel(); renderInspector(); }
    function toggleNeed(id: string) { if (active.has(id)) active.delete(id); else active.add(id); runForward(); }
    function activateNode(n: NetNode) { if (n.layer === 0) toggleNeed(n.id); select(n.id); }

    /* chips */
    const chipsEl = $<HTMLDivElement>("#chips");
    chipsEl.textContent = "";
    needs.forEach((n) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.dataset.id = n.id;
      b.innerHTML = `<span class="d" aria-hidden="true"></span>${esc(n.label)}`;
      b.addEventListener("click", () => { toggleNeed(n.id); if (BY[selected].layer === 0) select(n.id); });
      chipsEl.appendChild(b);
    });
    function syncChips() {
      chipsEl.querySelectorAll<HTMLButtonElement>(".chip").forEach((b) => b.setAttribute("aria-pressed", active.has(b.dataset.id!) ? "true" : "false"));
      needs.forEach((n) => n.g && n.g.setAttribute("aria-pressed", active.has(n.id) ? "true" : "false"));
    }
    const onAllOn = () => { needs.forEach((n) => active.add(n.id)); runForward(); };
    const onAllOff = () => { active.clear(); runForward(); };
    const onReplay = () => {
      const now = performance.now();
      NODES.forEach((n) => { if (n.layer > 0) { disp[n.id] = 0; startAt[n.id] = reduced() ? 0 : now + DELAY[n.layer]; } });
      if (reduced()) NODES.forEach((n) => (disp[n.id] = target[n.id]));
      spawnPulses(now); kick();
    };
    const allOn = $<HTMLButtonElement>("#all-on"), allOff = $<HTMLButtonElement>("#all-off"), replay = $<HTMLButtonElement>("#replay");
    allOn.addEventListener("click", onAllOn);
    allOff.addEventListener("click", onAllOff);
    replay.addEventListener("click", onReplay);

    /* ranking panel */
    const rankEl = $<HTMLOListElement>("#rank");
    rankEl.textContent = "";
    const rankItems: Record<string, HTMLLIElement> = {};
    evidence.forEach((n) => {
      const li = document.createElement("li");
      li.innerHTML = `<button type="button"><span>${esc(n.label)}</span><span class="bar"><i></i></span><span class="v">0.00</span></button>`;
      li.querySelector("button")!.addEventListener("click", () => select(n.id));
      rankItems[n.id] = li; rankEl.appendChild(li);
    });
    function renderRank() {
      const sorted = [...evidence].sort((a, b) => target[b.id] - target[a.id]);
      sorted.forEach((n) => {
        const li = rankItems[n.id], v = target[n.id];
        li.querySelector<HTMLElement>(".bar i")!.style.width = (v * 100).toFixed(1) + "%";
        li.querySelector(".v")!.textContent = fmt(v);
        li.classList.toggle("dim", v < 0.05);
        rankEl.appendChild(li);
      });
    }

    /* inspector */
    const insp = $<HTMLDivElement>("#inspector");
    const row = (id: string, right: string, cls = "") =>
      `<li><button type="button" data-sel="${id}"><span>${esc(BY[id].label)}</span><span class="v ${cls}">${right}</span></button></li>`;
    function renderInspector() {
      const n = BY[selected], a = target;
      let h = "";
      if (n.layer === 0) {
        const on = active.has(n.id);
        h = `<p class="eyebrow">Input layer · hiring need</p><h3>${esc(n.label)}</h3><p class="meta">${esc(n.desc!)}</p>
          <p class="state">${on ? '<b class="on">On</b>, sending signal into the network' : "<b>Off</b>, no signal"}</p>
          <button class="btn sm" type="button" data-toggle="${n.id}">${on ? "Switch off" : "Switch on"}</button>
          <h4>Feeds these skills</h4><ul class="links">${OUTE[n.id].map((e) => row(e.to, "weight " + fmt(e.w))).join("")}</ul>`;
      } else if (n.layer === 1) {
        h = `<p class="eyebrow">Hidden layer · skill</p><h3>${esc(n.label)}</h3><p class="meta">${esc(n.desc!)}</p>
          <div class="act-row"><span>Activation</span><span class="v">${fmt(a[n.id])}</span></div>
          <h4>Fed by</h4><ul class="links">${INE[n.id].map((e) => row(e.from, active.has(e.from) ? "on" : "off", active.has(e.from) ? "on-tag" : "")).join("")}</ul>
          <h4>Shows up in</h4><ul class="links">${OUTE[n.id].map((e) => row(e.to, fmt(a[e.to]))).join("")}</ul>`;
      } else if (n.layer === 2) {
        h = `<p class="eyebrow">Evidence layer · ${KIND[n.kind!]}</p><h3>${esc(n.label)}</h3><p class="meta">${esc(n.role!)} · ${esc(n.date!)}</p>
          <ul class="pts">${n.points!.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div class="act-row"><span>Activation</span><span class="v">${fmt(a[n.id])}</span></div>
          <h4>Skills feeding it</h4><ul class="links">${INE[n.id].map((e) => row(e.from, fmt(a[e.from]))).join("")}</ul>
          <a class="more" href="${n.anchor}">Read the full entry ↓</a>`;
      } else {
        const none = active.size === 0;
        h = `<p class="eyebrow">Output layer</p><h3>${esc(profile.name)}</h3>
          <p class="meta">AI Engineering student at ITS, graduating in September 2027.</p>
          <div class="act-row"><span>Activation for ${none ? "no inputs" : active.size === 1 ? "your 1 input" : `your ${active.size} inputs`}</span><span class="v">${fmt(a.o)}</span></div>
          <p class="meta" style="margin-top:14px">${none
            ? "Every input is off, so no signal reaches the output. Switch on a need above to run a forward pass."
            : "The output combines every piece of evidence with a noisy-OR, so it climbs as more of my work matches what you switched on. Click a node to see why it lit up."}</p>`;
      }
      insp.innerHTML = h;
    }
    const onInspClick = (ev: MouseEvent) => {
      const el = ev.target as Element;
      const s = el.closest<HTMLElement>("[data-sel]"); if (s) { select(s.dataset.sel!); return; }
      const t = el.closest<HTMLElement>("[data-toggle]"); if (t) toggleNeed(t.dataset.toggle!);
    };
    insp.addEventListener("click", onInspClick);

    build(); syncChips(); renderRank(); renderInspector();
    document.fonts?.ready.then(() => { if (!disposed) build(); });
    const ro = new ResizeObserver(() => { if (Math.abs(frameEl.clientWidth - builtW) > 4) build(); });
    ro.observe(frameEl);

    let netVisible = false;
    const io = new IntersectionObserver(([en]) => {
      const was = netVisible; netVisible = en.isIntersecting;
      if (netVisible && !was) spawnPulses(performance.now());
    }, { threshold: 0.35 });
    io.observe(frameEl);
    const iv = setInterval(() => {
      if (netVisible && active.size && !document.hidden && !svg.classList.contains("hovering")) spawnPulses(performance.now());
    }, 3600);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      clearInterval(iv);
      ro.disconnect(); io.disconnect();
      allOn.removeEventListener("click", onAllOn);
      allOff.removeEventListener("click", onAllOff);
      replay.removeEventListener("click", onReplay);
      insp.removeEventListener("click", onInspClick);
      svg.textContent = ""; chipsEl.textContent = ""; rankEl.textContent = ""; insp.textContent = "";
    };
  }, []);

  return (
    <section className="sec" id="network" ref={rootRef}>
      <Reveal className="sec-head">
        <div>
          <p className="eyebrow">Interactive · forward pass</p>
          <h2>What are you hiring for?</h2>
        </div>
        <p className="sec-intro">Switch on the inputs that match your role. The signal runs through the skills I have used and lights up the work that proves them. Hover a node to trace its paths, or click it for details.</p>
      </Reveal>
      <div className="chips" id="chips" role="group" aria-label="Hiring needs (input layer)"></div>
      <div className="chip-tools">
        <button className="linkbtn" type="button" id="all-on">Switch all on</button>
        <button className="linkbtn" type="button" id="all-off">Clear</button>
        <button className="linkbtn" type="button" id="replay">Replay the signal</button>
      </div>
      <div className="net-frame" id="net-frame">
        <svg id="net" role="group" aria-label="Network of hiring needs, skills, and projects or roles"></svg>
      </div>
      <p className="scroll-hint">Swipe sideways to see the whole network →</p>
      <div className="net-panels">
        <div className="panel" id="inspector" aria-live="polite" data-spotlight></div>
        <div className="panel" data-spotlight>
          <p className="eyebrow">Output · ranked</p>
          <h3>Strongest evidence for your selection</h3>
          <ol className="rank" id="rank"></ol>
          <p className="note">Each score is a noisy-OR of the signals flowing into that node, from 0 to 1.</p>
        </div>
      </div>
    </section>
  );
}
