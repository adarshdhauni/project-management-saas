import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants/pricingPlans";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

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
            Start free today. Paid plans are coming soon as your team grows.
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

              {plan.comingSoon ? (
                <Button
                  disabled
                  className={[
                    "mt-8 w-full",
                    plan.featured
                      ? "bg-primary-foreground/15 text-primary-foreground/60"
                      : "",
                  ].join(" ")}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  nativeButton={false}
                  className="mt-8 w-full hover:opacity-85"
                  render={<Link to="/auth/register" />}
                >
                  {plan.cta}
                </Button>
              )}

              {plan.comingSoon ? (
                <div
                  className={[
                    "mt-7 border-t pt-7",
                    plan.featured
                      ? "border-primary-foreground/10"
                      : "border-border",
                  ].join(" ")}
                >
                  <p
                    className={[
                      "text-sm leading-6",
                      plan.featured
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground",
                    ].join(" ")}
                  >
                    Paid plan coming soon. Additional capabilities will be
                    introduced in future updates.
                  </p>
                </div>
              ) : (
                <>
                  <div className="my-7 h-px bg-border" />

                  <p className="text-xs font-medium text-muted-foreground">
                    What's included
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
