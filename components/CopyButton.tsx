"use client";

import { useEffect, useRef, useState } from "react";

/** Copies `text`; if the clipboard API is unavailable, selects the element `targetId` so the visitor can copy by hand. */
export default function CopyButton({ text, targetId, label = "Copy email" }: { text: string; targetId: string; label?: string }) {
  const [msg, setMsg] = useState(label);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const done = (m: string) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(label), 1800);
  };
  const fallback = () => {
    const t = document.getElementById(targetId);
    const s = getSelection();
    if (t && s) {
      const r = document.createRange();
      r.selectNodeContents(t);
      s.removeAllRanges();
      s.addRange(r);
    }
    done("Selected, press Ctrl+C");
  };

  return (
    <button
      className="btn primary"
      type="button"
      onClick={() => {
        try {
          navigator.clipboard.writeText(text).then(() => done("Copied"), fallback);
        } catch {
          fallback();
        }
      }}
    >
      <span className="bl">{msg}</span>
    </button>
  );
}
