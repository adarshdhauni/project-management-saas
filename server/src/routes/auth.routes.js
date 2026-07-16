import express from "express";
import validate from "../middlewares/validate.js";
import registerSchema from "../validators/auth/register.schema.js";
import loginSchema from "../validators/auth/login.schema.js";
import forgotPasswordSchema from "../validators/auth/forgot-password.schema.js";
import resetPasswordSchema from "../validators/auth/reset-password.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  authController.registerUser,
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  authController.loginUser,
);

router.post("/refresh-token", authController.refreshUserToken);

router.get("/me", protect, authController.getCurrentUser);

router.post("/logout", protect, authController.logoutUser);

router.post(
  "/forgot-password",
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validate({ body: resetPasswordSchema }),
  authController.resetPassword,
);

export default router;
