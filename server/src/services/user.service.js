import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import avatarImageService from "./avatar-image.service.js";
import cloudinaryService from "./cloudinary.service.js";

const updateUser = async (userId, updatedData) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const updatedUser = await userRepository.updateUser(userId, updatedData);

  return updatedUser;
};

const uploadAvatar = async (userId, fileBuffer) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const processedImage = await avatarImageService.processAvatar(fileBuffer);

  const uploadResult = await cloudinaryService.uploadImage(
    processedImage.buffer,
    { format: "webp" },
  );

  if (!uploadResult?.secure_url || !uploadResult?.public_id) {
    if (uploadResult?.public_id) {
      try {
        await cloudinaryService.deleteImage(uploadResult.public_id);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up incomplete avatar upload:",
          cleanupError,
        );
      }
    }

    throw new ApiError(502, "Avatar upload failed.");
  }

  let updatedUser;

  try {
    updatedUser = await userRepository.updateUser(userId, {
      avatar: uploadResult.secure_url,
      avatarPublicId: uploadResult.public_id,
    });

    if (!updatedUser) {
      throw new ApiError(404, "User does not exist.");
    }
  } catch (error) {
    try {
      await cloudinaryService.deleteImage(uploadResult.public_id);
    } catch (cleanupError) {
      console.error(
        "Failed to clean up avatar after database update failure:",
        cleanupError,
      );
    }

    throw error;
  }

  const oldPublicId = user.avatarPublicId;

  if (oldPublicId && oldPublicId !== uploadResult.public_id) {
    try {
      const deletionResult = await cloudinaryService.deleteImage(oldPublicId);

      if (
        deletionResult.result !== "ok" &&
        deletionResult.result !== "not found"
      ) {
        console.error(
          "Previous avatar cleanup was unsuccessful:",
          deletionResult,
        );
      }
    } catch (cleanupError) {
      console.error("Failed to delete previous avatar:", cleanupError);
    }
  }

  return updatedUser;
};

const removeAvatar = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  if (!user.avatar && !user.avatarPublicId) {
    return user;
  }

  let oldPublicId = user.avatarPublicId;

  user.avatar = null;
  user.avatarPublicId = null;

  await user.save();

  if (oldPublicId) {
    try {
      const deletionResult = await cloudinaryService.deleteImage(oldPublicId);

      if (
        deletionResult.result !== "ok" &&
        deletionResult.result !== "not found"
      ) {
        console.error(
          "Previous avatar cleanup was unsuccessful:",
          deletionResult,
        );
      }
    } catch (cleanupError) {
      console.error("Failed to delete previous avatar:", cleanupError);
    }
  }

  return user;
};

const userService = {
  updateUser,
  uploadAvatar,
  removeAvatar
};

export default userService;
