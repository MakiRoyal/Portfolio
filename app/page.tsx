import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectRail from "@/components/ProjectRail";
import StatSheet from "@/components/StatSheet";

export default function Home() {
  return (
    <>
      <main id="contenu">
        <Hero />
        <About />
        <ProjectRail />
        <StatSheet />
      </main>
      <Footer />
    </>
  );
}
