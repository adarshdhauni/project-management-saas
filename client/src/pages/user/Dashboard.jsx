import { Building2, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
import { useGetWorkspacesQuery } from "@/features/workspace/workspaceApi";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError, isFetching, refetch } =
    useGetWorkspacesQuery();

  const workspaces = data?.data ?? [];

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

  const getWorkspaceInitials = (name) => {
    return (
      name
        ?.trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? ""
    );
  };

  const handleCreateWorkspace = () => {
    // Wire this to the same CreateWorkspaceDialog
    // used by the navbar.
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header>
          <p className="text-sm text-muted-foreground">Dashboard</p>

          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Good evening, {firstName}.
            </h1>
          </div>
        </header>

        {/* Loading */}
        {isLoading && <DashboardSkeleton />}

        {/* Error */}
        {!isLoading && isError && (
          <section className="mt-8">
            <ErrorState
              title="Couldn't load your workspaces"
              description="We couldn't fetch your workspaces. Please try again."
              onRetry={refetch}
              isRetrying={isFetching}
            />
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && workspaces.length === 0 && (
          <section className="mt-8">
            <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>

              <h2 className="mt-5 text-lg font-semibold tracking-tight">
                Create your workspace
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Workspaces keep your projects, tasks, and team members organized
                in one place.
              </p>

              <Button
                type="button"
                onClick={handleCreateWorkspace}
                className="mt-6 cursor-pointer"
              >
                <Plus data-icon="inline-start" />
                Create workspace
              </Button>
            </div>
          </section>
        )}

        {/* Workspaces */}
        {!isLoading && !isError && workspaces.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  Your workspaces
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a workspace to continue.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCreateWorkspace}
                className="cursor-pointer"
              >
                <Plus data-icon="inline-start" />
                <span className="hidden sm:inline">Create workspace</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => {
                const initials = getWorkspaceInitials(workspace.name);

                return (
                  <button
                    key={workspace._id}
                    type="button"
                    onClick={() => navigate(`/workspaces/${workspace._id}`)}
                    className="group flex min-h-55 cursor-pointer flex-col rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {/* Workspace identity */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground/70">
                        {initials}
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </div>

                    {/* Workspace name */}
                    <div className="mt-5">
                      <h3 className="truncate text-base font-semibold tracking-tight">
                        {workspace.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Workspace
                      </p>
                    </div>

                    {/* Workspace metadata */}
                    <div className="mt-auto pt-6">
                      <p className="text-xs text-muted-foreground">
                        Open workspace
                      </p>

                      <span className="mt-1 inline-flex items-center text-sm font-medium text-foreground">
                        View workspace
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Create workspace card */}
              <button
                type="button"
                onClick={handleCreateWorkspace}
                className="group flex min-h-55 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-5 text-center transition-colors hover:border-foreground/20 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/80">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-sm font-semibold">Create workspace</h3>

                <p className="mt-1 max-w-50 text-xs leading-5 text-muted-foreground">
                  Start a new workspace for your projects and team.
                </p>
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <section className="mt-10">
      <div className="mb-5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="mt-2 h-4 w-52 rounded-md" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="min-h-55 rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-11 w-11 rounded-xl" />

            <Skeleton className="mt-5 h-5 w-32 rounded-md" />
            <Skeleton className="mt-2 h-4 w-20 rounded-md" />

            <div className="mt-12">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="mt-2 h-4 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
