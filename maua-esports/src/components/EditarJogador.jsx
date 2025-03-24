import React, { useState } from "react";
import PropTypes from "prop-types";
import { RiImageEditFill, RiTwitterXFill } from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const EditarJogador = ({
  jogadorId,
  nomeInicial,
  tituloInicial,
  descricaoInicial,
  fotoInicial,
  instagramInicial,
  twitterInicial,
  twitchInicial,
  timeInicial,
  timesDisponiveis,
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
  const [time, setTime] = useState(timeInicial || "");
  const [erro, setErro] = useState("");

  const validarLink = (link) => {
    return !link || link.startsWith("https://");
  };

  const validarImagem = (arquivo) => {
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    return tiposPermitidos.includes(arquivo?.type);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validarImagem(file)) {
        setErro("Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.");
        return;
      }
      setErro("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validações
    if (!nome || !titulo || !descricao || !time) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    if (instagram && !validarLink(instagram)) {
      setErro("O link do Instagram deve começar com https://");
      return;
    }

    if (twitter && !validarLink(twitter)) {
      setErro("O link do Twitter deve começar com https://");
      return;
    }

    if (twitch && !validarLink(twitch)) {
      setErro("O link do Twitch deve começar com https://");
      return;
    }

    setErro("");
    onSave({
      nome,
      titulo,
      descricao,
      foto,
      instagram,
      twitter,
      twitch,
      time
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-fundo border-2 border-borda p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-branco font-bold mb-4">Editar Jogador</h2>

        {erro && (
          <div className="mb-4 p-2 bg-vermelho-claro/20 text-vermelho-claro rounded">
            {erro}
          </div>
        )}

        <div className="space-y-4">
          {/* Foto */}
          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-2">
              Foto:
            </label>
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={foto}
                alt="Foto do jogador"
                className="w-full h-full rounded-full object-cover border-2 border-borda"
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
          </div>

          {/* Campos de texto */}
          {[
            { label: "Nome", value: nome, onChange: setNome, required: true },
            { label: "Título", value: titulo, onChange: setTitulo, required: true },
            { 
              label: "Descrição", 
              value: descricao, 
              onChange: setDescricao, 
              required: true,
              textarea: true 
            }
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm text-fonte-escura font-semibold mb-1">
                {field.label} {field.required && <span className="text-vermelho-claro">*</span>}
              </label>
              {field.textarea ? (
                <textarea
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border border-borda rounded p-2 text-fonte-escura bg-fundo focus:border-azul-claro focus:outline-none"
                  rows="3"
                  required={field.required}
                />
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full border border-borda rounded p-2 text-fonte-escura bg-fundo focus:border-azul-claro focus:outline-none"
                  required={field.required}
                />
              )}
            </div>
          ))}

          {/* Time */}
          <div>
            <label className="block text-sm text-fonte-escura font-semibold mb-1">
              Time <span className="text-vermelho-claro">*</span>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-borda rounded p-2 text-fonte-escura bg-fundo focus:border-azul-claro focus:outline-none"
              required
            >
              <option value="">Selecione um time</option>
              {timesDisponiveis?.map((time) => (
                <option key={time._id} value={time._id}>
                  {time.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Redes Sociais */}
          {[
            { icon: <FaInstagram className="text-2xl" />, label: "Instagram", value: instagram, onChange: setInstagram },
            { icon: <RiTwitterXFill className="text-2xl" />, label: "Twitter", value: twitter, onChange: setTwitter },
            { icon: <IoLogoTwitch className="text-2xl" />, label: "Twitch", value: twitch, onChange: setTwitch }
          ].map((social) => (
            <div key={social.label}>
              <label className="block text-sm text-fonte-escura font-semibold mb-1">
                {social.label}
              </label>
              <div className="flex items-center">
                <div className="bg-fonte-escura rounded-l-md px-3 py-2 flex items-center justify-center">
                  {social.icon}
                </div>
                <input
                  type="text"
                  value={social.value}
                  onChange={(e) => social.onChange(e.target.value)}
                  placeholder={`https://${social.label.toLowerCase()}.com/usuario`}
                  className="w-full border border-borda border-l-0 rounded-r-md p-2 text-fonte-escura bg-fundo focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <CancelarBtn onClick={onClose} />
          <SalvarBtn onClick={handleSave} />
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
  timeInicial: PropTypes.string,
  timesDisponiveis: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nome: PropTypes.string.isRequired,
    })
  ),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditarJogador.defaultProps = {
  fotoInicial: "",
  instagramInicial: "",
  twitterInicial: "",
  twitchInicial: "",
  timeInicial: "",
  timesDisponiveis: [],
};

export default EditarJogador;