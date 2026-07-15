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

const authController = { registerUser, loginUser };

export default authController;
