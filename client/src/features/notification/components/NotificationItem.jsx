import { Bell, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getNotificationContent } from "@/utils/notification";
import { formatRelativeTime } from "@/utils/date";

const invitationStatuses = {
  pending: {
    label: "Pending",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  rejected: {
    label: "Declined",
    className: "border-border bg-muted text-muted-foreground",
  },
  expired: {
    label: "Expired",
    className: "border-border bg-muted text-muted-foreground",
  },
  unavailable: {
    label: "Unavailable",
    className: "border-border bg-muted text-muted-foreground",
  },
};

const NotificationItem = ({
  notification,
  onClick,
  onAccept,
  onDecline,
  onDelete,
  isAccepting = false,
  isDeclining = false,
  isDeleting = false,
  variant = "default",
}) => {
  const { title, description } = getNotificationContent(notification);

  const isInvitation = notification.type === "workspace.invited";
  const invitationStatus = isInvitation
    ? (invitationStatuses[notification.invitationStatus ?? "unavailable"] ??
      invitationStatuses.unavailable)
    : null;

  const canRespondToInvitation =
    isInvitation && notification.invitationStatus === "pending";

  const isCompact = variant === "compact";
  const isBusy = isAccepting || isDeclining || isDeleting;

  return (
    <div
      className={`group relative transition-colors duration-150 ${
        isCompact ? "rounded-lg px-2.5 py-2.5" : "px-3 py-4 sm:px-4"
      } ${
        notification.read
          ? "bg-transparent hover:bg-muted/60"
          : "bg-muted/50 hover:bg-muted"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border/60 ${
            isCompact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          {isInvitation ? (
            <UserPlus
              className={`text-muted-foreground ${
                isCompact ? "h-4 w-4" : "h-[18px] w-[18px]"
              }`}
            />
          ) : (
            <Bell
              className={`text-muted-foreground ${
                isCompact ? "h-4 w-4" : "h-[18px] w-[18px]"
              }`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onClick(notification)}
            className="block w-full cursor-pointer rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex items-start gap-2">
              <p
                className={`min-w-0 flex-1 text-sm ${
                  notification.read ? "font-medium" : "font-semibold"
                }`}
              >
                {title}
              </p>

              <div className="flex shrink-0 items-center gap-1.5">
                <span
                  className={`text-muted-foreground ${
                    isCompact ? "text-[10px]" : "text-xs"
                  }`}
                >
                  {formatRelativeTime(notification.createdAt)}
                </span>

                {!notification.read && (
                  <span
                    aria-label="Unread"
                    title="Unread"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  />
                )}
              </div>
            </div>

            {description && (
              <p
                className={`mt-1 text-muted-foreground ${
                  isCompact ? "text-xs" : "text-sm"
                }`}
              >
                {description}
              </p>
            )}
          </button>

          {invitationStatus && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  invitationStatus.className
                }`}
              >
                {invitationStatus.label}
              </span>
            </div>
          )}

          {canRespondToInvitation && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isBusy}
                onClick={() => onAccept(notification)}
                className="h-7 cursor-pointer px-2.5 text-xs"
              >
                {isAccepting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Accepting...
                  </>
                ) : (
                  "Accept"
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={() => onDecline(notification)}
                className="h-7 cursor-pointer px-2.5 text-xs"
              >
                {isDeclining ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Declining...
                  </>
                ) : (
                  "Decline"
                )}
              </Button>
            </div>
          )}
        </div>

        {!isCompact && onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete notification: ${title}`}
            title="Delete notification"
            disabled={isBusy}
            onClick={() => onDelete(notification)}
            className="h-8 w-8 shrink-0 cursor-pointer text-muted-foreground opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            {isDeleting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
