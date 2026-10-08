import type { Project } from "@/lib/types";

// Text wrapped in `backticks` renders as <code>.
export const dfk: Project = {
  id: "work-dfk",
  eyebrow: "LLM inference endpoint · May – Jun 2026 · AI/ML Engineer",
  title: "DFK Text Classifier",
  summary: "A fine-tuned 8-billion-parameter language model served as a GPU-backed API. It reads Indonesian social-media posts and sorts them into a five-label schema for disinformation, slander, and hate speech (DFK).",
  specs: [
    { term: "Model", detail: "Ministral-8B-DFK, fine-tuned, 8B parameters" },
    { term: "Serving", detail: "FastAPI endpoint on Modal" },
    { term: "Hardware", detail: "NVIDIA H100" },
    { term: "Precision", detail: "Full bfloat16 with Unsloth `FastLanguageModel`" },
    { term: "Cold starts", detail: "Weights cached on a persistent Modal Volume across container restarts" },
    { term: "Decoding", detail: "MTLA voting: N trials, confidence scored from logits over the first K = 10 tokens, majority vote" },
    { term: "Guardrails", detail: "Label normalization to the public schema; a relevance filter drops unrelated context before prompting" },
    { term: "Tracing", detail: "W&B Weave traces plus JSONL backups: inputs, outputs, latency, and token counts per request" },
  ],
  tags: ["Python", "FastAPI", "Modal", "Unsloth", "W&B Weave"],
};

export const shooter: Project = {
  id: "work-shooter",
  eyebrow: "Course final project · Dec 2025 · Gameplay & AI Programmer",
  title: "Top-Down Shooter",
  summary: "A 3D top-down zombie-survival shooter built by a team of three for the Intelligent Games (Game Cerdas) course. I wrote the core combat and enemy AI systems in C#.",
  specs: [
    { term: "Engine", detail: "Unity 2021, C#" },
    { term: "Pathfinding", detail: "NavMesh Agents compute the shortest path to the player and route around static obstacles" },
    { term: "Behavior", detail: "A finite state machine drives each enemy" },
    { term: "Shooting", detail: "`Physics.Raycast` hit detection with `LineRenderer` bullet tracers" },
    { term: "Waves", detail: "A central spawn manager raises the difficulty every round" },
    { term: "Resources", detail: "Health and ammunition management loop" },
  ],
  tags: ["Unity 2021", "C#", "NavMesh", "FSM", "Raycast"],
};

export const MTLA_SAMPLE = "Katanya air rebusan daun sirsak bisa menyembuhkan kanker dalam 3 hari. Sebarkan sebelum dihapus!";
