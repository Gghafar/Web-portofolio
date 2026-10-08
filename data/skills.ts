import type { Cert, ToolRow } from "@/lib/types";

export const EDUCATION = {
  school: "Institut Teknologi Sepuluh Nopember",
  degree: "Bachelor of Engineering candidate in Artificial Intelligence · Surabaya",
  gpa: "3.12",
  gpaMax: "4.00",
  /** First month of semester 1, used to work out the current semester. */
  start: { year: 2023, month: 8 },
  semesters: 8,
  range: "Aug 2023 → Sep 2027",
};

export const CERTS: Cert[] = [
  { name: "AI Engineer", issuer: "AITF · Digital Talent Academy" },
  { name: "Deep Learning", issuer: "AITF · Digital Talent Academy" },
  { name: "Associate Data Scientist", issuer: "Digital Talent Academy" },
  { name: "Cloud Security Foundations", issuer: "AWS Academy Graduate" },
  { name: "TOEFL 520", issuer: "Test of English as a Foreign Language" },
];

export const TOOLS: ToolRow[] = [
  { label: "Programming", items: ["Python", "SQL", "Java", "C# (Unity)"] },
  { label: "ML & LLMs", items: ["Fine-tuning (CPT, SFT)", "PEFT", "4-bit quantization", "Unsloth", "Weights & Biases"] },
  { label: "Serving", items: ["FastAPI", "Modal", "NVIDIA H100", "W&B Weave"] },
  { label: "Infra & security", items: ["DNS", "DNSSEC", "PowerDNS", "SSL/TLS", "Server administration", "Online judge systems"] },
  { label: "Game dev", items: ["Unity 2021", "NavMesh", "Finite state machines"] },
  { label: "Tools", items: ["CLI", "Microsoft Excel"] },
  { label: "Languages", items: ["Indonesian · native", "English · professional working"] },
  { label: "Working style", items: ["Adaptability", "Teamwork", "Attention to detail", "Positive attitude"] },
];
