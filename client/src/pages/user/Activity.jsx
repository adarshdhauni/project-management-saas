import { Activity as ActivityIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState";

import { useGetActivitiesQuery } from "@/features/workspace/workspaceApi";

import { getActivityContent } from "@/utils/activity";
import { formatRelativeTime } from "@/utils/date";

const Activity = () => {
  const { workspaceId } = useParams();

  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetActivitiesQuery({
      workspaceId,
      page: 1,
      limit: 20,
    });

  const rawActivities = data?.data?.activities ?? [];
  const pagination = data?.data?.pagination;

  const activities = rawActivities.map((activity) => {
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

  console.log(error);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          See what’s happening across this workspace.
        </p>
      </div>

      {/* Activity */}
      <section className="mt-8">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-start gap-3 py-4">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load activity"
            description="We couldn't load workspace activity. Please try again."
            onRetry={refetch}
            isRetrying={isFetching}
            className="py-16"
          />
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ActivityIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium">No activity yet</p>

            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Workspace activity will appear here as your team creates and
              updates projects, tasks, and members.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activities.map((activity) => {
              const Icon = activity.icon;

              const content = (
                <div className="flex gap-3 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-5">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>{" "}
                      {activity.target && (
                        <span className="font-medium">{activity.target}</span>
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );

              return activity.to ? (
                <Link
                  key={activity.id}
                  to={activity.to}
                  className="block rounded-md transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  {content}
                </Link>
              ) : (
                <div key={activity.id}>{content}</div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Activity;
