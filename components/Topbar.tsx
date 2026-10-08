"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, profile } from "@/data/profile";

export default function Topbar() {
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (fill.current) fill.current.style.width = (h > 0 ? Math.min(1, Math.max(0, scrollY / h)) * 100 : 0) + "%";
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href="#top">
          <i aria-hidden="true"></i>
          <span>{profile.name}</span>
        </a>
        <nav className="nav" aria-label="Sections">
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={active === id ? "on" : undefined}>
              {label}
            </a>
          ))}
        </nav>
      </div>
      <div className="progress" aria-hidden="true">
        <span ref={fill}></span>
      </div>
    </header>
  );
}
