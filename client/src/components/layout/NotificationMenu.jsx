import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetNotificationsQuery } from "@/features/notification/notificationApi";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";

const NotificationMenu = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetNotificationsQuery();

  const notifications = data?.data?.notifications ?? [];

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          />
        }
      >
        <Bell className="h-4 w-4" />

        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1.5rem)] max-w-80 rounded-xl p-1.5 sm:w-80"
      >
        <div className="flex items-center justify-between px-2.5 py-2">
          <p className="text-sm font-semibold">Notifications</p>

          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          )}
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="space-y-2 px-2.5 py-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg px-2.5 py-2.5"
              >
                <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                  <Skeleton className="h-3 w-3/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center px-4 py-7 text-center">
            <p className="text-sm font-semibold text-foreground">
              Couldn't load notifications
            </p>

            <p className="mt-1.5 max-w-60 text-xs leading-5 text-muted-foreground">
              We couldn't load your notifications. Please try again.
            </p>

            <button
              type="button"
              onClick={refetch}
              disabled={isFetching}
              className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              {isFetching && <Spinner className="h-3.5 w-3.5" />}
              {isFetching ? "Retrying..." : "Try again"}
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-2.5 py-8 text-center">
            <Bell className="mx-auto h-5 w-5 text-muted-foreground" />

            <p className="mt-2 text-sm font-medium">No notifications</p>

            <p className="mt-1 text-xs text-muted-foreground">
              You're all caught up.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className="cursor-pointer rounded-lg px-2.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {notification.type}
                </p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {notification.metadata?.workspaceName}
                </p>
              </div>

              {!notification.read && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem className="cursor-pointer justify-center rounded-lg text-sm font-medium">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
