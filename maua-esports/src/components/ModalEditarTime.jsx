import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiCloseFill } from "react-icons/ri";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const ModalEditarTime = ({ time, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: time.id,
    nome: time.nome,
    rota: time.rota,
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
      setErro("Nome e rota são obrigatórios!");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      <div className="bg-fundo p-6 rounded-lg max-w-md w-full border shadow-sm shadow-azul-claro">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">Editar Time</h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        {erro && <div className="text-vermelho-claro mb-4 text-sm">{erro}</div>}

        <form onSubmit={handleSubmit}>
          {/* ID do Time */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              ID do Time
            </label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full p-2 bg-preto text-branco border border-cinza-escuro rounded"
              disabled
            />
          </div>

          {/* Nome do Time */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Nome do Time <span className="text-vermelho-claro">*</span>
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
              Rota <span className="text-vermelho-claro">*</span>
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
              Foto do Time
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "foto")}
              className="w-full text-branco"
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
              Logo do Jogo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "jogo")}
              className="w-full text-branco"
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

ModalEditarTime.propTypes = {
  time: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nome: PropTypes.string.isRequired,
    rota: PropTypes.string.isRequired,
    foto: PropTypes.string,
    jogo: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalEditarTime;
