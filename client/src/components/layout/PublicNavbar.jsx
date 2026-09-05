import { ChevronRight, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useActiveSection from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import ThemeToggle from "../common/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const NAV_LINKS = [
  {
    label: "Features",
    id: "features",
    href: "#features",
  },
  {
    label: "Workflow",
    id: "workflow",
    href: "#workflow",
  },
  {
    label: "Pricing",
    id: "pricing",
    href: "#pricing",
  },
];

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  const activeSection = useActiveSection();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 text-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">T</span>
          </div>

          <span className="text-[15px] font-semibold tracking-tight">
            TaskFlow
          </span>
        </a>

        <nav className="hidden md:flex">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground",
                      isActive && "text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-150",
                        isActive && "scale-x-100",
                      )}
                    />

                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />

          <Link
            to="/auth/login"
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Log in
          </Link>

          <Link
            to="/auth/register"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-85"
          >
            Get started
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-sm p-6">
              <SheetTitle className="sr-only">Mobile navigation</SheetTitle>

              <SheetDescription className="sr-only">
                Navigate to a section or access your account.
              </SheetDescription>

              <div className="flex h-full flex-col overflow-y-auto">
                <div className="border-b border-border/50 pb-6">
                  <a
                    href="#top"
                    onClick={closeSheet}
                    className="text-2xl font-semibold tracking-[-0.03em]"
                  >
                    TaskFlow
                  </a>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Project management, simplified.
                  </p>
                </div>

                <div className="mt-8">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    Navigation
                  </p>

                  <nav className="space-y-2">
                    {NAV_LINKS.map((link) => {
                      const isActive = activeSection === link.id;

                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          aria-current={isActive ? "location" : undefined}
                          onClick={closeSheet}
                          className={cn(
                            "group flex items-center justify-between rounded-2xl border border-transparent px-4 py-3.5 transition-all duration-150",
                            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                            isActive
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "hover:border-border hover:bg-muted/60",
                          )}
                        >
                          <span className="text-base font-medium">
                            {link.label}
                          </span>

                          <ChevronRight
                            className={cn(
                              "size-4 transition-transform duration-150 group-hover:translate-x-1",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </a>
                      );
                    })}
                  </nav>
                </div>

                <div className="mt-auto border-t border-border/50 pt-6">
                  <div className="grid gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/auth/login" onClick={closeSheet}>
                        Log in
                      </Link>
                    </Button>

                    <Button asChild className="w-full">
                      <Link to="/auth/register" onClick={closeSheet}>
                        Get started
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
