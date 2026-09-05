import React from "react";

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-(--header-offset) border-t border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Everything in one place
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Built for focused teams.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Everything you need to move a project from an idea to completion
            without unnecessary complexity.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          <Feature
            number="01"
            title="Organize projects"
            description="Keep projects, tasks, and priorities structured in one workspace."
          />

          <Feature
            number="02"
            title="Collaborate clearly"
            description="Give your team one place for assignments, comments, and updates."
          />

          <Feature
            number="03"
            title="Track progress"
            description="See what is moving, what is blocked, and what needs attention."
          />
        </div>
      </div>
    </section>
  );
};

const Feature = ({ number, title, description }) => {
  return (
    <div className="bg-card p-7 sm:p-8">
      <span className="text-xs font-medium text-muted-foreground">
        {number}
      </span>

      <h3 className="mt-12 text-lg font-semibold tracking-tight">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default Features;
