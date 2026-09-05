import { ArrowRight, Check } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Workflow = () => {
  return (
    <section
      id="workflow"
      className="scroll-mt-(--header-offset) bg-background"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Simple workflow
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Less managing.
              <br />
              More making.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Create a workspace, bring your team together, break work into
              manageable tasks, and keep momentum visible.
            </p>

            <Link
              to="/auth/register"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              Start building today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              "Create your workspace",
              "Invite your team",
              "Create projects",
              "Break projects into tasks",
              "Track progress to completion",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-medium text-primary-foreground">
                  {index + 1}
                </div>

                <span className="text-sm font-medium">{item}</span>

                <Check className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
