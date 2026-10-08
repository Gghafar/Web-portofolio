import { Fragment } from "react";
import MtlaDemo from "./MtlaDemo";
import PathfindingArena from "./PathfindingArena";
import { dfk, shooter } from "@/data/projects";
import type { Project } from "@/lib/types";

/** Renders `backtick` spans as <code>. */
function withCode(text: string) {
  return text.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>));
}

function ProjectInfo({ p }: { p: Project }) {
  return (
    <div>
      <p className="eyebrow">{p.eyebrow}</p>
      <h3>{p.title}</h3>
      <p className="proj-sub">{p.summary}</p>
      <dl className="spec">
        {p.specs.map((s) => (
          <Fragment key={s.term}>
            <dt>{s.term}</dt>
            <dd>{withCode(s.detail)}</dd>
          </Fragment>
        ))}
      </dl>
      <ul className="tags">
        {p.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="sec" id="work">
      <div className="sec-head">
        <div>
          <p className="eyebrow">Projects · 2025 – 2026</p>
          <h2>Projects</h2>
        </div>
        <p className="sec-intro">A language model served in production and a game with enemies that hunt you down. Each one has a small demo you can run on this page.</p>
      </div>

      <article className="project" id={dfk.id}>
        <ProjectInfo p={dfk} />
        <MtlaDemo />
      </article>

      <article className="project" id={shooter.id}>
        <ProjectInfo p={shooter} />
        <PathfindingArena />
      </article>
    </section>
  );
}
