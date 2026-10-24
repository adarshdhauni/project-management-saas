import NotificationItem from "@/features/notification/components/NotificationItem";

const NotificationList = ({
  notifications,
  onNotificationClick,
  onAcceptInvitation,
  onDeclineInvitation,
  onDeleteNotification,
  acceptingNotificationId,
  decliningNotificationId,
  deletingNotificationId,
}) => {
  return (
    <div className="divide-y divide-border space-y-1">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onClick={onNotificationClick}
          onAccept={onAcceptInvitation}
          onDecline={onDeclineInvitation}
          onDelete={onDeleteNotification}
          isAccepting={acceptingNotificationId === notification._id}
          isDeclining={decliningNotificationId === notification._id}
          isDeleting={deletingNotificationId === notification._id}
        />
      ))}
    </div>
  );
};

export default NotificationList;
