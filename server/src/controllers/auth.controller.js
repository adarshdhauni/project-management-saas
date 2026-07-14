import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import env from "../config/env.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../constants/cookieOptions.js";

const registerUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
  );

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.refreshToken;

  res
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        {
          user: userObject,
        },
        "User registered successfully.",
      ),
    );
});

const authController = { registerUser };

export default authController;
