import CopyButton from "./CopyButton";
import Magnetic from "./motion/Magnetic";
import Reveal from "./motion/Reveal";
import TextReveal from "./motion/TextReveal";
import NodeDot from "./motion/NodeDot";
import { profile } from "@/data/profile";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Reveal as="p" className="eyebrow" y={10}>{profile.tagline}</Reveal>
      <h1 className="name">
        <TextReveal className="ln" text={profile.firstName} delay={0.05} />
        <span className="ln" style={{ display: "flex", alignItems: "baseline" }}>
          <TextReveal text={profile.lastName} delay={0.3} />
          <NodeDot delay={0.95} />
        </span>
      </h1>
      <div className="hero-row">
        <Reveal as="p" className="lede" delay={0.55}>{profile.lede}</Reveal>
        <Reveal delay={0.7}>
          <dl className="facts">
            {profile.facts.map((f) => (
              <Fact key={f.term} term={f.term} detail={f.detail} />
            ))}
            <dt>Email</dt>
            <dd id="hero-email">{profile.email}</dd>
          </dl>
          <div className="actions">
            <Magnetic><CopyButton text={profile.email} targetId="hero-email" /></Magnetic>
            <Magnetic><a className="btn" href={profile.github} target="_blank" rel="noopener">GitHub ↗</a></Magnetic>
            <Magnetic><a className="btn" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a></Magnetic>
          </div>
        </Reveal>
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
