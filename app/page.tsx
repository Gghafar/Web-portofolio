import Desktop from "@/components/desktop/Desktop";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <main>
      {/* The desktop is visual; this summary is what search engines and screen readers read first. */}
      <div className="sr-only">
        <h1>{profile.name}</h1>
        <p>
          {profile.role}. {profile.lede}
        </p>
        <p>
          Contact: <a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.linkedin}>LinkedIn</a> ·{" "}
          <a href={profile.github}>GitHub</a>
        </p>
      </div>
      <Desktop />
    </main>
  );
}
