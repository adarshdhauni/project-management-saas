import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";

const uploadImage = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "taskflow/avatars",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary returned no upload result."));
        }

        resolve(result);
      },
    );

    Readable.from([fileBuffer]).pipe(uploadStream);
  });
};

const deleteImage = (publicId) => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};

const cloudinaryService = { uploadImage, deleteImage };

export default cloudinaryService;
