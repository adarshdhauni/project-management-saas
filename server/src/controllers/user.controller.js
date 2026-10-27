import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";

const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user._id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(updatedUser, "User updated successfully."));
});

const userController = {
  updateUser,
};

export default userController;
