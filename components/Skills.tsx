import SemesterTrack from "./SemesterTrack";
import { CERTS, EDUCATION, TOOLS } from "@/data/skills";

export default function Skills() {
  return (
    <section className="sec" id="skills">
      <div className="sec-head">
        <div>
          <p className="eyebrow">Education &amp; toolkit</p>
          <h2>Skills</h2>
        </div>
        <p className="sec-intro">The tools below come straight from the work above. Each one is something I have used on a real project or event.</p>
      </div>
      <div className="skills-grid">
        <div className="skills-left">
          <div className="edu">
            <div>
              <p className="eyebrow">Education</p>
              <h3>{EDUCATION.school}</h3>
              <p className="where">{EDUCATION.degree}</p>
            </div>
            <div className="gpa">{EDUCATION.gpa}<small>/ {EDUCATION.gpaMax} GPA</small></div>
            <SemesterTrack />
          </div>
          <div className="edu">
            <p className="eyebrow" style={{ margin: 0 }}>Certifications</p>
            <ul className="cert-list">
              {CERTS.map((c) => (
                <li key={c.name}><b>{c.name}</b><span>{c.issuer}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <dl className="tool-list">
          {TOOLS.map((row) => (
            <div className="tool-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd><ul className="tags">{row.items.map((t) => <li key={t}>{t}</li>)}</ul></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
