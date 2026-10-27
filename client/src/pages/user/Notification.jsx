import { Bell, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ErrorState from "@/components/feedback/error/ErrorState";
import NotificationItemSkeleton from "@/components/feedback/loading/NotificationItemSkeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import NotificationList from "@/features/notification/components/NotificationList";
import NotificationPagination from "@/features/notification/components/NotificationPagination";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/features/notification/notificationApi";
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "@/features/workspace/workspaceApi";
import { getNotificationPath } from "@/utils/notification";

const Notifications = () => {
  const navigate = useNavigate();

  const [isRetryingNotifications, setIsRetryingNotifications] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const filterParam = searchParams.get("filter");
  const pageParam = Number(searchParams.get("page"));

  const filter = filterParam === "unread" ? "unread" : "all";
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const read = filter === "unread" ? false : undefined;

  const { data, isLoading, isError, isFetching, refetch } =
    useGetNotificationsQuery({
      page,
      limit: 20,
      read,
    });

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const [markAllNotificationsAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllNotificationsAsReadMutation();

  const [acceptInvitation] = useAcceptInvitationMutation();
  const [declineInvitation] = useDeclineInvitationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const [acceptingNotificationId, setAcceptingNotificationId] = useState(null);

  const [decliningNotificationId, setDecliningNotificationId] = useState(null);

  const [deletingNotificationId, setDeletingNotificationId] = useState(null);

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;
  const allCount = data?.data?.allCount ?? 0;
  const pagination = data?.data?.pagination;

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
      navigate(path);
    } else {
      toast.add({
        type: "info",
        title: "No destination available",
        description: "There is no page to open for this notification.",
      });
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

  const handleDeleteNotification = async (notification) => {
    setDeletingNotificationId(notification._id);

    try {
      await deleteNotification(notification._id).unwrap();

      toast.add({
        type: "success",
        title: "Notification deleted.",
        priority: "high",
      });

      if (notifications.length === 1 && page > 1) {
        setSearchParams((params) => {
          params.set("page", String(page - 1));
          return params;
        });
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Failed to delete notification.",
        priority: "high",
      });
    } finally {
      setDeletingNotificationId(null);
    }
  };

  const handleFilterChange = (value) => {
    setSearchParams(value === "all" ? {} : { filter: value });
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay up to date with activity across your workspaces.
          </p>
        </div>

        {!isLoading && unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead}
            className="w-full cursor-pointer sm:w-auto"
          >
            {isMarkingAllRead ? (
              <>
                <Spinner data-icon="inline-start" />
                Marking...
              </>
            ) : (
              <>
                <Check data-icon="inline-start" />
                Mark all as read
              </>
            )}
          </Button>
        )}
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
              filter === "all"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
            {allCount > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({allCount})
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("unread")}
            className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
              filter === "unread"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({unreadCount})
              </span>
            )}
          </button>
        </div>

        {isLoading && !isRetryingNotifications && (
          <div className="divide-y divide-border space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <NotificationItemSkeleton
                key={index}
                isUnread={index < 3}
                isInvitation={index === 0 || index === 3}
                showActions={index === 0}
              />
            ))}
          </div>
        )}

        {(isError || isRetryingNotifications) && (
          <ErrorState
            title="Couldn't load notifications"
            description="We couldn't load your notifications. Please try again."
            onRetry={handleRetryNotifications}
            isRetrying={isRetryingNotifications}
            className="py-16"
          />
        )}

        {!isLoading &&
          !isError &&
          !isRetryingNotifications &&
          notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="mt-4 text-sm font-medium">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>

              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {filter === "unread"
                  ? "You're all caught up."
                  : "You'll see workspace activity and updates here."}
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          !isRetryingNotifications &&
          notifications.length > 0 && (
            <>
              <NotificationList
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onAcceptInvitation={handleAcceptInvitation}
                onDeclineInvitation={handleDeclineInvitation}
                onDeleteNotification={handleDeleteNotification}
                acceptingNotificationId={acceptingNotificationId}
                decliningNotificationId={decliningNotificationId}
                deletingNotificationId={deletingNotificationId}
              />

              {pagination?.totalPages > 1 && (
                <NotificationPagination
                  pagination={pagination}
                  page={page}
                  isFetching={isFetching}
                  setSearchParams={setSearchParams}
                />
              )}
            </>
          )}
      </section>
    </div>
  );
};

export default Notifications;
