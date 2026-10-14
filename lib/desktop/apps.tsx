"use client";

import { AboutView, ContactView, DetailView, FolderView, ToolkitView, type Detail } from "@/components/desktop/views";
import { AlbumSection, PhotosView } from "@/components/desktop/Gallery";
import MtlaDemo from "@/components/MtlaDemo";
import PathfindingArena from "@/components/PathfindingArena";
import NetworkSection from "@/components/NetworkSection";
import Gantt from "@/components/Gantt";
import { profile } from "@/data/profile";
import { dfk, shooter } from "@/data/projects";
import { JOBS, MAJOR_ORGS, MINOR_ORGS } from "@/data/experience";
import { CERTS } from "@/data/skills";
import { albumFor } from "@/data/gallery";
import type { Org } from "@/lib/types";

export type Group = "Apps" | "Folders" | "Projects" | "Experience" | "Organizations" | "Certificates" | "Other";

export type AppDef = {
  id: string;
  /** Name in the menu bar and Spotlight. */
  name: string;
  /** Text in the window's title bar. */
  file: string;
  /** Preferred width in px (narrower screens get less). */
  width: number;
  group: Group;
  render: () => React.ReactNode;
};

const komdigi = JOBS.find((j) => j.id === "job-komdigi")!;
const pelni = JOBS.find((j) => j.id === "pelni")!;
const [mlRole, itRole] = komdigi.roles!;

function orgDetail(o: Org): Detail {
  return {
    kicker: "Organization",
    title: o.name,
    meta: o.where,
    body: (
      <ol className="steps">
        {o.steps.map((s, i) => (
          <li key={s.title} className="steps-item">
            {i > 0 && (
              <span className="promo" aria-label="promoted to">
                Promoted →
              </span>
            )}
            <span className={s.expert ? "step expert" : "step"}>
              <b>{s.title}</b>
              <span>{s.when}</span>
            </span>
          </li>
        ))}
      </ol>
    ),
    points: o.points,
    links: [{ to: "organizations", label: "All organizations", note: "Folder" }],
  };
}

const orgs = Object.fromEntries([...MAJOR_ORGS, ...MINOR_ORGS].map((o) => [o.id, o]));

const detail = (id: string, name: string, file: string, d: () => Detail, group: Group, width = 580): AppDef => ({
  id,
  name,
  file,
  width,
  group,
  render: () => {
    // Windows with an album in data/gallery.ts get their photos at the bottom.
    const album = albumFor(id);
    return <DetailView {...d()}>{album && <AlbumSection album={album} />}</DetailView>;
  },
});

const app = (id: string, name: string, file: string, width: number, render: () => React.ReactNode, group: Group = "Apps"): AppDef => ({
  id,
  name,
  file,
  width,
  group,
  render,
});

