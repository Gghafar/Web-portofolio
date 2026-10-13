import Reveal from "./motion/Reveal";
import Gantt from "./Gantt";
import { JOBS, MAJOR_ORGS, MINOR_ORGS } from "@/data/experience";
import type { Job, Org } from "@/lib/types";

function JobEntry({ job }: { job: Job }) {
  return (
    <Reveal as="article" className="job" id={job.id}>
      <div className="job-when">
        <span>{job.when}</span>
        <span>{job.place}</span>
      </div>
      <div>
        <div className="job-title"><h4>{job.company}</h4></div>
        <p className="where">{job.where}</p>
        {job.desc && <p className="job-desc">{job.desc}</p>}
        {job.roles && (
          <div className="roles">
            {job.roles.map((r) => (
              <div className="role" key={r.title}>
                <div className="role-h"><b>{r.title}</b><span>{r.when}</span></div>
                <ul>{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

function OrgCard({ org, index = 0 }: { org: Org; index?: number }) {
  return (
    <Reveal as="article" className="org" id={org.id} data-spotlight delay={index * 0.08}>
      <div>
        <h4>{org.name}</h4>
        <p className="where">{org.where}</p>
      </div>
      <ol className="steps">
        {org.steps.map((s, i) => (
          <StepItem key={s.title} step={s} promoted={i > 0} />
        ))}
      </ol>
      <ul>{org.points.map((p) => <li key={p}>{p}</li>)}</ul>
    </Reveal>
  );
}

function StepItem({ step, promoted }: { step: Org["steps"][number]; promoted: boolean }) {
  return (
    <>
      {promoted && <li className="promo" aria-label="promoted to">Promoted →</li>}
      <li className={step.expert ? "step expert" : "step"}>
        <b>{step.title}</b>
        <span>{step.when}</span>
      </li>
    </>
  );
}

export default function Experience() {
  return (
    <section className="sec" id="experience">
      <Reveal className="sec-head">
        <div>
          <p className="eyebrow">Work &amp; organizations · 2023 – 2026</p>
          <h2>Experience</h2>
        </div>
        <p className="sec-intro">In 2026 I worked at the Ministry of Communication and Digital Affairs and then at PT PELNI. Before that I helped run events at ITS and twice came back the following year as Expert Staff.</p>
      </Reveal>

      <Reveal>
        <Gantt />
      </Reveal>

      <h3 className="group-h">Work</h3>
      <div className="jobs">
        {JOBS.map((j) => <JobEntry key={j.id} job={j} />)}
      </div>

      <h3 className="group-h">Organizations</h3>
      <div className="orgs major">
        {MAJOR_ORGS.map((o, i) => <OrgCard key={o.id} org={o} index={i} />)}
      </div>
      <div className="orgs minor">
        {MINOR_ORGS.map((o, i) => <OrgCard key={o.id} org={o} index={i} />)}
      </div>
    </section>
  );
}
