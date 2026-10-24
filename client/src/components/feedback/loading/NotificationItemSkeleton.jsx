import { Skeleton } from "@/components/ui/skeleton";

const NotificationItemSkeleton = ({
  variant = "default",
  isInvitation = false,
  showActions = false,
  isUnread = true,
}) => {
  const isCompact = variant === "compact";

  return (
    <article
      aria-hidden="true"
      className={`relative overflow-hidden rounded-xl border ${
        isCompact ? "p-3" : "p-4 sm:p-5"
      } ${
        isUnread
          ? "border-primary/10 bg-muted/50"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        <Skeleton
          className={`mt-0.5 shrink-0 rounded-xl ${
            isCompact ? "h-9 w-9" : "h-10 w-10"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <Skeleton
              className={`h-4 min-w-0 ${
                isCompact ? "w-32 max-w-[65%]" : "w-44 max-w-[65%]"
              }`}
            />

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <Skeleton className={`h-3 ${isCompact ? "w-10" : "w-12"}`} />

              {isUnread && (
                <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
              )}
            </div>
          </div>

          <div className="mt-1.5 space-y-1.5">
            <Skeleton
              className={`h-3.5 w-full ${isCompact ? "max-w-55" : "max-w-75"}`}
            />
            <Skeleton
              className={`h-3.5 ${
                isCompact ? "w-[65%] max-w-42.5" : "w-[72%] max-w-55"
              }`}
            />
          </div>

          {isInvitation && (
            <div className="mt-3">
              <Skeleton className="h-5.5 w-19 rounded-full" />
            </div>
          )}

          {showActions && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-31 rounded-md" />
              <Skeleton className="h-8 w-17 rounded-md" />
            </div>
          )}
        </div>

        {!isCompact && (
          <Skeleton className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-md" />
        )}
      </div>
    </article>
  );
};

export default NotificationItemSkeleton;
