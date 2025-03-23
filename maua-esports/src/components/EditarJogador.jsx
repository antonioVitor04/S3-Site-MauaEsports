// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiImageEditFill, RiTwitterXFill } from "react-icons/ri";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";
import { IoLogoTwitch } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

const EditarJogador = ({
  jogadorId,
  nomeInicial,
  tituloInicial,
  descricaoInicial,
  fotoInicial,
  instagramInicial,
  twitterInicial,
  twitchInicial,
  onSave,
  onClose,
}) => {
  const [nome, setNome] = useState(nomeInicial);
  const [titulo, setTitulo] = useState(tituloInicial);
  const [descricao, setDescricao] = useState(descricaoInicial);
  const [foto, setFoto] = useState(fotoInicial);
  const [instagram, setInstagram] = useState(instagramInicial || "");
  const [twitter, setTwitter] = useState(twitterInicial || "");
  const [twitch, setTwitch] = useState(twitchInicial || "");

  // Função para validar links
  const validarLink = (link) => {
    return link.startsWith("https://");
  };

  // Função para validar o tipo de imagem
  const validarImagem = (arquivo) => {
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    return tiposPermitidos.includes(arquivo.type);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!validarImagem(file)) {
        alert("Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // Salva a imagem para envio
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Valida os links das redes sociais
    if (instagram && !validarLink(instagram)) {
      alert("O link do Instagram deve começar com https://");
      return;
    }
    if (twitter && !validarLink(twitter)) {
      alert("O link do Twitter deve começar com https://");
      return;
    }
    if (twitch && !validarLink(twitch)) {
      alert("O link do Twitch deve começar com https://");
      return;
    }

    // Se tudo estiver válido, salva as alterações
    onSave({
      nome,
      titulo,
      descricao,
      foto,
      instagram,
      twitter,
      twitch,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/50"
      style={{ animation: "fadeInUp 0.5s ease-out" }}
    >
      <div className="bg-fundo border-2 border-borda p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl text-branco font-bold mb-4">Editar Jogador</h2>

        <label className="block text-sm text-fonte-escura font-semibold">
          Foto:
        </label>
        <div className="relative w-24 h-24 mb-3">
          <img
            src={foto}
            alt="Foto do jogador"
            className="w-full h-full rounded-full object-cover"
          />
          <label
            htmlFor={`file-input-${jogadorId}`}
            className="absolute inset-0 flex items-center justify-center bg-azul-claro bg-opacity-50 rounded-full cursor-pointer"
          >
            <RiImageEditFill className="text-white text-xl" />
          </label>
          <input
            id={`file-input-${jogadorId}`}
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <label className="block text-sm text-fonte-escura font-semibold">
          Nome:
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-borda text-fonte-escura p-2 rounded mb-2"
        />

        <label className="block text-sm text-fonte-escura font-semibold">
          Título:
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-borda text-fonte-escura p-2 rounded mb-2"
        />

        <label className="block text-sm text-fonte-escura font-semibold">
          Descrição:
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-2 rounded border-borda text-fonte-escura mb-2"
        />

        <div className="flex items-center">
          {/* Logo do insta na esquerda */}
          <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
            <FaInstagram className="text-2xl text-preto" />
          </div>

          {/* Campo de entrada  */}
          <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-3">
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/usuario"
              className="w-full p-2 outline-none text-fonte-escura"
            />
          </div>
        </div>

        <div className="flex items-center">
          {/* Logo do twitter na esquerda */}
          <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
            <RiTwitterXFill className="text-2xl text-preto" />
          </div>

          {/* Campo de entrada  */}
          <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-3">
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/usuario"
              className="w-full p-2 outline-none text-fonte-escura"
            />
          </div>
        </div>

        <div className="flex items-center">
          {/* Logo do Twitch na esquerda */}
          <div className="bg-fonte-escura rounded-l-md px-2 py-2 flex items-center justify-center">
            <IoLogoTwitch className="text-2xl text-preto" />
          </div>

          {/* Campo de entrada  */}
          <div className="border border-borda rounded-r-md overflow-hidden flex-1 my-3">
            <input
              type="text"
              value={twitch}
              onChange={(e) => setTwitch(e.target.value)}
              placeholder="https://twitch.tv/usuario"
              className="w-full p-2 outline-none text-fonte-escura"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <SalvarBtn onClick={handleSave} />
          <CancelarBtn onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

EditarJogador.propTypes = {
  jogadorId: PropTypes.string.isRequired,
  nomeInicial: PropTypes.string.isRequired,
  tituloInicial: PropTypes.string.isRequired,
  descricaoInicial: PropTypes.string.isRequired,
  fotoInicial: PropTypes.string,
  instagramInicial: PropTypes.string,
  twitterInicial: PropTypes.string,
  twitchInicial: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditarJogador;
