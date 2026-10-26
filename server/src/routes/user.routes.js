import express from "express";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import updateUserSchema from "../validators/user/update-user.schema.js";

const router = express.Router();

router.patch(
  "/me",
  validate({ body: updateUserSchema }),
  protect,
  userController.updateUser,
);

export default router;
