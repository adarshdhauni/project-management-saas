import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

const updateUser = async (userId, updatedData) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const updatedUser = await userRepository.updateUser(userId, updatedData);

  return updatedUser;
};

const userService = {
  updateUser,
};

export default userService;
