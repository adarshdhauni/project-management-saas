import React from "react";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Search,
  Sun,
  Activity,
  FolderKanban,
  Settings,
  Users,
  Menu,
  Plus,
  Clock3,
  MoreHorizontal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  recentActivities,
  recentProjects,
  stats,
} from "@/constants/mockupData";

const ProductMockup = () => {
  return (
    <div className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_25px_80px_-30px_rgba(0,0,0,0.25)]">
        <div className="flex h-10 items-center gap-1.5 border-b border-border px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />

          <div className="mx-auto hidden h-6 w-72 rounded-md bg-muted sm:block" />
        </div>

        <header className="h-16 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">T</span>
                </div>

                <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">
                  TaskFlow
                </span>
              </div>

              <div className="mx-0.5 hidden h-6 w-px bg-border sm:block" />

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground sm:h-10 sm:w-auto sm:gap-2 sm:px-2.5">
                <LayoutDashboard className="h-4 w-4 rounded bg-muted-foreground/25" />
                <span className="hidden text-sm sm:inline">Dashboard</span>
              </div>

              <div className="flex h-9 min-w-0 max-w-36 shrink items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground sm:h-10 sm:max-w-56 sm:px-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-foreground/70">
                  AW
                </div>

                <span className="hidden truncate sm:block">Acme Workspace</span>

                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground sm:h-9 sm:w-auto sm:gap-2 sm:border sm:border-border sm:bg-muted/40 sm:px-3">
                <Search className="h-4 w-4" />

                <span className="hidden text-sm sm:inline">Search</span>

                <kbd className="ml-2 hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
                  ⌘ K
                </kbd>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground">
                <Sun className="h-4 w-4" />
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground">
                <Bell className="h-4 w-4" />
              </div>

              <div className="mx-1 h-6 w-px bg-border sm:mx-2" />

              <div className="flex items-center gap-1 rounded-lg p-1 sm:gap-2 sm:p-1.5 sm:pr-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  AD
                </div>

                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-4rem)]">
          <aside className="hidden w-64 shrink-0 border-r border-border bg-card sm:block">
            <div className="flex h-full flex-col">
              <nav className="flex-1 space-y-1 p-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-foreground">
                  <LayoutDashboard className="size-4 shrink-0" />
                  <span>Overview</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  <FolderKanban className="size-4 shrink-0" />
                  <span>Projects</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  <Activity className="size-4 shrink-0" />
                  <span>Activity</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  <Users className="size-4 shrink-0" />
                  <span>Members</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
                  <Settings className="size-4 shrink-0" />
                  <span>Settings</span>
                </div>
              </nav>
            </div>
          </aside>

          <div className="min-w-0 flex-1 bg-background ">
            <div className="border-b border-border sm:hidden">
              <div className="flex h-12 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open workspace navigation"
                  className="pointer-events-none"
                >
                  <Menu className="size-5" />
                </Button>
              </div>
            </div>
            <main>
              <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground">
                      AW
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Workspace
                      </p>

                      <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">
                        Acme Workspace
                      </h1>

                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        Build, manage, and ship great products together.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="pointer-events-none w-full sm:w-auto"
                  >
                    <Plus data-icon="inline-start" />
                    New project
                  </Button>
                </section>

                <section className="mt-8 grid gap-4 lg:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-border bg-card"
                      >
                        <div className="flex items-center justify-between p-5">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {stat.label}
                            </p>

                            <p className="mt-1 text-2xl font-semibold tracking-tight">
                              {stat.value}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {stat.description}
                            </p>
                          </div>

                          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                            <Icon className="size-4.5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>

                <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
                  <section className="min-w-0">
                    <Card className="gap-0 py-0">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            Recent projects
                          </CardTitle>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Projects updated recently in this workspace.
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <span className="hidden sm:inline">View all</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        <div className="divide-y divide-border">
                          {recentProjects.map((project) => {
                            const Icon = project.icon;

                            return (
                              <div
                                key={project.name}
                                className="px-5 py-4 sm:px-6"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex min-w-0 items-start gap-3">
                                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Icon className="size-4" />
                                      </div>

                                      <div className="min-w-0">
                                        <h3 className="truncate text-sm font-medium">
                                          {project.name}
                                        </h3>

                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                          {project.description}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                      <Clock3 className="h-3.5 w-3.5" />
                                      {project.updated}
                                    </div>
                                  </div>

                                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground">
                                    <MoreHorizontal className="size-4" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </section>

                  <section className="min-w-0">
                    <Card className="gap-0 py-0">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div className="min-w-0">
                            <CardTitle className="text-sm font-semibold">
                              Recent activity
                            </CardTitle>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Latest workspace activity.
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <span className="hidden sm:inline">View all</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardHeader>

                      <CardContent className="px-5 py-1 sm:px-6">
                        <div className="divide-y divide-border">
                          {recentActivities.map((activity) => {
                            const Icon = activity.icon;
                            return (
                              <div
                                key={`${activity.user}-${activity.target}`}
                                className="flex gap-3 py-4"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-xs leading-5">
                                    <span className="font-medium">
                                      {activity.user}
                                    </span>{" "}
                                    <span className="text-muted-foreground">
                                      {activity.action}
                                    </span>{" "}
                                    <span className="font-medium">
                                      {activity.target}
                                    </span>
                                  </p>

                                  <p className="mt-1 text-[11px] text-muted-foreground">
                                    {activity.time}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMockup;
