// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  RiImageAddLine,
  RiImageEditLine,
  RiCloseFill,
  RiTwitterXFill,
} from "react-icons/ri";
import { IoLogoTwitch } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import SalvarBtn from "./SalvarBtn";
import CancelarBtn from "./CancelarBtn";

const EditarJogador = ({
  jogador: {
    _id: jogadorId,
    nome: nomeInicial,
    titulo: tituloInicial,
    descricao: descricaoInicial,
    fotoUrl: fotoInicial,
    insta: instagramInicial,
    twitter: twitterInicial,
    twitch: twitchInicial,
  },
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    nome: nomeInicial,
    titulo: tituloInicial,
    descricao: descricaoInicial,
    foto: null,
    instagram: instagramInicial || "",
    twitter: twitterInicial || "",
    twitch: twitchInicial || "",
  });

  const [fotoPreview, setFotoPreview] = useState(fotoInicial);
  const [erro, setErro] = useState("");

  const validarLink = (link) => {
    return !link || link.startsWith("https://");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
      if (!tiposPermitidos.includes(file.type)) {
        setErro("Formato de imagem inválido. Use apenas JPG, JPEG ou PNG.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErro("A imagem deve ter no máximo 5MB");
        return;
      }

      setErro("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        foto: file,
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

  const handleRemoveFoto = () => {
    setFotoPreview("");
    setFormData({
      ...formData,
      foto: null,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.titulo || !formData.descricao) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.instagram && !validarLink(formData.instagram)) {
      setErro("O link do Instagram deve começar com https://");
      return;
    }

    if (formData.twitter && !validarLink(formData.twitter)) {
      setErro("O link do Twitter deve começar com https://");
      return;
    }

    if (formData.twitch && !validarLink(formData.twitch)) {
      setErro("O link do Twitch deve começar com https://");
      return;
    }

    setErro("");
    onSave({
      id: jogadorId, // Now using jogadorId
      ...formData,
      foto: formData.foto || fotoInicial,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fundo/80">
      <div className="bg-fundo shadow-sm shadow-azul-claro p-6 rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-branco">Editar Jogador</h2>
          <button
            onClick={onClose}
            className="text-fonte-escura hover:text-vermelho-claro hover:cursor-pointer"
          >
            <RiCloseFill size={24} />
          </button>
        </div>

        {erro && (
          <div className="mb-4 p-2 bg-vermelho-claro/20 text-vermelho-claro rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="space-y-4">
            {/* Foto com o novo estilo */}
            <div className="mb-4">
              <label className="block text-sm text-fonte-escura font-semibold mb-2">
                Foto do Jogador <span className="text-vermelho-claro">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-azul-claro rounded-lg cursor-pointer hover:bg-cinza-escuro/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {fotoPreview ? (
                    <>
                      <RiImageEditLine className="w-8 h-8 text-azul-claro mb-2" />
                      <p className="text-sm text-fonte-escura">
                        Alterar imagem
                      </p>
                    </>
                  ) : (
                    <>
                      <RiImageAddLine className="w-8 h-8 text-azul-claro mb-2" />
                      <p className="text-sm text-fonte-escura">
                        Clique para enviar
                      </p>
                    </>
                  )}
                  <p className="text-xs text-fonte-escura/50 mt-1">
                    PNG, JPG ou JPEG (Max. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required={!fotoInicial && !fotoPreview}
                />
              </label>
              {fotoPreview && (
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

            {/* Campos de texto */}
            {[
              {
                label: "Nome",
                name: "nome",
                value: formData.nome,
                required: true,
              },
              {
                label: "Título",
                name: "titulo",
                value: formData.titulo,
                required: true,
              },
              {
                label: "Descrição",
                name: "descricao",
                value: formData.descricao,
                required: true,
                textarea: true,
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-fonte-escura font-semibold mb-1">
                  {field.label}{" "}
                  {field.required && (
                    <span className="text-vermelho-claro">*</span>
                  )}
                </label>
                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
                    rows="3"
                    required={field.required}
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    className="w-full border border-borda rounded p-2 text-branco bg-preto focus:border-azul-claro focus:outline-none"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            {/* Redes Sociais */}
            {[
              {
                icon: <FaInstagram className="text-2xl" />,
                label: "Instagram",
                name: "instagram",
                value: formData.instagram,
              },
              {
                icon: <RiTwitterXFill className="text-2xl" />,
                label: "Twitter",
                name: "twitter",
                value: formData.twitter,
              },
              {
                icon: <IoLogoTwitch className="text-2xl" />,
                label: "Twitch",
                name: "twitch",
                value: formData.twitch,
              },
            ].map((social) => (
              <div key={social.name}>
                <label className="block text-sm text-fonte-escura font-semibold mb-1">
                  {social.label}
                </label>
                <div className="flex items-center">
                  <div className="bg-fonte-escura rounded-l-md px-3 py-2 flex items-center justify-center">
                    {social.icon}
                  </div>
                  <input
                    type="text"
                    name={social.name}
                    value={social.value}
                    onChange={handleChange}
                    placeholder={`https://${social.label.toLowerCase()}.com/usuario`}
                    className="w-full border border-borda border-l-0 rounded-r-md p-2 focus:border-azul-claro text-branco bg-preto focus:outline-none"
                  />
                </div>
              </div>
            ))}
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

EditarJogador.propTypes = {
  jogador: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nome: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descricao: PropTypes.string.isRequired,
    fotoUrl: PropTypes.string,
    insta: PropTypes.string,
    twitter: PropTypes.string,
    twitch: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditarJogador.defaultProps = {
  jogador: {
    fotoUrl: "",
    insta: "",
    twitter: "",
    twitch: "",
  },
};

export default EditarJogador;
