import userRepository from "../repositories/user.repository";
import ApiError from "../utils/ApiError";

const register = async (userData) => {
  const userExists = await userRepository.findUserByEmail(userData.email);

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await userRepository.createUser(userData);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  await userRepository.updateRefreshToken(user._id, refreshToken);

  return {
    user,
    accessToken,
    refreshToken,
  };
};
