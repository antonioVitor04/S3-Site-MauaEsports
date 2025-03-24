// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { HiUserCircle } from "react-icons/hi2";
import { FaPen } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";

const AtualizacaoPerfil = () => {
  const [isPenHovered, setPenIsHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [croppedImage, setCroppedImage] = useState(() => {
    // Recupera a imagem salva no localStorage ao inicializar o componente
    return localStorage.getItem("croppedImage") || null;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCrop = () => {
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

        // Salvar a imagem cortada no localStorage
        localStorage.setItem("croppedImage", croppedImageUrl);

        setImage(null);
      };
    }
  };

  return (
    <div>
      <div
        className="relative w-12 h-12 group"
        onMouseEnter={() => setPenIsHovered(true)}
        onMouseLeave={() => setPenIsHovered(false)}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Foto de Perfil"
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
          ) : (
            <HiUserCircle className="w-full h-full transform hover:scale-110 transition-transform duration-300 cursor-pointer hover:bg-hover hover:border-2 hover:border-borda hover:rounded-full" />
          )}
        </div>

        <div className="absolute bottom-0 right-0 rounded-full p-1 shadow-sm transition-opacity duration-300">
          <FaPen
            className="w-4 h-4 text-azul-claro"
            style={{
              animation: isPenHovered ? "shake 0.7s ease-in-out" : "none",
            }}
          />
        </div>
      </div>

      <input
        type="file"
        id="file-input"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {image && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-4 rounded-lg relative lg:mr-10"
            style={{ zIndex: 100 }}
          >
            <div
              className="relative"
              style={{ width: "300px", height: "300px", zIndex: 1 }}
            >
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-4 flex justify-end" style={{ zIndex: 101 }}>
              <button
                onClick={handleCrop}
                className="w-8 h-8 flex items-center justify-center p-1 bg-emerald-300 rounded-full text-branco cursor-pointer hover:bg-green-600 hover:scale-110 transition-transform duration-300 mx-3"
              >
                <MdDone/>
              </button>
              <button
                onClick={() => setImage(null)}
                className="w-8 h-8 flex items-center justify-center p-1 bg-vermelho-claro rounded-full text-branco cursor-pointer hover:bg-red-500 hover:scale-110 transition-transform duration-300 mx-4"
              >
                <MdCancel/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtualizacaoPerfil;
