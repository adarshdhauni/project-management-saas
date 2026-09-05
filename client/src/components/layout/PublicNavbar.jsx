import { Menu } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import useActiveSection from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import ThemeToggle from "../common/ThemeToggle";

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
  const activeSection = useActiveSection();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 text-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5">
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

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
