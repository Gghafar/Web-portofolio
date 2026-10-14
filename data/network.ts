import type { Evidence, Need, Skill, Weights } from "@/lib/types";

/** Input layer: what a recruiter might be hiring for. */
export const NEEDS: Need[] = [
  { id: "n_llm", label: "LLMs & NLP", desc: "Working with large language models on Indonesian text." },
  { id: "n_train", label: "ML & fine-tuning", desc: "Training and adapting models, tracking experiments, and building AI scoring systems." },
  { id: "n_serve", label: "Model serving", desc: "Getting a trained model behind a fast, observable API." },
  { id: "n_api", label: "Backend APIs", desc: "Python services with clear contracts and validated output." },
  { id: "n_infra", label: "Infra & security", desc: "Domains, servers, and encryption that stay up while people depend on them." },
  { id: "n_game", label: "Game AI", desc: "Enemy behavior, pathfinding, and gameplay systems." },
  { id: "n_team", label: "Teamwork & events", desc: "Coordinating people, schedules, venues, and logistics." },
];

/** Hidden layer. */
export const SKILLS: Skill[] = [
  { id: "s_py", label: "Python", desc: "My main language for ML work, from training runs to inference code." },
  { id: "s_ft", label: "CPT + SFT fine-tuning", desc: "Continual pre-training followed by supervised fine-tuning, with PEFT and 4-bit quantization." },
  { id: "s_wandb", label: "Weights & Biases", desc: "Experiment tracking for training runs, and Weave traces for every inference request." },
  { id: "s_unsloth", label: "Unsloth · bfloat16", desc: "FastLanguageModel inference in full bfloat16 precision." },
  { id: "s_mtla", label: "MTLA voting", desc: "Several generation trials, logit-based confidence, then a majority vote." },
  { id: "s_fastapi", label: "FastAPI", desc: "Served the DFK classifier as a production HTTP endpoint." },
  { id: "s_modal", label: "Modal · H100 GPUs", desc: "Serverless GPU deployment with a persistent Volume weight cache." },
  { id: "s_score", label: "AI scoring (GDCI)", desc: "An AI-driven engine that scores the domain governance maturity of government institutions." },
  { id: "s_dns", label: "DNS · DNSSEC · TLS", desc: "DNSSEC validation, PowerDNS, and SSL/TLS on government domain infrastructure." },
  { id: "s_server", label: "Server admin", desc: "Configured and maintained contest and government servers." },
  { id: "s_judge", label: "Online judge systems", desc: "Deployed, tested, and monitored the judge for a national contest." },
  { id: "s_unity", label: "Unity · C#", desc: "Core combat and enemy systems for a 3D top-down shooter." },
  { id: "s_nav", label: "NavMesh · FSM", desc: "Shortest-path pursuit and state-driven enemy behavior." },
  { id: "s_ops", label: "Event operations", desc: "Scheduling, venues, permits, and running the day itself." },
  { id: "s_mentor", label: "Mentoring & outreach", desc: "Guiding freshmen and prospective students." },
];

/** Evidence layer: work that proves the skills. `anchor` opens its window on the desktop. */
export const EVIDENCE: Evidence[] = [
  { id: "e_kml", kind: "job", label: "Komdigi · ML Engineer", role: "Machine Learning Engineer, Ministry of Communication and Digital Affairs", date: "Feb – Jul 2026", anchor: "#komdigi-ml", points: [
    "Designed a fine-tuning approach that combines continual pre-training (CPT) and supervised fine-tuning (SFT) with PEFT and 4-bit quantization.",
    "Tracked experiments in Weights & Biases: real-time training metrics, loss convergence, and documented results for the team."] },
  { id: "e_dfk", kind: "project", label: "DFK Text Classifier", role: "AI/ML Engineer", date: "May – Jun 2026", anchor: "#dfk", points: [
    "Deployed a fine-tuned 8B-parameter LLM as a GPU-backed FastAPI endpoint on Modal (NVIDIA H100).",
    "Built multi-trial logit-averaging (MTLA) voting to cut single-pass hallucination.",
    "Traced every request with W&B Weave: inputs, outputs, latency, and token counts."] },
  { id: "e_kit", kind: "job", label: "Komdigi · IT Intern", role: "IT Intern, Ministry of Communication and Digital Affairs", date: "Jan – Apr 2026", anchor: "#komdigi-it", points: [
    "Managed mission-critical government domain infrastructure with DNSSEC validation and SSL/TLS encryption.",
    "Led the design of the Government Domain Compliance Index (GDCI), an AI-driven engine that scores domain governance maturity across government institutions."] },
  { id: "e_npc", kind: "role", label: "Schematics NPC", role: "Schematics ITS, Technical Division, Staff → Expert Staff", date: "Mar 2024 – Nov 2025", anchor: "#schematics", points: [
    "Architected and maintained the servers and online judge for a national programming contest.",
    "Validated the systems before every contest window for zero downtime.",
    "Promoted from Staff (2024) to Expert Staff (2025)."] },
  { id: "e_shooter", kind: "project", label: "Top-Down Shooter", role: "Gameplay & AI Programmer, team of 3", date: "Dec 2025", anchor: "#shooter", points: [
    "Programmed zombie pathfinding with Unity NavMesh Agents.",
    "Built Raycast shooting with LineRenderer bullet tracers.",
    "Designed the enemy FSM and a wave spawner that scales difficulty."] },
  { id: "e_elx", kind: "role", label: "Elite x Pesraf", role: "BEM FTEIC ITS, Staff of Event → Expert Staff of Operational", date: "Oct 2024 – Sep 2025", anchor: "#elite", points: [
    "Ran operations for a faculty event that pairs a sports competition (ELITE) with an arts exhibition (PESRAF).",
    "Coordinated match schedules, officiating support, and venues.",
    "Promoted from Staff of Event (2024) to Expert Staff of Operational (2025)."] },
  { id: "e_ideas", kind: "role", label: "IDEAS 2025", role: "Staff of Event, Patriot ITS Bekasi", date: "Dec 2024 – Jan 2025", anchor: "#ideas", points: [
    "Ran events with INI LHO ITS Forda Bekasi to introduce ITS to senior high school students in Bekasi.",
    "Represented ITS as a student ambassador."] },
  { id: "e_incl", kind: "role", label: "Inclenation 2024", role: "Staff of Mentor, BEM FTEIC ITS", date: "Jul – Aug 2024", anchor: "#inclenation", points: [
    "Introduced the faculty and its departments to incoming freshmen.",
    "Was responsible for an assigned group of participants."] },
  { id: "e_pj", kind: "role", label: "Pasar Juang", role: "Logistics & General Affairs Staff", date: "Oct – Nov 2023", anchor: "#pasar", points: [
    "Coordinated logistics, permits, security, and consumables for a multi-day cultural exhibition."] },
];

/** need → skill weights */
export const W1: Weights = {
  n_llm: { s_py: 0.6, s_ft: 0.9, s_unsloth: 0.7, s_mtla: 1 },
  n_train: { s_py: 0.7, s_ft: 1, s_wandb: 0.9, s_score: 0.7 },
  n_serve: { s_wandb: 0.6, s_unsloth: 0.7, s_fastapi: 0.7, s_modal: 1 },
  n_api: { s_py: 0.9, s_fastapi: 1, s_server: 0.4 },
  n_infra: { s_modal: 0.4, s_score: 0.5, s_dns: 1, s_server: 1, s_judge: 0.8 },
  n_game: { s_unity: 1, s_nav: 1 },
  n_team: { s_unity: 0.3, s_ops: 1, s_mentor: 1 },
};

/** skill → evidence weights */
export const W2: Weights = {
  s_py: { e_kml: 0.8, e_dfk: 1 }, s_ft: { e_kml: 1 }, s_wandb: { e_kml: 1, e_dfk: 0.8 }, s_unsloth: { e_dfk: 1 }, s_mtla: { e_dfk: 1 },
  s_fastapi: { e_dfk: 1 }, s_modal: { e_dfk: 1 }, s_score: { e_kit: 1 }, s_dns: { e_kit: 1 }, s_server: { e_kit: 0.6, e_npc: 1 },
  s_judge: { e_npc: 1 }, s_unity: { e_shooter: 1 }, s_nav: { e_shooter: 1 },
  s_ops: { e_npc: 0.5, e_elx: 1, e_ideas: 0.5, e_pj: 1 }, s_mentor: { e_ideas: 1, e_incl: 1 },
};

/** evidence → output weights */
export const W3: Record<string, number> = { e_kml: 0.62, e_dfk: 0.62, e_kit: 0.58, e_npc: 0.55, e_shooter: 0.55, e_elx: 0.45, e_ideas: 0.4, e_incl: 0.4, e_pj: 0.35 };

/** Needs switched on when the page loads. */
export const DEFAULT_ACTIVE = ["n_llm", "n_train"];
