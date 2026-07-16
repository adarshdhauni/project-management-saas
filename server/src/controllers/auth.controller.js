import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../constants/cookieOptions.js";

const sendAuthResponse = (
  res,
  user,
  accessToken,
  refreshToken,
  message,
  statusCode,
) => {
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.refreshToken;

  return res
    .status(statusCode)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        {
          user: userObject,
        },
        message,
      ),
    );
};

const registerUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
  );

  return sendAuthResponse(
    res,
    user,
    accessToken,
    refreshToken,
    "User registered successfully.",
    201,
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  return sendAuthResponse(
    res,
    user,
    accessToken,
    refreshToken,
    "Login successfull.",
    200,
  );
});

const refreshUserToken = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.refreshAccessToken(req.cookies.refreshToken);

  return sendAuthResponse(
    res,
    user,
    accessToken,
    refreshToken,
    "Access token refreshed successfully.",
    200,
  );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user);

  return res.status(200).json(
    new ApiResponse(
      {
        user: req.user,
      },
      "Current user fetched successfully.",
    ),
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse({}, "Logged out successfully."));
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        {},
        "If an account with that email exists, a password reset link has been sent.",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  return res
    .status(200)
    .json(
      new ApiResponse(
        {},
        "Password has been reset successfully. Please log in with your new password.",
      ),
    );
});

const authController = {
  registerUser,
  loginUser,
  refreshUserToken,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};

export default authController;
