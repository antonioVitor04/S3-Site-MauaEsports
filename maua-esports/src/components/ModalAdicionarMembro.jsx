// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import PropTypes from "prop-types";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";
import JogoValorant from "../assets/images/logovalorant.svg";
import JogoCS2 from "../assets/images/logocs2.svg";
import FotoPadrao from "../assets/images/Foto.svg";

const ModalAdicionarMembro = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    foto: null,
    nome: "",
    titulo: "",
    descricao: "",
    jogo: "valorant-inclusivo",
    instagram: "",
    twitter: "",
    twitch: "",
  });

  const [previewFoto, setPreviewFoto] = useState(FotoPadrao);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validarLinks = () => {
    const { instagram, twitter, twitch } = formData;

    const validarLink = (url, rede) => {
      if (url && !url.startsWith("https://")) {
        alert(`O link do ${rede} deve começar com https://`);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.foto ||
      !formData.nome ||
      !formData.titulo ||
      !formData.descricao
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    // Verifica os links das redes sociais
    if (!validarLinks()) {
      return;
    }
    onSave(formData);
  };

  const getJogoIcone = () => {
    switch (formData.jogo) {
      case "valorant-masculino":
      case "valorant-feminino":
      case "valorant-inclusivo":
        return JogoValorant;
      case "cs2":
        return JogoCS2;
      default:
        return JogoValorant;
    }
  };

  return (
    <div className="my-2 fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      <div
        className="bg-fundo  p-6 rounded-lg shadow-sm shadow-azul-claro w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">Editar Jogador</h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload de Foto */}
          <div className="mb-4">
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Foto <span className="text-vermelho-claro">*</span>
            </label>
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={previewFoto}
                alt="Preview"
                className="w-full h-full rounded-full object-cover"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-azul-claro bg-opacity-50 rounded-full cursor-pointer">
                <IoMdAddCircleOutline className="text-preto text-2xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
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

            <div className="flex items-center mb-2 ">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center ">
                <FaInstagram className="text-2xl text-preto" />
              </div>
              <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-2 ">
                <input
                  type="text"
                  name="instagram"
                  placeholder="Instagram URL"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full p-2 outline-none text-branco bg-preto "
                />
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
                <RiTwitterXFill className="text-2xl text-preto" />
              </div>
              <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-2">
                <input
                  type="text"
                  name="twitter"
                  placeholder="Twitter URL"
                  value={formData.twitter}
                  onChange={handleChange}
                  className="w-full p-2 outline-none text-branco bg-preto focus:border-azul-claro focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
                <IoLogoTwitch className="text-2xl text-preto" />
              </div>
              <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-2">
                <input
                  type="text"
                  name="twitch"
                  placeholder="Twitch URL"
                  value={formData.twitch}
                  onChange={handleChange}
                  className="w-full p-2 outline-none text-branco bg-preto focus:border-azul-claro focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 mt-6">
            <SalvarBtn onClick={handleSubmit} />
            <CancelarBtn onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

ModalAdicionarMembro.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ModalAdicionarMembro;
