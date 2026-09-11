import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import ErrorState from "@/components/feedback/error/ErrorState";

import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/features/notification/notificationApi";
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "@/features/workspace/workspaceApi";

import { toast } from "../ui/toast";
import NotificationItem from "@/features/notification/components/NotificationItem";

const NotificationMenu = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, refetch } =
    useGetNotificationsQuery({
      page: 1,
      limit: 5,
    });

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const [markAllNotificationsAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsAsReadMutation();

  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptInvitationMutation();

  const [declineInvitation, { isLoading: isDeclining }] =
    useDeclineInvitationMutation();

  const notifications = data?.data?.notifications ?? [];

  const unreadCount = data?.data?.unreadCount ?? 0;

  const isNotificationsPage = location.pathname === "/dashboard/notifications";

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to mark notifications as read.",
        priority: "high",
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification._id).unwrap();
      }

      switch (notification.type) {
        case "task.assigned":
          navigate(
            `/dashboard/workspaces/${notification.workspace}/tasks/${notification.entityId}`,
          );
          break;

        case "workspace.invited":
          break;

        case "member.role_changed":
          navigate(`/dashboard/workspaces/${notification.workspace}/members`);
          break;

        case "member.removed":
          navigate("/dashboard");
          break;

        default:
          break;
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to update notification.",
        priority: "high",
      });
    }
  };

  const handleAcceptInvitation = async (notification) => {
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    try {
      await acceptInvitation(invitationId).unwrap();

      toast.add({
        type: "success",
        title: "Invitation accepted.",
        priority: "high",
      });

      await markNotificationAsRead(notification._id).unwrap();

      navigate(`/dashboard/workspaces/${notification.workspace}`);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to accept invitation.",
        priority: "high",
      });
    }
  };

  const handleDeclineInvitation = async (notification) => {
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    try {
      await declineInvitation(invitationId).unwrap();

      toast.add({
        type: "success",
        title: "Invitation declined.",
        priority: "high",
      });

      await markNotificationAsRead(notification._id).unwrap();
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to decline invitation.",
        priority: "high",
      });
    }
  };

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
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Notifications</p>

            {unreadCount > 0 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isMarkingAllRead ? (
                <>
                  <Spinner className="h-3 w-3" />
                  Marking...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Mark all as read
                </>
              )}
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        {isLoading ? (
          <div className="space-y-2 px-2.5 py-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg px-2.5 py-2.5"
              >
                <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-3.5 w-4/5 rounded-md" />

                    <Skeleton className="h-3 w-9 shrink-0 rounded-md" />
                  </div>

                  <Skeleton className="h-3 w-3/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load notifications"
            description="We couldn't load your notifications. Please try again."
            onRetry={refetch}
            isRetrying={isFetching}
            className="px-4 py-8"
          />
        ) : notifications.length === 0 ? (
          <div className="px-2.5 py-8 text-center">
            <Bell className="mx-auto h-5 w-5 text-muted-foreground" />

            <p className="mt-2 text-sm font-medium">No notifications</p>

            <p className="mt-1 text-xs text-muted-foreground">
              You're all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                  isAccepting={isAccepting}
                  isDeclining={isDeclining}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !isError && !isNotificationsPage && (
          <>
            <DropdownMenuSeparator className="my-1.5" />

            <DropdownMenuItem
              onClick={() => navigate("/dashboard/notifications")}
              className="cursor-pointer justify-center rounded-lg text-sm font-medium"
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
