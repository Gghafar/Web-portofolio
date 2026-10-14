import { Fragment } from "react";
import { TileArt } from "./glyphs";
import CopyButton from "@/components/CopyButton";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import CountUp from "@/components/motion/CountUp";
import SemesterTrack from "@/components/SemesterTrack";
import { profile } from "@/data/profile";
import { EDUCATION, TOOLS } from "@/data/skills";
import type { Spec } from "@/lib/types";

/** Opens another window: a plain link to its hash, which the desktop turns into "open that window". */
export function OpenLink({ to, children, ...rest }: { to: string } & Omit<React.ComponentProps<"a">, "href">) {
  // Spread the rest so wrappers like <LiquidButton asChild> can pass their class, data-slot and handlers.
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}

/** Renders `backtick` spans as <code>. */
function withCode(text: string) {
  return text.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>));
}

export type Detail = {
  kicker: string;
  title: string;
  meta?: string;
  body?: React.ReactNode;
  points?: string[];
  specs?: Spec[];
  tags?: string[];
  /** Other windows worth opening next. */
  links?: { to: string; label: string; note?: string }[];
  /** External link shown as the main button. */
  url?: { href: string; label: string };
  children?: React.ReactNode;
};

/** The standard window body from the design: kicker, title, meta, text, tags, then links. */
export function DetailView(d: Detail) {
  return (
    <div className="dv">
      <span className="dv-kicker">{d.kicker}</span>
      <h2 className="dv-title">{d.title}</h2>
      {d.meta && <p className="dv-meta">{d.meta}</p>}
      {d.body && <div className="dv-body">{d.body}</div>}
      {d.points && (
        <ul className="dv-points">
          {d.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {d.specs && (
        <dl className="spec">
          {d.specs.map((s) => (
            <Fragment key={s.term}>
              <dt>{s.term}</dt>
              <dd>{withCode(s.detail)}</dd>
            </Fragment>
          ))}
        </dl>
      )}
      {d.tags && d.tags.length > 0 && (
        <ul className="dv-tags">
          {d.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {d.children}
      {d.url && (
        <LiquidButton asChild size="xl" className="dv-cta rounded-xl text-[15px]">
          <a href={d.url.href} target="_blank" rel="noopener noreferrer">
            {d.url.label}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </LiquidButton>
      )}
      {d.links && d.links.length > 0 && (
        <div className="dv-links">
          {d.links.map((l) => (
            <OpenLink key={l.to} to={l.to} className="dv-link">
              <span>{l.label}</span>
              <span className="dv-note">{l.note ?? "Open"}</span>
            </OpenLink>
          ))}
        </div>
      )}
    </div>
  );
}

/** A Finder-style folder: one row per file, each opening its own window. */
export function FolderView({ intro, items }: { intro: string; items: { to: string; label: string; note?: string }[] }) {
  return (
    <div className="dv">
      <p className="dv-meta">{intro}</p>
      <ul className="finder">
        {items.map((it) => (
          <li key={it.to}>
            <OpenLink to={it.to} className="finder-row">
              <span className="finder-ico">
                <TileArt id={it.to} size={22} />
              </span>
              <span className="finder-name">{it.label}</span>
              <span className="finder-note">{it.note}</span>
            </OpenLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutView() {
  return (
    <DetailView
      kicker="About"
      title={profile.name}
      meta={`${profile.location} · ${profile.languages}`}
      body={<p>{profile.lede}</p>}
    >
      <dl className="facts">
        {profile.facts.map((f) => (
          <Fragment key={f.term}>
            <dt>{f.term}</dt>
            <dd>{f.detail}</dd>
          </Fragment>
        ))}
      </dl>
      <div className="edu">
        <div>
          <p className="eyebrow">Education</p>
          <h3>{EDUCATION.school}</h3>
          <p className="where">{EDUCATION.degree}</p>
        </div>
        <div className="gpa">
          <CountUp value={Number(EDUCATION.gpa)} decimals={2} />
          <small>/ {EDUCATION.gpaMax} GPA</small>
        </div>
        <SemesterTrack />
      </div>
      <div className="dv-actions">
        <span id="about-email" className="sr-only">
          {profile.email}
        </span>
        <CopyButton text={profile.email} targetId="about-email" />
        <LiquidButton asChild size="lg" className="rounded-full font-semibold">
          <OpenLink to="contact">Say hello</OpenLink>
        </LiquidButton>
      </div>
    </DetailView>
  );
}

export function ContactView() {
  return (
    <DetailView
      kicker="Contact"
      title="Say hello"
      meta={profile.location}
      body={<p>I am happy to talk about AI engineering, model serving, or anything on this desktop, in English or Bahasa Indonesia.</p>}
    >
      <a className="mail" id="contact-email" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <div className="dv-actions">
        <CopyButton text={profile.email} targetId="contact-email" />
        <LiquidButton asChild size="lg" className="rounded-full font-semibold">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </LiquidButton>
        <LiquidButton asChild size="lg" className="rounded-full font-semibold">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </LiquidButton>
      </div>
    </DetailView>
  );
}

export function ToolkitView() {
  return (
    <DetailView kicker="Skills" title="Toolkit" meta="Each one used on a real project or event.">
      <dl className="tool-list">
        {TOOLS.map((row) => (
          <div className="tool-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              <ul className="dv-tags">
                {row.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </DetailView>
  );
}
