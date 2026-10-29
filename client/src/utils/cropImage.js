const createCroppedImage = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Could not process the cropped image."));
        return;
      }

      context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create the cropped image."));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        0.92,
      );
    };

    image.onerror = () => {
      reject(new Error("Could not load the selected image."));
    };

    image.src = imageSrc;
  });
};

export default createCroppedImage;
