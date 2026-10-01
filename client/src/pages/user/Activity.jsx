import { Activity as ActivityIcon } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/feedback/error/ErrorState";

import { useGetActivitiesQuery } from "@/features/workspace/workspaceApi";

import { getActivityContent } from "@/utils/activity";
import { formatRelativeTime } from "@/utils/date";

const Activity = () => {
  const { workspaceId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limit = 20;

  const { data, isLoading, isError, isFetching, refetch } =
    useGetActivitiesQuery({
      workspaceId,
      page,
      limit,
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

  const handlePageChange = (event, pageNumber) => {
    event.preventDefault();

    if (page === pageNumber || isFetching) return;

    setSearchParams((params) => {
      if (pageNumber === 1) {
        params.delete("page");
      } else {
        params.set("page", String(pageNumber));
      }

      return params;
    });
  };

  const handlePreviousPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasPreviousPage || isFetching) return;

    setSearchParams((params) => {
      if (page - 1 === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page - 1));
      }

      return params;
    });
  };

  const handleNextPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasNextPage || isFetching) return;

    setSearchParams((params) => {
      params.set("page", String(page + 1));
      return params;
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          See what’s happening across this workspace.
        </p>
      </div>

      <section className="mt-8">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 px-3 py-4 sm:px-4"
              >
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-3.5 w-4/5 rounded-md" />
                  </div>

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
        ) : activities.length === 0 && !isLoading && !isFetching ? (
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
          <>
            <div className="divide-y divide-border">
              {activities.map((activity) => {
                const Icon = activity.icon;

                const content = (
                  <div className="flex gap-3 px-3 py-4 sm:px-4">
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
                    className="block transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={activity.id}>{content}</div>
                );
              })}
            </div>

            {pagination?.totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </p>

                <Pagination className="mx-0 w-auto sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={handlePreviousPage}
                        className={
                          !pagination.hasPreviousPage || isFetching
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, index) => index + 1,
                    ).map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNumber}
                          onClick={(event) =>
                            handlePageChange(event, pageNumber)
                          }
                          className={
                            isFetching
                              ? "pointer-events-none cursor-default opacity-60"
                              : "cursor-pointer"
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={handleNextPage}
                        className={
                          !pagination.hasNextPage || isFetching
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Activity;
