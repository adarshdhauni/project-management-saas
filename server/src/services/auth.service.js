import env from "../config/env.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await userRepository.updateRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken };
};

const register = async (userData) => {
  const userExists = await userRepository.findUserByEmail(userData.email);

  if (userExists) {
    throw new ApiError(409, "User already exists");
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
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(userData.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  if (!token) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);

  const user = await userRepository.findUserByIdWithRefreshToken(decoded._id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const authService = {
  register,
  login,
  refresAccessToken,
};

export default authService;
