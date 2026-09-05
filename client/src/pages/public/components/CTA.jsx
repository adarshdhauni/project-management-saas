import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const CTA = () => {
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

        <Link
          to="/auth/register"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary-foreground px-5 text-sm font-medium text-primary transition-opacity hover:opacity-90"
        >
          Get started for free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
