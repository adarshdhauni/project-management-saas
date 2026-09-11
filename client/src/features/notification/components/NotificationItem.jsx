import { Bell, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getNotificationContent } from "@/utils/notification";
import { formatRelativeTime } from "@/utils/date";

const NotificationItem = ({
  notification,
  onClick,
  onAccept,
  onDecline,
  isAccepting = false,
  isDeclining = false,
  variant = "default",
}) => {
  const { title, description } = getNotificationContent(notification);

  const isInvitation = notification.type === "workspace.invited";

  const isCompact = variant === "compact";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(notification)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(notification);
        }
      }}
      className={`group cursor-pointer ${
        isCompact ? "rounded-lg px-2.5 py-2.5" : "px-3 py-4 sm:px-4"
      } ${!notification.read ? "bg-muted/50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-muted ${
            isCompact ? "h-8 w-8" : "h-10 w-10"
          }`}
        >
          {isInvitation ? (
            <UserPlus
              className={
                isCompact
                  ? "h-4 w-4 text-muted-foreground"
                  : "h-4.5 w-4.5 text-muted-foreground"
              }
            />
          ) : (
            <Bell
              className={
                isCompact
                  ? "h-4 w-4 text-muted-foreground"
                  : "h-4.5 w-4.5 text-muted-foreground"
              }
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
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
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                />
              )}
            </div>
          </div>

          {description && (
            <p
              className={`mt-0.5 text-muted-foreground ${
                isCompact ? "truncate text-xs" : "text-sm"
              }`}
            >
              {description}
            </p>
          )}

          {isInvitation && (
            <div
              className="mt-2 flex gap-2"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                type="button"
                size="sm"
                disabled={isAccepting || isDeclining}
                onClick={() => onAccept(notification)}
                className="h-7 px-2.5 text-xs"
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
                disabled={isAccepting || isDeclining}
                onClick={() => onDecline(notification)}
                className="h-7 px-2.5 text-xs"
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
      </div>
    </div>
  );
};

export default NotificationItem;
