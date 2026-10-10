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
  useDeleteNotificationMutation,
} from "@/features/notification/notificationApi";
import {
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "@/features/workspace/workspaceApi";

import NotificationItem from "@/features/notification/components/NotificationItem";
import { toast } from "@/components/ui/toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getNotificationPath } from "@/utils/notification";
import { useState } from "react";

const Notifications = () => {
  const navigate = useNavigate();

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
  const pagination = data?.data?.pagination;

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
    if (notification.read) return;

    try {
      await markNotificationAsRead(notification._id).unwrap();
    } catch (error) {
      // Another surface may already have marked it as read.
      if (error?.status !== 409) {
        toast.add({
          type: "error",
          title:
            "The action succeeded, but the notification could not be marked as read.",
          priority: "high",
        });
      }
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
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    setAcceptingNotificationId(notification._id);

    try {
      await acceptInvitation(invitationId).unwrap();

      toast.add({
        type: "success",
        title: "Invitation accepted.",
        priority: "high",
      });

      await markAsReadSafely(notification);

      const workspaceId =
        typeof notification.workspace === "object"
          ? notification.workspace?._id
          : notification.workspace;

      if (workspaceId) {
        navigate(`/dashboard/workspaces/${workspaceId}`);
      }
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
    const invitationId = notification.metadata?.invitationId;

    if (!invitationId) {
      toast.add({
        type: "error",
        title: "Invitation information is missing.",
        priority: "high",
      });
      return;
    }

    setDecliningNotificationId(notification._id);

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

      // Avoid leaving the user on an empty page after deleting
      // its last item. Page one is already the default.
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
                  onDelete={handleDeleteNotification}
                  isAccepting={acceptingNotificationId === notification._id}
                  isDeclining={decliningNotificationId === notification._id}
                  isDeleting={deletingNotificationId === notification._id}
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
                            setSearchParams((params) => {
                              if (page - 1 === 1) {
                                params.delete("page");
                              } else {
                                params.set("page", String(page - 1));
                              }

                              return params;
                            });
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
                              setSearchParams((params) => {
                                if (pageNumber === 1) {
                                  params.delete("page");
                                } else {
                                  params.set("page", String(pageNumber));
                                }

                                return params;
                              });
                            }
                          }}
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
                        onClick={(event) => {
                          event.preventDefault();

                          if (page < pagination.totalPages && !isFetching) {
                            setSearchParams((params) => {
                              params.set("page", String(page + 1));
                              return params;
                            });
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
