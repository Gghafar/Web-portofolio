"use client";

import { useSyncExternalStore } from "react";
import { SearchIcon } from "lucide-react";
import { openSpotlight } from "@/components/CommandMenu";
import { APPS } from "@/lib/desktop/apps";
import { desktop, focusedId, useDesktop } from "@/lib/desktop/store";
import { MENU } from "@/data/desktop";
import { profile } from "@/data/profile";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The clock ticks once per minute; the snapshot is the current minute so React re-renders only then.
const minuteNow = () => Math.floor(Date.now() / 60000);
const subscribeMinute = (cb: () => void) => {
  const id = window.setInterval(cb, 5000);
  return () => window.clearInterval(id);
};

/** "Tue 14 Oct  09:41" after mount; empty while prerendering (the build doesn't know the visitor's time). */
function useClock() {
  const minute = useSyncExternalStore(subscribeMinute, minuteNow, () => null);
  if (minute === null) return "";
  const d = new Date(minute * 60000);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}  ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function MenuBar() {
  const state = useDesktop();
  const clock = useClock();
  const active = focusedId(state);
  // Like macOS, the bold name is the app in front; with nothing open it is the owner of the desktop.
  const activeName = active ? APPS[active]?.name : profile.name;

  return (
    <header className="menubar">
      <nav aria-label="Menu" className="menubar-left">
        <button type="button" className="mb" aria-label="Close all windows" onClick={() => desktop.closeAll()}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="#111111" />
            <circle cx="12" cy="12" r="3.5" fill="var(--desk-accent)" />
          </svg>
        </button>
        <button type="button" className="mb mb-app" onClick={(e) => desktop.open(active ?? "about", APPS[active ?? "about"].width, e.currentTarget)}>
          {activeName}
        </button>
        {MENU.map((m) => (
          <button key={m.app} type="button" className="mb mb-hide" onClick={(e) => desktop.open(m.app, APPS[m.app].width, e.currentTarget)}>
            {m.label}
          </button>
        ))}
      </nav>
      <div className="menubar-right">
        <span className="mb-hide mb-status">{profile.role}</span>
        <svg className="mb-hide" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19.5" r="0.8" fill="#111111" />
        </svg>
        <svg viewBox="0 0 28 14" width="24" height="12" fill="none" aria-hidden="true">
          <rect x="0.75" y="0.75" width="23" height="12.5" rx="3.5" stroke="#111111" strokeWidth="1.5" />
          <rect x="3" y="3" width="15" height="8" rx="1.5" fill="#111111" />
          <rect x="25.5" y="4.5" width="2" height="5" rx="1" fill="#111111" />
        </svg>
        <button type="button" className="mb mb-icon" aria-label="Spotlight search (⌘K)" title="Spotlight (⌘K)" onClick={openSpotlight}>
          <SearchIcon size={15} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="mb-clock">
          {clock}
        </span>
      </div>
    </header>
  );
}
