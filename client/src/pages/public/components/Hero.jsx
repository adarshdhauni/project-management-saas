import { ArrowRight, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
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
          <Link
            to="/auth/register"
            className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:opacity-85"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <a
            href="#features"
            className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Explore features
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_25px_80px_-30px_rgba(0,0,0,0.25)]">
          <div className="flex h-11 items-center gap-1.5 border-b border-border px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />

            <div className="mx-auto hidden h-6 w-64 rounded-md bg-muted sm:block" />
          </div>

          <div className="flex min-h-105">
            <aside className="hidden w-52 shrink-0 border-r border-border p-4 sm:block">
              <div className="mb-7 flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary" />
                <div className="h-3 w-20 rounded bg-muted-foreground/20" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-2">
                  <div className="h-3.5 w-3.5 rounded bg-muted-foreground/40" />
                  <div className="h-2.5 w-20 rounded bg-muted-foreground/30" />
                </div>

                <div className="flex items-center gap-2 px-2.5 py-2">
                  <div className="h-3.5 w-3.5 rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-16 rounded bg-muted-foreground/20" />
                </div>

                <div className="flex items-center gap-2 px-2.5 py-2">
                  <div className="h-3.5 w-3.5 rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-24 rounded bg-muted-foreground/20" />
                </div>
              </div>

              <div className="mt-8 h-px bg-border" />

              <div className="mt-5 space-y-3 px-2.5">
                <div className="h-2 w-14 rounded bg-muted-foreground/20" />
                <div className="h-2 w-24 rounded bg-muted-foreground/15" />
                <div className="h-2 w-20 rounded bg-muted-foreground/15" />
                <div className="h-2 w-28 rounded bg-muted-foreground/15" />
              </div>
            </aside>

            <div className="flex-1 p-5 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-3 w-24 rounded bg-muted-foreground/20" />
                  <div className="mt-3 h-6 w-44 rounded bg-muted-foreground/30" />
                </div>

                <div className="h-8 w-24 rounded-md bg-primary" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border p-4"
                  >
                    <div className="h-2.5 w-16 rounded bg-muted-foreground/15" />
                    <div className="mt-3 h-5 w-10 rounded bg-muted-foreground/30" />
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-border">
                <div className="border-b border-border px-4 py-3">
                  <div className="h-3 w-28 rounded bg-muted-foreground/20" />
                </div>

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between border-b border-border px-4 py-4 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted" />

                      <div>
                        <div className="h-2.5 w-28 rounded bg-muted-foreground/25" />
                        <div className="mt-2 h-2 w-20 rounded bg-muted-foreground/15" />
                      </div>
                    </div>

                    <div className="h-2 w-14 rounded bg-muted-foreground/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
