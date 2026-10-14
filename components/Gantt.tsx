"use client";

import { useState } from "react";
import { useNow } from "@/lib/useNow";
import { TIMELINE, TIMELINE_END, TIMELINE_START, TIMELINE_YEARS } from "@/data/experience";
import type { TimelineSeg } from "@/lib/types";

const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const T0 = new Date(TIMELINE_START.year, TIMELINE_START.month - 1, 1).getTime();
const T1 = new Date(TIMELINE_END.year, TIMELINE_END.month - 1, 1).getTime();

const pct = (d: Date | number) => Math.min(100, Math.max(0, ((+d - T0) / (T1 - T0)) * 100));
const ym = (s: string) => s.split("-").map(Number) as [number, number];
const mStart = (s: string) => { const [y, m] = ym(s); return new Date(y, m - 1, 1); };
const mEnd = (s: string) => { const [y, m] = ym(s); return new Date(y, m, 1); };
const mName = (s: string) => { const [y, m] = ym(s); return [MN[m - 1], y] as const; };
const range = (s: string, e: string) => {
  const [a, ay] = mName(s), [b, by] = mName(e);
  if (s === e) return `${a} ${ay}`;
  return ay === by ? `${a} – ${b} ${ay}` : `${a} ${ay} – ${b} ${by}`;
};

function segLabel(sg: TimelineSeg) {
  if (sg.k === "edu-next") return sg.t;
  return `${sg.t} · ${sg.e === "now" ? range(sg.s, sg.s) + " – present" : range(sg.s, sg.e)}`;
}

export default function Gantt() {
  // "Now" depends on the visitor's clock, so the bars are drawn after mount.
  const now = useNow();
  const [readout, setReadout] = useState("Hover or tap a bar to see its dates.");

  const years = TIMELINE_YEARS.map((y) => ({ y, left: pct(new Date(y, 0, 1)).toFixed(2) + "%" }));

  return (
    <div className="gantt">
      <div className="g-top">
        <p className="g-readout">{readout}</p>
        <ul className="legend">
          <li><i style={{ background: "var(--ink)" }}></i>Work</li>
          <li><i style={{ background: "var(--accent)" }}></i>Project</li>
          <li><i style={{ background: "var(--expert)" }}></i>Expert Staff</li>
          <li><i style={{ background: "var(--staff)" }}></i>Staff</li>
          <li><i style={{ border: "1.5px solid var(--ink-2)" }}></i>Degree</li>
        </ul>
      </div>
      <div className="g-grid">
        <span></span>
        <div className="g-axis">
          {years.map(({ y, left }) => <span key={y} style={{ left }}>{y}</span>)}
        </div>
        <div className="g-lines" style={{ gridRow: `2 / span ${TIMELINE.length}` }}>
          {years.map(({ y, left }) => <i key={y} style={{ left }}></i>)}
          {now && (
            <>
              <i className="now" style={{ left: pct(now).toFixed(2) + "%" }}></i>
              <b style={{ left: pct(now).toFixed(2) + "%" }}>Now</b>
            </>
          )}
        </div>
        {TIMELINE.map((r, ri) => (
          <TimelineRowView key={r.label} row={r} index={ri} now={now} onInfo={setReadout} />
        ))}
      </div>
    </div>
  );
}

function TimelineRowView({ row, index, now, onInfo }: { row: (typeof TIMELINE)[number]; index: number; now: Date | null; onInfo: (s: string) => void }) {
  return (
    <>
      <span className="g-lbl" style={{ gridRow: index + 2, gridColumn: 1 }}>{row.label}</span>
      <div className="g-track" style={{ gridRow: index + 2, gridColumn: 2 }}>
        {now && row.segs.map((sg) => {
          const l = pct(sg.s === "now" ? now : mStart(sg.s));
          const w = pct(sg.e === "now" ? now : mEnd(sg.e)) - l;
          const info = `${row.label}: ${segLabel(sg)}`;
          return (
            <a
              key={sg.s + sg.k}
              className={`g-bar k-${sg.k}`}
              href={row.anchor}
              style={{ left: l.toFixed(2) + "%", width: Math.max(w, 0).toFixed(2) + "%" }}
              aria-label={info}
              onPointerEnter={() => onInfo(info)}
              onFocus={() => onInfo(info)}
            ></a>
          );
        })}
      </div>
    </>
  );
}
