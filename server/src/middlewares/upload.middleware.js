
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new ApiError(400, "Only JPEG, PNG, and WebP images are allowed."),
      );
    }

    callback(null, true);
  },
});

export default upload;
