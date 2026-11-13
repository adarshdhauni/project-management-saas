import express from "express";
import { protect } from "../middlewares/protect.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateUserSchema from "../validators/user/update-user.schema.js";
import userController from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";
import updatePasswordSchema from "../validators/user/update-password.schema.js";

const router = express.Router();

router.patch(
  "/me",
  protect,
  validate({ body: updateUserSchema }),
  userController.updateUser,
);

router
  .route("/avatar")
  .patch(protect, upload.single("avatar"), userController.uploadAvatar)
  .delete(protect, userController.removeAvatar);

router.patch(
  "/change-password",
  protect,
  validate({ body: updatePasswordSchema }),
  userController.changePassword,
);

export default router;
