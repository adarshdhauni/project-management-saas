import express from "express";
import { protect } from "../middlewares/protect.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateUserSchema from "../validators/user/update-user.schema.js";
import userController from "../controllers/user.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.patch(
  "/me",
  protect,
  validate({ body: updateUserSchema }),
  userController.updateUser,
);

router.patch(
  "/avatar",
  protect,
  upload.single("avatar"),
  userController.updateAvatar,
);

export default router;
