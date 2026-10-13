"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { openCommandMenu } from "@/components/CommandMenu";
import { NAV, profile } from "@/data/profile";
import { toggleTheme, useTheme } from "@/lib/theme";

export default function Topbar() {
  const [active, setActive] = useState<string | null>(null);
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    // Clear the underline when scrolled back up into the hero.
    const hero = document.getElementById("top");
    const heroIO = new IntersectionObserver(([en]) => en.isIntersecting && setActive(null), { rootMargin: "0px 0px -60% 0px" });
    if (hero) heroIO.observe(hero);
    return () => {
      io.disconnect();
      heroIO.disconnect();
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-in">
        <a className="brand" href="#top">
          <i aria-hidden="true"></i>
          <span>{profile.name}</span>
        </a>
        <div style={{ display: "flex", alignItems: "center" }}>
          <nav className="nav" aria-label="Sections">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} aria-current={active === id ? "true" : undefined}>
                {label}
                {active === id && (
                  <motion.span layoutId="nav-ind" className="nav-ind" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                )}
              </a>
            ))}
          </nav>
          <div className="topbar-tools">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-[var(--ink-2)] hover:text-foreground" onClick={openCommandMenu} aria-label="Open command menu">
                  <SearchIcon className="size-4" />
                  <kbd className="kbd">⌘K</kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Jump anywhere</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-[var(--ink-2)] hover:text-foreground" onClick={toggleTheme} aria-label="Toggle colour theme">
                  {/* theme is null during SSR/hydration, then the real value; keyed so the icon spins in on each change. */}
                  <motion.span key={theme ?? "ssr"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
                    {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                  </motion.span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="progress" aria-hidden="true">
        <motion.span style={{ scaleX: progress }}></motion.span>
      </div>
    </header>
  );
}
