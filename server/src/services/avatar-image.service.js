import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import ApiError from "../utils/ApiError.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const processAvatar = async (fileBuffer) => {
  if (!Buffer.isBuffer(fileBuffer) || fileBuffer.length === 0) {
    throw new ApiError(400, "Please upload an image");
  }

  const detectedType = await fileTypeFromBuffer(fileBuffer);

  if (!detectedType || !allowedMimeTypes.has(detectedType.mime)) {
    throw new ApiError(
      400,
      "Only valid JPEG, PNG, and WebP images are allowed.",
    );
  }

  try {
    const processedBuffer = await sharp(fileBuffer, {
      failOn: "error",
      limitInputPixels: 16_000_000,
      animated: false,
    })
      .rotate()
      .resize(512, 512, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return {
      buffer: processedBuffer,
      mimetype: "image/webp",
    };
  } catch {
    throw new ApiError(
      400,
      "The uploaded file is not a valid, processable image.",
    );
  }
};

const avatarImageService = { processAvatar };

export default avatarImageService;
