import { Bell, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
import { getNotificationPath } from "@/utils/notification";
import { useState } from "react";

const NotificationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRetryingNotifications, setIsRetryingNotifications] = useState(false);

  const [acceptingNotificationId, setAcceptingNotificationId] = useState(null);

  const [decliningNotificationId, setDecliningNotificationId] = useState(null);

  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetNotificationsQuery({
    page: 1,
    limit: 5,
  });

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const [markAllNotificationsAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsAsReadMutation();

  const [acceptInvitation] = useAcceptInvitationMutation();

  const [declineInvitation] = useDeclineInvitationMutation();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const isNotificationsPage = location.pathname === "/dashboard/notifications";

  const handleRetryNotifications = async () => {
    setIsRetryingNotifications(true);

    try {
      await refetch().unwrap();
    } catch {
      toast.add({
        type: "error",
        title: "Failed to load notifications.",
        priority: "high",
      });
    } finally {
      setIsRetryingNotifications(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();

      toast.add({
        type: "success",
        title: "All notifications marked as read.",
        priority: "high",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to mark notifications as read.",
        priority: "high",
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsReadSafely(notification);

    if (notification.type === "workspace.invited") {
      switch (notification.invitationStatus) {
        case "pending":
          toast.add({
            type: "info",
            title: "Workspace invitation",
            description: "Use Accept or Decline to respond to this invitation.",
          });
          return;

        case "accepted":
          break;

        case "rejected":
          toast.add({
            type: "info",
            title: "Invitation declined",
            description: "You declined this workspace invitation.",
          });
          return;

        case "expired":
          toast.add({
            type: "info",
            title: "Invitation expired",
            description: "This workspace invitation has expired.",
          });
          return;

        default:
          toast.add({
            type: "info",
            title: "Invitation unavailable",
            description: "This invitation is no longer available.",
          });
          return;
      }
    }

    const path = getNotificationPath(notification);

    if (path) {
      setOpen(false);
      navigate(path);
    } else {
      toast.add({
        type: "info",
        title: "No destination available",
        description: "There is no page to open for this notification.",
      });
    }
  };

  const markAsReadSafely = async (notification) => {
    if (notification.read) return true;

    try {
      await markNotificationAsRead(notification._id).unwrap();
      return true;
    } catch {
      toast.add({
        type: "error",
        title:
          "Action completed, but notification could not be marked as read.",
        priority: "high",
      });

      return false;
    }
  };

  const handleAcceptInvitation = async (notification) => {
    const notificationId = notification._id;
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    setAcceptingNotificationId(notificationId);

    try {
      await acceptInvitation(invitationId).unwrap();

      toast.add({
        type: "success",
        title: "Invitation accepted.",
        priority: "high",
      });

      await markAsReadSafely(notification);

      const path = `/dashboard/workspaces/${notification.workspace?._id ?? notification.workspace}`;

      setOpen(false);
      navigate(path);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to accept invitation.",
        priority: "high",
      });
    } finally {
      setAcceptingNotificationId(null);
    }
  };

  const handleDeclineInvitation = async (notification) => {
    const notificationId = notification._id;
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    setDecliningNotificationId(notificationId);

    try {
      await declineInvitation(invitationId).unwrap();

      setOpen(false);

      toast.add({
        type: "success",
        title: "Invitation declined.",
        priority: "high",
      });

      await markAsReadSafely(notification);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to decline invitation.",
        priority: "high",
      });
    } finally {
      setDecliningNotificationId(null);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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

        {isLoading && !isRetryingNotifications ? (
          <div className="space-y-2 px-2.5 py-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-start gap-3 rounded-lg px-2.5 py-2.5"
              >
                <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-4 min-w-0 flex-1 rounded-md" />

                    <div className="flex shrink-0 items-center gap-1.5">
                      <Skeleton className="h-3 w-12 rounded-md" />
                      <Skeleton className="h-1.5 w-1.5 rounded-full" />
                    </div>
                  </div>

                  <Skeleton className="mt-1 h-3 w-3/4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : isError || isRetryingNotifications ? (
          <ErrorState
            title="Couldn't load notifications"
            description="We couldn't load your notifications. Please try again."
            onRetry={handleRetryNotifications}
            isRetrying={isRetryingNotifications}
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
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={handleNotificationClick}
                onAccept={handleAcceptInvitation}
                onDecline={handleDeclineInvitation}
                isAccepting={acceptingNotificationId === notification._id}
                isDeclining={decliningNotificationId === notification._id}
                variant="compact"
              />
            ))}
          </div>
        )}

        {!isLoading &&
          !isError &&
          !isNotificationsPage &&
          !isRetryingNotifications && (
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
