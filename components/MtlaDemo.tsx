"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { MTLA_SAMPLE } from "@/data/projects";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const LABELS = ["label_0", "label_1", "label_2", "label_3", "label_4"];
const fmt = (v: number) => v.toFixed(2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const hash = (str: string) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
};
const mulberry = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Trial = { lab: number; toks: number[]; conf: number };
type Result = { trials: Trial[]; win: { i: number; n: number; mc: number }; N: number };

/** Deterministic for a given text, N and run number, so the first render matches on server and client. */
function simulate(text: string, N: number, runCount: number): Result {
  const hv = hash(text.trim() || " ");
  const rnd = mulberry(hv + runCount * 7919);
  const truth = hv % 5;
  const trials: Trial[] = [];
  for (let i = 0; i < N; i++) {
    const good = rnd() < 0.7;
    const lab = good ? truth : (truth + 1 + Math.floor(rnd() * 4)) % 5;
    const base = good ? 0.72 + rnd() * 0.2 : 0.36 + rnd() * 0.24;
    const toks = Array.from({ length: 10 }, () => clamp(base + (rnd() - 0.5) * 0.26, 0.05, 0.99));
    trials.push({ lab, toks, conf: toks.reduce((s, v) => s + v, 0) / 10 });
  }
  const tally = LABELS.map((_, i) => ({ i, n: 0, c: 0, mc: 0 }));
  trials.forEach((t) => { tally[t.lab].n++; tally[t.lab].c += t.conf; });
  tally.forEach((t) => (t.mc = t.n ? t.c / t.n : 0));
  const win = [...tally].sort((a, b) => b.n - a.n || b.mc - a.mc)[0];
  return { trials, win, N };
}

export default function MtlaDemo() {
  const [text, setText] = useState(MTLA_SAMPLE);
  const [n, setN] = useState(5);
  const [result, setResult] = useState(() => simulate(MTLA_SAMPLE, 5, 0));
  const [shown, setShown] = useState(5);
  const [done, setDone] = useState(true);

  /** How many times the visitor has run it; seeds the sampler and keys the rows so they re-animate. */
  const [runCount, setRunCount] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rangeRef = useRef<HTMLInputElement>(null);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0; // clear in place: the unmount cleanup holds this same array
    const next = runCount + 1;
    setRunCount(next);
    const r = simulate(text, n, next);
    setResult(r);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(r.N);
      setDone(true);
      return;
    }
    setShown(0);
    setDone(false);
    r.trials.forEach((_, i) => timers.current.push(setTimeout(() => setShown(i + 1), 140 + i * 170)));
    timers.current.push(setTimeout(() => setDone(true), 240 + r.trials.length * 170));
  };
  // Re-run when the slider is released (native "change"), not on every drag step.
  // useEffectEvent lets the listener call the latest `run` without re-subscribing each render.
  const onSliderRelease = useEffectEvent(run);
  useEffect(() => {
    const el = rangeRef.current;
    const pending = timers.current;
    const onChange = () => onSliderRelease();
    el?.addEventListener("change", onChange);
    return () => {
      el?.removeEventListener("change", onChange);
      pending.forEach(clearTimeout);
    };
  }, []);

  const { trials, win, N } = result;
  const counts = [0, 0, 0, 0, 0];
  trials.slice(0, shown).forEach((t) => counts[t.lab]++);
  const first = trials[0];

  return (
    <div className="demo">
      <div className="demo-top">
        <p className="demo-title">Multi-Trial Logit Averaging</p>
        <span className="badge">Simulated demo</span>
      </div>
      <div>
        <label className="fl" htmlFor="mtla-text">Input post</label>
        <textarea id="mtla-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="ctl-row">
        <div className="range">
          <label htmlFor="mtla-n">Trials N</label>
          <input ref={rangeRef} type="range" id="mtla-n" min={1} max={9} step={1} value={n} onChange={(e) => setN(+e.target.value)} />
          <output htmlFor="mtla-n">{n}</output>
        </div>
        <LiquidButton type="button" size="default" className="rounded-full font-semibold" disabled={!done} onClick={run}>
          {runCount === 0 ? "Run inference" : "Run again"}
        </LiquidButton>
      </div>
      <div className="trials" aria-live="polite">
        {trials.slice(0, shown).map((t, i) => (
          <div key={`${runCount}-${i}`} className={done && t.lab === win.i ? "trial win" : "trial"}>
            <span>trial {i + 1}</span>
            <span className="toks">{t.toks.map((p, j) => <i key={j} style={{ height: `${Math.round(p * 100)}%` }}></i>)}</span>
            <span className="lab">{LABELS[t.lab]}</span>
            <span className="conf">{fmt(t.conf)}</span>
          </div>
        ))}
      </div>
      <div className="tally">
        {LABELS.map((l, i) => (
          <div key={l} className={done && i === win.i ? "tally-row win" : "tally-row"}>
            <span>{l}</span>
            <span className="bar"><i style={{ width: `${(counts[i] / N) * 100}%` }}></i></span>
            <span>{counts[i]}/{N}</span>
          </div>
        ))}
      </div>
      <p className="verdict">
        {!done ? "Running trials…" : (
          <>
            Majority vote: <strong>{LABELS[win.i]}</strong>, {win.n} of {N} trials, mean confidence {fmt(win.mc)}.{" "}
            {N === 1
              ? "With one trial there is nothing to vote on. Raise N to see voting at work."
              : first.lab !== win.i
                ? <>A single pass would have returned <strong>{LABELS[first.lab]}</strong> at {fmt(first.conf)} confidence. Voting overrode it.</>
                : "Trial 1 already agreed this time. Press Run again to resample; voting pays off when the first sample drifts."}
          </>
        )}
      </p>
      <p className="fine">Runs in your browser to show how the voting works. Each bar is one of the first 10 generated tokens and its height is that token&apos;s probability. Labels are placeholders and no real model is called.</p>
    </div>
  );
}
