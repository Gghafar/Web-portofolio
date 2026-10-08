export type Need = { id: string; label: string; desc: string };
export type Skill = { id: string; label: string; desc: string };
export type EvidenceKind = "job" | "project" | "role";
export type Evidence = {
  id: string;
  kind: EvidenceKind;
  label: string;
  role: string;
  date: string;
  anchor: string;
  points: string[];
};
export type Weights = Record<string, Record<string, number>>;

export type Spec = { term: string; detail: string };
export type Project = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  specs: Spec[];
  tags: string[];
};

export type Role = { title: string; when: string; points: string[] };
export type Job = {
  id: string;
  company: string;
  where: string;
  when: string;
  place: string;
  desc?: string;
  roles?: Role[];
};

export type OrgStep = { title: string; when: string; expert?: boolean };
export type Org = { id: string; name: string; where: string; steps: OrgStep[]; points: string[] };

export type SegKind = "edu" | "edu-next" | "staff" | "expert" | "project" | "job";
/** `s`/`e` are "YYYY-MM"; `e: "now"` means ongoing. A `edu-next` segment runs from today to `e`. */
export type TimelineSeg = { s: string; e: string; k: SegKind; t: string };
export type TimelineRow = { label: string; anchor: string; segs: TimelineSeg[] };

export type ToolRow = { label: string; items: string[] };
export type Cert = { name: string; issuer: string };
