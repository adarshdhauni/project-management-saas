import { Router } from "express";

import notificationController from "../controllers/notification.controller.js";

import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";

import getNotificationsSchema from "../validators/notification/get-notifications.schema.js";
import notificationIdSchema from "../validators/notification/notification-id.schema.js";

const router = Router();

router.use(protect);

router.get(
  "/",
  validate(getNotificationsSchema, "query"),
  notificationController.getNotifications,
);

router.patch("/read-all", notificationController.markAllNotificationsAsRead);

router.get(
  "/:notificationId",
  validate(notificationIdSchema, "params"),
  notificationController.getNotificationById,
);

router.patch(
  "/:notificationId/read",
  validate(notificationIdSchema, "params"),
  notificationController.markNotificationAsRead,
);

router.delete(
  "/:notificationId",
  validate(notificationIdSchema, "params"),
  notificationController.deleteNotification,
);

export default router;
