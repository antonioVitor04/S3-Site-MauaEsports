import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import PropTypes from "prop-types";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const ModalNovoTime = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    rota: "",
    foto: null,
    jogo: null,
  });
  const [fotoPreview, setFotoPreview] = useState(null);
  const [jogoPreview, setJogoPreview] = useState(null);
  const [erro, setErro] = useState("");

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "foto") {
          setFotoPreview(reader.result);
        } else {
          setJogoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        [type]: file,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.rota) {
      alert("Nome e rota são obrigatórios!");
      return;
    }
    if (!formData.foto || !formData.jogo) {
      alert("Foto do time e logo do jogo são obrigatórios!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-fundo p-6 rounded-lg max-w-md w-full border border-azul-claro">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">Criar Novo Time</h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ID do Time */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              ID do Time (Obrigatório)
            </label>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full p-2 bg-preto text-branco border border-cinza-escuro rounded"
              required
            />
          </div>

          {/* Nome do Time */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Nome do Time (Obrigatório)
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 bg-preto text-branco border border-cinza-escuro rounded"
              required
            />
          </div>

          {/* Rota */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Rota (Obrigatório)
            </label>
            <input
              type="text"
              name="rota"
              value={formData.rota}
              onChange={handleChange}
              className="w-full p-2 bg-preto text-branco border border-cinza-escuro rounded"
              required
            />
          </div>

          {/* Foto do Time */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Foto do Time (Obrigatório)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "foto")}
              className="w-full text-branco"
              required
            />
            {fotoPreview && (
              <img
                src={fotoPreview}
                alt="Preview da foto"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>

          {/* Logo do Jogo */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Logo do Jogo (Obrigatório)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "jogo")}
              className="w-full text-branco"
              required
            />
            {jogoPreview && (
              <img
                src={jogoPreview}
                alt="Preview do logo"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <SalvarBtn type="submit" />
            <CancelarBtn onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

ModalNovoTime.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalNovoTime;