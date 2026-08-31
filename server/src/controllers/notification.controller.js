import asyncHandler from "../utils/asyncHandler.js";
import notificationService from "../services/notification.services.js";
import ApiResponse from "../utils/ApiResponse.js";

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(
    req.user._id,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Notifications fetched successfully."));
});

const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(
    req.user._id,
    req.params.notificationId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, notification, "Notification fetched successfully."),
    );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationAsRead(
    req.user._id,
    req.params.notificationId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read."));
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllNotificationsAsRead(
    req.user._id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "All notifications marked as read."));
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(
    req.user._id,
    req.params.notificationId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully."));
});

const notificationController = {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};

export default notificationController;
