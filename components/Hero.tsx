import CopyButton from "./CopyButton";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <p className="eyebrow">{profile.tagline}</p>
      <h1 className="name">
        <span className="ln">{profile.firstName}</span>
        <span className="ln">
          {profile.lastName}
          <span className="node" aria-hidden="true"></span>
        </span>
      </h1>
      <div className="hero-row">
        <p className="lede">{profile.lede}</p>
        <div>
          <dl className="facts">
            {profile.facts.map((f) => (
              <Fact key={f.term} term={f.term} detail={f.detail} />
            ))}
            <dt>Email</dt>
            <dd id="hero-email">{profile.email}</dd>
          </dl>
          <div className="actions">
            <CopyButton text={profile.email} targetId="hero-email" />
            <a className="btn" href={profile.github} target="_blank" rel="noopener">GitHub ↗</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ term, detail }: { term: string; detail: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{detail}</dd>
    </>
  );
}
