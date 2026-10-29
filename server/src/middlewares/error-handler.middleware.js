import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import { ZodError } from "zod";

import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  console.error(error.stack);

  if (error instanceof ZodError) {
    let formattedErrors = {};

    error.issues.forEach((issue) => {
      const field = issue.path.join(".");

      formattedErrors[field] = issue.message;
    });

    error = new ApiError(400, "Validation failed.", formattedErrors);
  }

  if (error instanceof mongoose.Error.CastError) {
    error = new ApiError(400, "Invalid resource identifier.");
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0];

    if (field) {
      error = new ApiError(
        409,
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      );
    }
  }

  if (error instanceof jwt.JsonWebTokenError) {
    error = new ApiError(401, "Invalid access token.");
  }

  if (error instanceof jwt.TokenExpiredError) {
    error = new ApiError(401, "Access token has expired.");
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      error = new ApiError(413, "Avatar image must not exceed 2 MB.");
    } else if (error.code === "LIMIT_FILE_COUNT") {
      error = new ApiError(400, "Only one image can be uploaded.");
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      error = new ApiError(400, 'Unexpected file field. Use "avatar".');
    } else {
      error = new ApiError(400, "Avatar upload failed.");
    }
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, "Internal Server Error.");
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors ?? null,
    ...(env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};

export default errorHandler;
