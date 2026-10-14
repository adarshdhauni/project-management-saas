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
        {/* Matches the real notification icon */}
        <Skeleton
          className={`mt-0.5 shrink-0 rounded-xl ${
            isCompact ? "h-9 w-9" : "h-10 w-10"
          }`}
        />

        <div className="min-w-0 flex-1">
          {/* Title and timestamp/unread indicator */}
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

          {/* Description lines */}
          <div className="mt-1.5 space-y-1.5">
            <Skeleton
              className={`h-3.5 w-full ${
                isCompact ? "max-w-[220px]" : "max-w-[300px]"
              }`}
            />
            <Skeleton
              className={`h-3.5 ${
                isCompact ? "w-[65%] max-w-[170px]" : "w-[72%] max-w-[220px]"
              }`}
            />
          </div>

          {/* Invitation status badge */}
          {isInvitation && (
            <div className="mt-3">
              <Skeleton className="h-[22px] w-[76px] rounded-full" />
            </div>
          )}

          {/* Invitation action buttons */}
          {showActions && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Skeleton className="h-8 w-[124px] rounded-md" />
              <Skeleton className="h-8 w-[68px] rounded-md" />
            </div>
          )}
        </div>

        {/* Delete action placeholder on the full notifications page */}
        {!isCompact && (
          <Skeleton className="-mr-1 -mt-1 h-8 w-8 shrink-0 rounded-md" />
        )}
      </div>
    </article>
  );
};

export default NotificationItemSkeleton;
