/**
 * Layout of the "Portfolio Desktop": which file icons sit where on the desktop, and what is in the dock.
 * Every `app` is a window id from lib/desktop/apps.tsx; the same ids work as URL hashes (/#mtla).
 */

import { profile } from "./profile";

export type DesktopIconDef = {
  app: string;
  label: string;
  /** Position of the icon's centre, in % of the desktop (ignored on phones, where icons form a grid). */
  left: number;
  top: number;
};

export const DESKTOP_ICONS: DesktopIconDef[] = [
  { app: "about", label: "About.txt", left: 17, top: 20 },
  { app: "dfk", label: "DFK Classifier", left: 32, top: 15 },
  { app: "mtla", label: "MTLA Demo", left: 44, top: 23 },
  { app: "shooter", label: "Top-Down Shooter", left: 60, top: 13 },
  { app: "arena", label: "Pathfinding Arena", left: 69, top: 26 },
  { app: "hiring", label: "Hiring Match", left: 82, top: 17 },
  { app: "timeline", label: "Timeline", left: 8, top: 35 },
  { app: "komdigi-ml", label: "Komdigi — ML Engineer", left: 23, top: 36 },
  { app: "finetuning", label: "Fine-tuning Log", left: 37, top: 40 },
  { app: "pelni", label: "PT PELNI", left: 55, top: 36 },
  { app: "komdigi-it", label: "Komdigi — IT Intern", left: 79, top: 37 },
  { app: "toolkit", label: "Toolkit", left: 87, top: 52 },
  { app: "elite", label: "Elite x Pesraf", left: 13, top: 51 },
  { app: "inclenation", label: "Inclenation", left: 28, top: 58 },
  { app: "ideas", label: "IDEAS", left: 45, top: 55 },
  { app: "schematics", label: "Schematics NPC", left: 62, top: 50 },
  { app: "pasar", label: "Pasar Juang 2023", left: 75, top: 63 },
  { app: "cert-ai", label: "AI Engineer Cert", left: 19, top: 70 },
  { app: "cert-ds", label: "Data Scientist Cert", left: 53, top: 69 },
  { app: "cert-aws", label: "Cloud Security", left: 88, top: 70 },
  { app: "cv", label: "CV", left: 36, top: 76 },
  { app: "contact", label: "Say Hello", left: 66, top: 77 },
];

export type DockItemDef = {
  /** Window opened by the dock button. */
  app: string;
  label: string;
  /** Lights the "running" dot when any of these windows is open. */
  running: string[];
};

export const DOCK_MAIN: DockItemDef[] = [
  { app: "about", label: "About", running: ["about"] },
  { app: "projects", label: "Projects", running: ["projects"] },
  { app: "experience", label: "Experience", running: ["experience"] },
  { app: "organizations", label: "Organizations", running: ["organizations"] },
  { app: "certificates", label: "Certificates", running: ["certificates"] },
  { app: "photos", label: "Photos", running: ["photos"] },
];

export const DOCK_LINKS: DockItemDef[] = [
  { app: "github", label: "GitHub", running: ["github"] },
  { app: "linkedin", label: "LinkedIn", running: ["linkedin"] },
  // Shown once profile.instagramUser is filled in.
  ...(profile.instagramUser ? [{ app: "instagram", label: "Instagram", running: ["instagram"] }] : []),
];

export const DOCK_END: DockItemDef[] = [{ app: "contact", label: "Contact", running: ["contact"] }];

/** Menu bar entries (left side), each opens a folder window. */
export const MENU = [
  { app: "projects", label: "Projects" },
  { app: "experience", label: "Experience" },
  { app: "organizations", label: "Organizations" },
  { app: "certificates", label: "Certificates" },
  { app: "contact", label: "Contact" },
];
