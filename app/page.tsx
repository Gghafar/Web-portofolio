import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import NetworkSection from "@/components/NetworkSection";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Topbar />
      <main className="container">
        <Hero />
        <NetworkSection />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