const LIST: AppDef[] = [
  // ── Folders ──
  app("projects", "Projects", "projects/", 520, () => (
    <FolderView
      intro="Selected work. Open a file for details, or run the demos."
      items={[
        { to: "dfk", label: "DFK Text Classifier", note: "LLM endpoint" },
        { to: "mtla", label: "MTLA Demo.app", note: "Demo" },
        { to: "shooter", label: "Top-Down Shooter", note: "Game" },
        { to: "arena", label: "Pathfinding Arena.app", note: "Playable" },
        { to: "hiring", label: "Hiring Match.app", note: "Interactive" },
      ]}
    />
  ), "Folders"),
  app("experience", "Experience", "experience/", 560, () => (
    <FolderView
      intro="Work history, most recent first."
      items={[
        { to: "pelni", label: "IT Developer — PT PELNI (Persero)", note: pelni.when },
        { to: "komdigi-ml", label: "Machine Learning Engineer — Komdigi", note: "Feb – Jul 2026" },
        { to: "komdigi-it", label: "IT Intern — Komdigi", note: "Jan – Apr 2026" },
        { to: "finetuning", label: "Fine-tuning Log", note: "Notes" },
        { to: "timeline", label: "Timeline.app", note: "2023 – 2027" },
      ]}
    />
  ), "Folders"),
  app("organizations", "Organizations", "organizations/", 540, () => (
    <FolderView
      intro="Campus organizations and events at ITS."
      items={[...MAJOR_ORGS, ...MINOR_ORGS].map((o) => ({ to: o.id, label: o.name, note: o.steps[o.steps.length - 1].when }))}
    />
  ), "Folders"),
  app("certificates", "Certificates", "certificates/", 520, () => (
    <FolderView
      intro="Certifications."
      items={[
        { to: "cert-ai", label: "AI Engineer & Deep Learning", note: "AITF · DTA" },
        { to: "cert-ds", label: "Associate Data Scientist", note: "DTA" },
        { to: "cert-aws", label: "Cloud Security Foundations", note: "AWS Academy" },
        { to: "cert-toefl", label: "TOEFL 520", note: "English" },
      ]}
    />
  ), "Folders"),

  // ── Apps (the interactive demos) ──
  app("mtla", "MTLA Demo", "mtla_demo.app", 640, () => (
    <div className="app-pad">
      <MtlaDemo />
    </div>
  )),
  app("arena", "Pathfinding Arena", "pathfinding_arena.app", 700, () => (
    <div className="app-pad">
      <PathfindingArena />
    </div>
  )),
  app("hiring", "Hiring Match", "hiring_match.app", 1040, () => (
    <div className="app-pad">
      <NetworkSection />
    </div>
  )),
  app("timeline", "Timeline", "timeline.app", 880, () => (
    <div className="app-pad">
      <Gantt />
    </div>
  )),
  app("photos", "Photos", "photos.app", 720, () => <PhotosView />),

  // ── Projects ──
  detail("dfk", "DFK Classifier", "dfk_classifier", () => ({
    kicker: "Project · LLM inference endpoint",
    title: dfk.title,
    meta: "May – Jun 2026 · AI/ML Engineer",
    body: <p>{dfk.summary}</p>,
    specs: dfk.specs,
    tags: dfk.tags,
    links: [{ to: "mtla", label: "Run the MTLA voting demo", note: "App" }],
  }), "Projects", 640),
  detail("shooter", "Top-Down Shooter", "top_down_shooter", () => ({
    kicker: "Project · Game",
    title: shooter.title,
    meta: "Dec 2025 · Gameplay & AI Programmer · team of 3",
    body: <p>{shooter.summary}</p>,
    specs: shooter.specs,
    tags: shooter.tags,
    links: [{ to: "arena", label: "Play the pathfinding arena", note: "App" }],
  }), "Projects", 640),

  // ── Experience ──
  detail("pelni", "PT PELNI", "pt_pelni", () => ({
    kicker: "Experience",
    title: pelni.where,
    meta: `${pelni.company} · ${pelni.place} · ${pelni.when}`,
    body: <p>{pelni.desc}</p>,
    links: [{ to: "experience", label: "All experience", note: "Folder" }],
  }), "Experience"),
  detail("komdigi-ml", "Komdigi — ML Engineer", "komdigi_ml", () => ({
    kicker: "Experience",
    title: mlRole.title,
    meta: `Komdigi (Ministry of Communication and Digital Affairs) · ${mlRole.when}`,
    points: mlRole.points,
    tags: ["CPT", "SFT", "PEFT 4-bit", "Weights & Biases"],
    links: [
      { to: "finetuning", label: "Fine-tuning Log", note: "Notes" },
      { to: "komdigi-it", label: "Earlier role: IT Intern", note: "Jan – Apr 2026" },
    ],
  }), "Experience"),
  detail("finetuning", "Fine-tuning Log", "finetuning_log", () => ({
    kicker: "Notes · Komdigi",
    title: "Fine-tuning Log",
    meta: "CPT + SFT",
    body: <p>How the fine-tuning work at Komdigi was set up.</p>,
    points: [
      "Continual pre-training (CPT) first, then supervised fine-tuning (SFT).",
      "Parameter-efficient fine-tuning (PEFT) with 4-bit quantization.",
      "Every run tracked in Weights & Biases: real-time training metrics, loss-convergence analysis, and results the whole team could see.",
    ],
    tags: ["CPT", "SFT", "PEFT", "4-bit", "W&B"],
    links: [{ to: "komdigi-ml", label: "Machine Learning Engineer — Komdigi", note: "Role" }],
  }), "Experience"),
  detail("komdigi-it", "Komdigi — IT Intern", "komdigi_it", () => ({
    kicker: "Experience",
    title: itRole.title,
    meta: `Komdigi (Ministry of Communication and Digital Affairs) · ${itRole.when}`,
    points: itRole.points,
    tags: ["DNSSEC", "SSL/TLS", "GDCI"],
    links: [{ to: "komdigi-ml", label: "Next role: Machine Learning Engineer", note: "Feb – Jul 2026" }],
  }), "Experience"),

  // ── Organizations ──
  ...(
    [
      ["elite", "Elite x Pesraf"],
      ["schematics", "Schematics NPC"],
      ["inclenation", "Inclenation"],
      ["ideas", "IDEAS"],
      ["pasar", "Pasar Juang"],
    ] as const
  ).map(([id, short]) => detail(id, short, id, () => orgDetail(orgs[id]), "Organizations")),

  // ── Certificates ──
  detail("cert-ai", "AI Engineer Cert", "cert_ai_engineer", () => ({
    kicker: "Certificate",
    title: "AI Engineer & Deep Learning",
    meta: CERTS[0].issuer,
    body: <p>Two certifications from the AITF programme of the Digital Talent Academy: {CERTS[0].name} and {CERTS[1].name}.</p>,
    tags: ["AI engineering", "Deep learning"],
  }), "Certificates", 520),
  detail("cert-ds", "Data Scientist Cert", "cert_data_scientist", () => ({
    kicker: "Certificate",
    title: CERTS[2].name,
    meta: CERTS[2].issuer,
    tags: ["Data science"],
  }), "Certificates", 520),
  detail("cert-aws", "Cloud Security", "cert_cloud_security", () => ({
    kicker: "Certificate",
    title: CERTS[3].name,
    meta: CERTS[3].issuer,
    tags: ["Cloud", "Security"],
  }), "Certificates", 520),
  detail("cert-toefl", "TOEFL", "toefl", () => ({
    kicker: "Certificate",
    title: CERTS[4].name,
    meta: CERTS[4].issuer,
    tags: ["English"],
  }), "Certificates", 520),

  // ── Other files ──
  app("about", "About", "about.txt", 600, () => <AboutView />, "Other"),
  app("toolkit", "Toolkit", "toolkit", 640, () => <ToolkitView />, "Other"),
  app("contact", "Contact", "say_hello", 560, () => <ContactView />, "Other"),
  detail("cv", "CV", "cv", () => ({
    kicker: "Document",
    title: "Curriculum Vitae",
    body: <p>Everything from my CV is on this desktop. LinkedIn has the full history in one place.</p>,
    url: { href: profile.linkedin, label: "Open LinkedIn profile" },
    links: [
      { to: "experience", label: "Experience", note: "Folder" },
      { to: "projects", label: "Projects", note: "Folder" },
      { to: "organizations", label: "Organizations", note: "Folder" },
      { to: "certificates", label: "Certificates", note: "Folder" },
      { to: "toolkit", label: "Toolkit", note: "Skills" },
    ],
  }), "Other"),
  detail("github", "GitHub", "apps/github", () => ({
    kicker: "App · GitHub",
    title: profile.githubUser,
    meta: profile.github.replace("https://", ""),
    body: <p>Code and repositories, including the source of this desktop.</p>,
    tags: ["Code", "Repositories"],
    url: { href: profile.github, label: "Open GitHub profile" },
  }), "Other", 520),
  detail("linkedin", "LinkedIn", "apps/linkedin", () => ({
    kicker: "App · LinkedIn",
    title: profile.name,
    meta: profile.linkedinLabel,
    body: <p>Full work history, certifications and organizations.</p>,
    tags: ["LinkedIn"],
    url: { href: profile.linkedin, label: "Open LinkedIn profile" },
  }), "Other", 520),
];

export const APPS: Record<string, AppDef> = Object.fromEntries(LIST.map((a) => [a.id, a]));
export const APP_LIST = LIST;
