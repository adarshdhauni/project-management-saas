import ApiError from "../utils/ApiError.js";
import notificationRepository from "../repositories/notification.repository.js";
import workspaceInvitationRepository from "../repositories/workspace-invitation.repository.js";

const createNotification = async (notificationData, options = {}) => {
  const notification = await notificationRepository.create(
    notificationData,
    options,
  );

  return notification;
};

const getNotifications = async (userId, filters = {}) => {
  const result = await notificationRepository.findAllByRecipient(
    userId,
    filters,
  );

  const invitationIds = result.notifications
    .filter((notification) => notification.type === "workspace.invited")
    .map((notification) => notification.metadata?.invitationId)
    .filter(Boolean);

  const invitations =
    await workspaceInvitationRepository.findStatusesByIds(invitationIds);

  const now = new Date();

  const invitationStatusById = new Map(
    invitations.map((invitation) => {
      const effectiveStatus =
        invitation.status === "pending" && invitation.expiresAt <= now
          ? "expired"
          : invitation.status;

      return [invitation._id.toString(), effectiveStatus];
    }),
  );

  return {
    ...result,
    notifications: result.notifications.map((notification) => {
      const item = notification.toObject();

      if (item.type !== "workspace.invited") {
        return item;
      }

      const invitationId = item.metadata?.invitationId?.toString();

      return {
        ...item,
        invitationStatus:
          invitationStatusById.get(invitationId) ?? "unavailable",
      };
    }),
  };
};

const getNotificationById = async (userId, notificationId) => {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  if (!notification.recipient.equals(userId)) {
    throw new ApiError(403, "You do not have access to this notification.");
  }

  return notification;
};

const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  if (!notification.recipient.equals(userId)) {
    throw new ApiError(
      403,
      "You do not have permission to update this notification.",
    );
  }

  if (notification.read) {
    throw new ApiError(409, "Notification is already marked as read.");
  }

  return notificationRepository.updateById(notificationId, {
    read: true,
  });
};

const markAllNotificationsAsRead = async (userId) => {
  const result = await notificationRepository.markAllAsRead(userId);

  return result;
};

const deleteNotification = async (userId, notificationId) => {
  const notification = await notificationRepository.findById(notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  if (!notification.recipient.equals(userId)) {
    throw new ApiError(
      403,
      "You do not have permission to delete this notification.",
    );
  }

  await notificationRepository.deleteById(notificationId);

  return;
};

const notificationService = {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};

export default notificationService;
