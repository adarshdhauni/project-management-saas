import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  useGetWorkspaceByIdQuery,
  useGetWorkspaceOverviewQuery,
} from "@/features/workspace/workspaceApi";
import ErrorState from "@/components/feedback/error/ErrorState";
import getWorkspaceInitials from "@/utils/workspaceInitials";
import WorkspaceSkeleton from "@/components/feedback/loading/WorkspaceSkeleton";
import WorkspaceNotFound from "@/components/feedback/empty/WorkspaceNotFound";

const getProjectProgress = (project) => {
  if (!project.tasks) return 0;

  return Math.round((project.completedTasks / project.tasks) * 100);
};

const getProjectStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return "bg-muted text-foreground";

    case "Planning":
      return "bg-muted text-muted-foreground";

    default:
      return "bg-primary/10 text-primary";
  }
};

const Workspace = () => {
  const { workspaceId } = useParams();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetWorkspaceOverviewQuery(workspaceId);

  const workspace = data?.workspace;
  const stats = data?.data?.stats;
  const recentProjects = data?.data?.recentProjects ?? [];
  const recentActivity = data?.data?.recentActivity ?? [];

  console.log(error)

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ErrorState
          title="Couldn't load workspace"
          description={
            error?.data?.message ||
            "We couldn't load this workspace. Please try again."
          }
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (!workspace) {
    return <WorkspaceNotFound />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground">
            {getWorkspaceInitials(workspace.name)}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>

            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight">
              {workspace.name}
            </h1>

            <p className="mt-1 truncate text-sm text-muted-foreground">
              {workspace.description || "No description provided."}
            </p>
          </div>
        </div>

        <Button type="button" className="w-full cursor-pointer sm:w-auto">
          <Plus data-icon="inline-start" />
          New project
        </Button>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {stats?.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.label} className="gap-0 py-0">
              <CardContent className="flex items-center justify-between p-5">
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

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Main content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        {/* Recent Projects */}
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

              <Link
                to={`/dashboard/workspaces/${workspaceId}/projects`}
                className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="hidden sm:inline">View all</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentProjects.map((project) => {
                  const progress = getProjectProgress(project);

                  return (
                    <Link
                      key={project.id}
                      to={`/dashboard/workspaces/${workspaceId}/projects/${project.id}`}
                      className="group block px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-medium">
                              {project.name}
                            </h3>

                            <span
                              className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${getProjectStatusStyles(
                                project.status,
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {project.description}
                          </p>
                        </div>

                        <MoreHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                          <span>
                            {project.completedTasks} of {project.tasks} tasks
                          </span>

                          <span>{progress}%</span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        Updated {project.updatedAt}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Activity */}
        <section className="min-w-0">
          <Card className="gap-0 py-0">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <CardTitle className="text-sm font-semibold">
                  Recent activity
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">
                  Latest workspace activity.
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-5 py-1 sm:px-6">
              <div className="divide-y divide-border">
                {recentActivity?.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex gap-3 py-4 first:pt-4 last:pb-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-5">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">
                            {activity.action}
                          </span>{" "}
                          {activity.target && (
                            <span className="font-medium">
                              {activity.target}
                            </span>
                          )}
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
  );
};

export default Workspace;
