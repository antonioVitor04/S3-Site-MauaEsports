import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { MdDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const ImageCropper = ({
  initialImage = null,
  onCropComplete,
  onCancel,
  aspect = 1,
  cropShape = "round",
  cropSize = { width: 300, height: 300 },
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleSave = () => {
    if (croppedArea) {
      onCropComplete(croppedArea);
    }
  };

  return (
    <div className="fixed inset-0 bg-fundo/80 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg relative border shadow-sm shadow-azul-claro">
        <div
          className="relative"
          style={{ 
            width: cropSize.width, 
            height: cropSize.height,
            background: '#f0f0f0' // Adicionado para melhor visualização
          }}
        >
          {initialImage && (
            <Cropper
              image={initialImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="w-8 h-8 flex items-center justify-center p-1 bg-emerald-300 rounded-full text-white cursor-pointer hover:bg-green-600 hover:scale-110 transition-transform duration-300 mx-3"
          >
            <MdDone />
          </button>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center p-1 bg-red-300 rounded-full text-white cursor-pointer hover:bg-red-500 hover:scale-110 transition-transform duration-300 mx-4"
          >
            <MdCancel />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;