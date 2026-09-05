import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Free",
    description: "For individuals getting started with organized work.",
    price: "$0",
    period: "forever",
    features: [
      "1 workspace",
      "Up to 5 projects",
      "Unlimited tasks",
      "Task comments",
      "Basic notifications",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    description: "For individuals and small teams managing real projects.",
    price: "$9",
    period: "per user / month",
    features: [
      "Unlimited workspaces",
      "Unlimited projects",
      "Unlimited tasks",
      "Task comments",
      "Activity tracking",
      "Advanced notifications",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Team",
    description: "For teams that need more control and collaboration.",
    price: "$16",
    period: "per user / month",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Workspace management",
      "Project collaboration",
      "Advanced activity tracking",
      "Priority support",
    ],
    cta: "Get started",
    featured: false,
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="scroll-mt-(--header-offset) border-t border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Simple pricing for focused teams.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Start free and upgrade when your team needs more space to
            collaborate and get work done.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={[
                "relative flex flex-col rounded-2xl border p-7",
                plan.featured
                  ? "border-primary bg-primary text-primary-foreground shadow-xl"
                  : "border-border bg-card text-card-foreground",
              ].join(" ")}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-primary-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>

                <p
                  className={[
                    "mt-2 max-w-xs text-sm leading-6",
                    plan.featured
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mt-8">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-[-0.03em]">
                    {plan.price}
                  </span>

                  <span
                    className={[
                      "pb-1 text-xs",
                      plan.featured
                        ? "text-primary-foreground/50"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <Link
                to="/auth/register"
                className={[
                  "mt-8 flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-opacity",
                  plan.featured
                    ? "bg-primary-foreground text-primary hover:opacity-90"
                    : "bg-primary text-primary-foreground hover:opacity-85",
                ].join(" ")}
              >
                {plan.cta}
              </Link>

              <div
                className={[
                  "my-7 h-px",
                  plan.featured ? "bg-primary-foreground/10" : "bg-border",
                ].join(" ")}
              />

              <p
                className={[
                  "text-xs font-medium",
                  plan.featured
                    ? "text-primary-foreground/50"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                What's included
              </p>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check
                      className={[
                        "mt-0.5 h-4 w-4 shrink-0",
                        plan.featured
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground",
                      ].join(" ")}
                    />

                    <span
                      className={
                        plan.featured
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
