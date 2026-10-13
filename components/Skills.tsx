import Reveal from "./motion/Reveal";
import CountUp from "./motion/CountUp";
import SemesterTrack from "./SemesterTrack";
import { CERTS, EDUCATION, TOOLS } from "@/data/skills";

export default function Skills() {
  return (
    <section className="sec" id="skills">
      <Reveal className="sec-head">
        <div>
          <p className="eyebrow">Education &amp; toolkit</p>
          <h2>Skills</h2>
        </div>
        <p className="sec-intro">The tools below come straight from the work above. Each one is something I have used on a real project or event.</p>
      </Reveal>
      <div className="skills-grid">
        <div className="skills-left">
          <Reveal className="edu" data-spotlight>
            <div>
              <p className="eyebrow">Education</p>
              <h3>{EDUCATION.school}</h3>
              <p className="where">{EDUCATION.degree}</p>
            </div>
            <div className="gpa"><CountUp value={Number(EDUCATION.gpa)} decimals={2} /><small>/ {EDUCATION.gpaMax} GPA</small></div>
            <SemesterTrack />
          </Reveal>
          <Reveal className="edu" data-spotlight delay={0.1}>
            <p className="eyebrow" style={{ margin: 0 }}>Certifications</p>
            <ul className="cert-list">
              {CERTS.map((c) => (
                <li key={c.name}><b>{c.name}</b><span>{c.issuer}</span></li>
              ))}
            </ul>
          </Reveal>
        </div>
        <dl className="tool-list">
          {TOOLS.map((row, i) => (
            <Reveal className="tool-row" key={row.label} y={14} delay={i * 0.05}>
              <dt>{row.label}</dt>
              <dd><ul className="tags">{row.items.map((t) => <li key={t}>{t}</li>)}</ul></dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
