import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Workflow from "./components/Workflow";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import PageTransition from "@/components/shared/PageTransition";

const Home = () => {
  return (
    <PageTransition id = "top" className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <main>
        <Hero />

        <Features />

        <Workflow />

        <Pricing />

        <CTA />
      </main>
      <PublicFooter />
    </PageTransition>
  );
};

export default Home;
