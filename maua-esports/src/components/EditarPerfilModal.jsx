import React, { useState } from "react";
import { RiCloseFill, RiImageAddLine, RiImageEditLine } from "react-icons/ri";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";
import ImageCropper from "./ImageCropper";
import { UseImageCrop } from "./UseImageCrop";

const EditarPerfilModal = ({
  usuario: { email: emailInicial, discordID: discordIDInicial, fotoPerfil: fotoInicial },
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    discordID: discordIDInicial || "",
  });

  const {
    image: fotoImage,
    croppedImage: fotoCropped,
    isCropping: isCroppingFoto,
    handleFileChange: handleFotoFileChange,
    handleCropComplete: handleFotoCropComplete,
    handleCancelCrop: handleCancelFotoCrop,
    setCroppedImage: setFotoCropped
  } = UseImageCrop(fotoInicial ? `/usuarios/${usuario._id}/foto` : null);

  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveFoto = () => {
    setFotoCropped(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    if (formData.discordID && !/^\d{18}$/.test(formData.discordID)) {
      setErro("Discord ID deve ter exatamente 18 dígitos");
      return;
    }
  
    setErro("");
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('discordID', formData.discordID);
      
      if (fotoCropped) {
        // Converter a imagem cropped para Blob
        const blob = await fetch(fotoCropped).then(r => r.blob());
        formDataToSend.append('fotoPerfil', blob, 'profile.png');
      } else if (fotoCropped === null) {
        // Indica que a foto deve ser removida
        formDataToSend.append('removeFoto', 'true');
      }

      await onSave(formDataToSend);
    } catch (error) {
      setErro(error.message || "Erro ao salvar perfil");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      {isCroppingFoto && (
        <ImageCropper
          initialImage={fotoImage}
          onCropComplete={handleFotoCropComplete}
          onCancel={handleCancelFotoCrop}
          aspect={1}
          cropShape="round"
          cropSize={{ width: 400, height: 400 }}
        />
      )}

      <div className="bg-fundo p-6 rounded-lg max-w-md w-full border shadow-sm shadow-azul-claro max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        {erro && (
          <div className="mb-4 p-2 bg-vermelho-claro/20 text-vermelho-claro rounded text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm text-fonte-escura font-semibold mb-2">
                Foto de Perfil
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-azul-claro rounded-lg cursor-pointer hover:bg-cinza-escuro/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {fotoCropped ? (
                    <RiImageEditLine className="w-8 h-8 text-azul-claro mb-2" />
                  ) : (
                    <RiImageAddLine className="w-8 h-8 text-azul-claro mb-2" />
                  )}
                  <p className="text-sm text-fonte-escura">
                    {fotoCropped ? "Alterar imagem" : "Clique para enviar"}
                  </p>
                  <p className="text-xs text-fonte-escura/50 mt-1">
                    PNG, JPG ou JPEG (Max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoFileChange}
                  className="hidden"
                />
              </label>
              {fotoCropped && (
                <div className="mt-4 flex justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={fotoCropped}
                      alt="Preview da foto"
                      className="w-full h-full object-cover rounded-full border border-cinza-escuro"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFoto}
                      className="absolute -top-2 -right-2 bg-vermelho-claro text-branco rounded-full w-6 h-6 flex items-center justify-center hover:bg-vermelho-escuro transition-colors"
                      title="Remover imagem"
                    >
                      <RiCloseFill className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-fonte-escura font-semibold mb-1">
                Email
              </label>
              <input
                type="text"
                value={emailInicial}
                readOnly
                className="w-full border border-borda rounded p-2 text-fonte-escura bg-cinza-escuro cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm text-fonte-escura font-semibold mb-1">
                Discord ID
              </label>
              <input
                type="text"
                name="discordID"
                value={formData.discordID}
                onChange={handleChange}
                placeholder="123456789012345678"
                className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
              />
              <p className="text-xs text-fonte-escura/50 mt-1">
                Deve conter exatamente 18 dígitos
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <SalvarBtn type="submit" />
            <CancelarBtn onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilModal;