import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatRelativeTime } from "@/utils/date";
import { getNotificationContent } from "@/utils/notification";

const invitationStatuses = {
  pending: {
    label: "Pending",
    Icon: Clock3,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted",
    Icon: CheckCircle2,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  rejected: {
    label: "Declined",
    Icon: XCircle,
    className:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  expired: {
    label: "Expired",
    Icon: Clock3,
    className: "border-border bg-muted text-muted-foreground",
  },
  unavailable: {
    label: "Unavailable",
    Icon: AlertCircle,
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

  const isCompact = variant === "compact";
  const isInvitation = notification.type === "workspace.invited";

  const invitationStatus = isInvitation
    ? (invitationStatuses[notification.invitationStatus ?? "unavailable"] ??
      invitationStatuses.unavailable)
    : null;

  const canRespondToInvitation =
    isInvitation && notification.invitationStatus === "pending";

  const isBusy = isAccepting || isDeclining || isDeleting;
  const { Icon: StatusIcon } = invitationStatus ?? {};

  const createdAtDate = notification.createdAt
    ? new Date(notification.createdAt)
    : null;

  const validCreatedAt =
    createdAtDate && !Number.isNaN(createdAtDate.getTime());

  return (
    <article
      className={`group relative isolate overflow-hidden rounded-xl border transition-colors duration-150 ${
        isCompact ? "p-3" : "p-4 sm:p-5"
      } ${
        notification.read
          ? "border-transparent bg-transparent hover:border-border/70 hover:bg-muted/50"
          : "border-primary/10 bg-muted/50 hover:border-primary/20 hover:bg-muted"
      }`}
    >
      <button
        type="button"
        aria-label={`Open notification: ${title}${
          notification.read ? "" : ", unread"
        }`}
        disabled={isBusy}
        onClick={() => onClick(notification)}
        className="absolute inset-0 z-0 cursor-pointer rounded-xl bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-wait"
      />
      <div className="relative z-10 flex items-start gap-3 pointer-events-none">
        <div
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground ${
            isCompact ? "mt-0.5 h-9 w-9" : "mt-0.5 h-10 w-10"
          }`}
        >
          {isInvitation ? (
            <UserPlus className={isCompact ? "h-4 w-4" : "h-4.5 w-4.5"} />
          ) : (
            <Bell className={isCompact ? "h-4 w-4" : "h-4.5 w-4.5"} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <p
              className={`min-w-0 flex-1 text-sm leading-5 ${
                notification.read
                  ? "font-medium text-foreground"
                  : "font-semibold text-foreground"
              }`}
            >
              {title}
            </p>

            <div className="flex shrink-0 items-center gap-2">
              {validCreatedAt && (
                <time
                  dateTime={createdAtDate.toISOString()}
                  className={`whitespace-nowrap text-muted-foreground ${
                    isCompact ? "text-[11px]" : "text-xs"
                  }`}
                >
                  {formatRelativeTime(notification.createdAt)}
                </time>
              )}
              {!notification.read && (
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-primary ring-2 ring-primary/10"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {description && (
            <p
              className={`mt-1.5 leading-relaxed text-muted-foreground ${
                isCompact ? "line-clamp-2 text-xs" : "text-sm"
              }`}
            >
              {description}
            </p>
          )}

          {invitationStatus && StatusIcon && (
            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium ${invitationStatus.className}`}
              >
                <StatusIcon className="h-3 w-3" aria-hidden="true" />
                {invitationStatus.label}
              </span>
            </div>
          )}

          {canRespondToInvitation && (
            <div className="pointer-events-none mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isBusy}
                onClick={() => onAccept(notification)}
                className="h-8 cursor-pointer px-3 text-xs font-medium pointer-events-auto"
              >
                {isAccepting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Accepting...
                  </>
                ) : (
                  "Accept invitation"
                )}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={() => onDecline(notification)}
                className="h-8 cursor-pointer px-3 text-xs font-medium pointer-events-auto"
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
          <div className="pointer-events-none relative -mr-1 -mt-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete notification: ${title}`}
              title="Delete notification"
              disabled={isBusy}
              onClick={() => onDelete(notification)}
              className="h-8 w-8 cursor-pointer text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 pointer-events-auto"
            >
              {isDeleting ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default NotificationItem;
