import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CTA = () => {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  const isLoggedIn = isInitialized && isAuthenticated;

  return (
    <section
      id="cta"
      className="scroll-mt-(--header-offset) border-t border-border bg-primary text-primary-foreground"
    >
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-28">
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Ready to get your work organized?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-primary-foreground/60 sm:text-base">
          Start building your next project with a workspace designed to keep
          your team focused.
        </p>

        <Button
          nativeButton={false}
          className="group mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          render={<Link to={isLoggedIn ? "/dashboard" : "/auth/register"} />}
        >
          {isLoggedIn ? "Go to dashboard" : "Get started for free"}
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </section>
  );
};

export default CTA;
