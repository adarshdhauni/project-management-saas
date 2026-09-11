import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ErrorState from "@/components/feedback/error/ErrorState";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/features/notification/notificationApi";
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "@/features/workspace/workspaceApi";

import NotificationItem from "@/features/notification/components/NotificationItem";
import { toast } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

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

  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptInvitationMutation();

  const [declineInvitation, { isLoading: isDeclining }] =
    useDeclineInvitationMutation();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;
  const pagination = data?.data?.pagination;

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

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  console.log(pagination);

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
            {pagination?.total > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({pagination.total})
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

        {isLoading && (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 px-3 py-5 sm:px-4"
              >
                <Skeleton className="mt-0.5 h-10 w-10 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <Skeleton className="h-4 w-3/5 rounded-md" />
                    <Skeleton className="h-3 w-10 shrink-0 rounded-md" />
                  </div>

                  <Skeleton className="h-3.5 w-2/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState
            title="Couldn't load notifications"
            description="We couldn't load your notifications. Please try again."
            onRetry={refetch}
            isRetrying={isFetching}
            className="py-16"
          />
        )}

        {!isLoading && !isError && notifications.length === 0 && (
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

        {!isLoading && !isError && notifications.length > 0 && (
          <>
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                  isAccepting={isAccepting}
                  isDeclining={isDeclining}
                />
              ))}
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
                        onClick={(event) => {
                          event.preventDefault();

                          if (page > 1 && !isFetching) {
                            setPage((current) => current - 1);
                          }
                        }}
                        className={
                          page === 1 || isFetching
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
                          onClick={(event) => {
                            event.preventDefault();

                            if (page !== pageNumber && !isFetching) {
                              setPage(pageNumber);
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();

                          if (page < pagination.totalPages && !isFetching) {
                            setPage((current) => current + 1);
                          }
                        }}
                        className={
                          page === pagination.totalPages || isFetching
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

export default Notifications;
