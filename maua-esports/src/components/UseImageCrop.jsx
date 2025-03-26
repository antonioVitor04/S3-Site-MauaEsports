import { useState } from "react";

export const UseImageCrop = (initialImage = null) => {
  const [image, setImage] = useState(initialImage);
  const [croppedImage, setCroppedImage] = useState(initialImage);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedArea) => {
    if (image && croppedArea) {
      const canvas = document.createElement("canvas");
      const imageObj = new Image();
      imageObj.src = image;

      imageObj.onload = () => {
        canvas.width = croppedArea.width;
        canvas.height = croppedArea.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          imageObj,
          croppedArea.x,
          croppedArea.y,
          croppedArea.width,
          croppedArea.height,
          0,
          0,
          croppedArea.width,
          croppedArea.height
        );

        const croppedImageUrl = canvas.toDataURL("image/jpeg");
        setCroppedImage(croppedImageUrl);
        setIsCropping(false);
        setImage(null);
      };
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImage(null);
  };

  return {
    image,
    croppedImage,
    isCropping,
    handleFileChange,
    handleCropComplete,
    handleCancelCrop,
    setCroppedImage
  };
};