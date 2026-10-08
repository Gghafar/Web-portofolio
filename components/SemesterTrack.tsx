"use client";

import { useEffect, useState } from "react";
import { EDUCATION } from "@/data/skills";

/** Depends on today's date, so it renders after mount to avoid a build-time/visit-time mismatch. */
export default function SemesterTrack() {
  const [months, setMonths] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    setMonths((now.getFullYear() - EDUCATION.start.year) * 12 + (now.getMonth() + 1 - EDUCATION.start.month));
  }, []);

  const total = EDUCATION.semesters;
  const sem = months === null ? 0 : Math.min(total, Math.max(1, Math.floor(months / 6) + 1));
  const graduated = months !== null && months >= total * 6 + 1;

  return (
    <div>
      <div className="sem" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={i + 1 < sem ? "done" : i + 1 === sem ? "now" : ""}></i>
        ))}
      </div>
      <div className="sem-cap">
        <span>{months === null ? " " : graduated ? <b>Graduated</b> : <><b>Semester {sem}</b> of {total}</>}</span>
        <span>{EDUCATION.range}</span>
      </div>
    </div>
  );
}
