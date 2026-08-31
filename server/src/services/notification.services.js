import ApiError from "../utils/ApiError.js";
import notificationRepository from "../repositories/notification.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";

const createNotification = async (notificationData, options = {}) => {
  const notification = await notificationRepository.create(
    notificationData,
    options,
  );

  return notification;
};

const getNotifications = async (userId, filters = {}) => {
  return notificationRepository.findAllByRecipient(userId, filters);
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
  deleteNotification
};

export default notificationService;
