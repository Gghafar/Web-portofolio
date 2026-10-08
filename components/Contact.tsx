import CopyButton from "./CopyButton";
import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section className="sec contact" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>Have a model that needs to ship?</h2>
      <p className="sec-intro">I am happy to talk about AI engineering, model serving, or anything on this page, in English or Bahasa Indonesia.</p>
      <a className="mail" id="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="actions">
        <CopyButton text={profile.email} targetId="contact-email" />
        <a className="btn" href={profile.github} target="_blank" rel="noopener">{profile.githubLabel} ↗</a>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
      </div>
    </section>
  );
}
