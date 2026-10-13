"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import { toast } from "sonner";
import { BriefcaseIcon, CopyIcon, ExternalLinkIcon, FolderGitIcon, HashIcon, MailIcon, MoonIcon, UsersIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { NAV, profile } from "@/data/profile";
import { dfk, shooter } from "@/data/projects";
import { JOBS, MAJOR_ORGS, MINOR_ORGS } from "@/data/experience";
import { toggleTheme } from "@/lib/theme";

const OPEN_EVENT = "command-menu:open";

/** Lets any button (e.g. the topbar search) open the palette without sharing React state. */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast.success("Email copied", { description: profile.email });
  } catch {
    toast.error("Couldn't copy automatically", { description: profile.email });
  }
}

/**
 * Stricter than cmdk's default fuzzy match (which lets "toggle" hit "Kementerian … Digital"):
 * every typed word must appear as-is, and matches at the start of a word rank higher.
 */
function filter(value: string, search: string) {
  const hay = value.toLowerCase();
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.every((t) => hay.includes(t))) return 0;
  const wordStarts = terms.filter((t) => hay.startsWith(t) || hay.includes(" " + t)).length;
  return 0.5 + (0.5 * wordStarts) / terms.length;
}

/** Glide to an element with the same easing as wheel scrolling (Lenis), or the browser's own scroll without it. */
function jumpTo(id: string, lenis: Lenis | undefined) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { force: true }); // stops at the element's scroll-margin-top
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
}

/**
 * Run `fn` once the dialog has fully closed: Radix removes <body data-scroll-locked> at the end of
 * the close animation, and only then does SmoothScroll restart Lenis (which would cancel a scroll
 * started earlier). Waiting also keeps the fading dialog out of the theme-transition snapshot.
 */
function afterDialogClosed(fn: () => void) {
  const body = document.body;
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    mo.disconnect();
    requestAnimationFrame(fn);
  };
  const mo = new MutationObserver(() => !body.hasAttribute("data-scroll-locked") && go());
  mo.observe(body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
  if (!body.hasAttribute("data-scroll-locked")) go();
  window.setTimeout(go, 600); // safety net if the attribute never changes
}

/** ⌘K / Ctrl+K palette: jump to any section or entry, or run a quick action. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  /** Close first so the dialog's scroll lock is released before we scroll or switch theme. */
  const run = (fn: () => void) => () => {
    setOpen(false);
    // Defer one frame so React has started closing the dialog before we watch for the unlock.
    requestAnimationFrame(() => afterDialogClosed(fn));
  };
  /** New tabs must open synchronously inside the key/click event, or popup blockers stop them. */
  const openTab = (url: string) => () => {
    window.open(url, "_blank", "noopener");
    setOpen(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command menu"
      description="Jump to a section or run an action"
      commandProps={{ filter }}
    >
      <CommandInput placeholder="Search sections, projects, experience…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Sections">
          {NAV.map((s) => (
            <CommandItem key={s.id} value={`section ${s.label}`} onSelect={run(() => jumpTo(s.id, lenis))}>
              <HashIcon />
              {s.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {[dfk, shooter].map((p) => (
            <CommandItem key={p.id} value={`project ${p.title} ${p.tags.join(" ")}`} onSelect={run(() => jumpTo(p.id, lenis))}>
              <FolderGitIcon />
              {p.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Experience">
          {JOBS.map((j) => (
            <CommandItem key={j.id} value={`work ${j.company} ${j.where}`} onSelect={run(() => jumpTo(j.id, lenis))}>
              <BriefcaseIcon />
              {j.company}
            </CommandItem>
          ))}
          {[...MAJOR_ORGS, ...MINOR_ORGS].map((o) => (
            <CommandItem key={o.id} value={`organization ${o.name}`} onSelect={run(() => jumpTo(o.id, lenis))}>
              <UsersIcon />
              {o.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="copy email address" onSelect={run(copyEmail)}>
            <CopyIcon />
            Copy email
          </CommandItem>
          <CommandItem value="send email contact" onSelect={run(() => window.location.assign(`mailto:${profile.email}`))}>
            <MailIcon />
            Send an email
          </CommandItem>
          <CommandItem value="github code repositories" onSelect={openTab(profile.github)}>
            <FolderGitIcon />
            Open GitHub
            <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
          <CommandItem value="linkedin profile" onSelect={openTab(profile.linkedin)}>
            <ExternalLinkIcon />
            Open LinkedIn
            <CommandShortcut>↗</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="toggle theme dark light mode"
            // run() waits for the dialog to close, so it isn't captured in the transition snapshot.
            onSelect={run(() => toggleTheme())}
          >
            <MoonIcon />
            Toggle dark / light mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
