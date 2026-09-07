import { Building2, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState";
import { useGetWorkspacesQuery } from "@/features/workspace/workspaceApi";
import { useState } from "react";
import CreateWorkspaceDialog from "@/features/workspace/components/CreateWorkspaceDialog";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWorkspacesQuery();

  const workspaces = data?.data?.workspaces ?? [];

  const firstName = user?.name?.split(" ")[0];

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="mt-2 h-8 w-48 rounded" />
        </div>

        <section className="mt-8">
          <Skeleton className="min-h-100 w-full rounded-xl" />
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Good evening, {firstName}.
          </h1>
        </div>

        <ErrorState
          title="Couldn't load your workspaces"
          description="We couldn't load your workspace data. Please try again."
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Dashboard</p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Good evening, {firstName}.
        </h1>
      </div>

      {workspaces.length === 0 ? (
        <section className="mt-8">
          <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Create your workspace
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Workspaces keep your projects, tasks, and team members organized
              in one place.
            </p>

            <Button
              type="button"
              onClick={() => setIsCreateWorkspaceOpen(true)}
              className="mt-6 cursor-pointer"
            >
              <Plus />
              Create workspace
            </Button>
          </div>
        </section>
      ) : (
        <section className="mt-8">{/* Actual dashboard */}</section>
      )}

      <CreateWorkspaceDialog
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
      />
    </div>
  );
};

export default Dashboard;
