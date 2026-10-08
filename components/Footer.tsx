import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span>Built with Next.js · Deployed on Vercel</span>
    </footer>
  );
}
