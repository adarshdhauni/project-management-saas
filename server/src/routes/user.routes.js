import express from "express";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import updateUserSchema from "../validators/user/update-user.schema.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.patch(
  "/me",
  protect,
  validate({ body: updateUserSchema }),
  userController.updateUser,
);

export default router;
