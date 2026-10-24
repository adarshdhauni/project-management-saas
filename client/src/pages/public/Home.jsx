import PublicFooter from "@/components/layout/PublicFooter";
import PublicNavbar from "@/components/layout/PublicNavbar";
import PageTransition from "@/components/shared/PageTransition";

import CTA from "./components/CTA";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Workflow from "./components/Workflow";

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
