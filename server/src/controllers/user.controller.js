import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(updatedUser, "User updated successfully."));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const updatedUser = await userService.uploadAvatar(
    req.user._id,
    req.file?.buffer,
  );

  return res
    .status(200)
    .json(new ApiResponse(updatedUser, "Avatar updated successfully."));
});

const removeAvatar = asyncHandler(async (req, res) => {
  const updatedUser = await userService.removeAvatar(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar removed successfully."));
});

const userController = {
  updateUser,
  uploadAvatar,
  removeAvatar
};

export default userController;
