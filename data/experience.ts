import type { Job, Org, TimelineRow } from "@/lib/types";

export const JOBS: Job[] = [
  {
    id: "pelni",
    company: "PT PELNI (Persero)",
    where: "IT Developer",
    when: "Jul – Aug 2026",
    place: "Central Jakarta",
    desc: "IT developer at Indonesia's state-owned national shipping company.",
  },
  {
    id: "job-komdigi",
    company: "Kementerian Komunikasi dan Digital",
    where: "Ministry of Communication and Digital Affairs (Komdigi) · two roles",
    when: "Jan – Jul 2026",
    place: "Surabaya & Jakarta",
    roles: [
      {
        title: "Machine Learning Engineer",
        when: "Feb – Jul 2026 · Surabaya",
        points: [
          "Designed and oversaw a fine-tuning approach that combines continual pre-training (CPT) and supervised fine-tuning (SFT), using parameter-efficient fine-tuning (PEFT) with 4-bit quantization.",
          "Set up Weights & Biases for experiment tracking: real-time training metrics, loss-convergence analysis, and documented results the whole team could see.",
        ],
      },
      {
        title: "IT Intern",
        when: "Jan – Apr 2026 · Gambir, Jakarta",
        points: [
          "Managed mission-critical government domain infrastructure, deploying DNSSEC validation and enforcing SSL/TLS encryption across hosted services.",
          "Led the design of the Government Domain Compliance Index (GDCI), an AI-driven scoring engine that automates the assessment of domain governance maturity across government institutions.",
        ],
      },
    ],
  },
];

/** Shown two per row. */
export const MAJOR_ORGS: Org[] = [
  {
    id: "schematics",
    name: "Schematics National Programming Contest",
    where: "Schematics ITS · Technical Division · Surabaya",
    steps: [
      { title: "Staff", when: "Mar – Oct 2024" },
      { title: "Expert Staff", when: "Feb – Nov 2025", expert: true },
    ],
    points: [
      "Ran the technical side of a national competitive programming contest for junior high, senior high, and university students (NPC Junior and NPC Senior).",
      "Architected and maintained the contest servers and online judge, and validated them before every contest window for zero downtime.",
      "Handled live technical operations and fixed issues in real time so each contest ran smoothly.",
      "In 2024, configured servers, deployed the judge, and tested its reliability before launch.",
    ],
  },
  {
    id: "elite",
    name: "Elite x Pesraf",
    where: "BEM FTEIC ITS · Faculty annual event · Surabaya",
    steps: [
      { title: "Staff of Event", when: "Oct – Dec 2024" },
      { title: "Expert Staff of Operational", when: "May – Sep 2025", expert: true },
    ],
    points: [
      "The faculty's annual event pairs ELITE, an inter-faculty sports competition (basketball, soccer, and more), with PESRAF, an arts exhibition open to the public.",
      "For the 2025 edition, ran operations: match schedules, officiating support, and venues across every competition day.",
      "In 2024, supervised and prepared each day's sports matches.",
    ],
  },
];

/** Shown three per row. */
export const MINOR_ORGS: Org[] = [
  {
    id: "ideas",
    name: "IDEAS 2025",
    where: "Integrated Dreams and Realities · Patriot ITS Bekasi",
    steps: [{ title: "Staff of Event", when: "Dec 2024 – Jan 2025" }],
    points: [
      "Ran events with INI LHO ITS Forda Bekasi to introduce ITS to senior high school students in Bekasi.",
      "Represented ITS as a student ambassador and explained admission pathways.",
    ],
  },
  {
    id: "inclenation",
    name: "Inclenation 2024",
    where: "BEM FTEIC ITS · Faculty orientation · Surabaya",
    steps: [{ title: "Staff of Mentor", when: "Jul – Aug 2024" }],
    points: [
      "Introduced the Faculty of Electrical Technology and Intelligent Computing and each of its departments to incoming freshmen.",
      "Was responsible for an assigned group of participants throughout orientation.",
    ],
  },
  {
    id: "pasar",
    name: "Dies Natalis Pasar Juang",
    where: "ITS anniversary cultural market · Surabaya",
    steps: [{ title: "Staff, Logistics & General Affairs", when: "Oct – Nov 2023" }],
    points: ["Coordinated logistics, permits, security, and consumables for a multi-day exhibition featuring Reog Ponorogo and Ludruk."],
  },
];

/** Gantt chart range. */
export const TIMELINE_START = { year: 2023, month: 7 };
export const TIMELINE_END = { year: 2027, month: 10 };
export const TIMELINE_YEARS = [2024, 2025, 2026, 2027];

export const TIMELINE: TimelineRow[] = [
  { label: "B.Eng. AI, ITS", anchor: "#about", segs: [{ s: "2023-08", e: "now", k: "edu", t: "Degree, in progress" }, { s: "now", e: "2027-09", k: "edu-next", t: "Degree, expected to finish Sep 2027" }] },
  { label: "Pasar Juang", anchor: "#pasar", segs: [{ s: "2023-10", e: "2023-11", k: "staff", t: "Logistics & General Affairs Staff" }] },
  { label: "Schematics NPC", anchor: "#schematics", segs: [{ s: "2024-03", e: "2024-10", k: "staff", t: "Technical Staff" }, { s: "2025-02", e: "2025-11", k: "expert", t: "Expert Staff" }] },
  { label: "Inclenation 2024", anchor: "#inclenation", segs: [{ s: "2024-07", e: "2024-08", k: "staff", t: "Staff of Mentor" }] },
  { label: "Elite x Pesraf", anchor: "#elite", segs: [{ s: "2024-10", e: "2024-12", k: "staff", t: "Staff of Event" }, { s: "2025-05", e: "2025-09", k: "expert", t: "Expert Staff of Operational" }] },
  { label: "IDEAS 2025", anchor: "#ideas", segs: [{ s: "2024-12", e: "2025-01", k: "staff", t: "Staff of Event" }] },
  { label: "Top-Down Shooter", anchor: "#shooter", segs: [{ s: "2025-12", e: "2025-12", k: "project", t: "Gameplay & AI Programmer" }] },
  { label: "Komdigi · IT Intern", anchor: "#komdigi-it", segs: [{ s: "2026-01", e: "2026-04", k: "job", t: "IT Intern" }] },
  { label: "Komdigi · ML Eng.", anchor: "#komdigi-ml", segs: [{ s: "2026-02", e: "2026-07", k: "job", t: "Machine Learning Engineer" }] },
  { label: "DFK Classifier", anchor: "#dfk", segs: [{ s: "2026-05", e: "2026-06", k: "project", t: "AI/ML Engineer" }] },
  { label: "PT PELNI", anchor: "#pelni", segs: [{ s: "2026-07", e: "2026-08", k: "job", t: "IT Developer" }] },
];
