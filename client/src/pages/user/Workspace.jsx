import {
  Activity,
  ArrowRight,
  Clock3,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Users,
  CheckSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetWorkspaceOverviewQuery } from "@/features/workspace/workspaceApi";
import ErrorState from "@/components/feedback/error/ErrorState";
import getWorkspaceInitials from "@/utils/workspaceInitials";
import WorkspaceSkeleton from "@/components/feedback/loading/WorkspaceSkeleton";
import WorkspaceNotFound from "@/components/feedback/empty/WorkspaceNotFound";
import { getActivityContent } from "@/utils/activity";
import { formatRelativeTime } from "@/utils/date";
import { useState } from "react";
import ProjectDialog from "@/features/project/components/ProjectDialog";
import {
  getProjectIcon,
  getProjectColorClass,
} from "@/constants/projectOptions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Workspace = () => {
  const { workspaceId } = useParams();

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetWorkspaceOverviewQuery(workspaceId);

  const workspace = data?.data?.workspace;
  const overviewStats = data?.data?.stats || [];

  const stats = [
    {
      label: "Projects",
      value: overviewStats?.projects ?? 0,
      description: "Projects in this workspace",
      icon: FolderKanban,
      to: `/dashboard/workspaces/${workspaceId}/projects`,
    },
    {
      label: "Tasks",
      value: overviewStats?.tasks ?? 0,
      description: "Tasks across all projects",
      icon: CheckSquare,
      to: `/dashboard/workspaces/${workspaceId}/tasks`,
    },
    {
      label: "Members",
      value: overviewStats?.members ?? 0,
      description: "Members in this workspace",
      icon: Users,
      to: `/dashboard/workspaces/${workspaceId}/members`,
    },
  ];

  const recentProjects = data?.data?.recentProjects ?? [];
  const recentActivity = data?.data?.recentActivity ?? [];

  const activities = recentActivity.map((activity) => {
    const content = getActivityContent(activity);

    return {
      id: activity._id,
      user: activity.user?.name ?? "Someone",
      action: content.action,
      target: content.target,
      to: content.to,
      time: formatRelativeTime(activity.createdAt),
      icon: content.icon,
    };
  });

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsProjectDialogOpen(true);
  };
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

        <Button
          onClick={() => handleCreateProject()}
          type="button"
          className="w-full cursor-pointer sm:w-auto"
        >
          <Plus data-icon="inline-start" />
          New project
        </Button>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="group rounded-xl border border-border bg-card transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            </Link>
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

              {recentProjects.length > 0 && (
                <Link
                  to={`/dashboard/workspaces/${workspaceId}/projects`}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="hidden sm:inline">View all</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {recentProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:px-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <FolderKanban className="size-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-3 text-sm font-medium">No projects yet</h3>

                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    This workspace doesn't have any projects yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentProjects.map((project) => {
                    const Icon = getProjectIcon(project.icon);

                    return (
                      <div
                        key={project._id}
                        className="group px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            to={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                            className="min-w-0 flex-1"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${getProjectColorClass(
                                  project.color,
                                )}`}
                              >
                                <Icon className="size-4" />
                              </div>

                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-medium">
                                  {project.name}
                                </h3>

                                <p className="mt-1 truncate text-xs text-muted-foreground">
                                  {project.description || "No description"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Clock3 className="h-3.5 w-3.5" />
                              Updated {formatRelativeTime(project.updatedAt)}
                            </div>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button
                                  type="button"
                                  aria-label={`Actions for ${project.name}`}
                                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                />
                              }
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-40 rounded-xl p-1.5"
                            >
                              <DropdownMenuItem
                                onClick={() => handleEditProject(project)}
                                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                              >
                                <Pencil className="h-4 w-4" />
                                <span>Edit project</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="my-1.5" />

                              <DropdownMenuItem
                                onClick={() => handleDeleteProject(project)}
                                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete project</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

              {activities.length > 0 && (
                <Link
                  to={`/dashboard/workspaces/${workspaceId}/activity`}
                  className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="hidden sm:inline">View all</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </CardHeader>

            <CardContent className="px-5 py-1 sm:px-6">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-2 py-10 text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <Activity className="size-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-3 text-sm font-medium">No activity yet</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Workspace activity will appear here as work happens.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {activities.map((activity) => {
                    const Icon = activity.icon;

                    const content = (
                      <div className="flex gap-3 py-4 first:pt-4 last:pb-4">
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

                    return activity.to ? (
                      <Link
                        key={activity.id}
                        to={activity.to}
                        className="block transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={activity.id}>{content}</div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        workspaceId={workspaceId}
        project={selectedProject}
      />
    </div>
  );
};

export default Workspace;
