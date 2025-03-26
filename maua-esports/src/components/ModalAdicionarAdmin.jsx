import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiImageAddLine, RiCloseFill } from "react-icons/ri";
import { FaInstagram, FaTwitter, FaTwitch } from "react-icons/fa";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";
import FotoPadrao from "../assets/images/Foto.svg";

const ModalAdicionarAdmin = ({ onClose, onSave, erro }) => {
  const [formData, setFormData] = useState({
    nome: "",
    titulo: "",
    descricao: "",
    foto: null,
    instagram: "",
    twitter: "",
    twitch: "",
  });

  const [fotoPreview, setFotoPreview] = useState(FotoPadrao);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroLocal, setErroLocal] = useState(erro || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
      if (!tiposPermitidos.includes(file.type)) {
        setErroLocal(
          "Formato de imagem inválido. Use apenas JPG, JPEG ou PNG."
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErroLocal("A imagem deve ter no máximo 5MB");
        return;
      }

      setErroLocal("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setFormData({ ...formData, foto: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveFoto = () => {
    setFotoPreview(FotoPadrao);
    setFormData({ ...formData, foto: null });
  };

  const validarLinks = () => {
    const { instagram, twitter, twitch } = formData;

    const validarLink = (url, rede) => {
      if (url && !url.startsWith("https://")) {
        setErroLocal(`O link do ${rede} deve começar com https://`);
        return false;
      }
      return true;
    };

    return (
      validarLink(instagram, "Instagram") &&
      validarLink(twitter, "Twitter") &&
      validarLink(twitch, "Twitch")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErroLocal("");

    // Validação dos campos obrigatórios
    if (!formData.nome || !formData.titulo || !formData.descricao) {
      setErroLocal("Preencha todos os campos obrigatórios!");
      setIsSubmitting(false);
      return;
    }

    // Validação dos links
    if (!validarLinks()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave({
        nome: formData.nome.trim(),
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        foto: formData.foto,
        instagram: formData.instagram.trim() || null,
        twitter: formData.twitter.trim() || null,
        twitch: formData.twitch.trim() || null,
      });
    } catch (error) {
      setErroLocal(error.message || "Erro ao adicionar administrador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      <div className="bg-fundo p-6 rounded-lg shadow-sm shadow-azul-claro w-96 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">
            Adicionar Administrador
          </h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        {(erroLocal || erro) && (
          <div className="mb-4 p-2 bg-vermelho-claro/20 text-vermelho-claro rounded">
            {erroLocal || erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Foto */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Foto <span className="text-vermelho-claro">*</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-azul-claro rounded-lg cursor-pointer hover:bg-cinza-escuro/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <RiImageAddLine className="w-8 h-8 text-azul-claro mb-2" />
                <p className="text-sm text-fonte-escura">Clique para enviar</p>
                <p className="text-xs text-fonte-escura/50 mt-1">
                  PNG, JPG ou JPEG (Max. 5MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fotoPreview !== FotoPadrao && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-24 h-24">
                  <img
                    src={fotoPreview}
                    alt="Preview da foto"
                    className="w-full h-full rounded-full object-cover border border-cinza-escuro"
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

          {/* Nome */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Nome <span className="text-vermelho-claro">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border border-borda text-branco bg-preto p-2 rounded focus:border-azul-claro focus:outline-none"
              required
            />
          </div>

          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Título <span className="text-vermelho-claro">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full border border-borda text-branco bg-preto p-2 rounded focus:border-azul-claro focus:outline-none"
              required
            />
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Descrição <span className="text-vermelho-claro">*</span>
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full border border-borda text-branco bg-preto p-2 rounded focus:border-azul-claro focus:outline-none"
              rows="3"
              required
            ></textarea>
          </div>

          {/* Redes Sociais */}
          <div className="mb-4">
            <h3 className="text-sm text-fonte-escura font-semibold mb-2">
              Redes Sociais
            </h3>

            <div className="flex items-center mb-2">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
                <FaInstagram className="text-2xl text-preto" />
              </div>
              <input
                type="text"
                name="instagram"
                placeholder="Instagram URL"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full border border-borda border-l-0 text-branco bg-preto p-2 rounded-r-md focus:outline-none"
              />
            </div>

            <div className="flex items-center mb-2">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
                <FaTwitter className="text-2xl text-preto" />
              </div>
              <input
                type="text"
                name="twitter"
                placeholder="Twitter URL"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full border border-borda border-l-0 text-branco bg-preto p-2 rounded-r-md focus:outline-none"
              />
            </div>

            <div className="flex items-center">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
                <FaTwitch className="text-2xl text-preto" />
              </div>
              <input
                type="text"
                name="twitch"
                placeholder="Twitch URL"
                value={formData.twitch}
                onChange={handleChange}
                className="w-full border border-borda border-l-0 text-branco bg-preto p-2 rounded-r-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <SalvarBtn type="submit" disabled={isSubmitting} />
            <CancelarBtn onClick={onClose} disabled={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
};

ModalAdicionarAdmin.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  erro: PropTypes.string,
};

export default ModalAdicionarAdmin;
