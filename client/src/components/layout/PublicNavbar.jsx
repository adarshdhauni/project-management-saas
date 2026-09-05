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

          <Button size="lg" variant="ghost" render={<Link to="/auth/login" />}>
            Log in
          </Button>

          <Button size="lg" render={<Link to="/auth/register" />}>
            Get started
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full max-w-sm p-0">
              <SheetTitle className="sr-only">TaskFlow navigation</SheetTitle>

              <SheetDescription className="sr-only">
                Navigate the TaskFlow website or access your account.
              </SheetDescription>

              <div className="flex h-full flex-col">
                <div className="border-b border-border px-6 py-6">
                  <a
                    href="#top"
                    onClick={closeSheet}
                    className="flex items-center gap-2.5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <span className="text-sm font-semibold">T</span>
                    </div>

                    <span className="text-[15px] font-semibold tracking-tight">
                      TaskFlow
                    </span>
                  </a>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Project management, simplified.
                  </p>
                </div>

                <div className="px-4 py-6">
                  <p className="px-2 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Navigate
                  </p>

                  <nav className="space-y-1">
                    {NAV_LINKS.map((link) => {
                      const isActive = activeSection === link.id;

                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          aria-current={isActive ? "location" : undefined}
                          onClick={closeSheet}
                          className={cn(
                            "group flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                            isActive
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <span>{link.label}</span>

                          <ChevronRight
                            className={cn(
                              "size-4 transition-transform duration-150",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:translate-x-0.5",
                            )}
                          />
                        </a>
                      );
                    })}
                  </nav>
                </div>

                <div className="mt-auto border-t border-border px-6 py-6">
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Get started with TaskFlow
                  </p>

                  <div className="grid gap-2">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={closeSheet}
                      render={<Link to="/auth/login" />}
                      className="w-full"
                    >
                      Log in
                    </Button>

                    <Button
                      size="lg"
                      render={<Link to="/auth/register" />}
                      onClick={closeSheet}
                      className="w-full"
                    >
                      Get started
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
