import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import userRepository from "../repositories/user.repository.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET);

  const user = await userRepository.findUserById(decoded.sub);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  req.user = user;

  next();
});
