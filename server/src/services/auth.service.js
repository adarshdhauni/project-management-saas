import env from "../config/env.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import emailService from "../services/email.service.js";

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await userRepository.updateRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken };
};

const register = async (userData) => {
  const userExists = await userRepository.findUserByEmail(userData.email);

  if (userExists) {
    throw new ApiError(409, "User already exists.");
  }

  const user = await userRepository.createUser(userData);

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const login = async (userData) => {
  const user = await userRepository.findUserByEmailWithPassword(userData.email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(userData.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);

  const user = await userRepository.findUserByIdWithRefreshToken(decoded.sub);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const getCurrentUser = async (user) => {
  return user;
};

const logout = async (userId) => {
  await userRepository.clearRefreshToken(userId);
};

const forgotPassword = async (userData) => {
  const user = await userRepository.findUserByEmail(userData.email);

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await userRepository.updatePasswordResetToken(
    user._id,
    hashedToken,
    passwordResetExpires,
  );

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await emailService.sendPasswordResetEmail({
    email: user.email,
    resetUrl,
  });

  
};

const resetPassword = async (userData) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(userData.token)
    .digest("hex");

  const user = await userRepository.findUserByPasswordResetToken(hashedToken);

  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset token.");
  }

  user.password = userData.password;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;

  await user.save();
};

const authService = {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
