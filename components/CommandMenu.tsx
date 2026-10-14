"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CopyIcon, XIcon } from "lucide-react";
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
import { TileArt } from "@/components/desktop/glyphs";
import { APP_LIST, type Group } from "@/lib/desktop/apps";
import { desktop } from "@/lib/desktop/store";
import { profile } from "@/data/profile";

const OPEN_EVENT = "spotlight:open";
const GROUPS: Group[] = ["Apps", "Folders", "Projects", "Experience", "Organizations", "Certificates", "Other"];

/** Lets any button (e.g. the menu-bar magnifier) open Spotlight without sharing React state. */
export function openSpotlight() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

async function copyEmail() {
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

/** ⌘K / Ctrl+K: macOS-style Spotlight that opens any window on the desktop. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);

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

  const launch = (id: string, width: number) => () => {
    setOpen(false);
    desktop.open(id, width);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Spotlight"
      description="Search the files, folders and apps on this desktop"
      showCloseButton={false}
      className="spotlight top-[16%] translate-y-0 sm:max-w-[620px]"
      commandProps={{ filter }}
    >
      <CommandInput placeholder="Spotlight Search" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {GROUPS.map((g) => (
          <CommandGroup key={g} heading={g}>
            {APP_LIST.filter((a) => a.group === g).map((a) => (
              <CommandItem key={a.id} value={`${a.name} ${a.file} ${g}`} onSelect={launch(a.id, a.width)}>
                <span className="spot-ico">
                  <TileArt id={a.id} size={20} />
                </span>
                {a.name}
                <CommandShortcut>{a.file}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            value="copy email address contact"
            onSelect={() => {
              setOpen(false);
              copyEmail();
            }}
          >
            <CopyIcon />
            Copy email
            <CommandShortcut>{profile.email}</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="close all windows clear desktop"
            onSelect={() => {
              setOpen(false);
              desktop.closeAll();
            }}
          >
            <XIcon />
            Close all windows
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
