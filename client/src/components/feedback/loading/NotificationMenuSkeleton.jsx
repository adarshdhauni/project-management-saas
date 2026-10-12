import { Skeleton } from "@/components/ui/skeleton";

function NotificationMenuSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading notifications"
      className="divide-y divide-border/60"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3 px-4 py-4">
          <Skeleton className="mt-0.5 size-10 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-3/5 max-w-44" />
              <Skeleton className="mt-0.5 size-2 shrink-0 rounded-full" />
            </div>

            <Skeleton className="h-3.5 w-full max-w-64" />
            <Skeleton className="h-3.5 w-4/5 max-w-48" />

            {index === 0 && (
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 w-19 rounded-md" />
                <Skeleton className="h-8 w-19 rounded-md" />
              </div>
            )}

            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}

      <span className="sr-only">Loading your notifications…</span>
    </div>
  );
}

export default NotificationMenuSkeleton;
