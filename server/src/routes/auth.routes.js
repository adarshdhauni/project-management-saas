import express from "express";
import validate from "../middlewares/validate.js";
import registerSchema from "../validators/auth/register.schema.js";
import loginSchema from "../validators/auth/login.schema.js";
import asyncHandler from "../utils/asyncHandler.js";
import authController from "../controllers/auth.controller.js";

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

export default router;
