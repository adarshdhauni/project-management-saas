import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductMockup from "@/components/landing/ProductMockup";

const Hero = () => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  const isLoggedIn = isInitialized && isAuthenticated;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-150 w-200 -translate-x-1/2 rounded-full bg-primary/4 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-24 text-center sm:px-8 sm:pb-32 sm:pt-32">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Project management, simplified
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
          Turn ideas into
          <span className="block text-muted-foreground">
            meaningful progress.
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Plan projects, organize tasks, collaborate with your team, and keep
          every detail in one focused workspace.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            nativeButton={false}
            className="group"
            render={<Link to={isLoggedIn ? "/dashboard" : "/auth/register"} />}
          >
            {isLoggedIn ? "Go to dashboard" : "Start for free"}
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>

          <Button
            nativeButton={false}
            variant="outline"
            render={<a href="#features" />}
          >
            Explore features
            <ChevronRight />
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required
        </p>
      </div>

      <ProductMockup />
    </section>
  );
};

export default Hero;
